import React, { useEffect, useState } from "react";
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
    </div>
  );
}
