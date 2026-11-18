#!/usr/bin/env python3
"""Genera assets/ibiza-map.jpg: mappa illustrata di Ibiza (stile poster) con contorno OpenStreetMap e altitudini Copernicus DEM.
Uso: python3 tools/make_map.py   (richiede numpy, scipy, pillow)"""
import json, math, os, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
MODE = sys.argv[1] if len(sys.argv) > 1 else 'day'
NIGHT = MODE == 'night'
LNG0, LNG1, LAT0, LAT1 = 1.14, 1.69, 38.58, 39.38
W = 3200
H = round(W * ((LAT1 - LAT0) * 111.2) / ((LNG1 - LNG0) * 86.5))
OUT_W = 2000
KM_PX = (LNG1 - LNG0) * 86.5 / W
random.seed(7); rng = np.random.default_rng(7)

def px(lng, lat): return ((lng - LNG0) / (LNG1 - LNG0) * W, (LAT1 - lat) / (LAT1 - LAT0) * H)
def smooth(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def chaikin(p, n=3):
    for _ in range(n):
        q = []
        for i in range(len(p)):
            a, b = p[i], p[(i + 1) % len(p)]
            q += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        p = q
    return p

outline = json.load(open(os.path.join(HERE, 'ibiza_outline.json')))
outline = chaikin([tuple(p) for p in outline], 3)
poly = [px(*p) for p in outline]

def raster_mask(polys, ellipses=()):
    im = Image.new('L', (W * 2, H * 2), 0); d = ImageDraw.Draw(im)
    for pl in polys: d.polygon([(x * 2, y * 2) for x, y in pl], fill=255)
    for (cx, cy, rx, ry) in ellipses: d.ellipse([(cx - rx) * 2, (cy - ry) * 2, (cx + rx) * 2, (cy + ry) * 2], fill=255)
    return np.asarray(im.resize((W, H), Image.LANCZOS), dtype=np.float32) / 255

# Es Vedrà (isolotto, 382 m): non è nel contorno dell'isola principale
vx, vy = px(1.1963, 38.8636)
mask = raster_mask([poly], [(vx, vy, 0.42 / KM_PX / 1.0, 0.42 / KM_PX)])
land_b = mask > 0.5

# --- DEM ---
land = json.load(open(os.path.join(HERE, 'ibiza_relief60.json')))
H0 = np.zeros((40, 60), np.float32)
for j, i, e in land: H0[j, i] = e
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
lng = LNG0 + xx / W * (LNG1 - LNG0); lat = LAT1 - yy / H * (LAT1 - LAT0)
fi = (lng - 1.19) / 0.45 * 59; fj = (39.14 - lat) / 0.33 * 39
dem = ndi.map_coordinates(H0, [fj, fi], order=3, mode='constant', cval=0, prefilter=False).astype(np.float32)
dem = ndi.gaussian_filter(dem, 22)
dem = np.clip(dem, 0, None)
taper = smooth(0.5, 0.92, ndi.gaussian_filter(land_b.astype(np.float32), 70))
def noise(sig, seed):
    r = np.random.default_rng(seed).standard_normal((H // 4 + 1, W // 4 + 1)).astype(np.float32)
    r = ndi.gaussian_filter(r, sig / 4); r = ndi.zoom(r, 4, order=1)[:H, :W]; return r / (r.std() + 1e-6)
gate = smooth(4, 70, dem)
dem = dem + gate * (noise(60, 1) * 26 + noise(26, 2) * 12 + noise(11, 3) * 5)
dem = np.clip(dem, 0, None) * taper
dem = np.where(land_b, np.maximum(dem, 7 + 3 * noise(30, 9)), dem)
# Es Vedrà alto e ripido
ved = np.clip(1 - np.hypot(xx - vx, yy - vy) / (0.42 / KM_PX), 0, 1)
dem = np.maximum(dem, 382 * ved ** 0.6 * (ved > 0))
dem = ndi.gaussian_filter(dem, 3)

# --- MARE ---
sea_d = ndi.distance_transform_edt(~land_b).astype(np.float32) * KM_PX
sea_d = ndi.gaussian_filter(sea_d, 2)
stops_d = [0, 0.06, 0.4, 1.2, 3.0, 7.0, 14.0]
sea_cols = np.array([(240, 253, 250), (205, 248, 242), (130, 232, 222), (92, 212, 224), (70, 190, 224), (58, 166, 212), (50, 146, 200)], np.float32)
if NIGHT: sea_cols = np.array([(150, 240, 232), (52, 190, 200), (20, 128, 168), (11, 82, 132), (8, 52, 100), (6, 34, 74), (4, 22, 54)], np.float32)
sea = np.stack([np.interp(sea_d, stops_d, sea_cols[:, c]) for c in range(3)], -1)
sea *= (0.992 + 0.016 * noise(40, 4))[..., None]
# onde concentriche
ripple = np.zeros((H, W), np.float32)
rn = 0.55 + 0.45 * smooth(-0.6, 0.6, noise(30, 5))
for k, r in enumerate([0.5, 1.05, 1.75, 2.7, 3.9, 5.4, 7.2]):
    w = (0.035 + 0.012 * k) / 1.0
    ripple = np.maximum(ripple, np.exp(-(((sea_d - r) / w) ** 2)) * (0.62 - 0.065 * k) * rn)
sea = sea + ((np.array([150, 225, 245], np.float32) if NIGHT else 255) - sea) * (ripple * (0.55 if NIGHT else 1))[..., None]

# --- TERRA ---
stops_e = [0, 8, 45, 100, 170, 260, 360, 440]
land_cols = np.array([(246, 236, 206), (232, 226, 170), (208, 222, 150), (176, 208, 124), (138, 186, 110), (106, 162, 96), (92, 140, 88), (196, 184, 150)], np.float32)
if NIGHT: land_cols = np.array([(26, 46, 58), (30, 58, 62), (34, 72, 62), (38, 82, 64), (42, 90, 68), (50, 98, 74), (60, 106, 82), (86, 96, 96)], np.float32)
ln = np.stack([np.interp(dem, stops_e, land_cols[:, c]) for c in range(3)], -1)
# macchie di campi
patch = smooth(-0.3, 0.7, noise(90, 6))
ln = ln * (1 - 0.10 * patch[..., None]) + np.array([236, 214, 150], np.float32) * (0.10 * patch[..., None]) * (dem < 140)[..., None]
# ombreggiatura
gy, gx = np.gradient(dem * 3.2 / (KM_PX * 1000))
nz = 1 / np.sqrt(gx ** 2 + gy ** 2 + 1); nx = -gx * nz; ny = gy * nz
az, alt = math.radians(315), math.radians(42)
lx, ly, lz = math.cos(alt) * math.sin(az), math.cos(alt) * math.cos(az), math.sin(alt)
sh = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
sh = (sh - np.mean(sh[land_b])) * 1.5
ln = ln * (1 + (0.45 if NIGHT else 0.62) * sh)[..., None]
cool = np.clip(-sh, 0, 1)[..., None] * (0.45 if NIGHT else 0.38)
ln = ln * (1 - cool) + np.array([84, 112, 150], np.float32) * cool
# curve di livello
g = np.hypot(gx, gy) / 3.2 * (KM_PX * 1000) + 1e-3  # m/px
for step, wpx, a, col in [(40, 1.5, 0.30, (96, 124, 74)), (200, 2.6, 0.45, (78, 104, 60))]:
    dist_px = np.abs(((dem + step / 2) % step) - step / 2) / g
    line = np.exp(-(dist_px / wpx) ** 2) * smooth(10, 24, dem) * a
    ln = ln * (1 - line[..., None]) + np.array(col, np.float32) * line[..., None]
# spiaggia / bordo costiero
inner = ndi.distance_transform_edt(land_b).astype(np.float32)
beach = (1 - smooth(5, 15, inner)) * 0.85
ln = ln * (1 - beach[..., None]) + np.array([96, 150, 156] if NIGHT else [252, 243, 214], np.float32) * beach[..., None]
edge = np.exp(-((inner - 1.2) / 2.0) ** 2) * 0.55
ln = ln * (1 - edge[..., None]) + np.array([150, 128, 92], np.float32) * edge[..., None]

m = np.clip(mask, 0, 1)[..., None]
img = sea * (1 - m) + ln * m
canvas = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')

# --- alberi ---
trees = Image.new('RGBA', (W, H), (0, 0, 0, 0)); td = ImageDraw.Draw(trees)
dn = noise(70, 8)
cell = 34
for cy in range(0, H, cell):
    for cx in range(0, W, cell):
        x = cx + random.random() * cell; y = cy + random.random() * cell
        xi, yi = int(x), int(y)
        if xi >= W or yi >= H or not land_b[yi, xi] or inner[yi, xi] < 18: continue
        e = dem[yi, xi]
        p = smooth(35, 130, e) * (1 - smooth(380, 450, e)) * smooth(-0.5, 0.5, dn[yi, xi] + 0.35)
        if random.random() > p * 0.95: continue
        s = 7 + random.random() * 5
        sh_a = 0.65 + 0.35 * float(np.clip(sh[yi, xi] + 0.5, 0, 1))
        c = (int(36 + 16 * random.random()), int(98 + 24 * random.random()), int(58 + 12 * random.random()))
        if NIGHT: c = (int(c[0] * 0.42), int(c[1] * 0.5), int(c[2] * 0.55))
        td.polygon([(x - s * 0.55, y + s * 0.2), (x + s * 0.55, y + s * 0.2), (x, y - s * 1.35)], fill=c + (int(230 * sh_a),))
        td.polygon([(x - s * 0.45, y + s * 0.75), (x + s * 0.45, y + s * 0.75), (x, y - s * 0.55)], fill=(c[0] + 8, c[1] + 12, c[2] + 6, int(235 * sh_a)))
        td.rectangle([x - 0.8, y + s * 0.75, x + 0.8, y + s * 1.1], fill=(92, 66, 40, 220))
canvas = Image.alpha_composite(canvas, trees)

# --- saline, paesi (posizioni indicative, da verificare), luci ---
extra = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ed = ImageDraw.Draw(extra)
for (lg, lt, rx, ry) in [(1.388, 38.852, 0.9, 0.55), (1.402, 38.843, 0.7, 0.5)]:
    x, y = px(lg, lt)
    if land_b[int(y), int(x)]:
        ed.ellipse([x - rx / KM_PX, y - ry / KM_PX, x + rx / KM_PX, y + ry / KM_PX], fill=(70, 110, 120, 140) if NIGHT else (250, 226, 226, 235), outline=(255, 255, 255, 220) if not NIGHT else (150, 200, 210, 200), width=4)
TOWNS = [  # lng, lat, case, raggio km, intensità luce notte
    (1.4329, 38.9089, 150, 0.9, 1.0),   # Ibiza Town (Eivissa)
    (1.3050, 38.9800, 120, 0.8, 1.0),   # Sant Antoni
    (1.5337, 38.9843, 100, 0.7, 0.8),   # Santa Eulària
    (1.4056, 38.8846, 70, 0.55, 1.2),   # Playa d'en Bossa
    (1.5114, 39.0777, 36, 0.4, 0.5),    # Sant Joan
    (1.2944, 38.9226, 40, 0.45, 0.5),   # Sant Josep
    (1.5165, 39.1119, 26, 0.35, 0.5),   # Portinatx
    (1.3900, 38.9600, 30, 0.5, 0.25),    # Sant Rafel / interno
]
light = np.zeros((H, W), np.float32)
lg_img = Image.new('L', (W, H), 0); ld = ImageDraw.Draw(lg_img)
for (lg, lt, n, r, inten) in TOWNS:
    cx, cy = px(lg, lt)
    for _ in range(n):
        x = cx + random.gauss(0, r / KM_PX * 0.55); y = cy + random.gauss(0, r / KM_PX * 0.45)
        xi, yi = int(x), int(y)
        if not (0 <= xi < W and 0 <= yi < H) or not land_b[yi, xi] or inner[yi, xi] < 6: continue
        w_ = random.randint(9, 15); h_ = random.randint(7, 11)
        if NIGHT:
            ld.ellipse([x - 5, y - 5, x + 5, y + 5], fill=int(255 * min(1, inten * (0.5 + 0.5 * random.random()))))
        else:
            ed.rectangle([x + 3, y + 3, x + w_ + 4, y + h_ + 4], fill=(40, 60, 70, 90))
            ed.rectangle([x, y, x + w_, y + h_], fill=(252, 249, 242, 255), outline=(212, 190, 160, 255))
            if random.random() < 0.35: ed.rectangle([x, y - 3, x + w_, y + 1], fill=(206, 112, 74, 255))
if NIGHT:
    la = np.asarray(lg_img, np.float32) / 255
    glow = ndi.gaussian_filter(la, 26) * 5.0 + ndi.gaussian_filter(la, 9) * 2.2 + ndi.gaussian_filter(la, 3) * 2.4
    glow = np.clip(glow, 0, 1.4) * np.clip(m[..., 0] + 0.35, 0, 1)
    cimg = np.asarray(canvas.convert('RGB'), np.float32)
    gold = np.array([90, 226, 255], np.float32)  # luci azzurro CILEX
    cimg = cimg + gold * glow[..., None] * 0.72
    # alone turchese sulla costa
    rim = np.exp(-((sea_d - 0.12) / 0.24) ** 2) * 0.2 * (1 - m[..., 0])
    cimg = cimg + np.array([70, 230, 220], np.float32) * rim[..., None]
    canvas = Image.fromarray(np.clip(cimg, 0, 255).astype(np.uint8)).convert('RGBA')
canvas = Image.alpha_composite(canvas, extra)

# --- decorazioni mare ---
deco = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(deco)
for _ in range(1700):
    x = random.randrange(40, W - 40); y = random.randrange(40, H - 40)
    if sea_d[y, x] < 3.4 or land_b[y, x]: continue
    L = random.randint(14, 26)
    wa = 55 if NIGHT else 105
    dd.arc([x, y, x + L, y + L // 2], 200, 340, fill=(255, 255, 255, wa), width=3)
    dd.arc([x + L, y, x + 2 * L, y + L // 2], 200, 340, fill=(255, 255, 255, wa), width=3)
def boat(x, y, s=1.0, rot=0):
    if NIGHT:
        dd.ellipse([x - 22, y - 22, x + 22, y + 22], fill=(0, 219, 255, 60)); dd.ellipse([x - 11, y - 11, x + 11, y + 11], fill=(0, 219, 255, 120)); dd.ellipse([x - 6, y - 6, x + 6, y + 6], fill=(190, 247, 255, 255)); return
    dd.polygon([(x - 22 * s, y), (x + 22 * s, y), (x + 14 * s, y + 8 * s), (x - 14 * s, y + 8 * s)], fill=(250, 250, 250, 255))
    dd.polygon([(x + 1, y - 3 * s), (x + 1, y - 40 * s), (x + 20 * s, y - 3 * s)], fill=(255, 255, 255, 255))
    dd.polygon([(x - 2, y - 3 * s), (x - 2, y - 32 * s), (x - 16 * s, y - 3 * s)], fill=(238, 247, 252, 255))
    dd.line([(x, y - 3 * s), (x, y - 42 * s)], fill=(120, 140, 150, 255), width=2)
    dd.polygon([(x - 8 * s, y + 8 * s), (x + 8 * s, y + 8 * s), (x + 12 * s, y + 13 * s), (x - 12 * s, y + 13 * s)], fill=(255, 255, 255, 90))
for (lg, lt, s) in [(1.31, 38.77, 1.2), (1.56, 38.80, 1.0), (1.205, 39.14, 1.1), (1.64, 39.16, 0.9), (1.50, 38.66, 1.0), (1.30, 39.25, 0.9), (1.58, 39.27, 1.1), (1.22, 38.68, 1.0), (1.36, 38.63, 0.9), (1.66, 38.93, 1.0)]:
    x, y = px(lg, lt)
    if 0 < x < W and 0 < y < H and sea_d[int(y), int(x)] > 2.0 and not land_b[int(y), int(x)]: boat(x, y, 2.0 * s)

# riflessi del sole / luna sul mare
random.seed(11)
for _ in range(750 if not NIGHT else 380):
    x = random.randrange(60, W - 60); y = random.randrange(60, H - 60)
    if sea_d[y, x] < 0.5 or land_b[y, x]: continue
    r = random.choice([6, 8, 11, 15]) if not NIGHT else random.choice([4, 5, 7]); a = 235 if not NIGHT else 150
    col = (255, 255, 255, a) if not NIGHT else (180, 230, 255, a)
    dd.polygon([(x, y - r), (x + r * 0.22, y - r * 0.22), (x + r, y), (x + r * 0.22, y + r * 0.22), (x, y + r), (x - r * 0.22, y + r * 0.22), (x - r, y), (x - r * 0.22, y - r * 0.22)], fill=col)
canvas = Image.alpha_composite(canvas, deco)

if not NIGHT:  # nuvole con ombra
    sh_l = Image.new('RGBA', (W, H), (0, 0, 0, 0)); cl = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh_l); cd = ImageDraw.Draw(cl)
    for (lg, lt, sc) in [(1.22, 39.30, 1.0), (1.55, 39.31, 0.8), (1.60, 38.66, 1.0), (1.20, 38.70, 0.75), (1.40, 39.22, 0.5)]:
        x, y = px(lg, lt)
        for (dx, dy, rr) in [(0, 0, 90), (95, 20, 70), (-95, 25, 66), (40, -35, 70), (-40, -25, 60), (150, 38, 46), (-150, 42, 44)]:
            rr *= sc; cd.ellipse([x + dx * sc - rr, y + dy * sc - rr * 0.7, x + dx * sc + rr, y + dy * sc + rr * 0.7], fill=(255, 255, 255, 255))
            sd.ellipse([x + dx * sc - rr + 70, y + dy * sc - rr * 0.7 + 150, x + dx * sc + rr + 70, y + dy * sc + rr * 0.7 + 150], fill=(8, 50, 90, 255))
    sh_l = sh_l.filter(ImageFilter.GaussianBlur(34)); cl = cl.filter(ImageFilter.GaussianBlur(12))
    sa = np.asarray(sh_l, np.float32)[..., 3] * 0.20; ca_ = np.asarray(cl, np.float32)[..., 3] * 0.62 / 255
    base = np.asarray(canvas.convert('RGB'), np.float32)
    base = base * (1 - (sa / 255)[..., None]) + np.array([8, 50, 90], np.float32) * (sa / 255)[..., None]
    base = base * (1 - ca_[..., None]) + 255 * ca_[..., None]
    canvas = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert('RGBA')

# --- testi ---
POP = '/usr/share/fonts/truetype/google-fonts/Poppins-SemiBold.ttf'
POPI = '/usr/share/fonts/truetype/google-fonts/Poppins-Italic.ttf'
POPB = '/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf'
if not os.path.exists(POP): POP = POPB = POPI = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
txt = Image.new('RGBA', (W, H), (0, 0, 0, 0)); td2 = ImageDraw.Draw(txt)
def spaced(text, font, sp):
    return sum(td2.textlength(ch, font=font) for ch in text) + sp * (len(text) - 1)
def label(text, lng_, lat_, size=44, sp=7, color=(20, 56, 76, 235) if not NIGHT else (246, 240, 224, 255), halo=(255, 255, 255, 235) if not NIGHT else (4, 18, 40, 235), dot=True, dx=0, dy=0, font_path=POP):
    f = ImageFont.truetype(font_path, size); x, y = px(lng_, lat_)
    if dot:
        r = 10
        td2.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, 255) if not NIGHT else (0, 219, 255, 255), outline=(20, 56, 76, 255) if not NIGHT else (4, 18, 40, 255), width=4)
    w = spaced(text, f, sp); cx = x - w / 2 + dx; cy = y + dy
    for ch in text:
        td2.text((cx, cy), ch, font=f, fill=color, stroke_width=7, stroke_fill=halo)
        cx += td2.textlength(ch, font=f) + sp
    cx = x - w / 2 + dx
    for ch in text:
        td2.text((cx, cy), ch, font=f, fill=color); cx += td2.textlength(ch, font=f) + sp
# grande scritta in mare
big = ImageFont.truetype(POPB, 260); bx, by = px(1.15, 39.365)
cx = bx
for ch in '':
    td2.text((cx, by), ch, font=big, fill=(255, 255, 255, 120)); cx += td2.textlength(ch, font=big) + 46
sm = ImageFont.truetype(POPI, 64)
td2.text(px(1.16, 38.60), 'Mar Mediterráneo', font=sm, fill=(255, 255, 255, 150))
td2.text(px(1.44, 38.765), '↓ Formentera', font=sm, fill=(255, 255, 255, 190))
# luoghi (coordinate geografiche note, da verificare)
for name, lg, lt, kw in [
    ('SANT ANTONI', 1.3036, 38.9803, dict(dy=-70)),
    ('SANT JOSEP', 1.2941, 38.9223, dict(dy=24)),
    ('IBIZA TOWN', 1.4329, 38.9089, dict(dx=-135, dy=-30)),
    ("PLAYA D'EN BOSSA", 1.4056, 38.8846, dict(dx=-30, dy=26)),
    ('SANTA EULÀRIA', 1.5337, 38.9845, dict(dy=24)),
    ('SANT JOAN', 1.5122, 39.0733, dict(dy=24)),
    ('PORTINATX', 1.5145, 39.1126, dict(dx=-170, dy=-24)),
    ('CALA COMTE', 1.2216, 38.9556, dict(dx=-190, dy=-22, size=36, sp=5)),
    ('ES VEDRÀ', 1.1963, 38.8636, dict(dx=205, dy=-18, size=36, sp=5, dot=False)),
]: label(name, lg, lt, **kw)
# bussola
cx0, cy0 = px(1.215, 39.235); R = 170
td2.ellipse([cx0 - R, cy0 - R, cx0 + R, cy0 + R], fill=(255, 255, 255, 60), outline=(255, 255, 255, 230), width=6)
for ang, ln_, wd in [(0, 1.0, 22), (90, 0.62, 14), (180, 0.62, 14), (270, 0.62, 14)]:
    a = math.radians(ang); tip = (cx0 + math.sin(a) * R * 0.95 * ln_, cy0 - math.cos(a) * R * 0.95 * ln_)
    l = (cx0 + math.sin(a - math.pi / 2) * wd, cy0 - math.cos(a - math.pi / 2) * wd); r = (cx0 + math.sin(a + math.pi / 2) * wd, cy0 - math.cos(a + math.pi / 2) * wd)
    td2.polygon([tip, l, r], fill=(0, 219, 255, 255) if ang == 0 else (255, 255, 255, 230))
td2.text((cx0, cy0 - R - 62), 'N', font=ImageFont.truetype(POPB, 62), fill=(255, 255, 255, 255), anchor='mm')

# logo CILEX nel mare (maschera alfa dal logo ufficiale)
wmask = Image.open(os.path.join(HERE, 'logo-wordmark-mask.png')).convert('L')
wmw = int(W * 0.30); wmask = wmask.resize((wmw, round(wmw * wmask.height / wmask.width)), Image.LANCZOS)
wx, wy = [int(v) for v in px(1.385, 39.275)]
if NIGHT:
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gl = Image.new('RGBA', wmask.size, (0, 219, 255, 0)); gl.putalpha(wmask)
    glow.alpha_composite(gl, (wx, wy)); glow = glow.filter(ImageFilter.GaussianBlur(22))
    txt = Image.alpha_composite(txt, glow); txt = Image.alpha_composite(txt, glow)
    lg_ = Image.new('RGBA', wmask.size, (0, 219, 255, 0)); lg_.putalpha(wmask); txt.alpha_composite(lg_, (wx, wy))
else:
    sh_ = Image.new('RGBA', wmask.size, (6, 40, 80, 0)); sh_.putalpha(wmask.point(lambda v: int(v * 0.35)))
    shl = Image.new('RGBA', (W, H), (0, 0, 0, 0)); shl.alpha_composite(sh_, (wx + 10, wy + 12)); shl = shl.filter(ImageFilter.GaussianBlur(8))
    txt = Image.alpha_composite(txt, shl)
    lg_ = Image.new('RGBA', wmask.size, (255, 255, 255, 0)); lg_.putalpha(wmask.point(lambda v: int(v * 0.96))); txt.alpha_composite(lg_, (wx, wy))
td2 = ImageDraw.Draw(txt)
canvas = Image.alpha_composite(canvas, txt)
out = canvas.convert('RGB').resize((OUT_W, round(H * OUT_W / W)), Image.LANCZOS)
dest = os.path.join(HERE, '..', 'assets', 'ibiza-map-night.jpg' if NIGHT else 'ibiza-map.jpg')
out.save(dest, quality=88, optimize=True, progressive=True)
print('OK', out.size, os.path.getsize(dest) // 1024, 'KB', 'proj', LNG0, LNG1, LAT0, LAT1)
