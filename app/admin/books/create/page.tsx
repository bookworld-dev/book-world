"use client";
import { createBook } from "@/app/lib/api/book.api";
import { redirect } from "next/navigation";
import { useState } from "react";

type NewBook = {
  title: string;
  author: string;
  cover?: File;
};

const CreateBookForm = () => {
  const [newBook, setNewBook] = useState<NewBook>({
    title: '',
    author: '',
  });
  const [saving, setSaving] = useState(false);

  const previewUrl: string|undefined = newBook.cover ?
    URL.createObjectURL(newBook.cover) : undefined;

  const handleChange = (field: keyof NewBook) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewBook(b => ({
        ...b,
        [field]: e.target.value,
      }));
    };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewBook(b => ({
      ...b,
      cover: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { cover } = newBook;
    if (!cover) return;

    setSaving(true);
    createBook({ ...newBook, cover }).then(book => {
      redirect(`/admin/books/${book.id}`);
    }).finally(() => setSaving(false));
  }

  return (
    <div className="admin-section">
      <h1>New book</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label>Title</label>
          <input
            className="admin-input"
            type="text"
            placeholder="e.g. Middlemarch"
            value={newBook.title}
            onChange={handleChange('title')}
            aria-label="book-title"
            required
          />
        </div>

        <div className="admin-field">
          <label>Author</label>
          <input
            className="admin-input"
            type="text"
            placeholder="e.g. George Eliot"
            value={newBook.author}
            onChange={handleChange('author')}
            aria-label="book-author"
            required
          />
        </div>

        <div className="admin-field">
          <label>Cover image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleCoverUpload}
            aria-label="book-cover"
          />
          {previewUrl &&
            <img
              className="admin-cover-preview"
              src={previewUrl}
              alt="Cover preview"
              onLoad={() => URL.revokeObjectURL(previewUrl)}
            />
          }
        </div>

        <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>Save</button>
      </form>
    </div>
  );
};

export default CreateBookForm;
