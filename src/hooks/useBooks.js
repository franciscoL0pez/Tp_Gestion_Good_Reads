import { useEffect, useState } from "react";
import { getBooks } from "@/services/books";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) {
      return setMounted(true);
    }

    getBooks().then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, [mounted]);

  const addBook = (book) => {
    setBooks([book, ...books]);
  };

  return { books, loading, addBook };
};
