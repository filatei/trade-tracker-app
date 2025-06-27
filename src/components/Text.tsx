import { Text as RNText, TextProps } from "react-native";
import React from "react";

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  className?: string;
}

export function Text({ children, style, className, ...props }: CustomTextProps) {
  return (
    <RNText
      className={className}
      style={style}
      {...props}
    >
      {children}
    </RNText>
  );
}