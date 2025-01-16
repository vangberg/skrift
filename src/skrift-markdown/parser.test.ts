import { markdownToProseMirror } from "./parser.js";

describe("markdownToProseMirror", () => {
    test("parses basic text", () => {
        const doc = markdownToProseMirror("Hello world");
        expect(doc.type.name).toBe("doc");
        expect(doc.firstChild?.type.name).toBe("paragraph");
        expect(doc.firstChild?.textContent).toBe("Hello world");
    });

    test("parses headings", () => {
        const markdown = "# Heading 1\n## Heading 2";
        const doc = markdownToProseMirror(markdown);
        const [h1, h2] = doc.content.content;

        expect(h1.type.name).toBe("heading");
        expect(h1.attrs.level).toBe(1);
        expect(h1.textContent).toBe("Heading 1");

        expect(h2.type.name).toBe("heading");
        expect(h2.attrs.level).toBe(2);
        expect(h2.textContent).toBe("Heading 2");
    });

    test("parses thematic breaks", () => {
        const doc = markdownToProseMirror("---");
        expect(doc.firstChild?.type.name).toBe("horizontal_rule");
    });

    test("parses blockquotes", () => {
        const doc = markdownToProseMirror("> Quoted text");
        expect(doc.firstChild?.type.name).toBe("blockquote");
        expect(doc.firstChild?.firstChild?.type.name).toBe("paragraph");
        expect(doc.firstChild?.firstChild?.textContent).toBe("Quoted text");
    });

    test("parses bullet lists", () => {
        const markdown = "- Item 1\n- Item 2";
        const doc = markdownToProseMirror(markdown);
        expect(doc.firstChild?.type.name).toBe("bullet_list");
        const items = doc.firstChild?.content.content;
        expect(items?.length).toBe(2);
        expect(items?.[0].type.name).toBe("list_item");
        expect(items?.[0].firstChild?.textContent).toBe("Item 1");
    });

    test("parses ordered lists", () => {
        const markdown = "1. First\n2. Second";
        const doc = markdownToProseMirror(markdown);
        expect(doc.firstChild?.type.name).toBe("ordered_list");
        const items = doc.firstChild?.content.content;
        expect(items?.length).toBe(2);
        expect(items?.[0].type.name).toBe("list_item");
        expect(items?.[0].firstChild?.textContent).toBe("First");
    });

    test("converts tables to paragraphs", () => {
        const markdown = "| Header |\n|--------|\n| Cell |";
        const doc = markdownToProseMirror(markdown);
        expect(doc.firstChild?.type.name).toBe("paragraph");
        expect(doc.firstChild?.textContent).toBeDefined();
    });

    test("converts HTML to text", () => {
        const markdown = "HTML <div>Content</div>";
        const doc = markdownToProseMirror(markdown);
        expect(doc.firstChild?.type.name).toBe("paragraph");
        expect(doc.firstChild?.textContent).toBe("HTML <div>Content</div>");
    });

    test("parses emphasis and strong", () => {
        const markdown = "*italic* **bold**";
        const doc = markdownToProseMirror(markdown);
        const paragraph = doc.firstChild;
        const [italic, space, bold] = paragraph?.content.content || [];

        expect(italic.marks[0].type.name).toBe("em");
        expect(italic.text).toBe("italic");

        expect(bold.marks[0].type.name).toBe("strong");
        expect(bold.text).toBe("bold");
    });

    test("converts strikethrough to plain text", () => {
        const markdown = "~~strikethrough~~";
        const doc = markdownToProseMirror(markdown);
        expect(doc.firstChild?.textContent).toBe("~~strikethrough~~");
    });

    test("parses inline code", () => {
        const markdown = "`code`";
        const doc = markdownToProseMirror(markdown);
        expect(doc.firstChild?.textContent).toBe("code");
    });

    test("parses hard breaks", () => {
        const markdown = "line 1  \nline 2";
        const doc = markdownToProseMirror(markdown);
        const paragraph = doc.firstChild;
        expect(paragraph?.childCount).toBe(3); // text, hard_break, text
        expect(paragraph?.child(1).type.name).toBe("hard_break");
    });

    test("parses links", () => {
        const markdown = "[link](https://example.com 'title')";
        const doc = markdownToProseMirror(markdown);
        const link = doc.firstChild?.firstChild;

        expect(link?.marks[0].type.name).toBe("link");
        expect(link?.marks[0].attrs.href).toBe("https://example.com");
        expect(link?.marks[0].attrs.title).toBe("title");
        expect(link?.text).toBe("link");
    });

    test("parses images", () => {
        const markdown = "![alt](https://example.com/img.jpg 'title')";
        const doc = markdownToProseMirror(markdown);
        const image = doc.firstChild?.firstChild;

        expect(image?.type.name).toBe("image");
        expect(image?.attrs.src).toBe("https://example.com/img.jpg");
        expect(image?.attrs.title).toBe("title");
        expect(image?.attrs.alt).toBe("alt");
    });

    test("ignores reference-style definitions", () => {
        const markdown = "Document\n\n[id]: https://example.com";
        const doc = markdownToProseMirror(markdown);
        expect(doc.childCount).toBe(1);
        expect(doc.firstChild?.textContent).toBe("Document");
    });

    test("parses code blocks", () => {
        const markdown = "```javascript\nconst x = 1;\n```";
        const doc = markdownToProseMirror(markdown);
        const codeBlock = doc.firstChild;

        expect(codeBlock?.type.name).toBe("code_block");
        expect(codeBlock?.attrs.params).toBe("javascript");
        expect(codeBlock?.textContent).toBe("const x = 1;");
    });
}); 