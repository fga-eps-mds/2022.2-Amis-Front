/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AiOutlineHome, AiOutlineAudit } from "react-icons/ai";
import { BiLogOut, BiUser } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { AuthContext, Roles } from "../../../context/AuthProvider";

const Container = styled.div`
  width: 200px;
  height: 100%;
  border: none;
  background: white;
`;

const SidebarItem = styled(({ active, ...props }) => <Link {...props} />)`
  width: 200px;
  height: 60px;
  border: none;
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px 0 0 5px;
  text-decoration: none;
  padding-left: ${(props) => props.active && "13px"};
  background: ${(props) => (props.active ? grey : "white")};
  color: ${(props) => (props.active ? "#da4d3d" : "#525252")};
  border-left: ${(props) => props.active && "7px solid" + "#da4d3d"};
`;

const ItemText = styled.h1`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 300;
  padding-left: 10px;
`;

const Logo = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: "#da4d3d";
  font-weight: 600;
`;

interface SideBarItemProps {
  id: number;
  name: string;
  path: string;
  icon: JSX.Element;
  allowedRoles: Roles[];
  handleClick?: () => void;
}

export function Sidebar() {
  const [pathname] = useState(window.location.pathname);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const sidebarData: SideBarItemProps[] = [
    {
      id: 1,
      name: "Tela Inicial",
      path: "/",
      icon: (
        <AiOutlineHome
          color={pathname === "/" ? "#da4d3d" : "#525252"}
          size={22}
        />
      ),
      allowedRoles: [],
    },
    {
      id: 2,
      name: "Alunas",
      path: "/alunas",
      icon: (
        <BiUser
          color={pathname === "/alunas" ? "#da4d3d" : "#525252"}
          size={22}
        />
      ),
      allowedRoles: [],
    },
    {
      id: 3,
      name: "Turmas",
      path: "/turmas",
      icon: (
        <AiOutlineAudit
          color={pathname === "/turmas" ? "#da4d3d" : "#525252"}
          size={22}
        />
      ),
      allowedRoles: [],
    },
    // {
    //   id: 4,
    //   name: "Relatórios",
    //   path: "/relatorios",
    //   icon: (
    //     <HiOutlineDocumentReport
    //       color={pathname === "/relatorios" ? "#da4d3d" : "#525252"}
    //       size={22}
    //     />
    //   ),
    // },
    {
      id: 5,
      name: "Assistentes",
      path: "/assistentes",
      icon: (
        <BiUser
          color={pathname === "/assistentes" ? "#da4d3d" : "#525252"}
          size={22}
        />
      ),
      allowedRoles: [],
    },
    // {
    //   id: 6,
    //   name: "Configurações",
    //   path: "/configurações",
    //   icon: (
    //     <FiSettings
    //       color={pathname === "/configurações" ? "#da4d3d" : "#525252"}
    //       size={22}
    //     />
    //   ),
    // },
    {
      id: 7,
      name: "Sair",
      path: "/login/logout",
      icon: (
        <BiLogOut
          color={pathname === "/login/logout" ? "#da4d3d" : "#525252"}
          size={22}
        />
      ),
      handleClick: () => {
        auth.logout();
        navigate("/login/logout");
      },
      allowedRoles: [],
    },
  ];

  return (
    <Container>
      <Logo>AMIS</Logo>
      {sidebarData.map((itemData, index) => (
        <SidebarItem
          key={index}
          active={pathname === itemData.path}
          to={itemData.path}
          onClick={itemData.handleClick}
        >
          {itemData.icon}
          <ItemText>{itemData.name}</ItemText>
        </SidebarItem>
      ))}
    </Container>
  );
}

export default Sidebar;
