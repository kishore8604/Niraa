/**
 * Niraa front-end interactions
 * - Hero slider
 * - Collection carousel
 * - Product filtering + product modal
 * - Floating cart + drawer + checkout demo flow
 * - Navbar scroll effect
 * - Reveal-on-scroll animation
 */

const productData = [
  { id: 1, name: 'Luxe Crew Tee', category: 'T-Shirts', price: 1199, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80', desc: 'Soft-stretch cotton tee with precision tailoring.' },
  { id: 2, name: 'Signature Oxford', category: 'Shirts', price: 2099, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=700&q=80', desc: 'A refined shirt profile for elevated everyday wear.' },
  { id: 3, name: 'Tailored Tech Pant', category: 'Pants', price: 2499, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80', desc: 'Breathable fabrication with polished slim taper.' },
  { id: 4, name: 'Heritage Kurta', category: 'Kurtas', price: 1999, image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=700&q=80', desc: 'Modern minimal kurta with premium woven finish.' },
  { id: 5, name: 'Soft Lounge Set', category: 'Loungewear', price: 2699, image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=80', desc: 'Relaxed silhouettes crafted for effortless comfort.' },
  { id: 6, name: 'Performance Shorts', category: 'Shorts', price: 1499, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=80', desc: 'Lightweight luxury shorts for movement and style.' },
  { id: 7, name: 'Monochrome Tee', category: 'T-Shirts', price: 1099, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80', desc: 'Muted palette tee for clean layered aesthetics.' },
  { id: 8, name: 'Beige Linen Shirt', category: 'Shirts', price: 2299, image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=700&q=80', desc: 'Linen-blend sophistication in warm neutral tones.' }
];

const collectionData = [
  { title: 'Urban Quiet Luxury', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80' },
  { title: 'Monochrome Essentials', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80' },
  { title: 'Tailored Modernwear', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80' },
  { title: 'Soft Beige Story', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80' }
];

let selectedCategory = 'All';
let cart = [];
let heroIndex = 0;

const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const q = (s) => document.querySelector(s);
const qa = (s) => [...document.querySelectorAll(s)];

const productGrid = q('#productGrid');
const categories = q('#categories');
const cartCount = q('#cartCount');
const cartBody = q('#cartBody');
const cartTotal = q('#cartTotal');
const cartDrawer = q('#cartDrawer');
const overlay = q('#overlay');
const modal = q('#productModal');
const modalContent = q('#modalContent');
const checkoutModal = q('#checkoutModal');
const checkoutMessage = q('#checkoutMessage');
const heroSlides = qa('.hero-slide');
const heroDots = q('#heroDots');
const header = q('#siteHeader');
const collectionCarousel = q('#collectionCarousel');

function filteredProducts() {
  return selectedCategory === 'All'
    ? productData
    : productData.filter((item) => item.category === selectedCategory);
}

/** Render product cards */
function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = filteredProducts().map((item) => `
    <article class="product-card reveal">
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <h3>${item.name}</h3>
      <p class="product-meta">${item.category}</p>
      <strong>${rupee.format(item.price)}</strong>
      <div class="product-actions">
        <button class="btn btn-muted" data-action="view" data-id="${item.id}">View</button>
        <button class="btn btn-gold" data-action="add" data-id="${item.id}">Add</button>
      </div>
    </article>
  `).join('');

  activateReveal();
}

/** Render collection carousel cards */
function renderCollections() {
  if (!collectionCarousel) return;
  collectionCarousel.innerHTML = collectionData.map((item) => `
    <article class="collection-card">
      <img src="${item.image}" alt="${item.title}" loading="lazy" />
      <div class="meta">${item.title}</div>
    </article>
  `).join('');
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  if (!modal.classList.contains('open') && !checkoutModal.classList.contains('open')) overlay.hidden = true;
}
function openModal() { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); overlay.hidden = false; }
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!cartDrawer.classList.contains('open') && !checkoutModal.classList.contains('open')) overlay.hidden = true;
}
function openCheckout() {
  if (!cart.length) {
    checkoutMessage.textContent = 'Your cart is empty. Add products before checkout.';
    return;
  }
  checkoutMessage.textContent = '';
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
}
function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  if (!cartDrawer.classList.contains('open') && !modal.classList.contains('open')) overlay.hidden = true;
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  cartCount.textContent = String(count);
  cartTotal.textContent = rupee.format(total);

  if (!cart.length) {
    cartBody.innerHTML = '<p class="muted">No items in cart yet.</p>';
    return;
  }

  cartBody.innerHTML = cart.map((item) => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong>
        <small>${item.qty} × ${rupee.format(item.price)}</small>
      </div>
      <div>
        <button data-action="dec" data-id="${item.id}">−</button>
        <button data-action="inc" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const product = productData.find((x) => x.id === id);
  if (!product) return;

  const existing = cart.find((x) => x.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  renderCart();
}

function setProductModal(id) {
  const product = productData.find((x) => x.id === id);
  if (!product) return;

  modalContent.innerHTML = `
    <div class="modal-layout">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <p class="product-meta">${product.category}</p>
        <h3>${product.name}</h3>
        <p class="muted">${product.desc}</p>
        <p><strong>${rupee.format(product.price)}</strong></p>
        <button class="btn btn-gold" data-action="add-modal" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
  openModal();
}

/** Hero slider with dots and autoplay */
function initHeroSlider() {
  if (!heroSlides.length || !heroDots) return;

  heroDots.innerHTML = heroSlides.map((_, i) => `<button data-index="${i}" aria-label="Slide ${i + 1}"></button>`).join('');
  const dots = qa('#heroDots button');

  const setSlide = (i) => {
    heroIndex = (i + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, idx) => slide.classList.toggle('is-active', idx === heroIndex));
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === heroIndex));
  };

  setSlide(0);
  heroDots.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    setSlide(Number(btn.dataset.index));
  });

  setInterval(() => setSlide(heroIndex + 1), 5000);
}

/** Reveal-on-scroll */
function activateReveal() {
  const items = qa('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });
  items.forEach((item) => io.observe(item));
}

function initEvents() {
  categories?.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-btn');
    if (!btn) return;
    selectedCategory = btn.dataset.category;
    qa('.cat-btn').forEach((x) => x.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
  });

  productGrid?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === 'add') addToCart(id);
    if (btn.dataset.action === 'view') setProductModal(id);
  });

  modalContent?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="add-modal"]');
    if (!btn) return;
    addToCart(Number(btn.dataset.id));
    openCart();
  });

  cartBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    cart = cart
      .map((item) => {
        if (item.id !== id) return item;
        const delta = btn.dataset.action === 'inc' ? 1 : -1;
        return { ...item, qty: item.qty + delta };
      })
      .filter((item) => item.qty > 0);
    renderCart();
  });

  q('#openCart')?.addEventListener('click', openCart);
  q('#closeCart')?.addEventListener('click', closeCart);
  q('#openCheckout')?.addEventListener('click', openCheckout);
  q('#closeCheckout')?.addEventListener('click', closeCheckout);
  q('#closeProductModal')?.addEventListener('click', closeModal);

  overlay?.addEventListener('click', () => {
    closeCart();
    closeModal();
    closeCheckout();
  });

  q('#placeOrder')?.addEventListener('click', () => {
    if (!cart.length) {
      checkoutMessage.textContent = 'Cart is empty. Please add products first.';
      return;
    }
    checkoutMessage.textContent = 'Order placed successfully (demo).';
    cart = [];
    renderCart();
  });

  q('#menuToggle')?.addEventListener('click', () => q('#mobileNav')?.classList.toggle('open'));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 16) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  });

  q('#collectionPrev')?.addEventListener('click', () => {
    collectionCarousel?.scrollBy({ left: -collectionCarousel.clientWidth * 0.75, behavior: 'smooth' });
  });
  q('#collectionNext')?.addEventListener('click', () => {
    collectionCarousel?.scrollBy({ left: collectionCarousel.clientWidth * 0.75, behavior: 'smooth' });
  });
}

renderProducts();
renderCollections();
renderCart();
initHeroSlider();
activateReveal();
initEvents();
