import React from "react";
import "./NestBadge.css";

interface NestBadgeProps {
  size?: number; // 배지의 크기 (픽셀)
}

export function NestBadge({ size = 260 }: NestBadgeProps) {
  const scale = size / 260; // 기본 크기 260px 대비 비율
  
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <div className="badge" style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 260, height: 260 }}>
        <div className="badge-inner">
          {/* 새 + 둥지 래퍼 */}
          <div className="scene">
            {/* 새 */}
            <div className="bird">
              {/* 몸통 */}
              <div className="bird-body">
                <div className="bird-belly" />
              </div>

              {/* 얼굴 */}
              <div className="bird-face">
                <div className="bird-mask" />
                <div className="bird-eye bird-eye-left" />
                <div className="bird-eye bird-eye-right" />
                <div className="bird-cheek bird-cheek-left" />
                <div className="bird-cheek bird-cheek-right" />
                <div className="bird-beak" />
              </div>

              {/* 날개 */}
              <div className="bird-wing bird-wing-left" />
              <div className="bird-wing bird-wing-right" />
            </div>

            {/* 둥지 */}
            <div className="nest">
              <div className="nest-layer nest-layer-1" />
              <div className="nest-layer nest-layer-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
