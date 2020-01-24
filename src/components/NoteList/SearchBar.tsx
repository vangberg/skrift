import React, { useContext, useCallback } from "react";
import { StoreContext } from "../../store";

type Props = {};

export const SearchBar: React.FC<Props> = ({}) => {
  const store = useContext(StoreContext);
  const handleAdd = useCallback(() => store.generate(), [store]);

  return (
    <div className="flex">
      <input
        type="text"
        className="flex-grow border rounded-l p-1 outline-none"
        placeholder="Type to search…"
      />
      <div onClick={handleAdd} className="p-1 bg-blue-200 rounded-r">
        Add
      </div>
    </div>
  );
};
