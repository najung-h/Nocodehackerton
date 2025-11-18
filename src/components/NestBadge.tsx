import React from "react";
import nestLogo from "figma:asset/logo.png";

interface NestBadgeProps {
  size?: number; // 배지의 크기 (픽셀)
}

export function NestBadge({ size = 260 }: NestBadgeProps) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <img 
        src={nestLogo} 
        alt="둥지 로고" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain' 
        }} 
      />
    </div>
  );
}
