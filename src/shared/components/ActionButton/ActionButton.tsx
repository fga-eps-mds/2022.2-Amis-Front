import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text?: string;
  handleClick?: () => void;
  children?: React.ReactNode;
}

const Button = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: ${(props) => "white"};
  background: ${(props) => "#da4d3d"};
  font-weight: 500;
  font-size: 14px;
  &:hover {
    background-color: #d2301e;
  }
`;

export function ActionButton({ children, text, handleClick }: ButtonProps) {
  return (
    <Button type="submit" onClick={handleClick}>
      {text}
      {children}
    </Button>
  );
}

export default ActionButton;
