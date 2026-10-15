# ชุด Prompt ภาพ — Dashboard 12 Plus+ สินค้าอัตลักษณ์หนองบัวลำภู

ใช้กับ Gemini / Imagen, Midjourney, Flow, ChatGPT Image ได้ทุกตัว · เขียน prompt เป็นภาษาอังกฤษเพราะได้ภาพแม่นกว่า · ข้อความภาษาไทยบนภาพ ให้ใส่ทีหลังใน Canva (AI สะกดไทยเพี้ยน)

---

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
