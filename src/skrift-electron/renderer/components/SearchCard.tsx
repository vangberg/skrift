import React from "react";
import { SearchCardInput } from "./SearchCardInput.js";
import { Note } from "../../../skrift/note/index.js";
import { CardToolbar } from "./CardToolbar.js";
import { Card } from "./Card.js";
import { CardBody } from "./CardBody.js";
import { CardToolbarItem } from "./CardToolbarItem.js";
import { SearchCardResults } from "./SearchCardResults.js";
import { OpenCardMode } from "../interfaces/state/index.js";

type Props = {
  query: string;
  results: Note[];
  onOpen: (id: string, mode: OpenCardMode) => void;
  onClose: () => void;
  onAdd: (title: string, mode: OpenCardMode) => void;
  onSearch: (query: string) => void;
};

export const SearchCard: React.FC<Props> = ({
  query,
  results,
  onOpen,
  onClose,
  onAdd,
  onSearch,
}) => {
  return (
    <Card>
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
    </Card>
  );
};
