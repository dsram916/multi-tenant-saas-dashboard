import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import EditBookModal from '../../components/EditBookModal';

// --- AddBookForm (Corrected) ---
const AddBookForm = ({ onBookAdded }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('image', image); 
    let imageUrl = '';
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      imageUrl = data.imageUrl;
    } catch (err) {
      console.error('Image upload failed', err);
      setUploading(false);
      return;
    }
    try {
      const res = await axios.post('/api/books', { 
        title, 
        author, 
        price, 
        coverImageUrl: imageUrl
      });
      onBookAdded(res.data);
      setTitle('');
      setAuthor('');
      setPrice('');
      setImage(null);
      document.querySelector('input[type="file"]').value = '';
    } catch (err) {
      console.error('Failed to create book', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    // FIX: Light background and border colors for the form card
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 space-y-4 shadow-md">
      <h3 className="text-xl font-semibold text-gray-900">Add a New Book</h3>
      {/* TITLE INPUT: Correctly uses setTitle */}
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Book Title" 
        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" 
        required 
      />
      {/* AUTHOR INPUT: NOW CORRECTLY USES setAuthor */}
      <input 
        type="text" 
        value={author} 
        onChange={(e) => setAuthor(e.target.value)} 
        placeholder="Author" 
        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" 
        required 
      />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (₹)" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
        <input 
          type="file" 
          onChange={(e) => setImage(e.target.files[0])} 
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
          required
        />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={uploading}>
        {uploading ? 'Uploading Image...' : 'Add Book'}
      </button>
    </form>
  );
};

// --- BookList (No Change) ---
const BookList = ({ books, onBookDeleted, onEditBook, loading }) => {

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`/api/books/${bookId}`);
        onBookDeleted(bookId);
      } catch (err) {
        console.error('Failed to delete book', err);
      }
    }
  };

  return (
    // FIX: Light background and border colors for the list card
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Your Inventory</h3>
      <div className="space-y-3">
        {books.map((book) => (
          // FIX: Light item background
          <div key={book._id} className="bg-gray-50 p-4 rounded-lg flex items-center border border-gray-200">
            <img 
              src={`http://localhost:5001${book.coverImageUrl}`} 
              alt={book.title}
              className="w-16 h-20 object-contain rounded-md mr-4 bg-white"
            />
            <div className="flex-grow">
              <p className="font-semibold text-gray-900">{book.title}</p>
              <p className="text-sm text-gray-500">by {book.author}</p>
            </div>
            <p className="font-semibold mr-4 text-gray-900">₹{book.price}</p>
            <button onClick={() => onEditBook(book)} className="text-sm font-medium text-primary hover:underline mr-4">
              Edit
            </button>
            <button onClick={() => handleDelete(book._id)} className="text-sm font-medium text-red-500 hover:underline">
              Delete
            </button>
          </div>
        ))}
        {books.length === 0 && !loading && <p className="text-gray-500">You haven't added any books yet.</p>}
      </div>
    </div>
  );
};


// --- Main Page (Container Fix) ---
export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1); 

  const fetchBooks = async (pageNumber) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/books?page=${pageNumber}`);
      setBooks(data.books);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, []);

  const handleBookAdded = () => {
    fetchBooks(1);
  };

  const handleBookDeleted = () => {
    fetchBooks(page); 
  };

  const handleBookUpdated = (updatedBook) => {
    setBooks(books.map(book => 
      book._id === updatedBook._id ? updatedBook : book
    ));
  };

  return (
    // FIX: Main container ensures a light background for content area
    <div className="p-8 bg-gray-50 min-h-full"> 
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Books</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddBookForm onBookAdded={handleBookAdded} />
        </div>
        <div className="lg:col-span-2">
          <BookList 
            books={books} 
            onBookDeleted={handleBookDeleted} 
            onEditBook={setEditingBook} 
            loading={loading}
          />
          {/* Pagination buttons */}
          {!loading && pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={() => fetchBooks(page - 1)} 
                disabled={page === 1}
                className="btn-primary disabled:bg-gray-400"
              >
                Previous
              </button>
              <span className="text-gray-500">
                Page {page} of {pages}
              </span>
              <button 
                onClick={() => fetchBooks(page + 1)} 
                disabled={page === pages}
                className="btn-primary disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {editingBook && (
        <EditBookModal 
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onBookUpdated={handleBookUpdated}
        />
      )}
    </div>
  );
}