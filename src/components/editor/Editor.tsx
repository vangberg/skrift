import React, { useMemo, useCallback, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { withNoteLink } from './NoteLink'
import { renderElement } from './renderElement'
import { Serializer } from '../../interfaces/serializer';

type Props = {
  markdown: string
}

export const Editor: React.FC<Props> = ({ markdown }) => {
  const editor = useMemo(
    () => withReact(withNoteLink(createEditor())),
    []
  )

  const [value, setValue] =
    useState(() => Serializer.deserialize(markdown))

  const onChange = useCallback(setValue, [])

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable renderElement={useCallback(renderElement, [])} />
    </Slate>
  );
}