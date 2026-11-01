(function () {
  const KEY = 'nv_chai_cart';
  const drawer = document.getElementById('cart-drawer');
  const modal = document.getElementById('checkout-modal');
  const itemsEl = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  const msgEl = document.getElementById('checkout-msg');

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function write(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    render();
  }
  function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }

  function render() {
    const cart = read();
    const qty = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
    if (countEl) countEl.textContent = String(qty);
    if (totalEl) totalEl.textContent = money(total);
    if (!itemsEl) return;
    if (!cart.length) {
      itemsEl.innerHTML = '<p style="color:#777;margin:1rem 0;">Your cart is empty.</p>';
      return;
    }
    itemsEl.innerHTML = cart.map(function (i) {
      return '<div class="cart-item" data-id="' + i.id + '">' +
        '<img src="' + i.image + '" alt="">' +
        '<div><strong>' + i.name + '</strong><div class="qty">' +
        '<button type="button" data-dec>−</button><span>' + i.qty + '</span><button type="button" data-inc>+</button></div></div>' +
        '<div><strong>' + money(i.qty * i.price) + '</strong><br><button type="button" data-rm style="border:0;background:none;color:#c0392b;cursor:pointer;font-size:.8rem;">Remove</button></div></div>';
    }).join('');
  }

  function add(item) {
    const cart = read();
    const found = cart.find(function (c) { return c.id === item.id; });
    if (found) found.qty += 1;
    else cart.push({ id: item.id, name: item.name, price: Number(item.price), image: item.image, qty: 1 });
    write(cart);
  }

  document.querySelectorAll('[data-add]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      add({
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: btn.dataset.price,
        image: btn.dataset.image
      });
      openCart();
    });
  });

  function openCart() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('open-cart')?.addEventListener('click', openCart);
  document.querySelectorAll('[data-close-cart]').forEach(function (el) {
    el.addEventListener('click', closeCart);
  });

  itemsEl?.addEventListener('click', function (e) {
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const id = row.getAttribute('data-id');
    let cart = read();
    const item = cart.find(function (c) { return c.id === id; });
    if (!item) return;
    if (e.target.matches('[data-inc]')) item.qty += 1;
    if (e.target.matches('[data-dec]')) item.qty = Math.max(1, item.qty - 1);
    if (e.target.matches('[data-rm]')) cart = cart.filter(function (c) { return c.id !== id; });
    write(cart);
  });

  document.getElementById('go-checkout')?.addEventListener('click', function () {
    if (!read().length) { alert('Add at least one blend to cart.'); return; }
    closeCart();
    modal?.classList.add('open');
  });
  document.getElementById('cancel-checkout')?.addEventListener('click', function () {
    modal?.classList.remove('open');
  });

  document.getElementById('checkout-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const payload = {
      customer: {
        name: fd.get('name'),
        phone: fd.get('phone'),
        email: fd.get('email'),
        address: fd.get('address'),
        notes: fd.get('notes') || ''
      },
      payment_method: fd.get('payment_method'),
      items: read()
    };
    msgEl.style.display = 'block';
    msgEl.textContent = 'Placing order…';
    msgEl.style.color = '#555';
    try {
      const res = await fetch(window.NV_CHAI.checkoutUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Checkout failed');
      write([]);
      msgEl.style.color = '#0a7a3e';
      msgEl.textContent = 'Order placed! ID: ' + data.id + '. We will contact you shortly.';
      form.reset();
      setTimeout(function () { modal?.classList.remove('open'); msgEl.style.display = 'none'; }, 2800);
    } catch (err) {
      msgEl.style.color = '#c0392b';
      msgEl.textContent = err.message || 'Something went wrong';
    }
  });

  render();
})();
