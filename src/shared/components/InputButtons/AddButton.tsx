import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text?: string;
  handleClick?: () => void;
}

const Button = styled.button`
  width: 38px;
  height: 35px;
  border: none;
  border-radius: 5px;
  font-size: 25px;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  background-color: #da4d3d;
  &:hover {
    background-color: #d2301e;
    color: #ddd;
  }
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function AddButton({ handleClick }: ButtonProps) {
  return (
    <Button type="button" onClick={handleClick}>
      +
    </Button>
  );
}

export default AddButton;
