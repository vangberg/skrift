# Semantic Search

Semantic search lets the user search by content, matching meaning rather than keywords.
We will add semantic search to complement the existing full-text search.

## Compute embeddings

Add a function `NotesDB.computeEmbedding` that computes the embedding for a note.
Use the package `@huggingface/transformers` to compute the embedding. Use the
`all-MiniLM-L6-v2` model.

## Store embeddings

Use `sqlite-vec` to store the embeddings in a table like this:

```sql
CREATE VIRTUAL TABLE IF NOT EXISTS notes_embeddings USING vec0(
    embedding float[384]
)
```

When a note is saved with `NotesDB.save`, compute the embedding and store it in the
`notes_embeddings` table.

## Search

Performing a semantic is done with `NotesDB.searchSemantic: (query: string) => Promise<NoteID[]>`. 
It will perform a similarity search on the `notes_embeddings` table. The distance search could
be inspired by this Python code:

```
def search_semantic(conn, term, top_k=10):
    query = embedding_model().encode(term)

    df = pd.read_sql_query(
        """
        SELECT
            f.filename,
            f.title,
            e.distance AS score,
            ROW_NUMBER() OVER (ORDER BY e.distance ASC) AS rank
        FROM files f
        INNER JOIN (
            SELECT rowid, distance
            FROM files_embeddings
            WHERE embedding MATCH ?
            ORDER BY distance ASC
            LIMIT ?
        ) e ON f.id = e.rowid
        ORDER BY e.distance ASC
        """,
        conn,
        params=(serialize_f32(query), top_k),
    )

    return df
```