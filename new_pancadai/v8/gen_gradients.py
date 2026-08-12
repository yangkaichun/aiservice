#!/usr/bin/env python3
"""生成 v8 hero 背景漸層 PNG（純 numpy，無 PIL）— 輸出 raw RGBA 給 ffmpeg 轉 PNG"""
import subprocess, sys
import numpy as np

W, H = 1920, 1080

def write_png(path, arr_rgba):
    raw = arr_rgba.astype(np.uint8).tobytes()
    subprocess.run(
        ["ffmpeg", "-y", "-f", "rawvideo", "-pix_fmt", "rgba",
         "-s", f"{W}x{H}", "-i", "-", "-frames:v", "1", path],
        input=raw, capture_output=True, check=True)

# 1) 天空背景：深藍垂直漸層 頂 #0a1628 → 中 #14325e → 底 #0a1628
sky = np.zeros((H, W, 4), dtype=np.float64)
top = np.array([10, 22, 40])    # #0a1628
mid = np.array([20, 50, 94])    # #14325e
bot = np.array([10, 22, 40])    # #0a1628
y = np.linspace(0, 1, H)[:, None, None]
sky[..., :3] = np.where(y < 0.5,
                        top + (mid - top) * (y * 2),
                        mid + (bot - mid) * ((y - 0.5) * 2))
sky[..., 3] = 255
write_png("/tmp/v8_sky.png", sky)

# 2) 上下遮罩：頂部深 0-140px 淡出、底部 850-1080 漸深（黑色 alpha）
mask = np.zeros((H, W, 4), dtype=np.float64)
mask[..., 3] = 0
top_fade = np.clip((140 - np.arange(H)) / 140, 0, 1)[:, None]  # 頂 140px → alpha 1→0
bot_fade = np.clip((np.arange(H) - 850) / 230, 0, 1)[:, None]  # 850px 以下 → alpha 0→1
mask[..., 3] = np.maximum(top_fade, bot_fade) * 0.72
mask[..., :3] = 5   # 近黑
write_png("/tmp/v8_mask.png", mask)

print("gradients written")
