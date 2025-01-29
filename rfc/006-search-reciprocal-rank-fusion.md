# Search: Reciprocal Rank Fusion

We have two search methods:

- `NotesDB.searchKeyword`: Search by keyword.
- `NotesDB.searchSemantic`: Search by semantic similarity.

We can combine the results of these two searches using Reciprocal Rank Fusion (RRF)[^rrf].

The idea is to first search by keyword, then search by semantic similarity, and then combine the results.

`NotesDB.search` will perform an RRF search.

[^rrf]: https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking