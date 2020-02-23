import { Transforms } from "slate";
import { Serializer } from "../../interfaces/serializer";
import { ReactEditor } from "slate-react";

export const withMarkdown = (editor: ReactEditor): ReactEditor => {
  const { insertData } = editor;

  editor.insertData = data => {
    const fragment = data.getData("application/x-slate-fragment");

    if (!fragment) {
      const text = data.getData("text/plain");
      const parsed = Serializer.deserialize(text);
      Transforms.insertFragment(editor, parsed);
      return;
    }

    return insertData(data);
  };

  return editor;
};
