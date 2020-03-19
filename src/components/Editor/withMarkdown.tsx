import { Transforms, Editor } from "slate";
import { Serializer } from "../../interfaces/serializer";

export const withMarkdown = (editor: Editor): Editor => {
  const { insertData } = editor;

  editor.insertData = (data: DataTransfer) => {
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
