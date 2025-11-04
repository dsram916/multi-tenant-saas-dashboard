import Tenant from '../models/Tenant.js';
import Book from '../models/Book.js';

// @desc    Get a tenant's public storefont data (theme, books)
// @route   GET /api/public/store/:slug
// @access  Public
export const getStorefrontBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // 1. Find the tenant by their URL slug
    const tenant = await Tenant.findOne({ slug }).select('storeName theme');
    
    if (!tenant) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // 2. Find all books belonging to that tenant
    const books = await Book.find({ tenantId: tenant._id });

    // 3. Return the public data
    res.status(200).json({ tenant, books });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Get all public tenants (stores)
// @route   GET /api/public/stores
// @access  Public
export const getAllStores = async (req, res) => {
  try {
    // We only select the fields the public needs to see
    const tenants = await Tenant.find({}).select('storeName slug theme.logoUrl');
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};