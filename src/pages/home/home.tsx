import React, { useEffect, useState } from "react";
import Button from "../../shared/components/Button/Button";
import { Navbar } from "../../shared/components/Navbar/navbar";
import Title from "../../shared/components/Title/Title";

export function Home() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    console.log("COUNT ->>>>", count);
  }, [count]);

  return (
    <div>
      <Navbar />
      <Title fontSize={72} fontWeight={300}>
        A quantidade de cliques é {count}!
      </Title>
      <Button onClick={() => setCount(count + 1)}>Adicionar</Button>
    </div>
  );
}
