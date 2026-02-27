"use client";
import { createBook } from "@/app/lib/book.api";
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
    
    if (!newBook.cover) return;
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('cover', newBook.cover);
    
    createBook(formData).then(book => {
      redirect(`/admin/books/${book.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={newBook.title}
        onChange={handleChange('title')}
        aria-label="book-title"
        required
      />

      <input
        type="text"
        placeholder="Author"
        value={newBook.author}
        onChange={handleChange('author')}
        aria-label="book-author"
        required
      />

      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleCoverUpload}
        aria-label="book-cover"
      />
      
      { previewUrl && 
        <img
          src={previewUrl}
          alt="Cover preview"
          style={{ width: 200 }}
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      }
      <button type="submit">Save</button>
    </form>
  );
};

export default CreateBookForm;