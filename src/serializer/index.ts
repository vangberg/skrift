import { Node } from 'slate'

import { serialize } from './serialize'
import { deserialize } from './deserialize'
import * as guards from './guards'

export interface NoteLinkElement {
  type: 'note-link',
  id: string,
  children: Node[]  
}

export const Serializer = {
  serialize, deserialize,
  ...guards
}