const CART_STORAGE_KEY = 'kr4-cart';

const promoCodes = {
  STUDENT10: 10,
  MINING20: 20
};

let activePromo = null;

function getCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCounter();
}

function addToCart(productId) {
  const cart = getCart();
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
}

function changeQuantity(productId, delta) {
  const cart = getCart();
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem) {
    return;
  }

  cartItem.quantity += delta;

  if (cartItem.quantity <= 0) {
    saveCart(cart.filter((item) => item.id !== productId));
  } else {
    saveCart(cart);
  }
}

function removeFromCart(productId) {
  saveCart(getCart().filter((item) => item.id !== productId));
}

function clearCart() {
  saveCart([]);
}

function getCartItems() {
  return getCart()
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter((item) => item !== null);
}

function getCartCount() {
  return getCart().reduce((count, item) => count + item.quantity, 0);
}

function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCounter() {
  const count = getCartCount();

  document.querySelectorAll('.cart-counter').forEach((counter) => {
    counter.textContent = count;
    counter.classList.toggle('cart-counter--empty', count === 0);
  });
}

const cartList = document.querySelector('#cart-list');
const cartEmpty = document.querySelector('#cart-empty');
const cartSummary = document.querySelector('#cart-summary');
const cartCount = document.querySelector('#cart-count');
const cartSubtotal = document.querySelector('#cart-subtotal');
const cartDiscount = document.querySelector('#cart-discount');
const cartTotal = document.querySelector('#cart-total');
const cartClearButton = document.querySelector('#cart-clear');
const promoForm = document.querySelector('#promo-form');
const promoInput = document.querySelector('#promo-input');
const promoMessage = document.querySelector('#promo-message');

function createCartItem(item) {
  const li = document.createElement('li');
  li.classList.add('cart-item');

  const image = document.createElement('img');
  image.classList.add('cart-item__image');
  image.src = 'images/products/' + item.image + '-320.webp';
  image.alt = item.title;
  image.width = 320;
  image.height = 240;

  const info = document.createElement('div');
  info.classList.add('cart-item__info');

  const title = document.createElement('a');
  title.classList.add('cart-item__title');
  title.href = 'product.html?id=' + item.id;
  title.textContent = item.title;

  const price = document.createElement('p');
  price.classList.add('cart-item__price');
  price.textContent = formatPrice(item.price) + ' за шт.';

  info.append(title, price);

  const controls = document.createElement('div');
  controls.classList.add('cart-item__controls');

  const decreaseButton = document.createElement('button');
  decreaseButton.type = 'button';
  decreaseButton.classList.add('button', 'button--secondary', 'cart-item__quantity-button');
  decreaseButton.dataset.action = 'decrease';
  decreaseButton.dataset.id = item.id;
  decreaseButton.textContent = '−';
  decreaseButton.setAttribute('aria-label', 'Уменьшить количество: ' + item.title);

  const quantity = document.createElement('span');
  quantity.classList.add('cart-item__quantity');
  quantity.textContent = item.quantity;

  const increaseButton = document.createElement('button');
  increaseButton.type = 'button';
  increaseButton.classList.add('button', 'button--secondary', 'cart-item__quantity-button');
  increaseButton.dataset.action = 'increase';
  increaseButton.dataset.id = item.id;
  increaseButton.textContent = '+';
  increaseButton.setAttribute('aria-label', 'Увеличить количество: ' + item.title);

  controls.append(decreaseButton, quantity, increaseButton);

  const sum = document.createElement('p');
  sum.classList.add('cart-item__sum');
  sum.textContent = formatPrice(item.price * item.quantity);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('button', 'button--secondary', 'cart-item__remove');
  removeButton.dataset.action = 'remove';
  removeButton.dataset.id = item.id;
  removeButton.textContent = 'Удалить';
  removeButton.setAttribute('aria-label', 'Удалить из корзины: ' + item.title);

  li.append(image, info, controls, sum, removeButton);
  return li;
}

function renderCart() {
  const items = getCartItems();

  cartList.textContent = '';

  if (items.length === 0) {
    cartEmpty.hidden = false;
    cartSummary.hidden = true;
    return;
  }

  cartEmpty.hidden = true;
  cartSummary.hidden = false;

  items.forEach((item) => {
    cartList.append(createCartItem(item));
  });

  const subtotal = getCartTotal(items);
  const discount = activePromo ? Math.round(subtotal * promoCodes[activePromo] / 100) : 0;

  cartCount.textContent = getCartCount();
  cartSubtotal.textContent = formatPrice(subtotal);
  cartDiscount.textContent = discount > 0 ? '−' + formatPrice(discount) : formatPrice(0);
  cartTotal.textContent = formatPrice(subtotal - discount);
}

function showPromoMessage(text, type) {
  promoMessage.textContent = text;
  promoMessage.classList.remove('form-message--error', 'form-message--success');
  promoMessage.classList.add('form-message--' + type);
}

if (cartList) {
  renderCart();

  cartList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.id);

    if (button.dataset.action === 'increase') {
      changeQuantity(productId, 1);
    } else if (button.dataset.action === 'decrease') {
      changeQuantity(productId, -1);
    } else if (button.dataset.action === 'remove') {
      removeFromCart(productId);
    }

    renderCart();
  });

  cartClearButton.addEventListener('click', () => {
    clearCart();
    renderCart();
  });

  promoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const code = promoInput.value.trim().toUpperCase();

    if (code === '') {
      showPromoMessage('Введите промокод.', 'error');
      return;
    }

    if (!promoCodes[code]) {
      activePromo = null;
      showPromoMessage('Промокод не найден.', 'error');
      renderCart();
      return;
    }

    activePromo = code;
    showPromoMessage('Промокод ' + code + ' применён: скидка ' + promoCodes[code] + '%.', 'success');
    renderCart();
  });
}

updateCartCounter();
