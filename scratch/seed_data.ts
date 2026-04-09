/* 
  Seeding script for Authors and Books
  Run with: export PATH="/opt/homebrew/bin:$PATH" && npx tsx scratch/seed_data.ts
*/
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOlWM5pyxw-F1l7HXqu-snUfKzJUvpOh4",
  authDomain: "aghorin-2537f.firebaseapp.com",
  projectId: "aghorin-2537f",
  storageBucket: "aghorin-2537f.firebasestorage.app",
  messagingSenderId: "1040591387261",
  appId: "1:1040591387261:web:f0864e3ba696a4ab9fcf14",
  measurementId: "G-0QN3X8GME8"
};

const authors = [
  { name: "Sudha Murty", image: "/temp_assets/jk.png", bio: "Indian educator, author and philanthropist who is the chairperson of the Infosys Foundation.", booksCount: 12 },
  { name: "Chetan Bhagat", image: "/temp_assets/jk.png", bio: "Indian author and columnist, known for his dramedy novels about young urban middle-class Indians.", booksCount: 8 },
  { name: "Ankur Warikoo", image: "/temp_assets/jk.png", bio: "Indian entrepreneur, motivational speaker, and author of several self-help bestsellers.", booksCount: 3 },
  { name: "Amish Tripathi", image: "/temp_assets/jk.png", bio: "Indian author known for his book series Shiva Trilogy and Ram Chandra Series.", booksCount: 7 },
  { name: "Ruskin Bond", image: "/temp_assets/jk.png", bio: "Indian author of British descent, known for his contribution to Indian children's literature.", booksCount: 15 },
  { name: "J. K. Rowling", image: "/temp_assets/jk.png", bio: "British author, best known for writing the Harry Potter fantasy series.", booksCount: 10 }
];

const books = [
  { title: "Project Hail Mary", author: "Sudha Murty", price: 509, originalPrice: 599, image: "/temp_assets/81II81yH0iL._SL1500.jpg", discount: "90", summary: "...", pages: 496, dimensions: "12.8 x 3.2 x 19.7 cm", status: 'Available', isBestSeller: true },
  { title: "The Stationery Shop Of Tehran", author: "Sudha Murty", price: 382, originalPrice: 450, image: "/temp_assets/monthly_book1-35.jpg", discount: "68", status: 'Available', isBestSeller: true },
  { title: "The Indian Stock Market Simplified", author: "Chetan Bhagat", price: 339, originalPrice: 399, image: "/temp_assets/the-indian-stock-market-simplified-bk0517645-44848152740057.jpg", discount: "60", status: 'Available', isBestSeller: true },
  { title: "Atomic Habits", author: "Ankur Warikoo", price: 764, originalPrice: 899, image: "/temp_assets/Atomic_Habits_1_1.webp", discount: "135", status: 'Available', isBestSeller: true },
  { title: "King Of Gluttony", author: "Amish Tripathi", price: 539, originalPrice: 599, image: "/temp_assets/81tojBl5WML._SL1500.jpg", discount: "60", releaseDate: "2026-04-28", status: 'Available' },
  { title: "Release Me", author: "Ruskin Bond", price: 449, originalPrice: 499, image: "/temp_assets/81hFvO35kxL._SL1500_a669c084-3cda-4aae-ae01-a60afb30de72.jpg", discount: "50", releaseDate: "2026-04-07", status: 'Available' },
  { title: "Before I Knew I Loved You", author: "J. K. Rowling", price: 495, originalPrice: 550, image: "/temp_assets/81AWcSLd_dL._SL1500.jpg", discount: "55", releaseDate: "2026-05-21", status: 'Available' },
  { title: "Guilt", author: "Sudha Murty", price: 629, originalPrice: 699, image: "/temp_assets/812xE-_QztL._SY425.jpg", discount: "70", releaseDate: "2026-04-09", status: 'Available' },
  { title: "Wise And Otherwise", author: "Sudha Murty", price: 250, originalPrice: 299, image: "/temp_assets/81II81yH0iL._SL1500.jpg", discount: "49", status: 'Available' },
  { title: "The Old Man And His God", author: "Sudha Murty", price: 220, originalPrice: 250, image: "/temp_assets/monthly_book1-35.jpg", discount: "30", status: 'Available' }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Starting seeding...");
  
  // Seed Authors
  for (const author of authors) {
    const docRef = await addDoc(collection(db, "authors"), {
      ...author,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`Added author: ${author.name} (${docRef.id})`);
  }

  // Seed Books
  for (const book of books) {
    const docRef = await addDoc(collection(db, "books"), {
      ...book,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`Added book: ${book.title} (${docRef.id})`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
