import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const categories = ["All", "Vegetables", "Fruits", "Dairy", "Grains", "Herbs"];

const emptyForm = {
  name: "",
  category: "Vegetables",
  price: "",
  unit: "kg",
  quantity: "",
  location: "",
  farmer: "",
  imageUrl: "",
  description: "",
};

const fallbackImages = {
  Vegetables:
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85",
  Fruits:
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=85",
  Dairy:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85",
  Grains:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=85",
  Herbs:
    "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=900&q=85",
};

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ search, category });
        const response = await fetch(`${API_URL}/products?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load products. Please try again.");
        setProducts(await response.json());
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, category]);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitProduct(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Could not publish this listing.");
      setForm(emptyForm);
      setShowForm(false);
      setSearch("");
      setCategory("All");
      setProducts((current) => [result, ...current]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Field and Fork home">
          <span className="brand-mark">f.</span>
          <span>field<span className="brand-light">&amp;fork</span></span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <a className="nav-active" href="#market">The market</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <button className="sell-button" onClick={() => setShowForm(true)}>
          <span aria-hidden="true">＋</span> Sell your harvest
        </button>
      </header>

      <main>
        <section className="hero" id="how-it-works">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> GOOD FOOD, GROWN CLOSE</p>
            <h1>From our fields<br />to your <em>table.</em></h1>
            <p className="hero-description">
              Discover the best of your neighborhood harvest. Fresh, seasonal, and always grown with care.
            </p>
            <a className="hero-link" href="#market">Explore the market <span aria-hidden="true">↘</span></a>
            <div className="hero-note">
              <span className="note-icon" aria-hidden="true">✳</span>
              <span>Grown with care.<br /><strong>Shared with you.</strong></span>
            </div>
          </div>
          <div className="hero-image" role="img" aria-label="Fresh vegetables at a local farmers market">
            <span className="image-caption">A little closer to the source.</span>
            <span className="image-sun" aria-hidden="true">✳</span>
          </div>
          <div className="hero-index">01 <span /> 03</div>
        </section>

        <section className="market-section" id="market">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE LOCAL HARVEST</p>
              <h2>Good things, <em>growing.</em></h2>
            </div>
            <p className="section-intro">Picked fresh and brought to you by the people who grow it.</p>
          </div>

          <div className="market-controls">
            <div className="category-list" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  className={`category-button${category === item ? " selected" : ""}`}
                  key={item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Find something fresh..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search products, farmers, or locations"
              />
              <kbd>⌘ K</kbd>
            </label>
          </div>

          {error && <div className="notice error-notice" role="alert">{error}</div>}
          {loading ? (
            <div className="empty-state"><span className="loader" /> Gathering the harvest...</div>
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product._id}>
                  <div className="product-image-wrap">
                    <img
                      className="product-image"
                      src={product.imageUrl || fallbackImages[product.category] || fallbackImages.Vegetables}
                      alt={product.name}
                      loading="lazy"
                    />
                    <span className="product-category">{product.category}</span>
                  </div>
                  <div className="product-details">
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <p className="product-price">${Number(product.price).toFixed(2)}<span> / {product.unit}</span></p>
                    </div>
                    {product.description && <p className="product-description">{product.description}</p>}
                    <div className="farmer-row">
                      <span className="farmer-avatar">{product.farmer?.charAt(0).toUpperCase()}</span>
                      <span><strong>{product.farmer}</strong><small>{product.location}</small></span>
                      <span className="stock-label">{product.quantity} {product.unit} left</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">✳</span>
              <h3>{search || category !== "All" ? "Nothing fresh found" : "The first harvest is yours."}</h3>
              <p>{search || category !== "All" ? "Try another search or category." : "Be the first farmer to share a listing with your community."}</p>
              {!search && category === "All" && <button className="text-button" onClick={() => setShowForm(true)}>Add a listing <span aria-hidden="true">↗</span></button>}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#"><span className="brand-mark">f.</span><span>field<span className="brand-light">&amp;fork</span></span></a>
        <p>Good food starts close to home.</p>
        <span>© 2026 Field &amp; Fork</span>
      </footer>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowForm(false);
        }}>
          <section className="listing-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading">
              <div><p className="eyebrow">GROW SOMETHING GOOD</p><h2 id="modal-title">Share your harvest.</h2></div>
              <button className="close-button" onClick={() => setShowForm(false)} aria-label="Close form">×</button>
            </div>
            <p className="modal-intro">Tell your neighbors what you've been growing.</p>
            <form className="listing-form" onSubmit={submitProduct}>
              <label>Product name<input name="name" value={form.name} onChange={updateForm} required maxLength="100" placeholder="e.g. Heirloom tomatoes" /></label>
              <div className="form-row">
                <label>Category<select name="category" value={form.category} onChange={updateForm}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Price (USD)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateForm} required placeholder="4.50" /></label>
              </div>
              <div className="form-row">
                <label>Quantity<input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={updateForm} required placeholder="20" /></label>
                <label>Sold per<input name="unit" value={form.unit} onChange={updateForm} required placeholder="kg, bunch, each..." /></label>
              </div>
              <div className="form-row">
                <label>Your name<input name="farmer" value={form.farmer} onChange={updateForm} required placeholder="Farmer name" /></label>
                <label>Location<input name="location" value={form.location} onChange={updateForm} required placeholder="Town or neighborhood" /></label>
              </div>
              <label>Photo URL <span className="optional">(optional)</span><input name="imageUrl" type="url" value={form.imageUrl} onChange={updateForm} placeholder="https://..." /></label>
              <label>About this harvest <span className="optional">(optional)</span><textarea name="description" value={form.description} onChange={updateForm} maxLength="500" rows="3" placeholder="What makes it special?" /></label>
              <button className="submit-button" type="submit" disabled={saving}>{saving ? "Publishing..." : "Publish listing"} <span aria-hidden="true">↗</span></button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
