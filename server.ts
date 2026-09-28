import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI SDK for server-side calls
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes for AI Assistant
app.post('/api/ai/analyze-student', async (req, res) => {
  try {
    const { studentName, className, subject, scores, attendance, behavior } = req.body;

    if (!ai) {
      // Fallback pedagogical analysis when API key is not configured
      return res.json({
        success: true,
        source: 'local_engine',
        analysis: generateFallbackAnalysis(studentName, scores, attendance),
      });
    }

    const prompt = `Bạn là trợ lý sư phạm AI dành riêng cho giáo viên Trường THPT Nguyễn Dục. 
Hãy phân tích chi tiết tình hình học tập của học sinh sau:
- Họ và tên: ${studentName}
- Lớp: ${className}
- Môn học: ${subject || 'Toán học'}
- Điểm số: Điểm thường xuyên: ${scores?.tx?.join(', ') || 'N/A'}, Điểm giữa kỳ: ${scores?.gk ?? 'N/A'}, Điểm cuối kỳ: ${scores?.ck ?? 'N/A'}, Điểm trung bình: ${scores?.dtb ?? 'N/A'}
- Chuyên cần: Nghỉ có phép: ${attendance?.excused ?? 0}, Nghỉ không phép: ${attendance?.unexcused ?? 0}, Đi trễ: ${attendance?.late ?? 0}
- Hạnh kiểm: ${behavior || 'Tốt'}

Hãy trình bày phân tích với định dạng rõ ràng:
1. Đánh giá tổng quan năng lực học tập
2. Điểm mạnh và tiềm năng
3. Lỗ hổng kiến thức hoặc vấn đề cần lưu ý (dựa trên sự chênh lệch giữa các đầu điểm và chuyên cần)
4. Đề xuất kế hoạch bồi dưỡng / phụ đạo cụ thể cho giáo viên bộ môn và GVCN
5. Lời nhắn gửi khuyến khích cho học sinh và phụ huynh.
Viết bằng giọng điệu sư phạm chuẩn mực, ấm áp, sâu sắc của nhà giáo Việt Nam.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia sư phạm THPT Việt Nam giàu kinh nghiệm, chuyên phân tích học lực và tâm lý học sinh.',
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      source: 'gemini',
      analysis: response.text,
    });
  } catch (error: any) {
    console.error('Gemini student analysis error:', error);
    res.json({
      success: true,
      source: 'fallback_after_error',
      analysis: generateFallbackAnalysis(
        req.body?.studentName || 'Học sinh',
        req.body?.scores,
        req.body?.attendance
      ),
    });
  }
});

app.post('/api/ai/generate-remarks', async (req, res) => {
  try {
    const { students } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'local_engine',
        remarks: (students || []).map((s: any) => ({
          studentId: s.id,
          name: s.name,
          remark: generateFallbackRemark(s.name, s.dtb, s.behavior),
        })),
      });
    }

    const studentsPrompt = (students || [])
      .map(
        (s: any) =>
          `- ${s.name} (Lớp ${s.className}): ĐTB ${s.dtb}, Hạnh kiểm ${s.behavior || 'Tốt'}, Điểm mạnh: ${s.strengths || 'Ngoan ngoãn'}, Chuyên cần: ${s.attendanceSummary || 'Tốt'}`
      )
      .join('\n');

    const prompt = `Soạn lời nhận xét sổ liên lạc / học bạ theo Thông tư 22 của Bộ Giáo dục & Đào tạo cho danh sách học sinh THPT Nguyễn Dục sau:
${studentsPrompt}

Yêu cầu:
- Mỗi học sinh một lời nhận xét ngắn gọn (2-3 câu), súc tích, mang tính động viên và sát thực tế, nêu bật ưu điểm và phương hướng tiến bộ trong học kỳ tiếp theo.
- Trả về định dạng JSON mảng danh sách: [{"name": string, "remark": string}]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let remarks = [];
    try {
      remarks = JSON.parse(response.text || '[]');
    } catch {
      remarks = [];
    }

    res.json({
      success: true,
      source: 'gemini',
      remarks,
    });
  } catch (error: any) {
    console.error('Gemini remarks error:', error);
    res.json({
      success: true,
      source: 'fallback_after_error',
      remarks: (req.body?.students || []).map((s: any) => ({
        studentId: s.id,
        name: s.name,
        remark: generateFallbackRemark(s.name, s.dtb, s.behavior),
      })),
    });
  }
});

app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const { topic, gradeLevel, questionCount, difficulty } = req.body;

    if (!ai) {
      return res.json({
        success: true,
        source: 'local_engine',
        quiz: getFallbackQuiz(topic, gradeLevel),
      });
    }

    const prompt = `Tạo bộ câu hỏi trắc nghiệm ôn tập môn Toán THPT (Chương trình GDPT mới):
- Chuyên đề: ${topic || 'Khảo sát và vẽ đồ thị hàm số'}
- Khối lớp: Lớp ${gradeLevel || '12'}
- Số câu: ${questionCount || 4} câu
- Mức độ: ${difficulty || 'Nhận biết, Thông hiểu và Vận dụng'}

Mỗi câu hỏi phải có:
1. Câu hỏi (question)
2. 4 đáp án A, B, C, D (options)
3. Đáp án đúng (correctIndex: 0, 1, 2, hoặc 3)
4. Lời giải chi tiết, rõ ràng (explanation)

Trả về định dạng JSON mảng các đối tượng câu hỏi.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let quiz = [];
    try {
      quiz = JSON.parse(response.text || '[]');
    } catch {
      quiz = getFallbackQuiz(topic, gradeLevel);
    }

    res.json({
      success: true,
      source: 'gemini',
      quiz,
    });
  } catch (error: any) {
    console.error('Gemini quiz error:', error);
    res.json({
      success: true,
      source: 'fallback_after_error',
      quiz: getFallbackQuiz(req.body?.topic, req.body?.gradeLevel),
    });
  }
});

function generateFallbackAnalysis(name: string, scores: any, attendance: any) {
  const dtb = scores?.dtb ?? 8.0;
  const rank = dtb >= 8.5 ? 'Xuất sắc' : dtb >= 8.0 ? 'Giỏi' : dtb >= 6.5 ? 'Khá' : 'Trung bình';
  const unexcused = attendance?.unexcused ?? 0;
  
  return `### Báo Cáo Phân Tích Sư Phạm: ${name}
**1. Đánh giá tổng quan năng lực:**
Học sinh ${name} có mức độ tiếp thu bài học đạt mức **${rank}** (Điểm trung bình hiện tại: ${dtb.toFixed(1)}). Thái độ trong giờ học nghiêm túc, có tinh thần xây dựng bài tốt.

**2. Điểm mạnh và tiềm năng:**
- Khả năng tư duy logic và giải quyết các bài toán ở mức độ vận dụng tốt.
- Tinh thần tự giác học tập cao, hoàn thành đầy đủ bài tập được giao về nhà.

**3. Vấn đề cần lưu ý:**
${unexcused > 0 ? `- Học sinh có ${unexcused} buổi nghỉ không phép, cần nhắc nhở phối hợp với phụ huynh kịp thời.\n` : ''}- Cần củng cố thêm kỹ năng tính toán nhanh và độ chính xác ở các câu hỏi trắc nghiệm đếm số nghiệm và hình không gian.

**4. Đề xuất kế hoạch bồi dưỡng:**
- Giáo viên bộ môn: Giao thêm bài tập rèn kỹ năng phương pháp trắc nghiệm 30s.
- Hướng dẫn học sinh tham gia nhóm bạn cùng tiến để hỗ trợ thêm các bạn xung quanh.
- Khuyến khích tham gia câu lạc bộ bồi dưỡng học sinh giỏi của trường THPT Nguyễn Dục.

**5. Lời nhắn gửi:**
"Em có nền tảng tư duy rất sáng, hãy giữ vững ngọn lửa nhiệt huyết và tự tin bứt phá trong kỳ thi sắp tới nhé!"`;
}

function generateFallbackRemark(name: string, dtb: number, behavior: string) {
  if (dtb >= 8.5) {
    return `${name} có ý thức học tập xuất sắc, tư duy sáng tạo, tích cực tham gia các phong trào của lớp. Cần tiếp tục duy trì phong độ.`;
  } else if (dtb >= 8.0) {
    return `${name} chăm ngoan, nắm vững kiến thức căn bản, có tiến bộ rõ rệt trong các bài kiểm tra định kỳ. Rất đáng biểu dương.`;
  } else if (dtb >= 6.5) {
    return `${name} ngoan ngoãn, lễ phép, hoàn thành tốt các nhiệm vụ học tập. Cần rèn luyện thêm tính cẩn thận khi làm bài kiểm tra.`;
  } else {
    return `${name} có nhiều cố gắng, cần tập trung hơn trong giờ học và chủ động nhờ thầy cô giải đáp các phần kiến thức chưa hiểu rõ.`;
  }
}

function getFallbackQuiz(topic: string = 'Hàm số', grade: string = '12') {
  return [
    {
      question: `Cho hàm số y = f(x) có đạo hàm f'(x) = x(x - 1)^2 (x + 2). Số điểm cực trị của hàm số đã cho là:`,
      options: ['1', '2', '3', '4'],
      correctIndex: 1,
      explanation: 'Ta có f\'(x) = 0 khi x = 0, x = 1 (nghiệm bội 2), x = -2. Nghiệm bội 2 không làm f\'(x) đổi dấu, do đó f\'(x) đổi dấu qua 2 nghiệm x = 0 và x = -2. Vậy hàm số có 2 điểm cực trị.'
    },
    {
      question: 'Tiệm cận ngang của đồ thị hàm số y = (2x + 1)/(x - 3) là đường thẳng:',
      options: ['y = 2', 'y = -1/3', 'x = 3', 'x = 2'],
      correctIndex: 0,
      explanation: 'Giới hạn lim (x->±∞) (2x + 1)/(x - 3) = 2. Do đó đường thẳng y = 2 là tiệm cận ngang.'
    },
    {
      question: 'Giá trị nhỏ nhất của hàm số y = x^4 - 2x^2 + 3 trên đoạn [0; 2] bằng:',
      options: ['2', '3', '11', '1'],
      correctIndex: 0,
      explanation: 'y\' = 4x^3 - 4x = 4x(x^2 - 1). y\' = 0 khi x = 0, x = 1 (trên [0; 2]). Ta tính: y(0) = 3, y(1) = 2, y(2) = 11. Vậy min = 2 tại x = 1.'
    },
    {
      question: 'Cho khối chóp có diện tích đáy B = 6a^2 và chiều cao h = 2a. Thể tích của khối chóp đã cho bằng:',
      options: ['12a^3', '4a^3', '6a^3', '2a^3'],
      correctIndex: 1,
      explanation: 'Thể tích khối chóp V = (1/3) * B * h = (1/3) * 6a^2 * 2a = 4a^3.'
    }
  ];
}

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server THPT Nguyễn Dục đang chạy tại http://0.0.0.0:${port}`);
  });
}

startServer();
