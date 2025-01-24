import { describe, expect, it } from "vitest";

import { NotesDB } from "./index.js";

describe("NotesDB.computeEmbedding", () => {
    it("should compute embeddings with expected dimensions", async () => {
        const markdown = "This is a test note for embedding generation";
        const embedding = await NotesDB.computeEmbedding(markdown);

        // The model Xenova/all-MiniLM-L6-v2 produces 384-dimensional embeddings
        expect(embedding).toBeInstanceOf(Float32Array);
        expect(embedding.length).toBe(384);
    });
});