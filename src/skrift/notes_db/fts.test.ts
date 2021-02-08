import { Fts, Parser, Quote, String, Bareword } from "./fts";

describe("Fts", () => {
  describe("Query", () => {
    it("parses ASCII characters as bareword", () => {
      expect(Parser.expression.tryParse(`Query`)).toEqual([Bareword("Query")]);
    });

    it("parses ASCII characters followed by space as bareword", () => {
      expect(Parser.expression.tryParse(`Query `)).toEqual([Bareword("Query")]);
    });

    it("parses _ as bareword", () => {
      expect(Parser.expression.tryParse(`_`)).toEqual([Bareword("_")]);
    });

    it("parses Unicode characters above codepoint 127 as bareword", () => {
      expect(Parser.expression.tryParse(`ÆØÅ`)).toEqual([Bareword("ÆØÅ")]);
    });

    it("parses Unicode characters below or equal to codepoint 127 as string", () => {
      expect(Parser.expression.tryParse(`Qu#ery`)).toEqual([String("Qu#ery")]);
    });

    it("parses quoted string as string", () => {
      expect(Parser.expression.tryParse(`"with quote"`)).toEqual([
        String("with quote"),
      ]);
    });

    it("parses freestanding unmatched quote as quote", () => {
      expect(Parser.expression.tryParse(`"`)).toEqual([Quote()]);
    });

    it("parses AND as string", () => {
      expect(Parser.expression.tryParse(`AND`)).toEqual([String("AND")]);
    });

    it("parses OR as string", () => {
      expect(Parser.expression.tryParse(`OR`)).toEqual([String("OR")]);
    });

    it("parses NOT as string", () => {
      expect(Parser.expression.tryParse(`NOT`)).toEqual([String("NOT")]);
    });
  });

  describe("parse()", () => {
    it("parses tokens", () => {
      expect(Fts.parse(`A query "with quote" "`)).toEqual([
        Bareword("A"),
        Bareword("query"),
        String("with quote"),
        Quote(),
      ]);
    });
  });

  describe("toMatch()", () => {
    it("turns query into a match string", () => {
      expect(Fts.toMatch([Bareword("Query"), String("with quote")])).toEqual(
        `Query* "with quote"`
      );
    });
  });
});
