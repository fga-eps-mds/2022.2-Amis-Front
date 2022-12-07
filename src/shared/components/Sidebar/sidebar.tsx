/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from "react";
import styled from "styled-components";
import { AiOutlineHome, AiOutlineAudit } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";

const Container = styled.div`
  width: 200px;
  height: 100%;
  border: none;
  background: ${(props) => props.theme.colors.white};
`;

const SidebarItem = styled.div`
  width: 200px;
  height: 50px;
  border: none;
  background: ${(props) => props.theme.colors.white};
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
`;

const ItemText = styled.h1`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  color: #525252;
  padding-left: 10px;
`;

const Logo = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
`;

export function Sidebar() {
  const [pathname] = useState(false);

  return (
    <Container>
      <Logo>AMIS</Logo>
      <SidebarItem>
        <AiOutlineHome color="#525252" size={22} />
        <ItemText>Visão Geral</ItemText>
      </SidebarItem>
      <SidebarItem>
        <BiUser color="#525252" size={22} />
        <ItemText>Alunas</ItemText>
      </SidebarItem>
      <SidebarItem>
        <AiOutlineAudit color="#525252" size={22} />
        <ItemText>Turmas</ItemText>
      </SidebarItem>
      <SidebarItem>
        <HiOutlineDocumentReport color="#525252" size={22} />
        <ItemText>Relatórios</ItemText>
      </SidebarItem>
    </Container>
  );
}

export default Sidebar;
