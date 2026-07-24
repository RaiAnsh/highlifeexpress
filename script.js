function enterSite() {
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('site').style.display = 'block';
}

/* ── NAVIGATION ── */
function navScroll(e, targetId) {
  if (e) e.preventDefault();
  if (targetId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  }
  var el = document.getElementById(targetId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return false;
}

function shopNow(e, sectionId, cat) {
  if (e) e.preventDefault();
  if (cat) filterCategory(null, cat);
  var el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return false;
}

/* ── SEARCH ── */
function toggleSearch() {
  var input = document.getElementById('searchInput');
  if (!input) return;
  input.classList.toggle('open');
  if (input.classList.contains('open')) {
    input.focus();
  } else {
    input.value = '';
    applyFilters();
  }
}

/* ── CATEGORY FILTER ── */
var currentCategory = 'all';

function filterCategory(e, cat) {
  if (e) e.preventDefault();
  currentCategory = cat;
  document.querySelectorAll('.cat-item').forEach(function (item) {
    item.classList.toggle('active', item.dataset.cat === cat);
  });
  applyFilters();
  return false;
}

function applyFilters() {
  var searchInput = document.getElementById('searchInput');
  var searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
  var totalVisible = 0;

  document.querySelectorAll('.product-grid').forEach(function (grid) {
    var visibleCount = 0;
    grid.querySelectorAll('.product-card').forEach(function (card) {
      var matchesCategory;
      if (currentCategory === 'all') {
        matchesCategory = true;
      } else if (currentCategory === 'deals') {
        matchesCategory = !!(card.querySelector('.price-old') || card.querySelector('.sale-tag'));
      } else {
        matchesCategory = card.dataset.category === currentCategory;
      }
      var name = card.querySelector('.product-name').textContent.toLowerCase();
      var matchesSearch = !searchTerm || name.indexOf(searchTerm) !== -1;
      var visible = matchesCategory && matchesSearch;
      card.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });
    var section = grid.closest('.section');
    if (section) section.style.display = visibleCount > 0 ? '' : 'none';
    totalVisible += visibleCount;
  });

  var emptyState = document.getElementById('globalEmptyState');
  if (!emptyState) return;
  if (totalVisible === 0) {
    emptyState.textContent = searchTerm
      ? 'No products match "' + searchTerm + '".'
      : 'No products in this category yet — check back soon!';
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }
}

/* ── PRODUCT DESCRIPTIONS (full strain write-ups) ── */
var productDescriptions = {
  'Grape Cake': `Grape Cake is an indica dominant hybrid strain created through crossing the infamous Grape Stomper X Cherry Pie X Wedding Cake strains. Known for its super delicious flavor and long-lasting high, Grape Cake is the perfect bud for any indica lover who needs a little power behind their medicine. This bud has a super sweet and fruity grape flavor with a lightly spicy and savory cherry diesel exhale. The aroma is very similar, although with a deep pungent berry overtone that intensifies the more that you toke. The Grape Cake high settles in slowly after your first toke or two, taking on the mind before spreading to the body with a high level of potency. You'll feel a heavy influx of creativity and focus, filling you with a mental clarity that's perfect for taking on any task at hand. As your mind flies high, your body will begin to settle into a relaxing state that's not too sedative in nature. With these effects and its high 29%+ average THC level, Grape Cake is often chosen to treat those suffering from conditions such as depression, chronic stress, ADD or ADHD, chronic fatigue and appetite loss or nausea. This bud has fluffy spade-shaped dark olive green nugs with deep purple undertones, dark brown hairs and a coating of frosty white crystal trichomes.`,
  'Blueberry Kush': `A pure indica (sativa/indica ratio of 0:100), Blueberry Kush is a favorite offspring of two legends, Blueberry and OG Kush. It packs massive THC contents, topping 29% in at least one publicly available test. This strain contains much lower amounts of CBD, however, much less than 1%. That's too low to recommend Blueberry Kush as treatment for seizures and other conditions that respond to CBD. But it's a good strain for treating anxiety, low mood, ADHD, migraine headaches, mood disorders, chronic pain, and nausea. The indica effects are deeply relaxing, happy, euphoric, and sleepy. That makes Blueberry Kush a great late-night strain and an effective way to treat insomnia. This strain has an earthy flavor and aroma with notes of berries and herbs. Dry mouth and dry eyes are widely reported as side effects, while dizziness, paranoia, and headaches are less likely. Popular up and down the West Coast, from Southern California to British Columbia, Blueberry Kush can also be found on the medical marijuana market in Arizona. It's also a frequent find on the black market in many parts of the United States.`,
  'Zesty Citrus': `Zesty Citrus is an evenly balanced hybrid strain (50% indica/50% sativa) created through crossing the classic Double G X White Widow strains. This delicious bud packs a bright, citrusy flavor and lifted, mellow effects that will have you feeling calmed and happy from head to toe. The taste is bright and lemony with hints of spicy herbs and touches of tongue-tingling cinnamon. The aroma is very much the same, with an earthy herbal overtone accented by super spicy and zesty, citrusy lemons. The high will hit you as soon as you exhale, filling you with an immediate euphoric lift that puts a big smile on your face and helps you settle racing thoughts or negative thinking instantly. You'll also feel a light boost of mellow energy at this point, allowing you to keep active if needed without causing any anxiety or paranoia. Thanks to these effects and its super high 26-28% average THC level, Zesty Citrus is often chosen to treat a myriad of conditions including chronic fatigue, chronic stress, depression, headaches or migraines and nausea. This bud has fluffy and piecey, heart-shaped minty green nugs with thick orange hairs and chunky, golden-white crystal trichomes.`,
  'UK Cheese': `UK Cheese is perhaps the most famous marijuana strain to emerge from the British Isles. It is still more popular in the UK than anywhere else, although its fame has spread to many other parts of the world. English farmers created this strain by inbreeding Skunk #1, a sativa-dominant hybrid. UK Cheese itself is indica-dominant, with a sativa/indica ratio of 20:80, but the effects are balanced, delivering both a head and body high. It's a potent strain, with THC levels topping out at about 29%, and it's known to hit fast and hard. The effects are intensely euphoric, with an upbeat, happy mood, some laziness, and a dose of creativity. Best used to treat pain and stress, UK Cheese is also an effective way to alleviate insomnia and depression. CBD levels are low, less than 1%, so this isn't a good choice for patients with seizures or other disorders that respond to CBD. Cottonmouth and dry eyes are common side effects, and paranoia, headaches, and dizziness are also reported. Fittingly, this strain smells and tastes like cheese, with a pungent earthy aroma.`,
  'Cookie Cream': `Cookies N Cream, also known as "Cookies and Cream," is an evenly balanced hybrid (50% indica/50% sativa) strain created through crossing the delicious Girl Scout Cookies X Starfighter strains. This bud was the first place hybrid at the 2014 Denver Cannabis Cup, and for good reason. Cookies N Cream has a flavor that's much like your favorite cookie, with hints of chocolate and nuts as well as sweet vanilla and cream. The aroma is very much the same but with a slightly pungent twist. The high is long lasting and relaxed in nature, although it can be overwhelming to some due to its almost overpowering 25-28% average THC level. It starts with an uplifted euphoric onset that fills your mind with a sense of happiness without causing an increase in energy. As your mind soars into a blissful state, your body will slowly become more and more relaxed, lulling you into a state of calm. With these potent effects, Cookies N Cream is said to be perfect for treating experienced patients suffering from appetite loss, chronic stress, insomnia, and depression. Buds have dense lumpy long bright neon green nugs with light amber hairs and glittering crystal trichomes.`,
  'Oreoz': `Oreo Cake, also known as "Oreos Cake," is an indica dominant hybrid strain (70% indica/30% sativa) created through crossing the delicious Sunset Sherbet X Cookies N Cream strains. Oreo Cake packs a sweet and sugary creamy chocolate cookie flavor with hints of fresh vanilla, almost like a cake topped with Oreo Cookies. The aroma is very similar, with a creamy vanilla cake overtone accented by hints of spicy chocolate and sweet flowers. The high will hit you quickly, taking on a surprisingly bright and energetic onset within your mind. You'll feel lifted and happy with a burst of creativity that activates your brain and has you feeling super artistic. A relaxing physical high accompanies this happy boost, keeping you anchored in reality. Combined with its high 25-29% average THC level, these calming effects give Oreo Cake an edge in treating a variety of conditions including chronic fatigue, depression, chronic pain and chronic stress or anxiety. This bud has long, pepper-shaped forest green nugs with furry, thin orange hairs and a frosty coating of tiny, bright white crystal trichomes.`,
  'Pineapple Express': `Pineapple Express is a Sativa dominant strain with a 60:40 sativa/indica ratio. The strain is quite popular and has achieved recognition thanks to the stoner film of the same name. However, you have to keep in mind that the strain is not as intense as the movie has made it out to be. Pineapple Express still manages to offer a mild and nice body-numbing buzz, which is something to look forward to. The strain is offered in the form of well-weighed nuggets that look like Styrofoam popcorn. It does not taste sweet, but it does smell funky with its citrus overtones. The taste is quite extraordinary with a hint of pineapple while you inhale. Pineapple Express is chosen to treat a lot of medical problems including anxiety and stress. However, it is even more effective at curing the symptoms of chronic depression at the same time. If you are suffering from mild pains and aches, you should look no further. After a smoke, you will realize Pineapple Express is calming and stimulating at the same time. Not only will it heighten all your senses but you will feel energized all the while observing an increase in focus, awareness and creativity.`,
  'Ice Cream Gelato': `Ice Cream Gelato is an indica dominant hybrid strain (75% indica/25% sativa) created through crossing the delicious Gelato #33 X Wedding Cake strains. Named for its super delicious flavor and celebrity parentage, Ice Cream Gelato is the perfect bud for any discerning indica lover. Much like the name suggests, Ice Cream Gelato has a sweet and creamy vanilla flavor with hints of nutty cake and fresh fruits. The aroma is just as delicious, with a nutty vanilla overtone that's creamy, sugary and fruity at the same time. The high will have you feeling just as amazing as the flavor, with a soothing overtone that will have your physical form feeling relaxed while your mental state takes off to new heights of happy sociability. You'll be chatty and pretty giggly from start to finish, laughing at anything and everything around you for hours. This is accompanied by a lightly sedative body high that will instantly lock you to the couch without making you too sleepy. With these effects and its high 29-30% average THC level, Ice Cream Gelato is said to be perfect for treating chronic pain, depression or mood swings and chronic stress or anxiety. This bud has fat and dense popcorn-shaped olive green nugs with thin orange hairs and a coating of tiny golden white crystal trichomes.`,
  'Mars OG': `Mars OG is a strong and relaxing medicinal marijuana strain that is produced by crossing Mars and OG. The Indica variety is dominant in this strain. The plant produces several buds that are green in color with traces of orange. It has a mild to medium high THC level and a CBD content around 0.09% to 0.6%. It has a pungent aroma and flavor with hints of grape and earthy flavors. It feels quite good to smoke and has a very relaxing effect on your system. The prominent effect of Mars OG is that it makes you incredibly lazy — you don't feel like doing anything once you smoke it. In addition to that, it makes you euphoric, sleepy, uplifted and happy. This strain is excellent for treating insomnia; you soon fall asleep after smoking it and sleep for quite a long time. It is also useful for treating stress and anxiety of different types and is helpful in alleviating symptoms of depression. You can also use it to treat mild to chronic pains, but it is most appropriate for resolving insomnia issues. It can also be employed for treating loss of appetite as it stimulates hunger.`,
  'Rainbow Sherbet': `Rainbow Sherbet is an insanely delicious evenly balanced hybrid (50% indica/50% sativa) strain created through crossing the mouthwatering Champagne X Blackberry strains. If you're in the market for a great tasting bud and well-balanced effects, Rainbow Sherbet is it! This bud has a sweet berry fruity flavor that has a sugary exhale with a kick of fresh mint to it. The aroma is very earthy and fruity with a sweet berry overtone accented by fresh mint. The high hits you almost immediately after your first exhale with a mental rush of cerebral energy that lifts your spirits and infuses you with a sense of creativity with a touch of focus. As your mind brightens, your body will drop off into a state of deep relaxation that quickly turns into a heavy body stone. In combination with its high 28-29% average THC level, these potent effects give Rainbow Sherbet an edge in treating conditions such as chronic pain, arthritis, spinal cord injury, anxiety, and nausea. This bud has lemon-shaped forest green nugs with thin orange hairs and a thick frosty coating of tiny amber colored crystal trichomes.`,
  'Pink Runtz': `Pink Runtz is a rare evenly balanced hybrid strain (50% indica/50% sativa) created either as a phenotype of the infamous Runtz strain, a Zkittlez X Gelato cross, or as a cross of the delicious Rainbow Sherbet X Pink Panties strains. Described as a strain that will have you "talking to your forehead," this bud brings on the unfocused and giddy effects that will leave you feeling totally out of it and completely happy about it. The high starts with a rush of cerebral effects, filling you with a happy sense of high-flying euphoria that immediately pushes out any negative or racing thoughts, replacing them with heady unfocused bliss. As your mind settles into this buzzy state, a tingle will begin to spread throughout your physical form, leaving you totally relaxed and kicked back, pain-free from head to toe. In combination with its high 28-30% average THC level, these effects give Pink Runtz an edge in treating conditions such as depression, chronic stress or PTSD, mood swings, nausea or appetite loss and chronic fatigue. This bud has a sweet and fruity cherry berry flavor with a notable hint of sour candy. The aroma is very similar, although with a heavier sour overtone that intensifies as the nugs are burned away. Buds have dense spade-shaped minty green nugs with purple leaves, thin orange hairs and a thick frosty coating of tiny white crystal trichomes.`
};

/* ── PRODUCT DETAIL MODAL ── */
var activeModalCard = null;

function openProductModal(card) {
  var overlay = document.getElementById('productOverlay');
  if (!overlay) return;
  activeModalCard = card;

  var data = getCardData(card);
  var imgHtml = card.querySelector('.product-img img')
    ? '<img src="' + data.imgSrc + '" alt="' + data.name + '">'
    : '<span>🌿</span>';
  document.getElementById('productModalImg').innerHTML = imgHtml;
  document.getElementById('productModalBadges').innerHTML = card.querySelector('.badges').innerHTML;
  document.getElementById('productModalName').textContent = data.name;
  document.getElementById('productModalEffects').textContent = card.querySelector('.product-effects').textContent;
  document.getElementById('productModalPrice').textContent = data.priceLabel;
  document.getElementById('productModalDesc').textContent =
    productDescriptions[data.name] ||
    'Full details coming soon — message us in-store or online and we\'ll fill you in on this strain.';

  overlay.classList.add('open');
}

function closeProductModal() {
  var overlay = document.getElementById('productOverlay');
  if (overlay) overlay.classList.remove('open');
  activeModalCard = null;
}

function addToCartFromModal() {
  if (activeModalCard) addToCart(activeModalCard);
  closeProductModal();
  openCart();
}

/* ── CART ── */
var cart = [];

function loadCart() {
  try {
    var saved = localStorage.getItem('hle_cart');
    cart = saved ? JSON.parse(saved) : [];
  } catch (err) {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem('hle_cart', JSON.stringify(cart));
}

function getCardData(card) {
  var name = card.querySelector('.product-name').textContent.trim();
  var priceEl = card.querySelector('.price');
  var priceLabel = priceEl.textContent.replace(/\s+/g, ' ').trim();
  var clone = priceEl.cloneNode(true);
  var oldEl = clone.querySelector('.price-old');
  if (oldEl) oldEl.remove();
  var match = clone.textContent.match(/\$([\d.]+)/);
  var price = match ? parseFloat(match[1]) : 0;
  var img = card.querySelector('.product-img img');
  var imgSrc = img ? img.getAttribute('src') : '';
  return { name: name, price: price, priceLabel: priceLabel, imgSrc: imgSrc };
}

function addToCart(card) {
  var data = getCardData(card);
  var existing = cart.find(function (item) { return item.name === data.name; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: data.name, price: data.price, priceLabel: data.priceLabel, imgSrc: data.imgSrc, qty: 1 });
  }
  saveCart();
  renderCart();
}

function changeQty(index, delta) {
  var item = cart[index];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function cartCount() {
  return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
}

function cartSubtotal() {
  return cart.reduce(function (sum, item) { return sum + item.qty * item.price; }, 0);
}

function renderCart() {
  var badge = document.getElementById('cartBadge');
  if (!badge) return;
  badge.textContent = cartCount();
  var itemsEl = document.getElementById('cartItems');
  var checkoutBtn = document.getElementById('cartCheckoutBtn');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty.<br>Add some products to get started!</div>';
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    itemsEl.innerHTML = cart.map(function (item, i) {
      var thumb = item.imgSrc
        ? '<img src="' + item.imgSrc + '" alt="' + item.name + '">'
        : '🌿';
      return (
        '<div class="cart-item">' +
          '<div class="cart-item-thumb">' + thumb + '</div>' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + item.name + '</div>' +
            '<div class="cart-item-price">' + item.priceLabel + '</div>' +
            '<div class="cart-qty">' +
              '<button onclick="changeQty(' + i + ',-1)">&minus;</button>' +
              '<span>' + item.qty + '</span>' +
              '<button onclick="changeQty(' + i + ',1)">&plus;</button>' +
              '<button class="cart-remove" onclick="removeFromCart(' + i + ')">Remove</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  document.getElementById('cartSubtotal').textContent = '$' + cartSubtotal().toFixed(2);
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function placeOrder() {
  if (cart.length === 0) return;
  var lines = cart.map(function (item) {
    return item.qty + 'x ' + item.name + ' (' + item.priceLabel + ')';
  });
  var summary = lines.join('\n') + '\n\nSubtotal: $' + cartSubtotal().toFixed(2);
  var message =
    'Order details copied to your clipboard!\n\n' +
    summary +
    '\n\nText, email, or DM us this order to confirm — payment by cash on delivery, e-transfer, or in person.';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(summary).catch(function () {});
  }
  alert(message);
}

document.addEventListener('click', function (e) {
  var addBtn = e.target.closest('.add-btn');
  if (addBtn) {
    var addCard = addBtn.closest('.product-card');
    if (addCard) addToCart(addCard);
    return;
  }
  var card = e.target.closest('.product-card');
  if (card) {
    openProductModal(card);
    return;
  }
});

/* ── PLACEHOLDER CONTACT FORM ── */
function submitContactForm(e) {
  if (e) e.preventDefault();
  alert('Thanks for reaching out! Our contact form isn\'t fully wired up yet — please reach us directly via phone, text, or social media in the meantime.');
  return false;
}

loadCart();
renderCart();
