type Foo = number;

declare namespace JSX {
  interface IntrinsicElements {
    editor: import("slate").Editor;
    paragraph: any;
  }
}
