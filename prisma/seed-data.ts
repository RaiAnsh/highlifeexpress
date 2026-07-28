// Source-of-truth seed data ported from legacy-static/index.html + legacy-static/script.js
// (the original static site). Real product descriptions are verbatim from the client's
// original WhatsApp-style copy, preserved in legacy-static/script.js's `productDescriptions`.
//
// Note on legacy "range" prices (e.g. "$55–$90/oz"): the old static markup only ever showed
// a text range, not discrete tiers. Since the DB models discrete PriceOptions, these are
// seeded using the range's lower bound as a single option; add more tiers via the admin panel.
//
// Note on SALE pricing: compareAtPriceCents is seeded where the legacy markup showed a
// strikethrough price, but the storefront only renders it when the `promotions_enabled`
// SiteSetting is turned on (see lib/pricing.ts `isOnSale`).

const FALLBACK_DESCRIPTION =
  "Full details coming soon \u2014 message us and we'll fill you in on this strain.";

export type SeedPriceOption = { label: string; priceCents: number; compareAtPriceCents?: number };

export type SeedProduct = {
  name: string;
  slug: string;
  categorySlug: string;
  strainType: "INDICA" | "SATIVA" | "HYBRID" | "NA";
  thcPercent?: number;
  effects: string[];
  description: string;
  tags: string[];
  featuredSection: "NEW_ARRIVALS" | "BEST_SELLERS";
  sortOrder: number;
  photoFile?: string; // filename under public/photos — local dev only until Cloudinary migration
  priceOptions: SeedPriceOption[];
};

// Placeholder contact/business info — editable via /admin/settings once built.
// promotions_enabled defaults to "false" until price promotions are turned on.
export const SITE_SETTINGS: Record<string, string> = {
  promotions_enabled: "false",
  contact_phone: "647 551-0846 (please text)",
  contact_email: "1highlifeeexpress@gmail.com",
  hours: "Coming soon",
  service_area: "Ontario, Canada",
};

export const CATEGORIES = [
  { slug: "flower", name: "Flower", iconKey: "flower", sortOrder: 1 },
  { slug: "vapes", name: "Vapes", iconKey: "vapes", sortOrder: 2 },
  { slug: "prerolls", name: "Pre-Rolls", iconKey: "prerolls", sortOrder: 3 },
  { slug: "edibles", name: "Edibles", iconKey: "edibles", sortOrder: 4 },
  { slug: "accessories", name: "Accessories", iconKey: "accessories", sortOrder: 5 },
];

export const PRODUCTS: SeedProduct[] = [
  // ── New Arrivals ──
  {
    name: "Ice Cream Gelato",
    slug: "ice-cream-gelato",
    categorySlug: "flower",
    strainType: "INDICA",
    thcPercent: 30,
    effects: ["Relaxation", "Sociability", "Pain"],
    description:
      "Ice Cream Gelato is an indica dominant hybrid strain (75% indica/25% sativa) created through crossing the delicious Gelato #33 X Wedding Cake strains. Named for its super delicious flavor and celebrity parentage, Ice Cream Gelato is the perfect bud for any discerning indica lover. Much like the name suggests, Ice Cream Gelato has a sweet and creamy vanilla flavor with hints of nutty cake and fresh fruits. The aroma is just as delicious, with a nutty vanilla overtone that's creamy, sugary and fruity at the same time. The high will have you feeling just as amazing as the flavor, with a soothing overtone that will have your physical form feeling relaxed while your mental state takes off to new heights of happy sociability. You'll be chatty and pretty giggly from start to finish, laughing at anything and everything around you for hours. This is accompanied by a lightly sedative body high that will instantly lock you to the couch without making you too sleepy. With these effects and its high 29-30% average THC level, Ice Cream Gelato is said to be perfect for treating chronic pain, depression or mood swings and chronic stress or anxiety. This bud has fat and dense popcorn-shaped olive green nugs with thin orange hairs and a coating of tiny golden white crystal trichomes.",
    tags: ["NEW", "DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 1,
    photoFile: "ice-cream-gelato.jpeg",
    priceOptions: [
      { label: "14g", priceCents: 5000 },
      { label: "oz", priceCents: 9500 },
    ],
  },
  {
    name: "Master Kush",
    slug: "master-kush",
    categorySlug: "flower",
    strainType: "INDICA",
    thcPercent: 28,
    effects: ["Relaxation", "Migraine", "Pain"],
    description: FALLBACK_DESCRIPTION,
    tags: ["SALE", "DEAL3OZ140"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 2,
    priceOptions: [{ label: "oz", priceCents: 8000, compareAtPriceCents: 11000 }],
  },
  {
    name: "Cherry Pie",
    slug: "cherry-pie",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 29,
    effects: ["Euphoria", "Stress", "Sleep"],
    description: FALLBACK_DESCRIPTION,
    tags: ["DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 3,
    priceOptions: [{ label: "oz", priceCents: 5500 }],
  },
  {
    name: "Fruit Pebbles",
    slug: "fruit-pebbles",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 29,
    effects: ["Focus", "Energy", "Creativity"],
    description: FALLBACK_DESCRIPTION,
    tags: ["NEW"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 4,
    priceOptions: [{ label: "oz", priceCents: 7500 }],
  },
  {
    name: "Grape Cake",
    slug: "grape-cake",
    categorySlug: "flower",
    strainType: "INDICA",
    thcPercent: 29,
    effects: ["Creativity", "Focus", "Relaxation"],
    description:
      "Grape Cake is an indica dominant hybrid strain created through crossing the infamous Grape Stomper X Cherry Pie X Wedding Cake strains. Known for its super delicious flavor and long-lasting high, Grape Cake is the perfect bud for any indica lover who needs a little power behind their medicine. This bud has a super sweet and fruity grape flavor with a lightly spicy and savory cherry diesel exhale. The aroma is very similar, although with a deep pungent berry overtone that intensifies the more that you toke. The Grape Cake high settles in slowly after your first toke or two, taking on the mind before spreading to the body with a high level of potency. You'll feel a heavy influx of creativity and focus, filling you with a mental clarity that's perfect for taking on any task at hand. As your mind flies high, your body will begin to settle into a relaxing state that's not too sedative in nature. With these effects and its high 29%+ average THC level, Grape Cake is often chosen to treat those suffering from conditions such as depression, chronic stress, ADD or ADHD, chronic fatigue and appetite loss or nausea. This bud has fluffy spade-shaped dark olive green nugs with deep purple undertones, dark brown hairs and a coating of frosty white crystal trichomes.",
    tags: ["NEW", "DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 5,
    photoFile: "grape-cake.jpeg",
    priceOptions: [{ label: "oz", priceCents: 8000 }],
  },
  {
    name: "Zesty Citrus",
    slug: "zesty-citrus",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 28,
    effects: ["Euphoria", "Energy", "Calm"],
    description:
      "Zesty Citrus is an evenly balanced hybrid strain (50% indica/50% sativa) created through crossing the classic Double G X White Widow strains. This delicious bud packs a bright, citrusy flavor and lifted, mellow effects that will have you feeling calmed and happy from head to toe. The taste is bright and lemony with hints of spicy herbs and touches of tongue-tingling cinnamon. The aroma is very much the same, with an earthy herbal overtone accented by super spicy and zesty, citrusy lemons. The high will hit you as soon as you exhale, filling you with an immediate euphoric lift that puts a big smile on your face and helps you settle racing thoughts or negative thinking instantly. You'll also feel a light boost of mellow energy at this point, allowing you to keep active if needed without causing any anxiety or paranoia. Thanks to these effects and its super high 26-28% average THC level, Zesty Citrus is often chosen to treat a myriad of conditions including chronic fatigue, chronic stress, depression, headaches or migraines and nausea. This bud has fluffy and piecey, heart-shaped minty green nugs with thick orange hairs and chunky, golden-white crystal trichomes.",
    tags: ["NEW", "DEAL3OZ140", "DEAL2OZ110"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 6,
    photoFile: "zesty-citrus.jpeg",
    priceOptions: [{ label: "oz", priceCents: 6500 }],
  },
  {
    name: "Cookie Cream",
    slug: "cookie-cream",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 28,
    effects: ["Euphoria", "Relaxation", "Calm"],
    description:
      'Cookies N Cream, also known as "Cookies and Cream," is an evenly balanced hybrid (50% indica/50% sativa) strain created through crossing the delicious Girl Scout Cookies X Starfighter strains. This bud was the first place hybrid at the 2014 Denver Cannabis Cup, and for good reason. Cookies N Cream has a flavor that\'s much like your favorite cookie, with hints of chocolate and nuts as well as sweet vanilla and cream. The aroma is very much the same but with a slightly pungent twist. The high is long lasting and relaxed in nature, although it can be overwhelming to some due to its almost overpowering 25-28% average THC level. It starts with an uplifted euphoric onset that fills your mind with a sense of happiness without causing an increase in energy. As your mind soars into a blissful state, your body will slowly become more and more relaxed, lulling you into a state of calm. With these potent effects, Cookies N Cream is said to be perfect for treating experienced patients suffering from appetite loss, chronic stress, insomnia, and depression. Buds have dense lumpy long bright neon green nugs with light amber hairs and glittering crystal trichomes.',
    tags: ["DEAL3OZ140", "DEAL2OZ110"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 7,
    photoFile: "cookie-cream.jpeg",
    priceOptions: [{ label: "oz", priceCents: 8000 }],
  },
  {
    name: "Pineapple Express",
    slug: "pineapple-express",
    categorySlug: "flower",
    strainType: "SATIVA",
    thcPercent: 30,
    effects: ["Energy", "Focus", "Creativity"],
    description:
      "Pineapple Express is a Sativa dominant strain with a 60:40 sativa/indica ratio. The strain is quite popular and has achieved recognition thanks to the stoner film of the same name. However, you have to keep in mind that the strain is not as intense as the movie has made it out to be. Pineapple Express still manages to offer a mild and nice body-numbing buzz, which is something to look forward to. The strain is offered in the form of well-weighed nuggets that look like Styrofoam popcorn. It does not taste sweet, but it does smell funky with its citrus overtones. The taste is quite extraordinary with a hint of pineapple while you inhale. Pineapple Express is chosen to treat a lot of medical problems including anxiety and stress. However, it is even more effective at curing the symptoms of chronic depression at the same time. If you are suffering from mild pains and aches, you should look no further. After a smoke, you will realize Pineapple Express is calming and stimulating at the same time. Not only will it heighten all your senses but you will feel energized all the while observing an increase in focus, awareness and creativity.",
    tags: ["DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 8,
    photoFile: "pineapple-express.jpeg",
    priceOptions: [
      { label: "14g", priceCents: 5000 },
      { label: "oz", priceCents: 9500 },
    ],
  },
  {
    name: "Pink Runtz",
    slug: "pink-runtz",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 29,
    effects: ["Euphoria", "Relaxation", "Pain"],
    description:
      'Pink Runtz is a rare evenly balanced hybrid strain (50% indica/50% sativa) created either as a phenotype of the infamous Runtz strain, a Zkittlez X Gelato cross, or as a cross of the delicious Rainbow Sherbet X Pink Panties strains. Described as a strain that will have you "talking to your forehead," this bud brings on the unfocused and giddy effects that will leave you feeling totally out of it and completely happy about it. The high starts with a rush of cerebral effects, filling you with a happy sense of high-flying euphoria that immediately pushes out any negative or racing thoughts, replacing them with heady unfocused bliss. As your mind settles into this buzzy state, a tingle will begin to spread throughout your physical form, leaving you totally relaxed and kicked back, pain-free from head to toe. In combination with its high 28-30% average THC level, these effects give Pink Runtz an edge in treating conditions such as depression, chronic stress or PTSD, mood swings, nausea or appetite loss and chronic fatigue. This bud has a sweet and fruity cherry berry flavor with a notable hint of sour candy. The aroma is very similar, although with a heavier sour overtone that intensifies as the nugs are burned away. Buds have dense spade-shaped minty green nugs with purple leaves, thin orange hairs and a thick frosty coating of tiny white crystal trichomes.',
    tags: ["NEW", "DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 9,
    photoFile: "pink-runtz.jpeg",
    priceOptions: [
      { label: "14g", priceCents: 5000 },
      { label: "oz", priceCents: 9500 },
    ],
  },

  // ── Best Sellers ──
  {
    name: "Blueberry Cupcake",
    slug: "blueberry-cupcake",
    categorySlug: "flower",
    strainType: "INDICA",
    thcPercent: 27,
    effects: ["Sleep", "Appetite", "Calm"],
    description: FALLBACK_DESCRIPTION,
    tags: [],
    featuredSection: "BEST_SELLERS",
    sortOrder: 1,
    priceOptions: [{ label: "oz", priceCents: 5000 }],
  },
  {
    name: "Purple Milky Way",
    slug: "purple-milky-way",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 26,
    effects: ["Relaxation", "Euphoria", "Pain"],
    description: FALLBACK_DESCRIPTION,
    tags: [],
    featuredSection: "BEST_SELLERS",
    sortOrder: 2,
    priceOptions: [{ label: "oz", priceCents: 6000 }],
  },
  {
    name: "Rainbow Kush",
    slug: "rainbow-kush",
    categorySlug: "flower",
    strainType: "SATIVA",
    thcPercent: 25,
    effects: ["Energy", "Focus", "Mood Boost"],
    description: FALLBACK_DESCRIPTION,
    tags: [],
    featuredSection: "BEST_SELLERS",
    sortOrder: 3,
    priceOptions: [{ label: "oz", priceCents: 7500, compareAtPriceCents: 11000 }],
  },
  {
    name: "Banana Runtz",
    slug: "banana-runtz",
    categorySlug: "flower",
    strainType: "SATIVA",
    thcPercent: 30,
    effects: ["Creativity", "Uplifting", "Social"],
    description: FALLBACK_DESCRIPTION,
    tags: [],
    featuredSection: "BEST_SELLERS",
    sortOrder: 4,
    priceOptions: [{ label: "oz", priceCents: 8500 }],
  },
  {
    name: "Blueberry Kush",
    slug: "blueberry-kush",
    categorySlug: "flower",
    strainType: "INDICA",
    thcPercent: 29,
    effects: ["Relaxation", "Euphoria", "Sleep"],
    description:
      "A pure indica (sativa/indica ratio of 0:100), Blueberry Kush is a favorite offspring of two legends, Blueberry and OG Kush. It packs massive THC contents, topping 29% in at least one publicly available test. This strain contains much lower amounts of CBD, however, much less than 1%. That's too low to recommend Blueberry Kush as treatment for seizures and other conditions that respond to CBD. But it's a good strain for treating anxiety, low mood, ADHD, migraine headaches, mood disorders, chronic pain, and nausea. The indica effects are deeply relaxing, happy, euphoric, and sleepy. That makes Blueberry Kush a great late-night strain and an effective way to treat insomnia. This strain has an earthy flavor and aroma with notes of berries and herbs. Dry mouth and dry eyes are widely reported as side effects, while dizziness, paranoia, and headaches are less likely. Popular up and down the West Coast, from Southern California to British Columbia, Blueberry Kush can also be found on the medical marijuana market in Arizona. It's also a frequent find on the black market in many parts of the United States.",
    tags: ["DEAL3OZ140", "DEAL3OZ190", "DEAL2OZ110", "DEAL2OZ140"],
    featuredSection: "BEST_SELLERS",
    sortOrder: 5,
    photoFile: "blueberry-kush.jpeg",
    priceOptions: [{ label: "oz", priceCents: 8500 }],
  },
  {
    name: "UK Cheese",
    slug: "uk-cheese",
    categorySlug: "flower",
    strainType: "INDICA",
    thcPercent: 29,
    effects: ["Euphoria", "Pain", "Stress"],
    description:
      "UK Cheese is perhaps the most famous marijuana strain to emerge from the British Isles. It is still more popular in the UK than anywhere else, although its fame has spread to many other parts of the world. English farmers created this strain by inbreeding Skunk #1, a sativa-dominant hybrid. UK Cheese itself is indica-dominant, with a sativa/indica ratio of 20:80, but the effects are balanced, delivering both a head and body high. It's a potent strain, with THC levels topping out at about 29%, and it's known to hit fast and hard. The effects are intensely euphoric, with an upbeat, happy mood, some laziness, and a dose of creativity. Best used to treat pain and stress, UK Cheese is also an effective way to alleviate insomnia and depression. CBD levels are low, less than 1%, so this isn't a good choice for patients with seizures or other disorders that respond to CBD. Cottonmouth and dry eyes are common side effects, and paranoia, headaches, and dizziness are also reported. Fittingly, this strain smells and tastes like cheese, with a pungent earthy aroma.",
    tags: ["DEAL3OZ140", "DEAL2OZ110"],
    featuredSection: "BEST_SELLERS",
    sortOrder: 6,
    photoFile: "uk-cheese.jpeg",
    priceOptions: [{ label: "oz", priceCents: 8000 }],
  },
  {
    name: "Oreoz",
    slug: "oreoz",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 29,
    effects: ["Creativity", "Relaxation", "Mood Boost"],
    description:
      'Oreo Cake, also known as "Oreos Cake," is an indica dominant hybrid strain (70% indica/30% sativa) created through crossing the delicious Sunset Sherbet X Cookies N Cream strains. Oreo Cake packs a sweet and sugary creamy chocolate cookie flavor with hints of fresh vanilla, almost like a cake topped with Oreo Cookies. The aroma is very similar, with a creamy vanilla cake overtone accented by hints of spicy chocolate and sweet flowers. The high will hit you quickly, taking on a surprisingly bright and energetic onset within your mind. You\'ll feel lifted and happy with a burst of creativity that activates your brain and has you feeling super artistic. A relaxing physical high accompanies this happy boost, keeping you anchored in reality. Combined with its high 25-29% average THC level, these calming effects give Oreo Cake an edge in treating a variety of conditions including chronic fatigue, depression, chronic pain and chronic stress or anxiety. This bud has long, pepper-shaped forest green nugs with furry, thin orange hairs and a frosty coating of tiny, bright white crystal trichomes.',
    tags: ["DEAL3OZ140", "DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "BEST_SELLERS",
    sortOrder: 7,
    photoFile: "oreoz.jpeg",
    priceOptions: [{ label: "oz", priceCents: 8000 }],
  },
  {
    name: "Mars OG",
    slug: "mars-og",
    categorySlug: "flower",
    strainType: "INDICA",
    thcPercent: 28,
    effects: ["Relaxation", "Sleep", "Stress"],
    description:
      "Mars OG is a strong and relaxing medicinal marijuana strain that is produced by crossing Mars and OG. The Indica variety is dominant in this strain. The plant produces several buds that are green in color with traces of orange. It has a mild to medium high THC level and a CBD content around 0.09% to 0.6%. It has a pungent aroma and flavor with hints of grape and earthy flavors. It feels quite good to smoke and has a very relaxing effect on your system. The prominent effect of Mars OG is that it makes you incredibly lazy \u2014 you don't feel like doing anything once you smoke it. In addition to that, it makes you euphoric, sleepy, uplifted and happy. This strain is excellent for treating insomnia; you soon fall asleep after smoking it and sleep for quite a long time. It is also useful for treating stress and anxiety of different types and is helpful in alleviating symptoms of depression. You can also use it to treat mild to chronic pains, but it is most appropriate for resolving insomnia issues. It can also be employed for treating loss of appetite as it stimulates hunger.",
    tags: ["DEAL3OZ140", "DEAL2OZ110"],
    featuredSection: "BEST_SELLERS",
    sortOrder: 8,
    photoFile: "mars-og.jpeg",
    priceOptions: [{ label: "oz", priceCents: 7000 }],
  },
  {
    name: "Rainbow Sherbet",
    slug: "rainbow-sherbet",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 29,
    effects: ["Creativity", "Relaxation", "Pain"],
    description:
      "Rainbow Sherbet is an insanely delicious evenly balanced hybrid (50% indica/50% sativa) strain created through crossing the mouthwatering Champagne X Blackberry strains. If you're in the market for a great tasting bud and well-balanced effects, Rainbow Sherbet is it! This bud has a sweet berry fruity flavor that has a sugary exhale with a kick of fresh mint to it. The aroma is very earthy and fruity with a sweet berry overtone accented by fresh mint. The high hits you almost immediately after your first exhale with a mental rush of cerebral energy that lifts your spirits and infuses you with a sense of creativity with a touch of focus. As your mind brightens, your body will drop off into a state of deep relaxation that quickly turns into a heavy body stone. In combination with its high 28-29% average THC level, these potent effects give Rainbow Sherbet an edge in treating conditions such as chronic pain, arthritis, spinal cord injury, anxiety, and nausea. This bud has lemon-shaped forest green nugs with thin orange hairs and a thick frosty coating of tiny amber colored crystal trichomes.",
    tags: ["DEAL3OZ140", "DEAL2OZ110"],
    featuredSection: "BEST_SELLERS",
    sortOrder: 9,
    photoFile: "rainbow-sherbet.jpeg",
    priceOptions: [{ label: "oz", priceCents: 8000 }],
  },
  {
    name: "Platinum Cookie",
    slug: "platinum-cookie",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 29,
    effects: ["Euphoria", "Relaxation", "Happy"],
    description:
      "Platinum Cookies, also known as \u201cPlatinum GSC\u201d or \u201cPlatinum Girl Scout Cookies,\u201d is an evenly balanced hybrid (50% indica/50% sativa) strain created through crossing the classic OG Kush X Durban Poison strains. This bud gets its name from its crazy frosty appearance and sweet cookie kush flavor. Platinum Cookies buds have dense dark olive green nugs with dark amber hairs and a super thick coating of tiny bright white crystal trichomes that cover each and every inch of the nugs. The aroma of Platinum Cookies is a lot like the flavor, although it does take on a heavy musky effect that's pretty fragrant and pungent. The Platinum Cookies high is every bit as enjoyable as the classic GSC high but with amplified effects. It starts with a euphoric boost that lifts your spirits and leaves you feeling happy and completely at ease. As your mind soars through bliss, your body will fall victim to a tingly body buzz that leaves you utterly relaxed and completely at ease. Because of these effects and its powerful 29% average THC level, Platinum Cookies is often chosen by patients who need sweet relief from conditions such as chronic anxiety or stress, nausea, and migraines or tension headaches.",
    tags: ["NEW"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 10,
    photoFile: "platinum-cookie.jpeg",
    priceOptions: [{ label: "28g", priceCents: 9000 }],
  },
  {
    name: "Lemon Punch",
    slug: "lemon-punch",
    categorySlug: "flower",
    strainType: "HYBRID",
    thcPercent: 29,
    effects: ["Energizing", "Focus", "Relaxation"],
    description:
      "Lemon Punch is an evenly balanced hybrid strain (50% indica/50% sativa) created through crossing the powerful Purple Punch X Lemon G strains. Searching for a true one-two punch of full-bodied effects for a lazy afternoon? Lemon Punch is made for you. This bud packs hard-hitting effects that that will activate the mind while relaxing the body, all wrapped up in a tongue-tingling toke. The high hits your head almost as soon as you exhale, smashing into your brain with energizing and focused effects that get your mental gears turning and have you hopping on any mental task with ease. As your mind activates and expands, a soothing body high will creep into your limbs and back, pulling you down into a heavily couch-locked state of pure relaxation and bliss. In combination with its super high 29% average THC level, these effects make Lemon Punch a great choice for treating conditions such as chronic fatigue, depression, chronic stress, ADD or ADHD and headaches or migraines. This bud has a sweet and sour lemony citrus flavor with a light touch of fruity grapes, too. The aroma is very similar, with a sharply sour lemony overtone accented by earthy herbs and a touch of spicy grapes. Lemon Punch buds have long finger-shaped bright neon green nugs with lots of thin orange hairs and a coating of tiny golden crystal trichomes.",
    tags: ["NEW"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 11,
    photoFile: "lemon-punch.jpeg",
    priceOptions: [
      { label: "14g", priceCents: 5000 },
      { label: "28g", priceCents: 9000 },
    ],
  },
  {
    // Included in the $190 3oz deal — pricing/description are placeholders pending
    // real details from the client; update via the admin panel once confirmed.
    name: "Sour Grape",
    slug: "sour-grape",
    categorySlug: "flower",
    strainType: "HYBRID",
    effects: ["Relaxation", "Euphoria", "Focus"],
    description: FALLBACK_DESCRIPTION,
    tags: ["DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "BEST_SELLERS",
    sortOrder: 10,
    priceOptions: [{ label: "oz", priceCents: 8000 }],
  },
  {
    // Included in the $190 3oz deal — pricing/description are placeholders pending
    // real details from the client; update via the admin panel once confirmed.
    name: "Gorilla",
    slug: "gorilla",
    categorySlug: "flower",
    strainType: "INDICA",
    effects: ["Relaxation", "Sleep", "Pain"],
    description: FALLBACK_DESCRIPTION,
    tags: ["DEAL3OZ190", "DEAL2OZ140"],
    featuredSection: "BEST_SELLERS",
    sortOrder: 11,
    priceOptions: [{ label: "oz", priceCents: 8000 }],
  },
  {
    // 3.5g pricing per client. No strain type / THC% — this is hash, not a flower strain.
    name: "Hash",
    slug: "hash",
    categorySlug: "flower",
    strainType: "NA",
    effects: [],
    description: FALLBACK_DESCRIPTION,
    tags: ["NEW"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 12,
    photoFile: "hash.jpeg",
    priceOptions: [{ label: "3.5g", priceCents: 3700 }],
  },
  {
    // Rolling papers — not a strain, no THC/effects apply.
    name: "Raw Paper",
    slug: "raw-paper",
    categorySlug: "accessories",
    strainType: "NA",
    effects: [],
    description: "RAW rolling papers.",
    tags: ["NEW"],
    featuredSection: "NEW_ARRIVALS",
    sortOrder: 13,
    photoFile: "raw-paper.jpeg",
    priceOptions: [{ label: "pack", priceCents: 300 }],
  },
];
