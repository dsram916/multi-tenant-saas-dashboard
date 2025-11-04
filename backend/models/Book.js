import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  // --- PS: Data Isolation ---
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  coverImageUrl: { type: String },
}, { timestamps: true });

// --- PS: Compound Index ---
bookSchema.index({ tenantId: 1, createdAt: -1 });

const Book = mongoose.model('Book', bookSchema);
export default Book;