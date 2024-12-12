import React from "react";
import { SearchCardInput } from "./SearchCardInput";
import { Note } from "../../../skrift/note";
import { CardToolbar } from "./CardToolbar";
import { Card } from "./Card";
import { CardBody } from "./CardBody";
import { CardToolbarItem } from "./CardToolbarItem";
import { SearchCardResults } from "./SearchCardResults";
import { Path } from "../interfaces/path";
import {
  OpenCardMode,
  SearchCard as SearchCardType,
} from "../interfaces/state";

type Props = {
  path: Path;
  card: SearchCardType;
  query: string;
  results: Note[];
  onOpen: (id: string, mode: OpenCardMode) => void;
  onClose: () => void;
  onAdd: (title: string, mode: OpenCardMode) => void;
  onSearch: (query: string) => void;
};

export const SearchCard: React.FC<Props> = ({
  path,
  card,
  query,
  results,
  onOpen,
  onClose,
  onAdd,
  onSearch,
}) => {
  return (
    <Card card={card} path={path}>
      {/* {(provided) => ( */}
      <>
        <CardToolbar>
          <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
        </CardToolbar>

        <CardBody visible={true}>
          <div className="p-2">
            <SearchCardInput
              query={query}
              onAdd={onAdd}
              onSearch={onSearch}
            />
            <SearchCardResults onOpen={onOpen} results={results} />
          </div>
        </CardBody>
      </>
      {/* )} */}
    </Card>
  );
};
