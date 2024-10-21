import { useState, useEffect, useCallback } from "react";

function useBookmarks() {
  const [bookmarkedPages, setBookmarkedPages] = useState([]);

  useEffect(() => {
    const storedBookmarks =
      JSON.parse(localStorage.getItem("bookmarkedPages")) || [];
    setBookmarkedPages(storedBookmarks);
  }, []);

  const addBookmark = useCallback(
    (page) => {
      if (!bookmarkedPages.includes(page)) {
        const updatedBookmarks = [...bookmarkedPages, page];
        setBookmarkedPages(updatedBookmarks);
        localStorage.setItem(
          "bookmarkedPages",
          JSON.stringify(updatedBookmarks)
        );
      }
    },
    [bookmarkedPages]
  );

  const removeBookmark = useCallback(
    (page) => {
      const updatedBookmarks = bookmarkedPages.filter((p) => p !== page);
      setBookmarkedPages(updatedBookmarks);
      localStorage.setItem("bookmarkedPages", JSON.stringify(updatedBookmarks));
    },
    [bookmarkedPages]
  );

  return { bookmarkedPages, addBookmark, removeBookmark };
}

export default useBookmarks;
