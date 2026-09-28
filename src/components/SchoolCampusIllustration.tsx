import React from 'react';

export const SchoolCampusIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[360px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#004A99] via-[#0066CC] to-[#0284C7] p-8 text-white shadow-inner">
      {/* Decorative sky background elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Sun glow */}
      <div className="absolute top-10 right-14 w-28 h-28 rounded-full bg-amber-300/30 blur-2xl" />
      <div className="absolute top-14 right-20 w-16 h-16 rounded-full bg-amber-200/50 blur-lg" />

      {/* SVG Campus Artwork */}
      <svg
        viewBox="0 0 600 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-lg drop-shadow-2xl z-10"
      >
        {/* Distant Clouds */}
        <path
          d="M80 90C90 90 98 84 100 76C105 76 112 80 114 85C118 85 125 88 125 94C125 100 118 102 110 102H80C72 102 65 97 65 90C65 83 72 78 80 90Z"
          fill="white"
          fillOpacity="0.25"
        />
        <path
          d="M440 70C450 70 458 64 460 56C465 56 472 60 474 65C478 65 485 68 485 74C485 80 478 82 470 82H440C432 82 425 77 425 70C425 63 432 58 440 70Z"
          fill="white"
          fillOpacity="0.2"
        />

        {/* School Main Building */}
        <g id="main-building">
          {/* Base foundation */}
          <rect x="120" y="210" width="360" height="130" rx="4" fill="#F8FAFC" />
          <rect x="110" y="335" width="380" height="15" rx="2" fill="#E2E8F0" />
          
          {/* Roof Pediment / Traditional School Eaves */}
          <polygon points="110,210 300,140 490,210" fill="#DC2626" />
          <polygon points="125,210 300,148 475,210" fill="#EF4444" />
          <polygon points="260,140 300,105 340,140" fill="#B91C1C" />
          
          {/* Clock Tower / Crest Badge on Pediment */}
          <circle cx="300" cy="180" r="18" fill="#FFFFFF" stroke="#004A99" strokeWidth="2.5" />
          <circle cx="300" cy="180" r="2" fill="#004A99" />
          <line x1="300" y1="180" x2="300" y2="168" stroke="#004A99" strokeWidth="2" strokeLinecap="round" />
          <line x1="300" y1="180" x2="308" y2="180" stroke="#004A99" strokeWidth="1.5" strokeLinecap="round" />

          {/* School Name Plaque */}
          <rect x="210" y="218" width="180" height="22" rx="3" fill="#004A99" />
          <text
            x="300"
            y="233"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="1"
          >
            THPT NGUYỄN DỤC
          </text>

          {/* Columns */}
          <rect x="150" y="245" width="14" height="90" fill="#CBD5E1" />
          <rect x="220" y="245" width="14" height="90" fill="#CBD5E1" />
          <rect x="366" y="245" width="14" height="90" fill="#CBD5E1" />
          <rect x="436" y="245" width="14" height="90" fill="#CBD5E1" />

          {/* Classroom Windows */}
          <rect x="175" y="255" width="32" height="30" rx="3" fill="#93C5FD" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="191" y1="255" x2="191" y2="285" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="175" y1="270" x2="207" y2="270" stroke="#FFFFFF" strokeWidth="1" />

          <rect x="392" y="255" width="32" height="30" rx="3" fill="#93C5FD" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="408" y1="255" x2="408" y2="285" stroke="#FFFFFF" strokeWidth="1" />
          <line x1="392" y1="270" x2="424" y2="270" stroke="#FFFFFF" strokeWidth="1" />

          {/* Central Entrance Doorway */}
          <path
            d="M265 335V265C265 250 335 250 335 265V335H265Z"
            fill="#0066CC"
          />
          <path
            d="M272 335V270C272 258 328 258 328 270V335H272Z"
            fill="#E0F2FE"
          />
          <line x1="300" y1="260" x2="300" y2="335" stroke="#0066CC" strokeWidth="1.5" />
        </g>

        {/* Flag Pole (Cột cờ trường học) */}
        <g id="flag-pole">
          <rect x="70" y="325" width="30" height="15" rx="2" fill="#94A3B8" />
          <line x1="85" y1="120" x2="85" y2="325" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
          {/* Vietnamese National Flag */}
          <rect x="86" y="125" width="46" height="30" rx="1" fill="#DC2626" />
          <polygon
            points="109,134 111.5,140 118,140.5 113,144 115,150 109,146 103,150 105,144 100,140.5 106.5,140"
            fill="#FACC15"
          />
        </g>

        {/* Lush Greenery / Trees on Campus */}
        <g id="campus-trees">
          {/* Left Tree */}
          <path d="M40 340C30 310 40 280 60 270C75 250 105 255 110 275C125 285 125 315 115 340Z" fill="#15803D" />
          <path d="M48 335C40 315 48 290 65 280C78 265 100 270 105 285C118 295 115 318 108 335Z" fill="#22C55E" />
          <rect x="75" y="320" width="8" height="25" fill="#78350F" />

          {/* Right Royal Poinciana Tree (Cây Phượng Vĩ) */}
          <path d="M480 340C470 305 485 275 510 265C530 245 560 255 565 280C585 295 580 325 565 340Z" fill="#15803D" />
          <path d="M490 335C480 310 495 285 515 275C532 260 555 268 560 290C575 302 570 325 558 335Z" fill="#16A34A" />
          <circle cx="515" cy="275" r="7" fill="#EF4444" />
          <circle cx="545" cy="265" r="8" fill="#EF4444" />
          <circle cx="560" cy="290" r="6" fill="#F87171" />
          <rect x="528" y="320" width="10" height="25" fill="#78350F" />
        </g>

        {/* Front Walkway & Green Lawn */}
        <rect x="0" y="345" width="600" height="55" fill="#166534" />
        <polygon points="250,345 350,345 390,400 210,400" fill="#E2E8F0" />
      </svg>

      {/* Floating Motivational Banner */}
      <div className="absolute bottom-5 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center justify-between z-20">
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold">
            Năm học 2026 - 2027
          </p>
          <p className="text-sm font-bold text-white">
            "Đồng hành cùng học sinh – Kiến tạo tương lai"
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-200 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-300/30">
          <span>★</span>
          <span>Chuẩn Quốc Gia</span>
        </div>
      </div>
    </div>
  );
};
