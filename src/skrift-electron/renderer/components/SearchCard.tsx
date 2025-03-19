import React from "react";
import { SearchCardInput } from "./SearchCardInput.js";
import { NoteLink } from "../../../skrift/note/index.js";
import { CardToolbar } from "./CardToolbar.js";
import { Card } from "./Card.js";
import { CardBody } from "./CardBody.js";
import { CardToolbarItem } from "./CardToolbarItem.js";
import { SearchCardResults } from "./SearchCardResults.js";
import { OpenCardMode } from "../interfaces/state/index.js";

type Props = {
  query: string;
  keywordResults: NoteLink[];
  semanticResults: NoteLink[];
  onOpen: (id: string, mode: OpenCardMode) => void;
  onClose: () => void;
  onAdd: (title: string, mode: OpenCardMode) => void;
  onSearch: (query: string) => void;
};

export const SearchCard: React.FC<Props> = ({
  query,
  keywordResults,
  semanticResults,
  onOpen,
  onClose,
  onAdd,
  onSearch,
}) => {
  return (
    <Card>
      <CardToolbar>
        <CardToolbarItem onClick={onClose}>Close</CardToolbarItem>
      </CardToolbar>

      <CardBody visible={true}>
        <SearchCardInput
          query={query}
          onAdd={onAdd}
          onSearch={onSearch}
        />

        <div className="overflow-y-auto min-h-0">
          <h2>Exact Matches</h2>
          <SearchCardResults onOpen={onOpen} results={keywordResults} />

          <h2>Semantic Matches</h2>
          <SearchCardResults onOpen={onOpen} results={semanticResults} />
        </div>
      </CardBody>
    </Card>
  );
};
