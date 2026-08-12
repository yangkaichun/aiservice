#!/usr/bin/env python3
"""驗證 v8 安全版圖：頂部 70px（nav 區）std < 12 = 模糊填補 = 人物沒被切"""
import subprocess, sys
import numpy as np

def top_std(path, top=70, w=1920, h=1080):
    raw = subprocess.run(
        ["ffmpeg", "-i", path, "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        capture_output=True).stdout
    arr = np.frombuffer(raw, dtype=np.uint8).reshape(h, w)
    return float(arr[:top, :].std()), float(arr[top:, :].std()), float(arr[h//2-100:h//2+100, w//2-200:w//2+200].std())

for name in ["hero_main_safe.jpg", "hero_intl_safe.jpg"]:
    p = f"assets/v8gen/{name}"
    top, rest, center = top_std(p)
    status = "OK" if top < 12 else "WARN"
    print(f"{name}: top70px std={top:.2f} ({status}) | rest std={rest:.2f} | center std={center:.2f}")
