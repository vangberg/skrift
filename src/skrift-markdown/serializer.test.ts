import { describe, expect, test } from 'vitest'
import { builders } from "prosemirror-test-builder";
import { schema } from "./schema.js";
import { proseMirrorToMarkdown } from "./serializer.js";

const { doc, paragraph, bullet_list, list_item, ordered_list, heading, code_block, blockquote, horizontal_rule, hard_break, em, math_inline, math_display } = builders(schema);

describe("proseMirrorToMarkdown", () => {
    test("serializes paragraphs", () => {
        const md = proseMirrorToMarkdown(doc(
            paragraph("Hello world"),
            paragraph("Another paragraph"),
        ))

        expect(md).toBe("Hello world\n\nAnother paragraph\n");
    });

    test("serializes headings", () => {
        const md = proseMirrorToMarkdown(doc(
            heading({ level: 1 }, "Title"),
            heading({ level: 2 }, "Subtitle"),
            heading({ level: 3 }, "Section"),
        ));

        expect(md).toBe("# Title\n\n## Subtitle\n\n### Section\n");
    });

    test("serializes lists", () => {
        const md = proseMirrorToMarkdown(doc(
            bullet_list(
                list_item(paragraph("First item")),
                list_item(paragraph("Second item"))
            ),
            ordered_list(
                list_item(paragraph("First numbered")),
                list_item(paragraph("Second numbered"))
            )
        ));

        expect(md).toBe(
            "* First item\n\n* Second item\n\n1. First numbered\n\n2. Second numbered\n"
        );
    });

    test("serializes emphasis and strong marks", () => {
        const md = proseMirrorToMarkdown(doc(
            paragraph(
                "Normal ",
                schema.text("italic", [schema.mark("em")]),
                " and ",
                schema.text("bold", [schema.mark("strong")]),
                " text"
            )
        ));

        expect(md).toBe("Normal *italic* and **bold** text\n");
    });

    test("serializes links", () => {
        const md = proseMirrorToMarkdown(doc(
            paragraph(
                "Visit ",
                schema.text("Example", [schema.mark("link", { href: "https://example.com", title: "Example Site" })])
            )
        ));

        expect(md).toBe(
            'Visit [Example](https://example.com "Example Site")\n'
        );
    });

    // test("serializes inline code", () => {
    //     const md = proseMirrorToMarkdown(doc(
    //         paragraph(
    //             "Inline ",
    //             code("code")
    //         )
    //     ));

    //     console.log(em("code"));
    //     console.log(code("code"));

    //     expect(md).toBe("Inline `code`\n");
    // });

    test("serializes code blocks", () => {
        const md = proseMirrorToMarkdown(doc(
            code_block("function test() {\n  return true;\n}")
        ));

        expect(md).toBe(
            "```\nfunction test() {\n  return true;\n}\n```\n"
        );
    });

    test("serializes images", () => {
        const md = proseMirrorToMarkdown(doc(
            paragraph(
                schema.nodes.image.create({ src: "image.jpg", alt: "Alt text", title: "Image title" })
            )
        ));

        expect(md).toBe('![Alt text](image.jpg "Image title")\n');
    });

    test("serializes blockquotes", () => {
        const md = proseMirrorToMarkdown(doc(
            blockquote(
                paragraph("Quoted text")
            )
        ));

        expect(md).toBe("> Quoted text\n");
    });

    test("serializes horizontal rules", () => {
        const md = proseMirrorToMarkdown(doc(
            paragraph("Above"),
            horizontal_rule(),
            paragraph("Below")
        ));

        expect(md).toBe("Above\n\n***\n\nBelow\n");
    });

    test("serializes hard breaks", () => {
        const md = proseMirrorToMarkdown(doc(
            paragraph(
                "First line",
                hard_break(),
                "Second line"
            )
        ));

        expect(md).toBe("First line\\\nSecond line\n");
    });

    test("serializes inline math", () => {
        const md = proseMirrorToMarkdown(doc(
            paragraph(
                "The equation ",
                schema.nodes.math_inline.create({}, schema.text("x^2")),
                " is quadratic"
            )
        ));

        expect(md).toBe("The equation $x^2$ is quadratic\n");
    });

    test("serializes display math", () => {
        const md = proseMirrorToMarkdown(doc(
            schema.nodes.math_display.create({}, schema.text("x^2 + y^2 = z^2"))
        ));

        expect(md).toBe("$$\nx^2 + y^2 = z^2\n$$\n");
    });
});
