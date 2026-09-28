import React from 'react';

interface SchoolLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  whiteTheme?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  size = 'md',
  showText = false,
  whiteTheme = false,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`${sizeMap[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0066CC] to-[#004A99] p-1.5 shadow-sm text-white shrink-0`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow"
        >
          {/* Outer Crest */}
          <path
            d="M24 4L40 10V22C40 33 33 41 24 44C15 41 8 33 8 22V10L24 4Z"
            fill="#004A99"
            stroke="#93C5FD"
            strokeWidth="1.5"
          />
          {/* Inner Shield */}
          <path
            d="M24 7L37 12V21C37 30.5 31 37.5 24 40.5C17 37.5 11 30.5 11 21V12L24 7Z"
            fill="#0066CC"
          />
          {/* Graduation Cap */}
          <path
            d="M24 13L33 17.5L24 22L15 17.5L24 13Z"
            fill="#FFFFFF"
          />
          <path
            d="M19 19.5V23.5C19 25 21.2 26 24 26C26.8 26 29 25 29 23.5V19.5"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M33 17.5V23L31 25"
            stroke="#FDE047"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Open Book */}
          <path
            d="M17 28C20 27.5 23 28.5 24 30C25 28.5 28 27.5 31 28V36C28 35.5 25 36.5 24 38C23 36.5 20 35.5 17 36V28Z"
            fill="#FFFFFF"
            stroke="#E0F2FE"
            strokeWidth="0.8"
          />
          {/* Center Dividing Spine */}
          <line x1="24" y1="30" x2="24" y2="38" stroke="#004A99" strokeWidth="1" />
          {/* Star of Excellence */}
          <polygon
            points="24,24.5 25.2,27.2 28,27.5 26,29.3 26.6,32 24,30.5 21.4,32 22,29.3 20,27.5 22.8,27.2"
            fill="#FACC15"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight leading-tight ${
              whiteTheme ? 'text-white' : 'text-[#0066CC]'
            } ${size === 'lg' ? 'text-xl' : size === 'xl' ? 'text-2xl' : 'text-base'}`}
          >
            SỔ THEO DÕI HỌC TẬP
          </span>
          <span
            className={`text-xs font-semibold tracking-wider uppercase ${
              whiteTheme ? 'text-blue-100' : 'text-[#64748B]'
            }`}
          >
            TRƯỜNG THPT NGUYỄN DỤC
          </span>
        </div>
      )}
    </div>
  );
};
