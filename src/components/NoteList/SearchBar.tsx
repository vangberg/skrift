import React, { useCallback, useState } from "react";

type Props = {
  onAdd: (title: string) => void;
};

export const SearchBar: React.FC<Props> = ({ onAdd }) => {
  const [text, setText] = useState("");
  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onAdd(text);
    },
    [onAdd, text]
  );
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setText(event.target.value),
    [setText]
  );

  return (
    <div className="flex">
      <form className="flex flex-1" onSubmit={handleSubmit}>
        <input
          type="text"
          className="flex-grow border rounded-l p-1 outline-none"
          placeholder="Type to search…"
          value={text}
          onChange={handleChange}
        />
        <button className="p-1 border border-blue-200 bg-blue-200 rounded-r">
          Add
        </button>
      </form>
    </div>
  );
};
