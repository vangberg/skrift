import React from "react";

import { MiniCard } from "./MiniCard";
import { MiniCardToolbar } from "./MiniCardToolbar";
import { MiniCardBody } from "./MiniCardBody";
import { SearchCard } from "../interfaces/state";

type Props = {
  card: SearchCard;
};

export const MiniSearchCard: React.FC<Props> = ({ card }) => {
  return (
    <MiniCard>
      <MiniCardToolbar backgroundColor="bg-orange-300" />
      <MiniCardBody>{card.query}</MiniCardBody>
    </MiniCard>
  );
};
