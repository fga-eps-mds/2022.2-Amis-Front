import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const DivNavbar = styled.div`
  width: 100%;
  height: 70px;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 20px;
`;

const receitas = "/receitas";

export function Navbar() {
  return (
    <DivNavbar>
      <Link to={receitas}>Receitas</Link>
    </DivNavbar>
  );
}
