import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import BookCard from "./components/BookCard";

const API_BASE = "https://openlibrary.org/search.json";

function useDebounced(value, delay = 600) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 600);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [numFound, setNumFound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const PAGE_SIZE = 20;

  const fetchBooks = useCallback(async (q, pageNum = 1) => {
    if (!q) {
      setResults([]);
      setNumFound(0);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const offset = (pageNum - 1) * PAGE_SIZE;
      const url = `${API_BASE}?title=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&offset=${offset}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setResults(data.docs || []);
      setNumFound(data.numFound || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch results. Try again.");
      setResults([]);
      setNumFound(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // when debounced query changes, reset to page 1 and fetch
  useEffect(() => {
    setPage(1);
    fetchBooks(debouncedQuery, 1);
  }, [debouncedQuery, fetchBooks]);

  // when page changes, fetch
  useEffect(() => {
    if (!debouncedQuery) return;
    fetchBooks(debouncedQuery, page);
  }, [page, debouncedQuery, fetchBooks]);

  const totalPages = Math.ceil(numFound / PAGE_SIZE);

  return (
    <div className="app">
      <header className="header">
        <h1>📚 Book Finder</h1>
        <p className="subtitle">Search books by title using Open Library</p>
      </header>

      <main className="main">
        <SearchBar value={query} onChange={(v) => setQuery(v)} placeholder="Search by book title (e.g. Pride and Prejudice)" />

        {loading && <div className="status">Loading…</div>}
        {error && <div className="status error">{error}</div>}
        {!loading && !error && debouncedQuery && results.length === 0 && (
          <div className="status">No results found for “{debouncedQuery}”</div>
        )}

        <section className="results-grid">
          {results.map((doc) => (
            <BookCard key={`${doc.key}-${doc.cover_i || "nc"}`} doc={doc} />
          ))}
        </section>

        {numFound > 0 && (
          <div className="pager">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn"
            >
              ← Prev
            </button>

            <div className="pager-info">
              Page {page} of {totalPages} · {numFound.toLocaleString()} results
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn"
            >
              Next →
            </button>
          </div>
        )}

        <footer className="footer">
          <small>
            Powered by Open Library. Covers served from covers.openlibrary.org.
          </small>
        </footer>
      </main>
    </div>
  );
}
