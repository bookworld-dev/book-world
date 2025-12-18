"use client"
import { useEffect } from "react";
import { getRandomBook } from "./lib/book.api";

export default function BookWorld() {
  const getBookData = async () => {
    const data = await getRandomBook('NL');
    console.log(data);
  }

  useEffect(() => {
    getBookData()
  }, [])

  return (
    <p>book world</p>
  );
}
