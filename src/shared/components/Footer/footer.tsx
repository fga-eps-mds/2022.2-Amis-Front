import React from "react";
import styled from "styled-components";
import footer_image1 from "../../../assets/footer_image1.png";
import footer_image2 from "../../../assets/footer_image2.png";

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

export function Footer() {
  return (
    <DivFooter>
      <a href="https://www.instagram.com/amismulherescriativas/">
        <Image
          src={footer_image1}
          style={{ width: "40px", marginRight: "20x", marginBottom: "20px" }}
        ></Image>
      </a>
      <a href="https://pt-br.facebook.com/InstitutoMulheresCriativas/">
        <Image
          src={footer_image2}
          style={{ width: "20px", marginRight: "20px", marginBottom: "20px" }}
        ></Image>
      </a>
      <div>
        <FooterText>© 2022. All rights reserved.</FooterText>
      </div>
    </DivFooter>
  );
}
