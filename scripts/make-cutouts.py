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
    Job("hero-07-partner.webp", "jerky-heap.webp", lo=14, hi=40,
        note="一堆方形肉乾，白底。拿來填中央那一鍋。"),
    Job("cutlet-bag.jpg", "cutlet-fillet.webp", lo=22, hi=56,
        crop=(0.2, 0.08, 0.785, 0.33), neutral=(20, 205),
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
        lo=48, hi=86, crop=(0.135, 0.45, 0.865, 0.578),
        fill_holes=False, connected=False,
        note="牛肉丁。整張是青底的 LOADING 進度條，只裁框線內那排肉丁；"
             "背景色直接指定那個青，不然裁切邊上的黑框線會把取樣帶歪。"),
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
    return 0


if __name__ == "__main__":
    sys.exit(run())
