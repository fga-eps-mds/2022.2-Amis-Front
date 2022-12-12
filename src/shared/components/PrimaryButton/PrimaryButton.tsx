import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text: string;
  handleClick?: () => void;
}

const Button = styled.button`
  width: 150px;
  height: 50px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.white};
  background: ${(props) => props.theme.colors.primary};

  &:hover {
    background-color: #d2301e;
  }
`;

export function PrimaryButton({ text, handleClick }: ButtonProps) {
  return (
    <Button type="submit" onClick={handleClick}>
      {text}
    </Button>
  );
}

export default PrimaryButton;
