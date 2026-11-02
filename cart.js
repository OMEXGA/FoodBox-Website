/* =====================================================
   CART LOGIC
   ===================================================== */

const PRODUCTS = {
  'protein': { id: 'protein', name: 'Protein Bar', price: 30, img: 'images/Protein.png' },
  'carbohydrate': { id: 'carbohydrate', name: 'Carbohydrate Bar', price: 30, img: 'images/Carbohydrate.png' },
  'vitamin': { id: 'vitamin', name: 'Vitamin Bar', price: 30, img: 'images/Vitamin.png' },
  'mineral': { id: 'mineral', name: 'Mineral Bar', price: 30, img: 'images/Mineral.png' },
  'fat': { id: 'fat', name: 'Healthy Fat Bar', price: 30, img: 'images/Fat.png' },
  'box': { id: 'box', name: 'Custom Box (20 bars)', price: 300, img: 'images/box.png' }
};

let cart = JSON.parse(localStorage.getItem('fitgrid_cart')) || [];

const cartContainer = document.getElementById('cart-items-container');
const emptyMsg = document.getElementById('empty-cart-msg');
const subtotalEl = document.getElementById('summary-subtotal');
const totalEl = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartBadge = document.getElementById('cart-count');

function saveCart() {
  localStorage.setItem('fitgrid_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  if (!cartBadge) return;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = totalItems;
  if (totalItems > 0) {
    cartBadge.style.display = 'flex';
  } else {
    cartBadge.style.display = 'none';
  }
}

function renderCart() {
  if (!cartContainer) return;

  // Clear existing items except the empty message
  const items = cartContainer.querySelectorAll('.cart-item');
  items.forEach(item => item.remove());

  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    checkoutBtn.disabled = true;
    subtotalEl.textContent = '฿0';
    totalEl.textContent = '฿0';
    updateCartBadge();
    return;
  }

  emptyMsg.style.display = 'none';
  checkoutBtn.disabled = false;

  let subtotal = 0;

  cart.forEach((item, index) => {
    const product = PRODUCTS[item.id];
    if (!product) return;

    const itemTotal = product.price * item.qty;
    subtotal += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-img"><img src="${product.img}" alt="${product.name}" loading="lazy"></div>
      <div class="cart-item-details">
        <h3>${product.name}</h3>
        <p>฿${product.price} / item</p>
      </div>
      <div class="cart-item-actions">
        <div class="cart-item-price">฿${itemTotal}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  subtotalEl.textContent = `฿${subtotal}`;
  totalEl.textContent = `฿${subtotal}`;
  updateCartBadge();
}

window.updateQty = function(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
};

window.removeItem = function(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
};

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    alert('Thank you for your order! (Proceeding to payment...)');
    cart = [];
    saveCart();
    renderCart();
  });
}

// Global script for Navbar etc.
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
  });
}

const lm = document.getElementById('loginModal');
const sm = document.getElementById('signupModal');
if (lm && sm) {
  const ol=e=>{e.preventDefault();sm.classList.remove('active');lm.classList.add('active');};
  const os=e=>{e.preventDefault();lm.classList.remove('active');sm.classList.add('active');};
  document.querySelectorAll('.nav-login-btn').forEach(b=>b.addEventListener('click',ol));
  document.querySelectorAll('.nav-login-btn-link').forEach(b=>b.addEventListener('click',ol));
  document.querySelectorAll('.nav-signup-btn').forEach(b=>b.addEventListener('click',os));
  document.querySelectorAll('.nav-signup-btn-link').forEach(b=>b.addEventListener('click',os));
  document.getElementById('loginCloseBtn')?.addEventListener('click',()=>lm.classList.remove('active'));
  document.getElementById('signupCloseBtn')?.addEventListener('click',()=>sm.classList.remove('active'));
  lm.addEventListener('click',e=>{if(e.target===lm)lm.classList.remove('active');});
  sm.addEventListener('click',e=>{if(e.target===sm)sm.classList.remove('active');});
}

// Initial render
renderCart();
