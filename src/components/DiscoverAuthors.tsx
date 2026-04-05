import { Link } from 'react-router-dom';

const DiscoverAuthors: React.FC = () => {
  const authors = [
    { name: "Sudha Murty", image: "/temp_assets/jk.png" },
    { name: "Chetan Bhagat", image: "/temp_assets/jk.png" },
    { name: "Ankur Warikoo", image: "/temp_assets/jk.png" },
    { name: "Amish Tripathi", image: "/temp_assets/jk.png" },
    { name: "Ruskin Bond", image: "/temp_assets/jk.png" },
    { name: "J. K. Rowling", image: "/temp_assets/jk.png" }
  ];

  return (
    <div id="shopify-section-template--21194970333401__image_box_grid_ALmxwF" className="shopify-section image-box-grid-container">
      <section className="image-box-grid" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="container">
          <h2 className="sec-title">Discover Great Authors</h2>
          <p className="sec-desc">From timeless classics to modern favourites.</p>
          <div className="image-box-grid-items" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
            {authors.map((author) => (
              <div key={author.name} className="image-box-grid-item">
                <Link to={`/author/${encodeURIComponent(author.name)}`}>
                  <img
                    width="154"
                    height="154"
                    src={author.image}
                    alt={author.name}
                    loading="lazy"
                  />
                  <p>{author.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverAuthors;
