import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { allBooks } from '../data/books';

const TARGET_UID = "YwrdijSZ85TiE4yCT75QHrHe3842";

const MigrationPage: React.FC = () => {
    const [status, setStatus] = useState<string[]>([]);
    const [isMigrating, setIsMigrating] = useState(false);

    const log = (msg: string) => {
        setStatus(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    const startNormalization = async () => {
        if (isMigrating) return;
        setIsMigrating(true);
        log("Starting case normalization (lowercase)...");

        try {
            // 1. Normalize Books
            log("Normalizing Books...");
            const booksSnapshot = await getDocs(collection(db, "books"));
            for (const bookDoc of booksSnapshot.docs) {
                const data = bookDoc.data();
                const updates: any = {};
                
                if (data.title && data.title !== data.title.toLowerCase()) {
                    updates.title = data.title.toLowerCase();
                }
                if (data.author && data.author !== data.author.toLowerCase()) {
                    updates.author = data.author.toLowerCase();
                }

                if (Object.keys(updates).length > 0) {
                    await updateDoc(doc(db, "books", bookDoc.id), updates);
                    log(`Updated Book: ${data.title} -> ${updates.title || data.title}`);
                }
            }

            // 2. Normalize Users
            log("Normalizing Users (Authors)...");
            const usersSnapshot = await getDocs(collection(db, "users"));
            for (const userDoc of usersSnapshot.docs) {
                const data = userDoc.data();
                if (data.displayName && data.displayName !== data.displayName.toLowerCase()) {
                    const lowName = data.displayName.toLowerCase();
                    await updateDoc(doc(db, "users", userDoc.id), {
                        displayName: lowName
                    });
                    log(`Updated User: ${data.displayName} -> ${lowName}`);
                }
            }

            log("Normalization completed successfully!");
        } catch (err: any) {
            log(`ERROR during normalization: ${err.message}`);
        } finally {
            setIsMigrating(false);
        }
    };

    const startMigration = async () => {
        if (isMigrating) return;
        setIsMigrating(true);
        log("Starting migration...");

        try {
            for (const book of allBooks) {
                log(`Processing: ${book.title}...`);

                const q = query(collection(db, "books"), where("title", "==", book.title.toLowerCase()));
                const existing = await getDocs(q);
                if (!existing.empty) {
                    log(`Skipping ${book.title}: Already exists in Firestore.`);
                    continue;
                }

                try {
                    const response = await fetch(book.image);
                    if (!response.ok) throw new Error(`Failed to fetch ${book.image}`);
                    const blob = await response.blob();

                    const filename = book.image.split('/').pop() || `${Date.now()}.jpg`;
                    const storageRef = ref(storage, `book_covers/${filename}`);
                    log(`Uploading image to Storage: book_covers/${filename}...`);
                    
                    const uploadResult = await uploadBytes(storageRef, blob);
                    const downloadUrl = await getDownloadURL(uploadResult.ref);
                    log(`Image uploaded. URL: ${downloadUrl}`);

                    const bookData = {
                        ...book,
                        title: book.title.toLowerCase(),
                        author: book.author.toLowerCase(),
                        authorId: TARGET_UID,
                        image: downloadUrl,
                        isPublished: true,
                        createdAt: serverTimestamp(),
                    };

                    await addDoc(collection(db, "books"), bookData);
                    log(`SUCCESS: ${book.title} added to Firestore.`);
                } catch (err: any) {
                    log(`ERROR processing ${book.title}: ${err.message}`);
                }
            }
            log("Migration completed!");
        } catch (err: any) {
            log(`FATAL ERROR: ${err.message}`);
        } finally {
            setIsMigrating(false);
        }
    };

    const publishAllExisting = async () => {
        if (isMigrating) return;
        setIsMigrating(true);
        log("Ensuring all existing books are set to Published = true...");
        try {
            const booksSnapshot = await getDocs(collection(db, "books"));
            for (const bookDoc of booksSnapshot.docs) {
                const data = bookDoc.data();
                if (data.isPublished === undefined || data.isPublished === false) {
                    await updateDoc(doc(db, "books", bookDoc.id), {
                        isPublished: true
                    });
                    log(`Published: ${data.title}`);
                }
            }
            log("All existing books have been published!");
        } catch (err: any) {
            log(`ERROR: ${err.message}`);
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <div className="container" style={{ padding: '100px 0', minHeight: '100vh' }}>
            <h2>Data Management Utility</h2>
            <p>Seed data or normalize existing records for case-insensitive search.</p>
            
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <button 
                    onClick={startMigration} 
                    disabled={isMigrating}
                    className="explore-cta"
                    style={{ cursor: isMigrating ? 'not-allowed' : 'pointer' }}
                >
                    {isMigrating ? "Working..." : "Seed Initial Data"}
                </button>

                <button 
                    onClick={startNormalization} 
                    disabled={isMigrating}
                    className="explore-cta"
                    style={{ cursor: isMigrating ? 'not-allowed' : 'pointer', backgroundColor: '#e6fffa', borderColor: '#81e6d9' }}
                >
                    {isMigrating ? "Working..." : "Normalize Case"}
                </button>

                <button 
                    onClick={publishAllExisting} 
                    disabled={isMigrating}
                    className="explore-cta"
                    style={{ cursor: isMigrating ? 'not-allowed' : 'pointer', backgroundColor: '#fff5f5', borderColor: '#feb2b2' }}
                >
                    {isMigrating ? "Working..." : "Publish All Existing Books"}
                </button>
            </div>

            <div style={{ 
                backgroundColor: '#1e1e1e', 
                color: '#00ff00', 
                padding: '20px', 
                borderRadius: '8px', 
                maxHeight: '400px', 
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px'
            }}>
                {status.length === 0 ? "Logs will appear here..." : status.map((s, i) => <div key={i}>{s}</div>)}
            </div>
        </div>
    );
};

export default MigrationPage;
