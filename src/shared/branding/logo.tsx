"use client";

import React from "react";
import Image from "next/image";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  size?: LogoSize;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const sizeMap: Record<LogoSize, number> = {
  sm: 24,
  md: 32,
  lg: 48,
};

export function Logo({
  size = "md",
  className = "",
  style,
  onClick,
}: LogoProps) {
  const height = sizeMap[size];
  const width = Math.round((height * 1049) / 448);

  return (
    <Image
      src="/logo.svg"
      alt="Foody"
      width={width}
      height={height}
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}
