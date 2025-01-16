// This file is derived from prosemirror-markdown
// https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/schema.ts
//
// Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { Schema, MarkSpec } from "prosemirror-model"

/// Document schema for the data model used by CommonMark.
export const schema = new Schema({
    nodes: {
        doc: {
            content: "block+"
        },

        paragraph: {
            content: "inline*",
            group: "block",
            parseDOM: [{ tag: "p" }],
            toDOM() { return ["p", 0] }
        },

        blockquote: {
            content: "block+",
            group: "block",
            parseDOM: [{ tag: "blockquote" }],
            toDOM() { return ["blockquote", 0] }
        },

        horizontal_rule: {
            group: "block",
            parseDOM: [{ tag: "hr" }],
            toDOM() { return ["div", ["hr"]] }
        },

        heading: {
            attrs: { level: { default: 1 } },
            content: "(text | image)*",
            group: "block",
            defining: true,
            parseDOM: [{ tag: "h1", attrs: { level: 1 } },
            { tag: "h2", attrs: { level: 2 } },
            { tag: "h3", attrs: { level: 3 } },
            { tag: "h4", attrs: { level: 4 } },
            { tag: "h5", attrs: { level: 5 } },
            { tag: "h6", attrs: { level: 6 } }],
            toDOM(node) { return ["h" + node.attrs.level, 0] }
        },

        code_block: {
            content: "text*",
            group: "block",
            code: true,
            defining: true,
            marks: "",
            attrs: { params: { default: "" } },
            parseDOM: [{
                tag: "pre", preserveWhitespace: "full", getAttrs: node => (
                    { params: (node as HTMLElement).getAttribute("data-params") || "" }
                )
            }],
            toDOM(node) { return ["pre", node.attrs.params ? { "data-params": node.attrs.params } : {}, ["code", 0]] }
        },

        ordered_list: {
            content: "list_item+",
            group: "block",
            attrs: { order: { default: 1 }, tight: { default: false } },
            parseDOM: [{
                tag: "ol", getAttrs(dom) {
                    return {
                        order: (dom as HTMLElement).hasAttribute("start") ? +(dom as HTMLElement).getAttribute("start")! : 1,
                        tight: (dom as HTMLElement).hasAttribute("data-tight")
                    }
                }
            }],
            toDOM(node) {
                return ["ol", {
                    start: node.attrs.order == 1 ? null : node.attrs.order,
                    "data-tight": node.attrs.tight ? "true" : null
                }, 0]
            }
        },

        bullet_list: {
            content: "list_item+",
            group: "block",
            attrs: { tight: { default: false } },
            parseDOM: [{ tag: "ul", getAttrs: dom => ({ tight: (dom as HTMLElement).hasAttribute("data-tight") }) }],
            toDOM(node) { return ["ul", { "data-tight": node.attrs.tight ? "true" : null }, 0] }
        },

        list_item: {
            content: "block+",
            defining: true,
            parseDOM: [{ tag: "li" }],
            toDOM() { return ["li", 0] }
        },

        math_inline: {               // important!
            group: "inline math",
            content: "text*",        // important!
            inline: true,            // important!
            atom: true,              // important!
            toDOM: () => ["math-inline", { class: "math-node" }, 0],
            parseDOM: [{
                tag: "math-inline"   // important!
            }]
        },

        math_display: {              // important!
            group: "block math",
            content: "text*",        // important!
            atom: true,              // important!
            code: true,              // important!
            toDOM: () => ["math-display", { class: "math-node" }, 0],
            parseDOM: [{
                tag: "math-display"  // important!
            }]
        },

        text: {
            group: "inline"
        },

        image: {
            inline: true,
            attrs: {
                src: {},
                alt: { default: null },
                title: { default: null }
            },
            group: "inline",
            draggable: true,
            parseDOM: [{
                tag: "img[src]", getAttrs(dom) {
                    return {
                        src: (dom as HTMLElement).getAttribute("src"),
                        title: (dom as HTMLElement).getAttribute("title"),
                        alt: (dom as HTMLElement).getAttribute("alt")
                    }
                }
            }],
            toDOM(node) { return ["img", node.attrs] }
        },

        hard_break: {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [{ tag: "br" }],
            toDOM() { return ["br"] }
        }
    },

    marks: {
        em: {
            parseDOM: [
                { tag: "i" }, { tag: "em" },
                { style: "font-style=italic" },
                { style: "font-style=normal", clearMark: m => m.type.name == "em" }
            ],
            toDOM() { return ["em"] }
        },

        strong: {
            parseDOM: [
                { tag: "strong" },
                { tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null },
                { style: "font-weight=400", clearMark: m => m.type.name == "strong" },
                { style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
            ],
            toDOM() { return ["strong"] }
        } as MarkSpec,

        link: {
            attrs: {
                href: {},
                title: { default: null }
            },
            inclusive: false,
            parseDOM: [{
                tag: "a[href]", getAttrs(dom) {
                    return { href: (dom as HTMLElement).getAttribute("href"), title: dom.getAttribute("title") }
                }
            }],
            toDOM(node) { return ["a", node.attrs] }
        },

        code: {
            parseDOM: [{ tag: "code" }],
            toDOM() { return ["code"] }
        }
    }
})
