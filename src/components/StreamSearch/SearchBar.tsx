import React, { useCallback } from "react";

type Props = {
  query: string;
  onAdd: (title: string) => void;
  onSearch: (query: string) => void;
};

export const SearchBar: React.FC<Props> = ({ query, onAdd, onSearch }) => {
  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onAdd(query);
    },
    [query, onAdd]
  );
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onSearch(event.target.value),
    [onSearch]
  );

  return (
    <div className="flex p-2">
      <form className="flex flex-1" onSubmit={handleSubmit}>
        <input
          type="search"
          className="flex-grow border rounded-l p-1 outline-none"
          placeholder="Type to search…"
          value={query}
          onChange={handleChange}
        />
        <button className="p-1 border border-blue-200 bg-blue-200 rounded-r">
          Create
        </button>
      </form>
    </div>
  );
};