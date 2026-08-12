const products = [
  {
    id: 1,
    name: "Adiyogi Whey Isolate",
    cat: "Protein",
    price: 2899,
    desc: "1kg · Chocolate · 24g protein / scoop",
    img: "https://images.unsplash.com/photo-1579722820308-d74e57ce3e7f?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Creatine Monohydrate",
    cat: "Performance",
    price: 999,
    desc: "300g · Micronized · Unflavoured",
    img: "https://images.unsplash.com/photo-1594882645126-14020914d110?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Pre-Workout Ignite",
    cat: "Performance",
    price: 1499,
    desc: "250g · Fruit punch · Caffeine focused",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Multivitamin Daily",
    cat: "Health",
    price: 599,
    desc: "60 tablets · Recovery support",
    img: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 5,
    name: "Omega-3 Softgels",
    cat: "Health",
    price: 749,
    desc: "90 softgels · Heart & joint care",
    img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 6,
    name: "Lifting Straps",
    cat: "Gear",
    price: 449,
    desc: "Pair · Cotton · Extra grip",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 7,
    name: "Shaker Bottle 700ml",
    cat: "Gear",
    price: 299,
    desc: "BPA free · Adiyogi branded",
    img: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 8,
    name: "Mass Gainer Pro",
    cat: "Protein",
    price: 3299,
    desc: "3kg · High calorie · Vanilla",
    img: "https://images.unsplash.com/photo-1622484211148-87c6e0e814d6?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 9,
    name: "BCAA Intra Fuel",
    cat: "Performance",
    price: 1199,
    desc: "300g · Blue raspberry",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=700&q=80",
  },
];

const cart = [];
let activeFilter = "all";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function renderProducts() {
  const grid = document.getElementById("products");
  const list = products.filter((p) => activeFilter === "all" || p.cat === activeFilter);
  grid.innerHTML = list
    .map(
      (p) => `<article class="product">
        <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy" /></div>
        <div class="info">
          <div class="cat">${p.cat}</div>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="row">
            <div class="price">${money(p.price)}</div>
            <button class="btn btn-dark" data-add="${p.id}">Add</button>
          </div>
        </div>
      </article>`
    )
    .join("");

  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.add)));
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  renderCart();
  openCart();
}

function renderCart() {
  const box = document.getElementById("cartItems");
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.qty * c.price, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = money(total);

  if (!cart.length) {
    box.innerHTML = `<p style="color:var(--muted)">Cart is empty. Add nutrition or gear to continue.</p>`;
    return;
  }

  box.innerHTML = cart
    .map(
      (c) => `<div class="cart-item">
        <div>
          <div class="name">${c.name}</div>
          <div class="meta">${c.qty} × ${money(c.price)}</div>
        </div>
        <div>
          <strong>${money(c.qty * c.price)}</strong>
          <div><button class="btn btn-ghost" style="padding:0.25rem 0.5rem;margin-top:0.35rem" data-remove="${c.id}">Remove</button></div>
        </div>
      </div>`
    )
    .join("");

  box.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = cart.findIndex((c) => c.id === Number(btn.dataset.remove));
      if (i > -1) cart.splice(i, 1);
      renderCart();
    });
  });
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProducts();
  });
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;
  const total = cart.reduce((s, c) => s + c.qty * c.price, 0);
  cart.length = 0;
  renderCart();
  closeCart();
  alert(`Order placed for Adiyogi Store!\nTotal: ${money(total)}\nPickup: Bistan Rd studio · Demo only`);
});

renderProducts();
renderCart();
