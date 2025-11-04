import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import data
import { users } from './data/users.js';
import { books } from './data/books.js';

// Import models
import User from './models/User.js';
import Tenant from './models/Tenant.js';
import Book from './models/Book.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB(); // Connect to the DB

    // --- 1. Clear all existing data ---
    await User.deleteMany();
    await Tenant.deleteMany();
    await Book.deleteMany();

    console.log('Data Destroyed!');

    // --- 2. Create Tenants ---
    const tenantA = new Tenant({
      storeName: "Alice's Awesome Books",
      theme: { primaryColor: '#3b82f6' }, // Blue theme
    });
    
    const tenantB = new Tenant({
      storeName: "Bob's Cozy Corner",
      theme: { primaryColor: '#10b981' }, // Green theme
    });
    
    await tenantA.save();
    await tenantB.save();

    // --- 3. Create Users and assign Tenants ---
    const [adminAlice, adminBob, customerCharlie] = users;

    adminAlice.tenantId = tenantA._id;
    adminBob.tenantId = tenantB._id;
    customerCharlie.tenantId = tenantA._id; // Charlie is a customer of Tenant A's store

    await User.insertMany([adminAlice, adminBob, customerCharlie]);

    // --- 4. Create Books and assign Tenants ---
    const [gatsby, nineteen84, dune, hobbit, mockingbird] = books;

    // Give 3 books to Tenant A
    gatsby.tenantId = tenantA._id;
    nineteen84.tenantId = tenantA._id;
    dune.tenantId = tenantA._id;

    // Give 2 books to Tenant B
    hobbit.tenantId = tenantB._id;
    mockingbird.tenantId = tenantB._id;

    await Book.insertMany([gatsby, nineteen84, dune, hobbit, mockingbird]);

    console.log('--- Seed data imported! ---');
    console.log('Seller 1 (Tenant A): alice@seller.com');
    console.log('Seller 2 (Tenant B): bob@seller.com');
    console.log('Buyer 1 (Tenant A): charlie@buyer.com');
    console.log('Password for all: 123456');
    console.log('---------------------------');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Tenant.deleteMany();
    await Book.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// This allows us to run 'node seeder.js -d'
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}