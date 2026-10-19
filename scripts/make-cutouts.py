#!/usr/bin/env python3
"""把實拍的單色背景去掉，產生帶 alpha 的去背圖。

參考圖的碟子上擺的是去背的食材，不是裁進橢圓裡的方形照片——食材還會
溢出碟緣。要做到一樣，就得有真正帶 alpha 的素材。

這支script只做一件事：把背景的像素挖掉。食材本身的像素一個都不動，
所以原彩完全保留——這不是重繪也不是染色。

挖背景會遇到三種麻煩，所以有三個對應的開關：

  connected   主體跟背景同色時（白紙袋配白底），只挖「從邊框連得過來」
              的背景，袋子才不會跟著消失。
  neutral     商業攝影的落影是中性灰、商品本身是暖色或深色。把「低彩度
              又很亮」的像素一併挖掉，貼到黑色鍋子上才不會浮一圈灰影。
  open_px     商品照上印的線框、文字這類細結構離背景色很遠，挖不掉。
              用形態學開運算把比這個寬度細的東西清掉，再只留最大的一塊。

挖完之後還會把其中幾張疊成中央那一鍋的內容，詳見 pack_pot()。

用法：python3 scripts/make-cutouts.py
輸出：src/assets/poster/cutout/*.webp
"""

from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = Path("src/assets/poster")
OUT = SRC / "cutout"


@dataclass
class Job:
    name: str
    out: str
    # 背景色。None 表示從邊框取樣。
    bg: tuple[int, int, int] | None = None
    # 距離背景色多近算背景、多遠算前景（0-255 的歐氏距離）。
    lo: float = 18
    hi: float = 46
    # 先裁掉畫面上不要的部分（左、上、右、下，各為寬高的比例）。
    crop: tuple[float, float, float, float] = (0, 0, 1, 1)
    # 連落影一起挖：(彩度上限, 亮度下限)。商品本身必須比這個暖或這個暗。
    neutral: tuple[float, float] | None = None
    # 只留暖色：要求 R 比 B 高出這個值。商品是褐色、落影是背景色染出來的冷調時用。
    warm_only: float = 0
    # 只留冷色：要求 B 比 G 高出這個值。商品偏紫紅、背景與落影是暖米色時用——
    # 紫紅的藍比綠高，米色反過來，所以這一刀切得比色距乾淨。
    cool_only: float | None = None
    # 清掉比這個半徑細的結構（線框、文字），單位是像素。
    open_px: int = 0
    # 只留面積最大的一塊。清完細結構後用來掃掉殘餘的碎片。
    keep_largest: bool = False
    # 挖完之後把小碎塊清掉，單位是最大塊面積的比例。
    despeckle: float = 0.004
    # 主體內部被挖出來的洞，小於這個面積（像素）的補成不透明。
    # 肉乾堆的縫隙是真的縫隙，不能補；乾貨表面的裂縫是誤傷，要補。
    patch_holes: int = 0
    # 主體內部的洞要不要算進輪廓。被線框圍住的背景會被當成洞，那種就不能算。
    fill_holes: bool = True
    # 是否只挖「從邊框連得過來」的背景。
    connected: bool = True
    note: str = ""


JOBS = [
    Job("hero-07-partner.webp", "jerky-heap.webp", lo=22, hi=56,
        warm_only=14, fill_holes=False, connected=False,
        note="一堆方形肉乾，白底。拿來填中央那一鍋。片與片之間的縫也是白底，"
             "那些縫不是被線框圍住的孤島、是真的縫，所以不限連通、也不補洞——"
             "縫要透出來，鍋底的深褐色才看得見，一鍋貨才有層次。"),
    Job("cutlet-bag.jpg", "cutlet-fillet.webp", lo=22, hi=56,
        crop=(0.2, 0.08, 0.773, 0.33), neutral=(20, 205),
        note="嚎大大雞排。整張是雞排插在白紙袋裡，袋子跟白底同色挖不開，"
             "所以只裁露在袋口以上的那一片雞排——袋口斜線在 0.38 以下。"),
    Job("drop-partner-pigear.jpg", "pig-ear.webp", lo=20, hi=50,
        crop=(0.09, 0.12, 0.84, 0.72), neutral=(32, 75),
        open_px=12, keep_largest=True, patch_holes=6000,
        fill_holes=False, connected=False,
        note="豬耳朵。下緣的字樣先裁掉。照片上印了一個黑色方框，線寬量到 13px，"
             "所以開運算的半徑要大過它，再只留最大的一塊，"
             "框就不見了、耳朵留著。紙的粗紋是中性灰，一併挖掉。"),
    Job("hero-06-bowl.webp", "woven-bowl.webp", lo=12, hi=34,
        neutral=(18, 190),
        note="藤編寵物碗。碗底那一圈中性灰的落影連著挖掉——藤是暖色、"
             "內裡是墨綠、織紋是黑，都不會被誤傷。"),
    Job("beef-cubes-loading.jpg", "beef-cubes.webp", bg=(129, 186, 201),
        lo=40, hi=78, crop=(0.135, 0.45, 0.865, 0.578),
        warm_only=22, patch_holes=4000, fill_holes=False, connected=False,
        note="牛肉丁。整張是青底的 LOADING 進度條，只裁框線內那排肉丁；"
             "背景色直接指定那個青，不然裁切邊上的黑框線會把取樣帶歪。"
             "每一塊右邊都有一道青色的落影，離背景色更遠所以門檻挖不掉，"
             "改用「只留暖色」把它清掉——肉丁本身是褐的，不會被誤傷。"),
    Job("drop-cat-catgrass.jpg", "cat-grass.webp", bg=(12, 10, 16),
        lo=95, hi=150, crop=(0.27, 0.17, 0.82, 0.75),
        patch_holes=3000, keep_largest=True, fill_holes=False, connected=False,
        note="草上飛貓草雞肉乾。原圖是一片台灣形狀的肉乾浮在星雲裡，"
             "先裁到肉乾那一塊（把貓與亮色的星雲臂裁在外面），"
             "剩下的背景是近黑的星空，離肉乾很遠，門檻一刀就切得開。"),
    Job("drop-partner-mixed.jpg", "duck-cubes.webp", bg=(229, 208, 180),
        lo=40, hi=90, crop=(0.13, 0.675, 0.395, 0.86),
        cool_only=-2, patch_holes=1500, fill_holes=False, connected=False,
        note="鴨肉丁。原圖是一碗對切的拼圖，碗外散著幾塊；這裡只裁碗底下那一排"
             "——碗裡的那些壓在奶白的碗面上，挖不開。"
             "米底本身帶漸層、肉丁底下還有一圈暖色的落影，單靠色距切不乾淨。"
             "但肉丁是紫紅（量到 137,60,68，藍比綠高 8），米底與落影是暖米"
             "（233,210,179，綠比藍高 31），所以改用 cool_only 從色相切——"
             "一刀就把米底連落影一起去掉。代價是肉丁邊上那一圈偏暖的白脂"
             "會跟著掉，剩下的是乾淨的紫紅方塊。"
             "鍋裡需要的就是這個紫紅：其餘的素材全是褐與金，湊不出參考圖的雜色。"),
    Job("drop-partner-mixed.jpg", "dried-apple.webp", bg=(247, 230, 210),
        lo=20, hi=44, crop=(0.265, 0.272, 0.492, 0.497),
        neutral=(48, 190), patch_holes=6000,
        note="蘋果乾片。同一張原圖的碗裡，那一疊排成扇形的蘋果片。"
             "手上所有去背素材的平均亮度都在 75–111 之間（全是深色的肉乾與肉丁），"
             "參考圖的鍋裡量到 145——缺的就是奶白這一塊，而這一疊是唯一一樣"
             "真的夠亮的實拍（量到 164，有一半的像素亮度過 190）。"
             "難處在於果肉本身是奶白、碗面也是奶白（247,230,210），色距只有 53，"
             "光靠門檻挖出來的果肉會變半透明。但果肉的彩度量到 68–136、"
             "碗面只有 36（四分位距才 ±3），所以改用 neutral 從彩度切"
             "（低彩度又亮的一律當背景），果肉就實了。"
             "左上角與右緣外面是碗面與深色的肉乾片，裁切邊各往內收兩像素避開。"),
    Job("drop-moon-packs.jpg", "moon-pack.webp", bg=(253, 216, 96),
        lo=52, hi=88, crop=(0.04, 0.035, 0.855, 1.0),
        note="牠的月餅包裝。黃底本身很均勻，但上緣有一條白邊、左緣一條淡黃、"
             "右邊還露出第二袋，三個都先裁掉，取樣才會落在那片黃上。"
             "門檻拉高是為了連袋底那一片偏暗的黃一起挖掉。"),
]


def load(job: Job) -> np.ndarray:
    im = Image.open(SRC / job.name).convert("RGB")
    w, h = im.size
    l, t, r, b = job.crop
    if (l, t, r, b) != (0, 0, 1, 1):
        im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))
    return np.asarray(im).astype(np.float32)


def _border(a: np.ndarray, k: int = 5) -> np.ndarray:
    h, w, _ = a.shape
    ys, xs = np.mgrid[0:h, 0:w]
    return (ys < k) | (ys >= h - k) | (xs < k) | (xs >= w - k)


def background(a: np.ndarray, job: Job) -> np.ndarray:
    """回傳一張與原圖同尺寸的背景估計圖。"""
    if job.bg is not None:
        return np.broadcast_to(np.array(job.bg, np.float32), a.shape)
    flat = np.median(a[_border(a)], axis=0).astype(np.float32)
    return np.broadcast_to(flat, a.shape)


def alpha_for(a: np.ndarray, bg: np.ndarray, job: Job) -> np.ndarray:
    dist = np.linalg.norm(a - bg, axis=2)

    # 距離背景色越遠越不透明，lo 以內全透明、hi 以外全不透明。
    soft = np.clip((dist - job.lo) / max(job.hi - job.lo, 1e-6), 0, 1)

    if job.neutral is not None:
        sat_max, lum_min = job.neutral
        sat = a.max(axis=2) - a.min(axis=2)
        lum = a.mean(axis=2)
        # 兩個條件都「越符合越透明」，取較寬鬆的那一邊當保留量。
        keep = np.maximum(
            np.clip((sat - sat_max) / 8, 0, 1),
            np.clip((lum_min - lum) / 20, 0, 1),
        )
        soft = np.minimum(soft, keep)

    if job.warm_only:
        warm = np.clip((a[:, :, 0] - a[:, :, 2] - job.warm_only) / 10, 0, 1)
        soft = np.minimum(soft, warm)

    if job.cool_only is not None:
        cool = np.clip((a[:, :, 2] - a[:, :, 1] - job.cool_only) / 6, 0, 1)
        soft = np.minimum(soft, cool)

    if job.connected:
        # 只有「從邊框連得過來」的背景才挖掉，主體內部的白留著。
        candidate = soft < 0.9
        labels, _ = ndimage.label(candidate)
        border = np.concatenate([
            labels[0], labels[-1], labels[:, 0], labels[:, -1],
        ])
        touching = sorted({int(v) for v in np.unique(border) if v})
        if not touching:
            return np.ones(a.shape[:2], dtype=np.float32)
        alpha = np.where(np.isin(labels, touching), soft, 1.0)
    else:
        alpha = soft
    alpha = alpha.astype(np.float32)

    # 清掉零星的碎塊、細線與針孔。
    solid = ndimage.binary_closing(alpha > 0.5, np.ones((3, 3)))
    if job.open_px:
        r = job.open_px
        yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
        solid = ndimage.binary_opening(solid, (yy ** 2 + xx ** 2) <= r * r)
    lab, n = ndimage.label(solid)
    if n > 1:
        sizes = ndimage.sum(solid, lab, range(1, n + 1))
        floor = sizes.max() if job.keep_largest else job.despeckle * sizes.max()
        solid = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s >= floor])
    if job.fill_holes:
        solid = ndimage.binary_fill_holes(solid)
    alpha = np.where(solid, np.maximum(alpha, 0.05), 0.0)

    if job.patch_holes:
        holes = ndimage.binary_fill_holes(alpha > 0.5) & (alpha <= 0.5)
        lab, n = ndimage.label(holes)
        if n:
            sizes = ndimage.sum(holes, lab, range(1, n + 1))
            small = [i + 1 for i, s in enumerate(sizes) if s <= job.patch_holes]
            alpha = np.where(np.isin(lab, small), 1.0, alpha)

    # 邊緣羽化一個像素，不然會有鋸齒。
    return np.clip(ndimage.gaussian_filter(alpha, 0.6), 0, 1)


def despill(a: np.ndarray, bg: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    """半透明的邊緣把背景色扣掉，才不會留一圈白邊。"""
    out = a.copy()
    m = (alpha > 0.03) & (alpha < 0.97)
    k = alpha[m][:, None]
    out[m] = np.clip((a[m] - bg[m] * (1 - k)) / np.maximum(k, 0.15), 0, 255)
    return out


"""中央那一鍋。

參考圖的鍋裡是一整鍋塞到鍋緣的乾貨，而且是好幾種不同的東西混在一起。
手上沒有任何一張實拍是「一鍋混裝的乾貨」——最接近的那張肉乾堆只有一種
肉乾，放大到蓋滿圓之後每一片會大得不成比例。

所以這一鍋是把前面挖出來的去背實拍疊起來鋪滿的：縮放、旋轉、擺位，
像素本身一個都沒改，顏色完全是原彩，沒有任何生成或重繪的東西。
鍋的牌寫的是「全部商品」，鍋裡混裝好幾樣真的商品正好對得上。

擺位不是隨機撒的。把參考圖的鍋放大看，同一種東西是聚在一區的：
亮橘的厚片佔左上到正上、粉褐的捲片在左、暗紅的方丁擠在右上一小群、
深褐的細條綁成一束放在正下、右邊是橘片與魚。所以這一鍋照同一個分區擺，
一區一種料——隨機撒出來的是雜訊，分區擺出來才是一鍋菜。

參考圖裡有兩樣東西這邊湊不出來：奶白的凍乾方塊與那三條柳葉魚。
站上沒有這兩樣的實拍（柳葉魚只在「鍋邊加點」有品名），
所以就是沒有，不找相似的頂替、也不生成。

擺位表是寫死的，不是隨機的，所以每次跑出來都一樣。
r 與 ang 是極座標（r 為鍋半徑的比例、ang 為螢幕角度，0 度朝右、90 度朝下），
w 是寬度佔鍋直徑的比例，rot 是旋轉角。
名字後面加 #n 表示取那張去背圖切出來的第 n 塊（見 _pieces）。
"""
POT_SIZE = 1400
POT_LAYOUT = [
    # ---- 底層 ----
    # 深褐的肉乾先鋪滿整個圓。這一層幾乎會被上面的料蓋掉，留下來的是
    # 料與料之間的縫——參考圖那些縫就是這個深褐色。
    ("jerky-heap.webp", 0.70, 0, 0.50, 14),
    ("jerky-heap.webp", 0.70, 45, 0.50, 96),
    ("jerky-heap.webp", 0.70, 90, 0.50, 178),
    ("jerky-heap.webp", 0.70, 135, 0.50, 253),
    ("jerky-heap.webp", 0.70, 180, 0.50, 31),
    ("jerky-heap.webp", 0.70, 225, 0.50, 118),
    ("jerky-heap.webp", 0.70, 270, 0.50, 201),
    ("jerky-heap.webp", 0.70, 315, 0.50, 288),
    ("jerky-heap.webp", 0.38, 30, 0.54, 62),
    ("jerky-heap.webp", 0.38, 120, 0.54, 147),
    ("jerky-heap.webp", 0.38, 210, 0.54, 234),
    ("jerky-heap.webp", 0.38, 300, 0.54, 321),
    ("jerky-heap.webp", 0.0, 0, 0.56, 120),

    # ---- 正下方到右下：深褐的細條綁成一束。參考圖這一區是整鍋最暗的地方 ----
    ("jerky-heap.webp", 0.44, 95, 0.46, 8),
    ("jerky-heap.webp", 0.62, 72, 0.40, -34),
    ("jerky-heap.webp", 0.62, 116, 0.40, 42),

    # ---- 左上到正上：亮橘的厚片。
    #      參考圖這一區是五六片尖長的亮橘纖維片排成一把扇形。手上最接近的是
    #      雞排，但牠只有一張 399px 的大片，從前放到 0.40 寬會變成一塊沒有
    #      形狀的橘色板子——所以尺寸收到 0.20–0.26、片數加倍，再順著扇形的
    #      方向轉，讓牠讀成一片片的片，而不是一塊大的 ----
    ("cutlet-fillet.webp", 0.56, 216, 0.26, 52),
    ("cutlet-fillet.webp", 0.52, 240, 0.25, 30),
    ("cutlet-fillet.webp", 0.56, 264, 0.24, 6),
    ("cutlet-fillet.webp", 0.34, 228, 0.24, 62),
    ("cutlet-fillet.webp", 0.32, 258, 0.23, 20),
    ("cutlet-fillet.webp", 0.76, 212, 0.22, 74),
    ("cutlet-fillet.webp", 0.78, 238, 0.21, 34),
    ("cutlet-fillet.webp", 0.76, 262, 0.21, -4),
    ("cutlet-fillet.webp", 0.16, 272, 0.22, -18),

    # ---- 左下：橘的薄片接著左上那一區下來。參考圖左下也是暖色的片，
    #      不是正下方那一束深褐的細條 ----
    ("cutlet-fillet.webp", 0.72, 138, 0.22, -40),
    ("cutlet-fillet.webp", 0.54, 124, 0.21, 118),
    ("cutlet-fillet.webp", 0.78, 118, 0.20, 10),

    # ---- 正下方與右下：黃綠的貓草肉乾。參考圖整鍋只有這一兩塊是黃綠的，
    #      位置就在正下方偏右，所以這裡也只擺三塊、尺寸壓在 0.24 以內
    #      ——擺多了會在下半邊糊成一片 ----
    ("cat-grass.webp", 0.46, 86, 0.24, 24),
    ("cat-grass.webp", 0.60, 62, 0.22, -18),
    ("cat-grass.webp", 0.70, 36, 0.20, 76),

    # ---- 正上方到右上：暗紅的方丁。參考圖這一區是六七塊暗紅的大方丁，
    #      是整鍋塊頭最大的東西。原圖那兩塊鴨肉丁只有 35px 見方，所以整張
    #      （127px，兩塊一起）當一個單位擺，寬度壓在 0.11 以內——
    #      放大不到 1.3 倍，不會糊 ----
    ("duck-cubes.webp", 0.42, 290, 0.11, 16),
    ("duck-cubes.webp", 0.34, 306, 0.11, -28),
    ("duck-cubes.webp", 0.54, 300, 0.10, 52),
    ("duck-cubes.webp", 0.52, 280, 0.10, -8),
    ("duck-cubes.webp", 0.28, 318, 0.10, 72),
    ("duck-cubes.webp", 0.62, 288, 0.10, 32),

    # ---- 左側與左下：參考圖這一區是幾條粉褐、帶奶白紋的捲片。
    #      蘋果乾片的扇形正好對上——一疊奶白的片，片與片之間一道粉紅的皮，
    #      顏色與形狀都對得上，而且牠是手上唯一夠亮的素材（亮度 164，
    #      其餘全在 75–111）。參考圖那八塊奶白的凍乾方塊與三條柳葉魚站上
    #      都沒有實拍，這一疊就是整鍋奶白唯一的來源。
    #
    #      只擺五片。追參考圖那個亮度（145，這一鍋是 112）很容易想多鋪幾片，
    #      但鋪到七片以上整鍋就讀成一碗蘋果了——寧可暗一點，也不要讓一樣
    #      配料蓋掉其他真的商品。旋轉角撒滿一整圈：片上那幾道粉紅的皮方向性
    #      很強，角度要是都差不多，一整排就會讀成同一個圖案重複貼上去 ----
    ("dried-apple.webp", 0.52, 166, 0.19, 18),
    ("dried-apple.webp", 0.56, 198, 0.18, 142),
    ("dried-apple.webp", 0.30, 182, 0.17, 265),
    ("dried-apple.webp", 0.76, 152, 0.16, 70),
    ("dried-apple.webp", 0.74, 196, 0.16, 310),

    # ---- 右側：參考圖這一區是那八塊奶白的凍乾方塊、三條柳葉魚與幾片橘的
    #      薄片——整張圖第二亮的一塊。那兩樣沒有實拍，所以這裡用小一號的
    #      蘋果乾片配幾片雞排把亮度接起來，不然右半邊會整片塌成深褐色 ----
    ("dried-apple.webp", 0.30, 352, 0.13, 240),
    ("dried-apple.webp", 0.46, 14, 0.13, 25),
    ("dried-apple.webp", 0.62, 344, 0.12, 155),
    ("cutlet-fillet.webp", 0.74, 356, 0.22, -40),
    ("cutlet-fillet.webp", 0.76, 20, 0.21, 24),
    ("cutlet-fillet.webp", 0.54, 328, 0.20, -66),

    # ---- 零散的牛肉丁，撒在各區的接縫上。
    #      原圖那排切出來一塊約 127px，所以寬度壓在 0.09 以內 ----
    ("beef-cubes.webp#0", 0.66, 136, 0.09, 20),
    ("beef-cubes.webp#1", 0.70, 52, 0.09, -35),
    ("beef-cubes.webp#2", 0.44, 124, 0.085, 62),
    ("beef-cubes.webp#3", 0.62, 190, 0.09, -8),
    ("beef-cubes.webp#4", 0.40, 208, 0.09, 41),
    ("beef-cubes.webp#0", 0.18, 120, 0.09, -62),
    ("beef-cubes.webp#1", 0.16, 70, 0.085, 15),
    ("beef-cubes.webp#2", 0.44, 344, 0.09, -47),
    ("beef-cubes.webp#3", 0.72, 244, 0.085, 88),
    ("beef-cubes.webp#4", 0.78, 96, 0.085, -18),
    ("beef-cubes.webp#0", 0.80, 160, 0.08, 52),
    ("beef-cubes.webp#1", 0.80, 128, 0.08, -24),
]


def _place(canvas: Image.Image, art: Image.Image, r: float, ang: float,
           w: float, rot: float) -> None:
    d = canvas.width
    scaled = art.resize(
        (max(1, round(w * d)), max(1, round(w * d * art.height / art.width))),
        Image.LANCZOS,
    )
    turned = scaled.rotate(rot, expand=True, resample=Image.BICUBIC)
    rad = np.radians(ang)
    cx = d / 2 + r * (d / 2) * np.cos(rad)
    cy = d / 2 + r * (d / 2) * np.sin(rad)
    canvas.alpha_composite(
        turned, (round(cx - turned.width / 2), round(cy - turned.height / 2))
    )


def _pieces(name: str, min_area: int = 2000,
            drop_edge: bool = False) -> list[Image.Image]:
    """把一張去背圖拆成互不相連的單塊，才好零散地撒在鍋裡。

    drop_edge 會丟掉貼在圖框邊上的塊——那些是被裁框切斷的半塊，
    擺進鍋裡會露出一條直邊。
    """
    art = Image.open(OUT / name)
    alpha = np.asarray(art)[:, :, 3] > 128
    lab, n = ndimage.label(alpha)
    h, w = alpha.shape
    out = []
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        if len(ys) < min_area:
            continue
        if drop_edge and (xs.min() <= 1 or ys.min() <= 1
                          or xs.max() >= w - 2 or ys.max() >= h - 2):
            continue
        out.append(art.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)))
    out.sort(key=lambda im: -im.width * im.height)
    return out


"""那一堆牛肉丁。

原圖是五塊排成一列，長寬比 6.2，擺到任何一只碟子上都只是細細一條；
參考圖的碟子上是一小堆。所以這裡把那一列拆成單塊，再堆成一小堆——
跟中央那一鍋同一招，像素與顏色都是原圖的，只做縮放與擺位。
"""
BEEF_MOUND = [
    (0.27, 0.78, 0.34, -9),
    (0.55, 0.82, 0.32, 14),
    (0.79, 0.72, 0.33, -21),
    (0.15, 0.52, 0.31, 7),
    (0.45, 0.56, 0.35, -14),
    (0.74, 0.45, 0.32, 19),
    (0.28, 0.25, 0.30, -26),
    (0.56, 0.26, 0.33, 11),
    (0.84, 0.21, 0.29, -5),
]


def pack_beef() -> None:
    cubes = _pieces("beef-cubes.webp")
    size = 900
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    for i, (fx, fy, w, rot) in enumerate(BEEF_MOUND):
        art = cubes[i % len(cubes)]
        scaled = art.resize(
            (round(w * size), round(w * size * art.height / art.width)),
            Image.LANCZOS,
        )
        turned = scaled.rotate(rot, expand=True, resample=Image.BICUBIC)
        canvas.alpha_composite(
            turned,
            (round(fx * size - turned.width / 2),
             round(fy * size - turned.height / 2)),
        )
    a = np.asarray(canvas)
    ys, xs = np.where(a[:, :, 3] > 10)
    out = canvas.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    out.save(OUT / "beef-mound.webp", lossless=True)
    print(f"  {'beef-mound.webp':20s} {out.width:4d}x{out.height:4d}"
          f"  長寬比 {out.width / out.height:.2f}  九塊牛肉丁堆成一小堆")


"""那只黑鍋裡的豬耳朵。

量過參考圖每一只碟子「碟面被食材蓋掉的比例」：八只是 55–100%，那只黑鍋是
86%，整鍋塞滿，而且食材還溢出鍋緣。單放一只豬耳朵只蓋到 27%——豬耳朵本身
是個 V 形、鏤空六成多，放再大也填不滿，看起來就是一只空鍋裡躺了一根枝枒。

所以這裡把同一只豬耳朵疊成一鍋。像素與顏色都是原圖的，只做縮放、旋轉與擺位。
擺位是按黑鍋那個橢圓（扁率 0.73）排的：先沿著外圈繞一圈、再補中間，
每一只的旋轉角都差很多，不然一眼就看出是同一張貼好幾次。
"""
PAN_PIG_EAR = [
    (0.26, 0.30, 0.46, 24),
    (0.58, 0.24, 0.44, 158),
    (0.82, 0.33, 0.42, 72),
    (0.17, 0.58, 0.44, 288),
    (0.44, 0.52, 0.48, 206),
    (0.74, 0.60, 0.44, 112),
    (0.30, 0.78, 0.42, 340),
    (0.62, 0.80, 0.42, 48),
    (0.88, 0.72, 0.38, 250),
    (0.10, 0.36, 0.36, 130),
    # 補洞的一輪。第一輪排完量到 71%，離 86% 還差一截，缺口都在這幾處。
    (0.50, 0.34, 0.38, 96),
    (0.94, 0.50, 0.36, 14),
    (0.06, 0.76, 0.36, 182),
    (0.46, 0.94, 0.36, 268),
    (0.40, 0.08, 0.34, 316),
    (0.68, 0.44, 0.32, 60),
    (0.22, 0.46, 0.30, 224),
]


"""那只淺藍碟子上的雞排。

參考圖左上那只碟子上是五六片細長的亮橘片排成一把扇形，不是一整塊。
手上的雞排只有一張 399×234 的大片，整片鋪上去會變成一塊沒有形狀的橘色板子
——碟面覆蓋率是對的（67%，參考圖 70%），但顆粒完全不對。

所以同一招：把那一片縮小、轉開、疊成一盤。旋轉角沿著扇形的方向遞增，
讓它讀成一片片疊著的片。
"""
PLATE_CUTLET = [
    (0.28, 0.76, 0.44, 34),
    (0.54, 0.82, 0.42, 12),
    (0.76, 0.72, 0.40, -16),
    (0.22, 0.46, 0.42, 52),
    (0.50, 0.50, 0.46, 26),
    (0.78, 0.44, 0.40, -4),
    (0.36, 0.22, 0.40, 68),
    (0.64, 0.20, 0.38, 42),
]


def pack_plate(out_name: str, ratio: float, source: str,
               layout: list[tuple[float, float, float, float]],
               note: str, width: int = 1200) -> None:
    """照碟子的扁率疊一盤食材，並量出橢圓內的覆蓋率。"""
    height = round(width * ratio)
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    art = Image.open(OUT / source)
    for fx, fy, w, rot in layout:
        scaled = art.resize(
            (round(w * width), round(w * width * art.height / art.width)),
            Image.LANCZOS,
        )
        turned = scaled.rotate(rot, expand=True, resample=Image.BICUBIC)
        canvas.alpha_composite(
            turned,
            (round(fx * width - turned.width / 2),
             round(fy * height - turned.height / 2)),
        )
    canvas.save(OUT / out_name, lossless=True)

    yy, xx = np.mgrid[0:height, 0:width]
    inside = (((xx - width / 2) / (width / 2)) ** 2
              + ((yy - height / 2) / (height / 2)) ** 2) <= 1.0
    solid = np.asarray(canvas)[:, :, 3] > 128
    cover = float(solid[inside].mean())
    print(f"  {out_name:20s} {width:4d}x{height:4d}"
          f"  橢圓內覆蓋率 {cover:.0%}  {note}")


def _art(ref: str, cache: dict[str, Image.Image | list[Image.Image]]) -> Image.Image:
    """解析擺位表裡的名字。「x.webp」是整張，「x.webp#2」是切出來的第 2 塊。"""
    name, _, index = ref.partition("#")
    if not index:
        if name not in cache:
            cache[name] = Image.open(OUT / name)
        return cache[name]
    if name not in cache:
        cache[name] = _pieces(name, min_area=800)
    pieces = cache[name]
    return pieces[int(index) % len(pieces)]


def pack_pot() -> None:
    canvas = Image.new("RGBA", (POT_SIZE, POT_SIZE), (0, 0, 0, 0))
    cache: dict[str, Image.Image | list[Image.Image]] = {}
    for ref, r, ang, w, rot in POT_LAYOUT:
        _place(canvas, _art(ref, cache), r, ang, w, rot)

    # 裁成圓的，邊緣羽化一點，鍋緣才不會出現一條硬邊。
    yy, xx = np.mgrid[0:POT_SIZE, 0:POT_SIZE]
    rr = np.hypot(xx - POT_SIZE / 2, yy - POT_SIZE / 2) / (POT_SIZE / 2)
    mask = np.clip((1.0 - rr) / 0.015, 0, 1)
    a = np.asarray(canvas).astype(np.float32)
    a[:, :, 3] *= mask
    Image.fromarray(a.astype(np.uint8), "RGBA").save(OUT / "pot-fill.webp",
                                                     lossless=True)

    inside = rr < 0.98
    cover = float((a[:, :, 3] > 128)[inside].mean())
    # 擺得對不對，光看覆蓋率不夠——還要看調性。參考圖鍋裡量到的是
    # 平均亮度 145、標準差 61、奶白（亮度過 190 且彩度低於 60）佔 13%。
    # 這幾個數字就是這一鍋要追的目標。
    solid = (a[:, :, 3] > 128) & inside
    rgb = a[:, :, :3][solid]
    lum = rgb.mean(axis=1)
    sat = rgb.max(axis=1) - rgb.min(axis=1)
    cream = float(((lum > 190) & (sat < 60)).mean())
    dark = float((lum < 70).mean())
    print(f"  {'pot-fill.webp':20s} {POT_SIZE}x{POT_SIZE}  圓內覆蓋率 {cover:.0%}"
          f"  亮度 {lum.mean():.0f}±{lum.std():.0f}（參考 145±61）"
          f"  奶白 {cream:.0%}（參考 13%）  深色 {dark:.0%}（參考 16%）")


def run() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for job in JOBS:
        a = load(job)
        bg = background(a, job)
        alpha = alpha_for(a, bg, job)
        rgb = despill(a, bg, alpha)

        keep = alpha > 0.04
        if not keep.any():
            print(f"  !! {job.name}: 整張都被挖掉了，跳過")
            continue
        ys, xs = np.where(keep)
        y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1

        rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)[y0:y1, x0:x1]
        Image.fromarray(rgba, "RGBA").save(OUT / job.out, lossless=True)
        cover = float(keep[y0:y1, x0:x1].mean())
        print(f"  {job.out:20s} {x1 - x0:4d}x{y1 - y0:4d}  覆蓋率 {cover:.0%}  {job.note}")
    pack_beef()
    pack_plate("pig-ear-pan.webp", 0.73, "pig-ear.webp", PAN_PIG_EAR,
               "十七只豬耳朵疊成一鍋（參考圖那只黑鍋量到 86% 覆蓋率）")
    pack_plate("cutlet-plate.webp", 0.89, "cutlet-fillet.webp", PLATE_CUTLET,
               "八片雞排疊成一盤（參考圖左上那只碟子是一把扇形的細長片）")
    pack_pot()
    return 0


if __name__ == "__main__":
    sys.exit(run())
