import React from "react";
import styled from "styled-components";
import { grey } from "@mui/material/colors";

const DivNavbar = styled.div`
  width: 85%;
  height: 100px;
  background: ${(props) => grey};
  padding: 20px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: ${(props) => "black"};
  font-size: 28px;
  font-weight: 500;
  height: 40px;
  border-right: 1px solid #c5bdbd;
  padding-right: 100px;
  display: flex;
  align-items: center;
`;

const DivUser = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const DivUserName = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h1`
  color: ${(props) => "black"};
  font-size: 15px;
  font-weight: 350;
  display: flex;
  align-items: center;
`;

const UserFunction = styled.h1`
  color: ${(props) => "black"};
  font-size: 11px;
  font-weight: 350;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const UserImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-color: #525252;
`;

export function Navbarlog({ text }: TitleProps) {
  return (
    <DivNavbar>
      <Title> {text} </Title>
      <DivUser>
        <DivUserName>
          <UserName>JOSÉ MARIA</UserName>
          <UserFunction>Admin</UserFunction>
        </DivUserName>
        <UserImage />
      </DivUser>
    </DivNavbar>
  );
}
export default Navbarlog;
