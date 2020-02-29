import React from "react";
import { Item } from "./Item";

type Props = {
  onClose: () => void;
  onDelete: () => void;
  onCopy: () => void;
};

export const Toolbar: React.FC<Props> = ({ onCopy, onDelete, onClose }) => {
  return (
    <div className="flex">
      <Item onClick={onDelete}>Delete</Item>
      <Item onClick={onCopy}>Copy link</Item>
      <Item onClick={onClose}>Close</Item>
    </div>
  );
};
