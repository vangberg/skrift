import P from "parsimmon";

export type Bareword = { type: "word"; value: string };
export type String = { type: "string"; value: string };
export type Quote = { type: "quote" };

export const Bareword = (value: string): Bareword => ({ type: "word", value });
export const String = (value: string): String => ({ type: "string", value });
export const Quote = (): Quote => ({ type: "quote" });

export type Token = Bareword | String | Quote;

export const Parser = P.createLanguage({
  expression(r) {
    return P.alt(
      r.andOrNot,
      r.bareword,
      r.string,
      r.quotedString,
      r.singleQuote
    )
      .sepBy(P.whitespace)
      .trim(P.optWhitespace);
  },

  /*
  From: https://www.sqlite.org/fts5.html

  > As an FTS5 bareword that is not "AND", "OR" or "NOT" (case sensitive).
  > An FTS5 bareword is a string of one or more consecutive characters 
  > that are all either:
  >
  > * [\u0080-\uFFFF] Non-ASCII range characters (i.e. unicode codepoints greater than 127), or
  > * [\w] One of the 52 upper and lower case ASCII characters, or
  > * [\w] One of the 10 decimal digit ASCII characters, or
  > * [\u005F] The underscore character (unicode codepoint 96). [Seems to be codepoint 95 in reality]
  > * [ignored for now] The substitute character (unicode codepoint 26). 
  */
  bareword() {
    return (
      P.regex(/[\w+\u0080-\uFFFF\u005F]+/)
        /*
        Without this lookahead, bareword() would match the `Que` part of `Que#ry`,
        which should be matched bystring()
        */
        .lookahead(P.alt(P.whitespace, P.eof))
        .map(Bareword)
    );
  },

  andOrNot() {
    return P.alt(P.string("AND"), P.string("OR"), P.string("NOT")).map(String);
  },

  string() {
    /*
    Starts with at least one character that is not a ", followed by
    whatever that is not whitespace.
    */
    return P.regex(/[^"\s]+\S*/)
      .atLeast(1)
      .tie()
      .map(String);
  },

  quotedString() {
    return P.oneOf(`"`)
      .then(P.noneOf(`"`).atLeast(1).tie().skip(P.string(`"`)))
      .map(String);
  },

  singleQuote() {
    return P.oneOf(`"`).map(Quote);
  },
});

export const Fts = {
  parse(input: string): Token[] {
    const result = Parser.expression.parse(input);

    if (!result.status) return [];

    return result.value;
  },

  toMatch(tokens: Token[]): string {
    const match: string[] = [];

    tokens.forEach((token) => {
      switch (token.type) {
        case "word":
          match.push(`${token.value}*`);
          break;
        case "string":
          match.push(`"${token.value}"`);
          break;
      }
    });

    return match.join(" ");
  },
};
