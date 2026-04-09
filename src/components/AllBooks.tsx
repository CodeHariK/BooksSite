import React, { useEffect, useState } from 'react';
import { collection, getDocs, limit, query, orderBy, startAfter, where } from 'firebase/firestore';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { ProductCard, type ProductProps } from './ProductSections';
import SearchBar from './SearchBar';

const BATCH_SIZE = 8;

const AllBooks: React.FC = () => {
    const [books, setBooks] = useState<ProductProps[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBooks = async (isFirstBatch = false, search = '') => {
        setLoading(true);
        try {
            let q;
            if (search) {
                const searchLower = search.toLowerCase();
                // Firestore "Starts With" partial search
                q = query(
                    collection(db, 'books'),
                    where('isPublished', '==', true),
                    where('title', '>=', searchLower),
                    where('title', '<=', searchLower + '\uf8ff'),
                    orderBy('title'),
                    limit(BATCH_SIZE)
                );
            } else {
                q = query(
                    collection(db, 'books'),
                    where('isPublished', '==', true),
                    orderBy('createdAt', 'desc'),
                    limit(BATCH_SIZE)
                );
            }

            let paginatedQuery = q;
            if (!isFirstBatch && lastDoc && !search) {
                // Pagination on filtered lists is complex in Firestore without Composite Indexes
                paginatedQuery = query(q, startAfter(lastDoc));
            }

            const querySnapshot = await getDocs(paginatedQuery);
            const newBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductProps));

            if (isFirstBatch) {
                setBooks(newBooks);
            } else {
                setBooks(prev => [...prev, ...newBooks]);
            }

            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
            setHasMore(querySnapshot.docs.length === BATCH_SIZE);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(true, searchTerm);
    }, [searchTerm]);

    return (
        <div className="shopify-section collection-product-listing-sec" style={{ padding: '0px 0' }}>
            <div className="container">
                {/* Search Bar */}
                <div className="search-section" style={{ marginBottom: '40px' }}>
                    <SearchBar
                        mode="books"
                        placeholder="Search for books by title..."
                        onSearch={(term) => setSearchTerm(term)}
                    />
                </div>

                <div className="collection-product-listing-title" style={{ marginBottom: '40px' }}>
                    <div className="collection-product-listing-title-container">
                        <h2 className="sec-title">{searchTerm ? `Search Results for "${searchTerm}"` : "All Our Books"}</h2>
                        <p className="sec-desc">Explore our full collection of masterpieces.</p>
                    </div>
                </div>

                <div className="products-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '30px'
                }}>
                    {books.map((book, idx) => (
                        <ProductCard key={`${book.title}-${idx}`} {...book} />
                    ))}
                </div>

                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading more books...</p>
                    </div>
                )}

                {!loading && books.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <h3>No books found.</h3>
                        <p>Try searching for something else!</p>
                    </div>
                )}

                {!loading && hasMore && !searchTerm && (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <button
                            onClick={() => fetchBooks(false)}
                            className="explore-cta"
                            style={{ margin: '0 auto', cursor: 'pointer' }}
                        >
                            <span>Load More Books</span>
                            <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBooks;


