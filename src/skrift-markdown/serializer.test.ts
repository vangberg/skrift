import { schema } from "./schema.js";
import { proseMirrorToMarkdown } from "./serializer.js";

describe("proseMirrorToMarkdown", () => {
    const createDoc = (content: any) => {
        return schema.node("doc", {}, content);
    };

    test("serializes paragraphs", () => {
        const doc = createDoc([
            schema.node("paragraph", {}, [schema.text("Hello world")]),
            schema.node("paragraph", {}, [schema.text("Another paragraph")]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe("Hello world\n\nAnother paragraph\n");
    });

    test("serializes headings", () => {
        const doc = createDoc([
            schema.node("heading", { level: 1 }, [schema.text("Title")]),
            schema.node("heading", { level: 2 }, [schema.text("Subtitle")]),
            schema.node("heading", { level: 3 }, [schema.text("Section")]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe("# Title\n\n## Subtitle\n\n### Section\n");
    });

    test("serializes lists", () => {
        const doc = createDoc([
            schema.node("bullet_list", {}, [
                schema.node("list_item", {}, [
                    schema.node("paragraph", {}, [schema.text("First item")]),
                ]),
                schema.node("list_item", {}, [
                    schema.node("paragraph", {}, [schema.text("Second item")]),
                ]),
            ]),
            schema.node("ordered_list", {}, [
                schema.node("list_item", {}, [
                    schema.node("paragraph", {}, [schema.text("First numbered")]),
                ]),
                schema.node("list_item", {}, [
                    schema.node("paragraph", {}, [schema.text("Second numbered")]),
                ]),
            ]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe(
            "* First item\n* Second item\n\n1. First numbered\n2. Second numbered\n"
        );
    });

    test("serializes emphasis and strong marks", () => {
        const doc = createDoc([
            schema.node("paragraph", {}, [
                schema.text("Normal "),
                schema.text("italic", [schema.mark("em")]),
                schema.text(" and "),
                schema.text("bold", [schema.mark("strong")]),
                schema.text(" text"),
            ]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe("Normal *italic* and **bold** text\n");
    });

    test("serializes links", () => {
        const doc = createDoc([
            schema.node("paragraph", {}, [
                schema.text("Visit "),
                schema.text("Example", [
                    schema.mark("link", { href: "https://example.com", title: "Example Site" }),
                ]),
            ]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe(
            'Visit [Example](https://example.com "Example Site")\n'
        );
    });

    test("serializes code blocks and inline code", () => {
        const doc = createDoc([
            schema.node("paragraph", {}, [
                schema.text("Inline "),
                schema.text("code", [schema.mark("code")]),
            ]),
            schema.node("code_block", {}, [schema.text("function test() {\n  return true;\n}")]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe(
            "Inline `code`\n\n```\nfunction test() {\n  return true;\n}\n```\n"
        );
    });

    test("serializes images", () => {
        const doc = createDoc([
            schema.node("paragraph", {}, [
                schema.node("image", {
                    src: "image.jpg",
                    alt: "Alt text",
                    title: "Image title",
                }),
            ]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe('![Alt text](image.jpg "Image title")\n');
    });

    test("serializes blockquotes", () => {
        const doc = createDoc([
            schema.node("blockquote", {}, [
                schema.node("paragraph", {}, [schema.text("Quoted text")]),
            ]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe("> Quoted text\n");
    });

    test("serializes horizontal rules", () => {
        const doc = createDoc([
            schema.node("paragraph", {}, [schema.text("Above")]),
            schema.node("horizontal_rule"),
            schema.node("paragraph", {}, [schema.text("Below")]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe("Above\n\n***\n\nBelow\n");
    });

    test("serializes hard breaks", () => {
        const doc = createDoc([
            schema.node("paragraph", {}, [
                schema.text("First line"),
                schema.node("hard_break"),
                schema.text("Second line"),
            ]),
        ]);

        expect(proseMirrorToMarkdown(doc)).toBe("First line\\\nSecond line\n");
    });
});
