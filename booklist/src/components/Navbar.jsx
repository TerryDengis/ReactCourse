import React, { useContext } from 'react';
import { BookContext } from '../contexts/BookContext';

export const Navbar = () => {
  const { books } = useContext(BookContext);

  return (
    <div className="navbar">
      <h1> Terry's Reading List</h1>
      <p>Currently you have {books.length} books to get through ...</p>
    </div>
  );
};
