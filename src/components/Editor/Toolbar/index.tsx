import React from "react";
import { Item } from "./Item";

type Props = {
  onClose: () => void;
  onDelete: () => void;
};

export const Toolbar: React.FC<Props> = ({ onDelete, onClose }) => {
  return (
    <div className="flex">
      <Item onClick={onDelete}>Delete</Item>
      <Item onClick={onClose}>Close</Item>
    </div>
  );
};
