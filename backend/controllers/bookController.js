import Book from '../models/Book.js';

// --- THIS FUNCTION IS UPDATED ---
// @desc    Get all books for the logged-in tenant (with pagination)
// @route   GET /api/books
export const getTenantBooks = async (req, res) => {
  try {
    const pageSize = 5; // We'll show 5 books per page
    const page = Number(req.query.page) || 1; // Get page number from ?page=1

    // 1. Get the total count of books for this tenant
    const count = await Book.countDocuments({ tenantId: req.user.tenantId });

    // 2. Fetch only the books for the current page
    // The bad  line was here and has been removed.
    const books = await Book.find({ tenantId: req.user.tenantId })
      .limit(pageSize) // Get only 5
      .skip(pageSize * (page - 1)); // Skip books from previous pages

    // 3. Return the books, the current page, and the total number of pages
    res.status(200).json({
      books,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// --- END OF UPDATE ---


// --- (This function is the same) ---
export const createTenantBook = async (req, res) => {
  try {
    const { title, author, price, coverImageUrl } = req.body;
    const book = new Book({
      title,
      author,
      price,
      coverImageUrl: coverImageUrl || '/assets/book-cover.jpg',
      tenantId: req.user.tenantId, // <-- PS: Data Isolation
    });
    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- (This function is the same) ---
export const updateTenantBook = async (req, res) => {
  try {
    const { title, author, price } = req.body;
    const book = await Book.findById(req.params.id);

    if (book.tenantId.toString() !== req.user.tenantId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    book.title = title || book.title;
    book.author = author || book.author;
    book.price = price || book.price;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(404).json({ message: 'Book not found' });
  }
};

// --- (This function is the same) ---
export const deleteTenantBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book.tenantId.toString() !== req.user.tenantId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(404).json({ message: 'Book not found' });
  }
};