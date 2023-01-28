import React from "react";
import styled from "styled-components";
import { Navbar } from "../../shared/components/Navbar/navbar";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Title from "../../shared/components/Title/Title";
import footer_image1 from "../../assets/footer_image1.png";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const DivPresentation = styled.div`
  background-color: ${(props) => props.theme.colors.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 45px 120px 120px 100px;
`;

const DivFooter = styled.div`
  width: 100%;
  background: ${(props) => props.theme.colors.primary};
  padding: 45px;
  text-align: center;
`;

const Image = styled.img`
  border-radius: 35%;
`;

const FooterText = styled.span`
  color: ${(props) => props.theme.colors.white};
  font-weight: 400px;
  font-size: 13px;
`;

export function Receitas() {
  return (
    <div>
      <Navbar />
      <DivPresentation>
        <Title fontSize={50} fontWeight={500}>
          RECEITAS
        </Title>
        <PrimaryButton
          text={"Cadastrar receita"}
          handleClick={() => console.log("BOTÃO")}
        />
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Biscoito ou Bolacha
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Quaerat laboriosam, asperiores fugiat quae ad corporis, ea porro
                aliquid labore quis quia quisquam cupiditate, fuga iste eum.
                Quae voluptas delectus alias.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </DivPresentation>
      <DivFooter>
        <a href="https://www.instagram.com/amismulherescriativas/">
          <Image
            src={footer_image1}
            style={{
              width: "40px",
              marginBottom: "20px",
            }}
          ></Image>
        </a>
        <div>
          <FooterText>© 2022. All rights reserved.</FooterText>
        </div>
      </DivFooter>
    </div>
  );
}
