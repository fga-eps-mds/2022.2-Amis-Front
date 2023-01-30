import React from "react";
import styled from "styled-components";
import { Navbar } from "../../shared/components/Navbar/navbar";
import PrimaryButton from "../../shared/components/PrimaryButton/PrimaryButton";
import Title from "../../shared/components/Title/Title";
import { Footer } from "../../shared/components/Footer/footer";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

const DivPresentation = styled.div`
  background-color: ${(props) => props.theme.colors.gray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 45px 120px 120px 100px;
`;

export function Receitas() {
  return (
    <div>
      <Navbar />
      <DivPresentation>
        <div>
          <Title fontSize={50} fontWeight={500}>
            RECEITAS
          </Title>
          <PrimaryButton
            text={"Cadastrar receita"}
            handleClick={() => console.log("BOTÃO")}
          />
        </div>
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
      <Footer />
    </div>
  );
}
