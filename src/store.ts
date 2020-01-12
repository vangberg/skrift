import React from 'react'
import { Note } from "./interfaces/note";

type Notes = Map<string, Note>
type Callback = () => void

const KEY = 'skrift.store.notes'

function fromLocalStorage(): Notes {
  const json = window.localStorage.getItem(KEY) || ''
  try {
    return new Map(JSON.parse(json))
  }
  catch {
    return new Map()
  }
}

function toLocalStorage(notes: Notes) {
  const json = JSON.stringify(Array.from(notes.entries()))
  window.localStorage.setItem(KEY, json)
}

export class Store {
  notes: Notes;
  callbacks: Callback[];

  constructor() {
    this.notes = fromLocalStorage()
    this.callbacks = []
  }

  getNotes(): Notes {
    return new Map(this.notes)
  }

  getIds(): string[] {
    return Array.from(this.notes.keys())
  }

  get(id: string): Note {
    const note = this.notes.get(id)
    
    if (!note) {
      throw new Error(`Could not find note with id ${id}`)
    }
    
    return note
  }

  save(id: string, note: Note) {
    this.notes.set(id, note)
    toLocalStorage(this.notes)
    this.callbacks.forEach(callback => callback())
  }

  generate(): [string, Note] {
    const id = new Date().toJSON()

    const note = {
      title: "",
      links: [],
      markdown: ""
    }
    
    this.save(id, note)

    return [id, note]
  }

  onUpdate(callback: Callback) {
    this.callbacks.push(callback)
  }
}

export const StoreContext = React.createContext(new Store())