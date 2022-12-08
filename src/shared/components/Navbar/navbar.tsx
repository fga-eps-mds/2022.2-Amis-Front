import React, { useState } from "react";
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
  font-size: 24px;
`;

const MenuButton = styled.button<{ isActive?: boolean }>`
  color: ${(props) =>
    props.isActive ? props.theme.colors.primary : props.theme.colors.black};
  margin-right: 50px;
  border: none;
  background-color: ${(props) => props.theme.colors.white};
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
`;

export function Navbar() {
  const [pathname, setPathname] = useState("/");

  const menuData = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Receitas",
      path: "/receitas",
    },
    {
      name: "Contato",
      path: "/",
    },
  ];

  return (
    <DivNavbar>
      <DivNavbarCenter>
        <DivNavbarMenu>
          <Title>AMIS</Title>
          {menuData.map((itemData, index) => (
            <MenuButton
              key={index}
              isActive={pathname === itemData.path}
              onClick={() => setPathname(itemData.path)}
            >
              {itemData.name}
            </MenuButton>
          ))}
        </DivNavbarMenu>
        <Button>Área Logada</Button>
      </DivNavbarCenter>
    </DivNavbar>
  );
}
