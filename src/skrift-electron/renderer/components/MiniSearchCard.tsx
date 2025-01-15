import React from "react";

import { MiniCard } from "./MiniCard.js";
import { MiniCardToolbar } from "./MiniCardToolbar.js";
import { MiniCardBody } from "./MiniCardBody.js";
import { SearchCard } from "../interfaces/state/index.js";

type Props = {
  card: SearchCard;
};

export const MiniSearchCard: React.FC<Props> = ({ card }) => {
  return (
    <MiniCard>
      <MiniCardToolbar backgroundColor="bg-yellow-300" />
      <MiniCardBody>{card.query}</MiniCardBody>
    </MiniCard>
  );
};
