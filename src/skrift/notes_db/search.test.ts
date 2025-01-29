import { NotesDB } from "./index.js";
import { Note } from "../note/index.js";
import { describe, it, expect, beforeEach } from "vitest";
import BetterSqlite3 from "better-sqlite3";

describe("NotesDB.search", () => {
    let db: BetterSqlite3.Database;

    beforeEach(() => {
        db = NotesDB.memory();
        NotesDB.initialize(db);
    });

    it("combines keyword and semantic search results", async () => {
        // Create test notes with different content
        await NotesDB.save(db, "1.md", "# Python Programming\nLearn about Python programming language basics.");
        await NotesDB.save(db, "2.md", "# JavaScript Guide\nA comprehensive guide to JavaScript programming.");
        await NotesDB.save(db, "3.md", "# Programming Languages\nCompare different programming languages.");
        await NotesDB.save(db, "4.md", "# Cooking Recipe\nHow to make a delicious pasta.");

        // Search for programming related content
        const results = await NotesDB.search(db, "programming language guide");

        // Verify that programming related notes are ranked higher
        expect(results).toContain("3.md"); // Contains both "programming" and "languages"
        expect(results).toContain("1.md"); // Contains "programming language"
        expect(results).toContain("2.md"); // Contains "programming"

        // Cooking recipe should be ranked last or not included
        const cookingIndex = results.indexOf("4.md");
        const programmingIndex = results.indexOf("3.md");
        expect(cookingIndex).toBeGreaterThan(programmingIndex);
    });

    it("returns empty array for empty query", async () => {
        const results = await NotesDB.search(db, "");
        expect(results).toEqual([]);
    });

    it("handles non-existing content gracefully", async () => {
        const results = await NotesDB.search(db, "xyznonexistent");
        expect(results).toEqual([]);
    });
}); 