import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
  primaryColor: { type: String, default: '#8B5CF6' },
  logoUrl: { type: String, default: '/assets/default-logo.svg' },
});

// A helper function to create a URL-friendly slug
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const settingsSchema = new mongoose.Schema({
  enable3dModel: { type: Boolean, default: true },
  enableReviews: { type: Boolean, default: false },
});

const tenantSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    theme: {
      type: themeSchema,
      default: () => ({}),
    },
    settings: {
      type: settingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// --- THIS IS THE FIX ---
// We check if the document is new OR if the storeName was modified
tenantSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('storeName')) {
    this.slug = slugify(this.storeName);
  }
  next();
});
// --- END OF FIX ---

const Tenant = mongoose.model('Tenant', tenantSchema);
export default Tenant;