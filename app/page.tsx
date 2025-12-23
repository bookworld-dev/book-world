"use client"
import { useEffect } from "react";
import { getRandomBookByLocation } from "./lib/book.api";

export default function BookWorld() {
  const getBookData = async () => {
    const data = await getRandomBookByLocation('NL');
    console.log(data);
  }

  useEffect(() => {
    getBookData()
  }, [])

  return (
    <p>book world</p>
  );
}
