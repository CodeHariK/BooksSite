import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface ProductProps {
  id: string;
  title: string;
  author: string;
  authorId: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: string;
  releaseDate?: string;
  buttonText?: string;
  isBestSeller?: boolean;
  isComingSoon?: boolean;
}

export const ProductCard: React.FC<ProductProps> = ({ id, title, author, authorId, price, originalPrice, image, discount, isBestSeller, isComingSoon }) => {
  return (
    <div className="product-item">
      <div className="product-item-container">
        <Link to={`/book/${id}`}>
          <div className="product-item-img-container cust-produt">
            <img
              className="product-card-first-img"
              loading="lazy"
              width="375"
              height="375"
              src={image}
              alt={title}
            />
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '5px', zIndex: 1 }}>
              {isBestSeller && (
                <div style={{ backgroundColor: '#ffa100', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                  BEST SELLER
                </div>
              )}
              {isComingSoon && (
                <div style={{ backgroundColor: '#2d2d2d', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                  COMING SOON
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="product-item-content-container">
          <div className="product-item-content">
            <p className="product-item-title">{title}</p>
            <div className="author-min-space">
              <p className="product-item-author">
                <Link to={`/author/${authorId}`} style={{ color: 'inherit', opacity: 1 }}>{author}</Link>
              </p>
            </div>
            <div className="product-item-price-wrapper">
              <div className="product-item-price-container">
                {originalPrice && (
                  <p className="product-item-compare-price">
                    <span>₹</span> {originalPrice}
                  </p>
                )}
                <p className="product-item-original-price">
                  <span>₹</span> {price}
                </p>
                {discount && (
                  <div className="min-space">
                    <div className="pdp-discount-tag-container">
                      <div className="discount-tag">
                        <p className="discount-percent">
                          <span>₹ </span>{discount} <span>Off</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="product-item-cta-container" style={{ marginTop: '15px' }}>
            <Link 
              to={`/buy?bookId=${id}`} 
              className="explore-cta" 
              style={{ width: '100%', justifyContent: 'center', padding: '10px 15px', fontSize: '14px' }}
            >
              <span>Buy</span>
              <img width="14" height="14" src="/temp_assets/arrow-up-right.svg" alt="buy" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const q = query(
          collection(db, 'books'), 
          where('isPublished', '==', true),
          where('isBestSeller', '==', true), 
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductProps));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching Best Sellers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading) return null;

  return (
    <div className="shopify-section collection-product-listing-sec">
      <section className="collection-product-listing-container best-sellers" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="collection-product-listing">
          <div className="container">
            <div className="collection-product-listing-title">
              <div className="collection-product-listing-title-container">
                <h2 className="sec-title">Best Sellers</h2>
                <p className="sec-desc">Read What Millions Have Loved!</p>
              </div>
              <div className="collection-arrows-cta">
                <a className="explore-cta d-767-none" href="#">
                  <span>Show All</span>
                  <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow-up-right" />
                </a>
              </div>
            </div>
            <div className="book-grid-system">
                {products.map((p) => <ProductCard key={p.title} {...p} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ComingSoon: React.FC = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComingSoon = async () => {
      try {
        const q = query(
          collection(db, 'books'), 
          where('isPublished', '==', true),
          where('isComingSoon', '==', true), 
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductProps));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching Coming Soon:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComingSoon();
  }, []);

  if (loading) return null;

  return (
    <div className="shopify-section collection-product-listing-sec">
      <section className="collection-product-listing-container coming-soon">
        <div className="collection-product-listing">
          <div className="container">
            <div className="collection-product-listing-title">
              <div className="collection-product-listing-title-container">
                <h2 className="sec-title">Coming Soon</h2>
                <p className="sec-desc">Countdown to your next obsession.</p>
              </div>
              <div className="collection-arrows-cta">
                <a className="explore-cta d-767-none" href="#">
                  <span>Show All</span>
                  <img width="16" height="16" src="/temp_assets/arrow-up-right.svg" alt="arrow-up-right" />
                </a>
              </div>
            </div>
            <div className="book-grid-system">
                {products.map((p) => <ProductCard key={p.title} {...p} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
