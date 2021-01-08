import React from "react";
import { SearchCardInput } from "./SearchCardInput";
import { Note } from "../../../skrift/note";
import { CardToolbar } from "./CardToolbar";
import { Card } from "./Card";
import { CardBody } from "./CardBody";
import { CardToolbarItem } from "./CardToolbarItem";
import { SearchCardResults } from "./SearchCardResults";
import { Path } from "../interfaces/path";

type Props = {
  path: Path;
  query: string;
  results: Note[];
  onOpen: (id: string, push: boolean) => void;
  onClose: () => void;
  onAdd: (title: string) => void;
  onSearch: (query: string) => void;
};

export const SearchCard: React.FC<Props> = ({
  path,
  query,
  results,
  onOpen,
  onClose,
  onAdd,
  onSearch,
}) => {
  return (
    <Card path={path}>
      {(provided) => (
        <>
          <CardToolbar backgroundColor="bg-orange-300">
            <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
            <CardToolbarItem {...provided.dragHandleProps}>
              Move
            </CardToolbarItem>
          </CardToolbar>

          <CardBody>
            <SearchCardInput query={query} onAdd={onAdd} onSearch={onSearch} />
            <SearchCardResults onOpen={onOpen} results={results} />
          </CardBody>
        </>
      )}
    </Card>
  );
};
