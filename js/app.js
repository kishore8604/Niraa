/**
 * Static storefront logic for Niraa.
 * Features: category filtering, product details modal, cart drawer,
 * local add/remove actions, and checkout confirmation flow.
 */
const products = [
  { id: 1, name: 'Essential Crew Tee', category: 'T-Shirts', price: 799, icon: '👕', description: 'Premium cotton tee with a clean regular fit for everyday comfort.' },
  { id: 2, name: 'Oxford Classic Shirt', category: 'Shirts', price: 1499, icon: '👔', description: 'Smart-casual shirt crafted from breathable oxford weave fabric.' },
  { id: 3, name: 'Relaxed Fit Chino', category: 'Pants', price: 1699, icon: '👖', description: 'Mid-rise chinos designed for flexible movement and all-day wear.' },
  { id: 4, name: 'Heritage Cotton Kurta', category: 'Kurtas', price: 1399, icon: '🧵', description: 'Minimal kurta silhouette tailored with soft cotton texture.' },
  { id: 5, name: 'Cloud Lounge Set', category: 'Loungewear', price: 1899, icon: '🛋️', description: 'Two-piece loungewear with plush touch and modern fit.' },
  { id: 6, name: 'Everyday Active Shorts', category: 'Shorts', price: 999, icon: '🩳', description: 'Lightweight shorts with stretch waistband and utility pockets.' },
  { id: 7, name: 'Graphic Relax Tee', category: 'T-Shirts', price: 899, icon: '🎽', description: 'Statement print tee with ultra-soft jersey cotton material.' },
  { id: 8, name: 'Linen Blend Shirt', category: 'Shirts', price: 1599, icon: '👔', description: 'Cooling linen blend shirt perfect for warm weather layering.' }
];

let selectedCategory = 'All';
let cart = [];

const productGrid = document.getElementById('productGrid');
const categoryFilters = document.getElementById('categoryFilters');
const cartCount = document.getElementById('cartCount');
const cartButton = document.getElementById('cartButton');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const overlay = document.getElementById('overlay');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const checkoutTrigger = document.getElementById('checkoutTrigger');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutModal = document.getElementById('closeCheckoutModal');
const placeOrder = document.getElementById('placeOrder');
const checkoutMessage = document.getElementById('checkoutMessage');
const productModal = document.getElementById('productModal');
const productModalBody = document.getElementById('productModalBody');
const closeProductModal = document.getElementById('closeProductModal');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function filteredProducts() {
  return selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);
}

function renderProducts() {
  productGrid.innerHTML = filteredProducts().map((product) => `
    <article class="product-card">
      <div class="product-image">${product.icon}</div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="product-meta">${product.category}</p>
        <strong>${formatCurrency(product.price)}</strong>
        <div class="product-footer">
          <button class="btn btn-outline" data-action="details" data-id="${product.id}">View</button>
          <button class="btn btn-primary" data-action="add" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCart() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartCount.textContent = String(cart.reduce((sum, item) => sum + item.qty, 0));
  cartSubtotal.textContent = formatCurrency(subtotal);

  if (!cart.length) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-row">
      <div>
        <strong>${item.name}</strong>
        <small>${item.qty} × ${formatCurrency(item.price)}</small>
      </div>
      <div>
        <button class="btn btn-outline" data-action="decrease" data-id="${item.id}">-</button>
        <button class="btn btn-outline" data-action="increase" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join('');
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  renderCart();
}

function updateCartQty(productId, delta) {
  cart = cart
    .map((item) => item.id === productId ? { ...item, qty: item.qty + delta } : item)
    .filter((item) => item.qty > 0);
  renderCart();
}

function toggleOverlay(show) {
  overlay.hidden = !show;
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  toggleOverlay(true);
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  if (!productModal.classList.contains('open') && !checkoutModal.classList.contains('open')) {
    toggleOverlay(false);
  }
}

function openProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  productModalBody.innerHTML = `
    <div class="modal-product">
      <div class="modal-product-image">${product.icon}</div>
      <div>
        <p class="product-meta">${product.category}</p>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>${formatCurrency(product.price)}</strong></p>
        <button class="btn btn-primary" data-action="add" data-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
  productModal.classList.add('open');
  productModal.setAttribute('aria-hidden', 'false');
  toggleOverlay(true);
}

function closeProductDetails() {
  productModal.classList.remove('open');
  productModal.setAttribute('aria-hidden', 'true');
  if (!cartDrawer.classList.contains('open') && !checkoutModal.classList.contains('open')) {
    toggleOverlay(false);
  }
}

function openCheckout() {
  if (!cart.length) {
    checkoutMessage.textContent = 'Add items to cart before checkout.';
    return;
  }
  checkoutMessage.textContent = '';
  checkoutModal.classList.add('open');
  checkoutModal.setAttribute('aria-hidden', 'false');
  toggleOverlay(true);
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutModal.setAttribute('aria-hidden', 'true');
  if (!cartDrawer.classList.contains('open') && !productModal.classList.contains('open')) {
    toggleOverlay(false);
  }
}

if (categoryFilters) {
  categoryFilters.addEventListener('click', (event) => {
    const button = event.target.closest('.category-btn');
    if (!button) return;

    selectedCategory = button.dataset.category;
    categoryFilters.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    renderProducts();
  });
}

if (productGrid) {
  productGrid.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;

    const productId = Number(target.dataset.id);
    if (target.dataset.action === 'add') addToCart(productId);
    if (target.dataset.action === 'details') openProductModal(productId);
  });
}

if (productModalBody) {
  productModalBody.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-action="add"]');
    if (!target) return;
    addToCart(Number(target.dataset.id));
    openCart();
  });
}

if (cartItems) {
  cartItems.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;

    const productId = Number(target.dataset.id);
    if (target.dataset.action === 'increase') updateCartQty(productId, 1);
    if (target.dataset.action === 'decrease') updateCartQty(productId, -1);
  });
}

cartButton?.addEventListener('click', openCart);
closeCart?.addEventListener('click', closeCartDrawer);
closeProductModal?.addEventListener('click', closeProductDetails);
overlay?.addEventListener('click', () => {
  closeCartDrawer();
  closeProductDetails();
  closeCheckout();
});
mobileMenuToggle?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
checkoutTrigger?.addEventListener('click', openCheckout);
closeCheckoutModal?.addEventListener('click', closeCheckout);

placeOrder?.addEventListener('click', () => {
  if (!cart.length) {
    checkoutMessage.textContent = 'Cart is empty. Add products first.';
    return;
  }

  checkoutMessage.textContent = 'Order placed successfully! (Demo flow)';
  cart = [];
  renderCart();
});

renderProducts();
renderCart();
