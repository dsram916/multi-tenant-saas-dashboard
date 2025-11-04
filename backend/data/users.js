import bcrypt from 'bcryptjs';

// Pre-hashed password for "123456"
const password = bcrypt.hashSync('123456', 10);

// Note: We can't add tenantId here, as we don't know it yet.
// The seeder script will handle that.
export const users = [
  {
    name: 'Admin Alice (Seller)',
    email: 'alice@seller.com',
    password: password,
    role: 'admin',
  },
  {
    name: 'Admin Bob (Seller)',
    email: 'bob@seller.com',
    password: password,
    role: 'admin',
  },
  {
    name: 'Charlie (Customer)',
    email: 'charlie@buyer.com',
    password: password,
    role: 'customer',
  },
];