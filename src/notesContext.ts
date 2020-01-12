import React from 'react'
import { Note } from './interfaces/note'

export const NotesContext = React.createContext(new Map<string, Note>())