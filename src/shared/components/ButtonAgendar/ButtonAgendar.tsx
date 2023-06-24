import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text?: string;
  handleClick?: () => void;
  children?: React.ReactNode;
}

const Button = styled.button`
  width: 200px;
  height: 50px;
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
 

export function ButtonAgendar({ children, text, handleClick }: ButtonProps) {
  return (
    <Button type="submit" onClick={handleClick}>
      {text}
      {children}
    </Button>
  );
}


export default ButtonAgendar;
