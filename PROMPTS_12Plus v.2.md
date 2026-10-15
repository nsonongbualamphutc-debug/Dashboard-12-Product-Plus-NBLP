# ชุด Prompt ภาพ v2 — สากลผสมหนองบัวลำภู (Modern Lotus–Karst)

> v2 เลิกใช้กรอบลายไทย/กนกทอง เปลี่ยนเป็นงานแบบแบรนด์สากล (คล้ายแบรนด์ specialty food / craft ระดับโลก) แล้วใส่ความเป็นหนองบัวลำภูผ่าน **สัญลักษณ์ 3 อย่าง**:
> 1. **ภู** — เขาหินปูนยอดแหลม (karst) เป็นเงาเรียบ ๆ ไม่ใช่ภาพวิวเต็ม
> 2. **หนองบัว** — ดอกบัวแบบเรขาคณิต และผิวน้ำนิ่ง
> 3. **ลายผ้าฉนวน** — เป็นลายกราฟิกเส้นซิกแซก/ข้าวหลามตัด ใช้เป็นแถบเล็ก ๆ เท่านั้น
>
> ในแดชบอร์ด **ตราสินค้า (Badge) และแบนเนอร์ร้านค้า สร้างด้วยโค้ด (SVG) แล้ว** ไม่ต้องเจนภาพมาแทน ส่วน prompt ตรา/แบนเนอร์ด้านล่างไว้ใช้ทำสื่อพิมพ์ โพสต์ หรือป้ายจริง

## โทนสีแบรนด์
| ชื่อ | HEX | ใช้กับ |
|---|---|---|
| Forest Emerald | #0F4A37 | สีหลัก แถบเมนู ตัวอักษร |
| Lotus Pink | #C2386F | จุดเน้น ดอกบัว |
| Harvest Gold | #B1832A | เส้น/ตัวเลข เน้นพรีเมียม |
| Limestone Cream | #FBF7EE | พื้นหลัง ป้ายฉลาก |

สีประจำสินค้า (ใช้เป็นพื้นหลังสตูดิโอ/ตรา):
ข้าว #3F8A3A · อ้อย #7E9A1E · กระบือ #4D5A66 · โคเนื้อ #9C3F27 · ไก่ #C2671B · ปลา #22789B · เห็ด #8A6440 · ผักหวาน #2C8A57 · กล้วย #C49A12 · ขิดสลับหมี่ #B92C75 · ว่านอุษาลำภู #C8344F · กาแฟ #7A4528 · ผ้าฉนวน #4A5878 · คล้า #9A7130

## Style DNA v2 — แปะต่อท้ายทุก prompt
```
modern premium product key visual, international editorial still-life photography, clean minimal composition, solid color seamless backdrop with a soft gradient, product placed on a smooth limestone plinth, a subtle flat silhouette of pointed limestone karst peaks cut into the backdrop as an arch, soft directional daylight with long gentle shadows, a single stylized lotus or calm water reflection as accent, refined, airy, generous negative space, 8k, no text, no logo, no Thai ornamental patterns, no gold filigree
```
**Negative:** `ornate frame, kanok pattern, gold filigree, temple, cluttered table, busy background, cartoon, text, watermark, oversaturated`

---

## A. แบนเนอร์สินค้า (Key Visual) — 21:9 สำหรับส่วนหัวหน้าสินค้า / 16:9 สำหรับสไลด์

แทน `[COLOR]` ด้วย HEX สินค้า · เว้นพื้นที่ว่างด้านซ้ายไว้วางชื่อสินค้า
```
[PRODUCT SCENE], on a cream limestone plinth, [COLOR] seamless backdrop with a karst-peak arch cutout revealing soft morning mist, composition: product on the right third, empty negative space on the left half for headline, [Style DNA v2]
```
| # | [PRODUCT SCENE] |
|---|---|
| 01 ข้าวหอมมรกต | a minimal ceramic bowl of glossy fragrant rice, a kraft rice pouch with blank label, two golden rice stalks laid diagonally |
| 02 อ้อย | three clean-cut sugarcane stalks standing upright, a tall glass of fresh cane juice, cubes of golden cane sugar on a small stone dish |
| 03 กระบือ | a sculptural close portrait of a Thai swamp buffalo head with sweeping horns emerging from soft shadow, a single lotus floating on still water in front |
| 04 โคเนื้อ | a perfectly marbled ribeye on a dark slate board, coarse salt and a sprig of herbs, minimal knife |
| 05 ไก่พื้นเมือง | golden grilled native chicken on a modern ceramic plate, a small basket of sticky rice, chili dip in a tiny bowl |
| 06 ปลาน้ำจืด | a fresh whole tilapia on crushed ice in a stone tray, a jar of pla som, lime and lemongrass |
| 07 เห็ด | an arrangement of oyster, grey phoenix and split-gill mushrooms in a sculptural cluster, a small glass jar of mushroom chili paste |
| 08 ผักหวานป่า | a neat bundle of bright green wild sweet leaf shoots tied with twine, dew drops, a clear glass bowl of clear soup |
| 09 กล้วย | a single perfect bunch of Namwa bananas, a stack of sun-dried bananas in a kraft box |
| 10 ผ้าขิดสลับหมี่ | a folded magenta khit-mudmee silk fabric with sculptural drape, a skein of natural-dyed silk thread |
| 11 ว่านอุษาลำภู | a single pink-red curcuma flower in a minimal matte ceramic pot, two rhizome bulbs beside it |
| 12 กาแฟภูซาง | a modern glass pour-over brewer, a cup of black coffee, scattered roasted beans and a few red coffee cherries |
| 13 ผ้าฉนวนลุ่มภู | a crisp folded stack of indigo-grey handwoven fabric with geometric pattern, a minimal tote bag made of the same fabric |
| 14 คล้า | a modern woven khla reed tote bag and a small round basket, glossy natural fibers, a linen scarf |

## B. ตราสินค้า (Badge) แบบสากล — 1:1 พื้นหลังใส
```
Minimal modern circular brand badge, flat vector, two concentric circles, outer ring in [COLOR] with empty space for curved text, inner cream circle with a simple single-weight line icon of [ICON], tiny lotus-and-karst-peak mark at the top, Scandinavian-meets-Thai design, clean geometric, isolated on transparent background, no text, no ornament
```
[ICON] เช่น `a rice stalk`, `two sugarcane stalks`, `a buffalo head with curved horns`, `a T-bone steak`, `a rooster`, `a fish`, `a mushroom`, `a leafy sprig`, `a banana bunch`, `a diamond weave pattern`, `a curcuma flower`, `a coffee bean`, `a stack of folded fabric`, `a woven basket`
> ข้อความวงรอบ (NONG BUA LAM PHU · LOCAL IDENTITY · 12 PLUS+) และชื่อไทย ใส่ใน Canva/Illustrator เอง

## C. โลโก้มาร์ก "บัว–ภู" (มาร์กของ 12 Plus+)
```
Minimal geometric logo mark: a lotus flower of three petals where the center petal is shaped like a pointed limestone karst peak, two gentle wave lines below representing a pond, flat vector, emerald green and lotus pink on cream, balanced, modern, works at small size, no text
```

## D. แบนเนอร์ร้านค้า — 3:1 (หัวการ์ดร้าน / ป้ายหน้าร้าน / ปก Facebook)
```
Wide banner of a modern Thai community concept store, cream limestone-textured wall with a karst-peak arch doorway, light oak shelves neatly displaying [PRODUCT] products in minimal kraft packaging, a potted lotus, warm natural daylight, calm and premium, large empty wall area on the left for shop name, 3:1, [Style DNA v2]
```
**แบบ flat-lay (ใช้กับร้านออนไลน์):**
```
Top-down flat lay of [PRODUCT] products on [COLOR] paper background, arranged in a clean grid with a cut-paper karst peak shape and a paper lotus, soft shadows, empty space on the left third, 3:1
```

## E. แพ็กเกจจิ้ง (ให้ผู้ประกอบการใช้ต่อ)
```
Product packaging mockup for [PRODUCT]: matte kraft stand-up pouch / box with a minimal cream label, a small [COLOR] band at the bottom with a thin zigzag weave line, a small lotus-karst emblem, studio lighting on limestone surface, front 3/4 view, no readable text
```

## F. โพสต์โซเชียล 4:5 (ขายของ)
```
Vertical 4:5 social media product poster for [PRODUCT], hero product centered on a limestone plinth, [COLOR] backdrop with karst-peak arch, a thin cream frame line inset, empty space at top for headline and at bottom for price, [Style DNA v2]
```

## G. วิดีโอสั้นหน้าสินค้า (Veo/Flow) 6 วิ
```
Slow orbit camera move around [PRODUCT SCENE] on a limestone plinth, [COLOR] backdrop with karst arch, a light breeze moves mist through the arch, soft shadow shifts, premium commercial look, 6 seconds, no text
```

---

## วิธีใส่ภาพเข้าแดชบอร์ด
- ภาพ **A** (16:9) = พื้นหลังส่วนหัวสินค้า + การ์ดเชลฟ์ · ภาพ **B** = รูปในกรอบขาวด้านขวา (ระบบครอปเป็น 3:4 ให้เอง วางของไว้กลางภาพ)
- ถ้าทำ Key Visual v2 (หมวด A ด้านบน) ส่งมาแทนภาพ A ได้เลย ตั้งชื่อ `A 01 ข้าวหอมมรกต.png` เหมือนเดิม

---

# ภาคผนวก — ชุด Prompt v1 (ฉากธรรมชาติ golden hour ที่ใช้ทำภาพประกอบ v.1 อยู่ตอนนี้)

## 0. สไตล์หลัก (Style DNA) — แปะต่อท้ายทุก prompt

```
photorealistic commercial product photography, golden hour warm sunlight from the back-left, soft morning mist over limestone karst mountains of Nong Bua Lam Phu northeast Thailand in the distance, lush green rice fields, rustic dark teak wooden table in foreground, woven bamboo baskets and banana leaves as props, shallow depth of field, rich but natural colors, high detail texture, premium Thai local product advertising, 8k, no text, no watermark, no logo
```

**Negative prompt** (ถ้าเครื่องมือรองรับ):
```
text, letters, watermark, logo, cartoon, illustration, plastic look, oversaturated, extra fingers, deformed animals, blurry foreground, cluttered, modern city, people faces
```

## ขนาดภาพตามช่องในแดชบอร์ด

| ช่อง | อัตราส่วน | ใช้ทำอะไร |
|---|---|---|
| Showcase พื้นหลังสินค้า | 16:9 (1920×1080) | ภาพจาง ๆ หลังข้อความ ต้องเว้นพื้นที่ว่างด้านซ้าย |
| กรอบสินค้า (ขวา) / Tile เชลฟ์ | 3:4 (1200×1600) | ภาพเด่นสินค้า วางของกลางภาพ |
| ตราสินค้า (Badge) | 1:1 พื้นหลังใส | วงกลมทองในเชลฟ์ซ้าย |
| Banner ร้านค้า | 3:1 (1500×500) | หัวการ์ดร้านค้า |
| Hero หน้าภาพรวม | 16:9 หรือ 3:4 | รวมสินค้าทั้ง 14 อย่าง |

> เคล็ดลับ: สำหรับพื้นหลัง Showcase ให้เติม `composition with empty negative space on the left half, product cluster on the right third` จะวางข้อความได้สวยโดยไม่บังสินค้า

---

## 1. พื้นหลังและภาพรวม

**1.1 Hero หน้าภาพรวม (รวม 14 สินค้า)**
```
A grand abundant harvest display on a long rustic teak table overlooking misty limestone mountains and a lotus pond at sunrise, featuring emerald fragrant rice in baskets, fresh sugarcane, ripe bananas, coffee cherries and roasted beans, wild sweet leaf bundles, assorted mushrooms, pink-red curcuma flowers in clay pots, freshwater fish on banana leaf, grilled native chicken, premium marbled beef, a Thai swamp buffalo and native cattle grazing in background, folded handwoven silk fabrics in magenta and indigo-grey, woven khla basketry bags, composition with empty sky at top for title, [Style DNA]
```

**1.2 พื้นหลังแดชบอร์ด (ลายจาง ไม่แย่งสายตา)**
```
Extremely soft, low-contrast background of misty limestone karst mountains and rice terraces at dawn, pale sage green and ivory tones, heavy atmospheric haze, minimal detail, large empty areas, suitable as a subtle website background, 16:9, no text
```

**1.3 ลายผ้าสำหรับแถบเมนู (Texture)**
```
Seamless tileable texture of Thai handwoven ikat silk pattern, deep emerald green and antique gold threads, subtle, flat top-down macro, even lighting, no shadows, 1:1
```

**1.4 กรอบตราทอง (Badge เปล่า สำหรับใส่ภาพสินค้าเอง)**
```
Ornate circular golden emblem frame with Thai kanok floral scrollwork, rice ears and lotus motifs, emerald green inner ring, empty center, glossy 3D metallic, isolated on transparent background, front view, 1:1
```

---

## 2. Prompt สินค้าราย Product (ภาพหลัก 3:4)

แต่ละสินค้ามี 2 แบบ — **A: ภาพหลัก (Hero)** และ **B: ภาพขายของ (Lifestyle)** ใช้ในหน้า Showcase/โพสต์ขาย

### 01 ข้าวหอมมรกต
- **A** `Premium Thai fragrant rice: a woven bamboo basket overflowing with glossy slender white rice grains, a smaller basket of pale green unmilled young rice, golden rice ear bundles tied with string, a wooden scoop spilling grains, a white frangipani flower, ripe rice field and misty karst mountains behind, [Style DNA]`
- **B** `Steaming bowl of perfectly cooked fragrant jasmine rice in a celadon bowl, vacuum-sealed kraft rice pack beside it (blank label), rice field at golden hour behind, [Style DNA]`

### 02 อ้อย
- **A** `Freshly cut sugarcane stalks stacked on a rustic table, cross-sections showing juicy fibers, tall glass of fresh cold sugarcane juice with condensation, blocks of natural golden cane sugar in a banana-leaf tray, sugarcane plantation and mountains behind, [Style DNA]`
- **B** `Thai farmer's hands holding cleanly cut green-harvested sugarcane, no burning, clear blue sky over fields, [Style DNA]`

### 03 กระบือ
- **A** `Majestic dark grey Thai swamp buffalo with long curved horns standing proudly in a lush green pasture beside a wooden fence, flower garland around its neck, water pond and misty limestone mountains behind, golden hour rim light, [Style DNA]`
- **B** `Thai buffalo beauty contest scene, decorated buffalo with colorful cloth, rural festival bunting, soft bokeh crowd, [Style DNA]`

### 04 โคเนื้อ
- **A** `Premium marbled beef cuts on a dark wooden butcher board with rosemary and coarse salt, Brahman-cross cattle grazing in green pasture behind a bamboo fence, misty mountains, [Style DNA]`
- **B** `Thai-style sun-dried beef (nuea daet diao) on a woven bamboo tray, sticky rice basket and chili dip, [Style DNA]`

### 05 ไก่พื้นเมือง
- **A** `Golden crispy Isan grilled native chicken on bamboo skewers on banana leaf, sticky rice in a woven kratip basket, a proud black-tailed Pradu Hang Dam rooster standing on a wooden post behind, free-range farm and mountains, [Style DNA]`
- **B** `Free-range native Thai chickens foraging in a sunlit yard under trees, rustic coop, [Style DNA]`

### 06 ปลาน้ำจืด
- **A** `Fresh freshwater fish (tilapia, catfish, silver barb) glistening on banana leaves, a clay jar of pla som fermented fish, sun-dried fish on a bamboo rack, a fisherman casting a net from a small wooden boat on a calm misty reservoir at sunrise, [Style DNA]`
- **B** `Vacuum-packed fermented fish product with blank label beside fried crispy pla som and fresh herbs, [Style DNA]`

### 07 เห็ด
- **A** `Abundant fresh mushrooms — oyster, grey phoenix, white split-gill, straw mushrooms — piled in bamboo baskets, mushroom cultivation bags on wooden shelves in a rustic thatched mushroom house behind, morning light rays, [Style DNA]`
- **B** `Jars of spicy mushroom chili paste and crispy sweet mushroom snack in clear packs (blank labels), fresh mushrooms around, [Style DNA]`

### 08 ผักหวานป่า
- **A** `Bundles of tender bright green wild sweet leaf shoots (Melientha suavis) on a woven bamboo tray, morning dew drops, dry deciduous dipterocarp forest with sunbeams and misty mountains behind, [Style DNA]`
- **B** `Thai red ant egg and sweet leaf soup in a clay pot, steam rising, rustic kitchen table, [Style DNA]`

### 09 กล้วย
- **A** `Bunches of ripe golden Namwa bananas, trays of sun-dried banana and crispy banana chips, banana leaves and a banana blossom, banana plantation and mountains behind, [Style DNA]`
- **B** `Solar-dried bananas in a greenhouse dryer, neat rows on mesh racks, warm light, [Style DNA]`

### 10 ผ้าขิดสลับหมี่
- **A** `Luxurious handwoven Thai silk with alternating khit supplementary-weft and mudmee ikat bands in vivid magenta and gold, draped elegantly over a wooden loom bench, skeins of naturally dyed silk thread, red ginger flowers, karst mountains behind, [Style DNA]`
- **B** `Close-up of weaver's hands working at a traditional wooden loom with magenta silk, soft window light, [Style DNA]`

### 11 ว่านอุษาลำภู (กระเจียว)
- **A** `Stunning pink-red curcuma (siam tulip) flowers blooming in terracotta pots on a rustic table, fresh green leaves, rhizome bulbs in a small basket, rainy-season lush garden with mist and mountains behind, soft diffused light, [Style DNA]`
- **B** `Potted curcuma flower as an elegant gift with kraft paper wrap and twine, resort terrace setting, [Style DNA]`

### 12 กาแฟภูซาง
- **A** `Ripe red coffee cherries on branches and in a basket, roasted coffee beans in a burlap sack, a ceramic cup of black coffee with rising steam, green coffee plantation on misty highland slopes behind, [Style DNA]`
- **B** `Hand drip coffee being poured at a wooden village cafe counter, kraft coffee bag (blank label), [Style DNA]`

### 13 ผ้าฉนวนลุ่มภู
- **A** `Elegant handwoven cotton textile in indigo-grey and silver geometric pattern draped over a rattan chair, folded fabric stack tied with ribbon, small handmade bag and scarf from the same fabric, jasmine flowers, misty mountains behind, [Style DNA]`
- **B** `Thai woman's tailored modern blouse made of indigo-grey handwoven textile on a mannequin in a boutique, warm light, faceless, [Style DNA]`

### 14 คล้า (จักสาน)
- **A** `Handwoven khla reed basketry — glossy natural tan tote bags, sticky-rice kratip baskets, round trays and a mat — arranged on a wooden porch, bundles of split khla strips, wetland reeds and mountains behind, [Style DNA]`
- **B** `Fashionable woven khla handbag styled with linen dress and sunglasses on a cafe table, lifestyle editorial, [Style DNA]`

---

## 3. Prompt ตราสินค้า (Badge) ต่อสินค้า

แทน `[SUBJECT]` ด้วยชื่อสินค้าภาษาอังกฤษจากหัวข้อ 2
```
Circular ornate golden badge emblem, Thai kanok scroll frame with lotus and rice motifs, inside a miniature photorealistic scene of [SUBJECT] with misty limestone mountains, a blank curved ribbon banner at the bottom for text, glossy 3D, isolated on transparent background, 1:1, no text
```
จากนั้นใส่ชื่อไทยบนริบบิ้นใน Canva ด้วยฟอนต์ Chonburi สีทอง ขอบเขียวเข้ม

## 4. Banner ร้านค้า (3:1)
```
Wide banner of a cozy Thai community shop front with wooden shelves of [SUBJECT] products, warm lights, potted plants, soft focus, empty space on left for shop name, 3:1, [Style DNA]
```

## 5. วิดีโอสั้นสำหรับหน้า Showcase (Flow / Veo / Kling)
```
Slow cinematic dolly-in toward [SUBJECT] on a rustic teak table at golden hour, morning mist drifting over limestone mountains behind, gentle steam/dew/leaf movement, light rays, 6 seconds, photorealistic, no text
```

---

## วิธีใส่ภาพเข้าแดชบอร์ด
1. ตั้งชื่อไฟล์ `bg{เลข}.webp`, `badge{เลข}.png` ตามลำดับในไฟล์ PDF (1 ข้าว … 14 คล้า)
2. ย่อภาพหลักกว้าง ~1000px แปลงเป็น WebP คุณภาพ 70 จะเหลือไฟล์ละ ~100–150 KB
3. ส่งไฟล์มาให้ผม แล้วผมจะเปลี่ยนแทนรูปเดิมในชุด `IMG` ให้
