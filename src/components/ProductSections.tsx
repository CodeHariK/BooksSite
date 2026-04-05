import { Link } from 'react-router-dom';
import { allBooks } from '../data/books';

export interface ProductProps {
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: string;
  releaseDate?: string;
  buttonText?: string;
}

export const ProductCard: React.FC<ProductProps> = ({ title, author, price, originalPrice, image, discount, releaseDate, buttonText = "Add to Bag" }) => {
  return (
    <div className="product-item">
      <div className="product-item-container">
        <Link to={`/book/${encodeURIComponent(title)}`}>
          <div className="product-item-img-container cust-produt">
            <img
              className="product-card-first-img"
              loading="lazy"
              width="375"
              height="375"
              src={image}
              alt={title}
            />
          </div>
        </Link>
        {releaseDate && (
          <div className="release-timer">
            <img className="timer-icon" width="20" height="20" src="/temp_assets/icon.svg" alt="Timer Icon" loading="lazy" />
            Releasing In <span className="countdown">22d : 6h : 19m : 11s</span>
          </div>
        )}
        <div className="product-item-content-container">
          <div className="product-item-content">
            <p className="product-item-title">{title}</p>
            <div className="author-min-space">
              <p className="product-item-author">
                <Link to={`/author/${encodeURIComponent(author)}`} style={{ color: 'inherit', opacity: 1 }}>{author}</Link>
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
          <div className="cart-icon addToCart">
            <img
              src="/temp_assets/shopping-bag(1).svg"
              height="58"
              width="58"
              alt="Add to Bag Icon"
              loading="lazy"
            />
            {buttonText}
          </div>
        </div>
      </div>
    </div>
  );
};

export const BestSellers: React.FC = () => {
  const products = allBooks.slice(0, 4);

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
            <div className="products-grid">
              <img className="collection-creative-img" loading="lazy" src="/temp_assets/illustrations.svg" width="936" height="837" alt="Collection Creative Image" />
              <div className="collection-products-slider" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {products.map((p) => <ProductCard key={p.title} {...p} />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const ComingSoon: React.FC = () => {
  const products = allBooks.slice(4, 8);

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
            <div className="products-grid">
              <img className="collection-creative-img" loading="lazy" src="/temp_assets/Layer_1_1.svg" width="936" height="837" alt="Collection Creative Image" />
              <div className="collection-products-slider" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {products.map((p) => <ProductCard key={p.title} {...p} />)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
