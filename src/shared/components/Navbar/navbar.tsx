import React from "react";
import Button from "../Button/Button";
import styled from "styled-components";

const DivNavbar = styled.div`
  width: 100vw;
  height: 106px;
  background: ${(props) => props.theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DivNavbarCenter = styled.div`
  width: 80vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DivNavbarMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
  border-right: 1px solid #666666;
  padding-right: 100px;
  margin-right: 45px;
`;

const MenuButton = styled.button`
  color: ${(props) => props.theme.colors.black};
  margin-right: 50px;
  border: none;
  background-color: ${(props) => props.theme.colors.white};
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
`;

const receitas = "/receitas";

export function Navbar() {
  return (
    <DivNavbar>
      <DivNavbarCenter>
        <DivNavbarMenu>
          <Title>AMIS</Title>
          <MenuButton>Home</MenuButton>
          <MenuButton>Receitas</MenuButton>
          <MenuButton>Contato</MenuButton>
        </DivNavbarMenu>
        <Button>Área Logada</Button>
      </DivNavbarCenter>
    </DivNavbar>
  );
}
