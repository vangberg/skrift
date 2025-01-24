import { describe, expect, test } from 'vitest';
import { Fts, Parser, Quote, String, Bareword } from "./fts.js";

describe("Fts", () => {
  describe("Query", () => {
    test("parses ASCII characters as bareword", () => {
      expect(Parser.expression.tryParse(`Query`)).toEqual([Bareword("Query")]);
    });

    test("parses ASCII characters followed by space as bareword", () => {
      expect(Parser.expression.tryParse(`Query `)).toEqual([Bareword("Query")]);
    });

    test("parses _ as bareword", () => {
      expect(Parser.expression.tryParse(`_`)).toEqual([Bareword("_")]);
    });

    test("parses Unicode characters above codepoint 127 as bareword", () => {
      expect(Parser.expression.tryParse(`ÆØÅ`)).toEqual([Bareword("ÆØÅ")]);
    });

    test("parses Unicode characters below or equal to codepoint 127 as string", () => {
      expect(Parser.expression.tryParse(`Qu#ery`)).toEqual([String("Qu#ery")]);
    });

    test("parses quoted string as string", () => {
      expect(Parser.expression.tryParse(`"with quote"`)).toEqual([
        String("with quote"),
      ]);
    });

    test("parses freestanding unmatched quote as quote", () => {
      expect(Parser.expression.tryParse(`"`)).toEqual([Quote()]);
    });

    test("parses AND as string", () => {
      expect(Parser.expression.tryParse(`AND`)).toEqual([String("AND")]);
    });

    test("parses OR as string", () => {
      expect(Parser.expression.tryParse(`OR`)).toEqual([String("OR")]);
    });

    test("parses NOT as string", () => {
      expect(Parser.expression.tryParse(`NOT`)).toEqual([String("NOT")]);
    });
  });

  describe("parse()", () => {
    test("parses tokens", () => {
      expect(Fts.parse(`A query "with quote" "`)).toEqual([
        Bareword("A"),
        Bareword("query"),
        String("with quote"),
        Quote(),
      ]);
    });
  });

  describe("toMatch()", () => {
    test("turns query into a match string", () => {
      expect(Fts.toMatch([Bareword("Query"), String("with quote")])).toEqual(
        `Query* "with quote"`
      );
    });
  });
});
