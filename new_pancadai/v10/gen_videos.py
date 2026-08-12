#!/usr/bin/env python3
"""v10 動態素材生成：星空黎明 hero / 極光流光 / 光塵上升（numpy → ffmpeg pipe，無縫 loop）"""
import numpy as np
import subprocess, os, math

W, H = 1920, 1080
FPS = 24
HERE = os.path.dirname(os.path.abspath(__file__))

def pipe_frames(frames, name, crf=28):
    os.makedirs(os.path.join(HERE, 'video'), exist_ok=True)
    mp4 = os.path.join(HERE, 'video', name + '.mp4')
    webm = os.path.join(HERE, 'video', name + '.webm')
    for out, args in [(mp4, ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', str(crf), '-preset', 'medium']),
                      (webm, ['-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1'])]:
        cmd = ['ffmpeg', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
               '-r', str(FPS), '-i', '-', '-an'] + args + [out]
        p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
        for f in frames():
            p.stdin.write(f.tobytes())
        p.stdin.close(); p.wait()
        print(name, out, os.path.getsize(out)//1024, 'KB')

# ---------- 1. starry_dawn: 星空 + 流星 + 地平線黎明光（hero 主影片，12s loop） ----------
def gen_starry_g():
    T = 12; N = int(T * FPS); rng = np.random.default_rng(2026)
    nstar = 460
    sx = rng.uniform(0, W, nstar); sy = rng.uniform(0, H*0.72, nstar)
    sr = rng.uniform(0.6, 2.0, nstar); sbase = rng.uniform(0.25, 1.0, nstar)
    sphase = rng.uniform(0, 2*math.pi, nstar); sspeed = rng.uniform(1.2, 3.4, nstar)
    nshoot = 3
    sh_x0 = rng.uniform(0, W, nshoot); sh_y0 = rng.uniform(0, H*0.4, nshoot)
    sh_dx = rng.uniform(300, 520, nshoot); sh_dy = rng.uniform(120, 200, nshoot)
    sh_ph = rng.uniform(0, 1, nshoot)
    yy = np.linspace(0, H, H)[:, None]
    # 地平線位置與黎明色
    horiz = H * 0.86
    dawn_rgb = np.array([255, 168, 96]); deep_rgb = np.array([5, 11, 24])
    for t in range(N):
        f = t / T
        # 底部黎明光暈（正弦起伏 → 無縫）
        dawn_k = 0.72 + 0.28 * math.sin(2*math.pi*f*2 + 0.6)
        glow = np.clip((horiz - yy) / (horiz*0.55), 0, 1)**1.6 * dawn_k
        img = np.zeros((H, W, 3), np.float32)
        # 天空漸層：深藍 → 底部轉暖
        for c, (top, bot) in enumerate(zip(deep_rgb, dawn_rgb)):
            img[:, :, c] = top + (bot - top) * glow
        # 深藍冷色主體
        sky_g = np.linspace(0, 1, H)[:, None]
        img += np.array([8, 16, 36])[None, None, :] * (1 - sky_g[..., None]*0.5)
        # 星空（閃爍）
        tw = 0.55 + 0.45 * np.sin(2*math.pi*sspeed*f*2 + sphase)
        for i in range(nstar):
            a = sbase[i] * tw[i] * (0.5 + 0.5*(1 - sy[i]/H))
            if a < 0.06: continue
            g = int(sr[i]*2.0) + 1
            x0, y0 = int(sx[i]), int(sy[i])
            for dyy in range(-g, g+1):
                for dxx in range(-g, g+1):
                    d2 = dxx*dxx + dyy*dyy
                    if d2 > g*g: continue
                    xx, yy2 = x0+dxx, y0+dyy
                    if 0 <= xx < W and 0 <= yy2 < H:
                        img[yy2, xx] += np.array([255, 250, 240]) * a * (1 - d2/(g*g))**2
        # 流星
        for k in range(nshoot):
            ph = (f + sh_ph[k]) % 1.0
            if ph < 0.28:
                prog = ph / 0.28
                mx = sh_x0[k] + sh_dx[k]*prog
                my = sh_y0[k] + sh_dy[k]*prog
                L = 90
                for j in range(L):
                    xx = int(mx - j*sh_dx[k]/L*0.16)
                    yyy = int(my - j*sh_dy[k]/L*0.16)
                    if 0 <= xx < W and 0 <= yyy < H:
                        fade = (1 - j/L)**2 * 0.9
                        img[yyy, xx] += np.array([255, 244, 220]) * fade
        yield np.clip(img, 0, 255).astype(np.uint8)

# ---------- 2. aurora_hope: 極光絲帶流動（藍 + 暖金，章節背景，12s loop） ----------
def gen_aurora_g():
    T = 12; N = int(T * FPS)
    yy = np.linspace(0, H, H)[:, None]
    xx = np.linspace(0, W, W)[None, :]
    base_top = np.array([6, 13, 30]); base_bot = np.array([16, 34, 70])
    for t in range(N):
        f = t / T
        grad = (base_top[None, :] * (1 - yy/H) + base_bot[None, :] * (yy/H))
        img = np.repeat(grad, W, axis=1).reshape(H, W, 3).copy().astype(np.float32)
        # 兩條極光帶（sin 波紋）
        for k, (col, amp, wlen, speed, ph, basey, strength) in enumerate([
            (np.array([70, 160, 255]), 60, 520, 1.0, 0.0, 0.30, 0.16),
            (np.array([255, 190, 120]), 46, 400, 1.35, 2.1, 0.46, 0.13),
            (np.array([120, 210, 255]), 80, 700, 0.7, 4.0, 0.20, 0.08)]):
            cy = basey + amp*math.sin(2*math.pi*f*speed + ph) / H
            d = np.abs(yy/H - cy) / (0.05 + 0.02*math.sin(2*math.pi*f*speed*1.7 + ph))
            ribbon = np.exp(-d*d) * (0.6 + 0.4*math.sin(2*math.pi*f*0.9 + ph*3))
            sway = 0.5 + 0.5*math.sin(2*math.pi*f*speed*1.3 + ph + xx/W*math.pi*2)
            img += (ribbon * sway * strength)[..., None] * col[None, None, :]
        # 微塵上升
        for i in range(24):
            px = (i*97 + int(60*math.sin(2*math.pi*f*0.8 + i))) % W
            pyy = int((H*0.8 - f*H*0.7 + i*53) % H)
            for dyy in range(-2, 3):
                for dxx in range(-2, 3):
                    if dxx*dxx+dyy*dyy <= 4:
                        xx2, yy2 = px+dxx, pyy+dyy
                        if 0 <= xx2 < W and 0 <= yy2 < H:
                            img[yy2, xx2] += np.array([255, 240, 210]) * 0.30
        yield np.clip(img, 0, 255).astype(np.uint8)

if __name__ == '__main__':
    import sys
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    jobs = {'starry': (gen_starry_g, 'starry_dawn'), 'aurora': (gen_aurora_g, 'aurora_hope')}
    if which != 'all':
        jobs = {which: jobs[which]}
    for key, (fn, name) in jobs.items():
        def g(fn=fn):
            for f in fn():
                yield f
        pipe_frames(g, name)
    print('done')
