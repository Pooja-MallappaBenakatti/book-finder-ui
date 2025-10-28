import React from "react";

function coverUrl(cover_i) {
  return cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : null;
}

export default function BookCard({ doc }) {
  const title = doc.title || "Untitled";
  const authors = doc.author_name ? doc.author_name.join(", ") : "Unknown author";
  const year = doc.first_publish_year || doc.publish_year?.[0] || "—";
  const cover = coverUrl(doc.cover_i);

  return (
    <article className="bookcard">
      <div className="coverwrap">
        {cover ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img className="cover" src={cover} alt={`Cover of ${title}`} loading="lazy" />
        ) : (
          <div className="no-cover">No cover</div>
        )}
      </div>

      <div className="book-info">
        <h3 className="book-title" title={title}>{title}</h3>
        <div className="book-meta">
          <span className="author">{authors}</span>
          <span className="year">{year}</span>
        </div>

        {doc.subject && doc.subject.length > 0 && (
          <div className="tags">
            {doc.subject.slice(0, 5).map((s) => (
              <span key={s} className="tag">{s}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
