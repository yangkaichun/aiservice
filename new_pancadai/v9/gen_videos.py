#!/usr/bin/env python3
"""v9 動態素材生成：光線粒子背景 / 黎明光掃 / 掃描光束（numpy+PIL，pipe 給 ffmpeg）"""
import numpy as np
import subprocess, os, math

W, H = 1920, 1080
FPS = 24
HERE = os.path.dirname(os.path.abspath(__file__))

def pipe_frames(frames, name, crf=28, extra=None):
    """frames: generator of uint8 HxWx3; encode h264 yuv420p + webm vp9"""
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

# ---------- 1. rays_light: 深藍底 + 暖色體積光旋轉 + 上升塵埃（12s 無縫 loop） ----------
def gen_rays_g():
    T = 12; N = int(T * FPS); rng = np.random.default_rng(7)
    npart = 90
    px = rng.uniform(0, W, npart); py = rng.uniform(0, H, npart)
    ps = rng.uniform(1.5, 4.0, npart); psp = rng.uniform(18, 60, npart)
    pt = rng.uniform(0, 2*math.pi, npart)
    yy = np.linspace(0, H, H)[:, None]
    base_top = np.array([10, 22, 46]); base_bot = np.array([26, 56, 110])
    for t in range(N):
        f = t / T
        grad = (base_top[None, :] * (1 - yy/H) + base_bot[None, :] * (yy/H))
        img = np.repeat(grad, W, axis=1).reshape(H, W, 3).copy().astype(np.float32)
        ang = 2*math.pi * f
        cx, cy = W*0.5, H*0.42
        X = np.arange(W)[None, :]; Y = np.arange(H)[:, None]
        dx = X - cx; dy = Y - cy
        r = np.sqrt(dx*dx + dy*dy) + 1e-5
        base_a = np.arctan2(dy, dx)
        for k in range(7):
            a0 = ang + k * (2*math.pi/7) + 0.35*math.sin(2*math.pi*f*2 + k)
            bw = 0.16 + 0.05*math.sin(2*math.pi*f*3 + k*1.7)
            da = np.abs(((base_a - a0 + math.pi) % (2*math.pi)) - math.pi)
            beam = np.clip(1 - da/bw, 0, 1)**3
            fall = np.clip(1 - r/1600, 0, 1)**1.5
            warmth = np.array([255, 214, 160]) * (0.030 + 0.022*math.sin(2*math.pi*f + k))
            img += beam[..., None] * fall[..., None] * warmth[None, None, :]
        for i in range(npart):
            y = (py[i] - psp[i]*t + psp[i]*T*10) % H
            x = px[i] + 30*math.sin(2*math.pi*f + pt[i])
            g = int(ps[i]*2.2)
            for dyy in range(-g, g+1):
                for dxx in range(-g, g+1):
                    d2 = dxx*dxx + dyy*dyy
                    if d2 > g*g: continue
                    a = (1 - d2/(g*g))**2 * 0.5
                    xx, yy2 = int(x+dxx), int(y+dyy)
                    if 0 <= xx < W and 0 <= yy2 < H:
                        img[yy2, xx] += np.array([255, 235, 200]) * a
        yield np.clip(img, 0, 255).astype(np.uint8)

# ---------- 2. hope_light: 黎明光水平掃過深藍底（AI 之光） ----------
def gen_hope_g():
    T = 12; N = int(T * FPS); rng = np.random.default_rng(11)
    npart = 70
    px = rng.uniform(0, W, npart); py = rng.uniform(0, H, npart)
    psp = rng.uniform(20, 70, npart); pt = rng.uniform(0, 2*math.pi, npart)
    yy = np.linspace(0, H, H)[:, None]
    base_top = np.array([8, 16, 38]); base_bot = np.array([30, 60, 120])
    for t in range(N):
        f = t / T
        grad = (base_top[None, :] * (1 - yy/H) + base_bot[None, :] * (yy/H))
        img = np.repeat(grad, W, axis=1).reshape(H, W, 3).copy().astype(np.float32)
        # 掃光：x 位置正弦往復
        sx = W * (0.5 + 0.42*math.sin(2*math.pi*f - math.pi/2))
        X = np.arange(W)[None, :]
        glow = np.exp(-((X - sx)**2) / (2*(140.0)**2))  # 主光柱
        glow2 = np.exp(-((X - sx)**2) / (2*(420.0)**2))  # 大光暈
        warm = np.array([255, 190, 120])
        img += (glow2 * 0.10 + glow * 0.30)[..., None] * warm[None, None, :] * (0.75 + 0.25*math.sin(2*math.pi*f*4))
        # 光柱傾斜感：下方散開
        for k in range(5):
            spread = (1 + k*0.5)
            g2 = np.exp(-((X - sx + (yy - H*0.4)*spread*0.35)**2) / (2*(90.0)**2)) * np.clip((yy - H*0.2)/H*2, 0, 1)
            img += (g2 * 0.05)[..., None] * warm[None, None, :]
        for i in range(npart):
            y = (py[i] - psp[i]*t + psp[i]*T*10) % H
            x = px[i] + 40*math.sin(2*math.pi*f + pt[i])
            g = int(2.0*2.2)
            for dyy in range(-g, g+1):
                for dxx in range(-g, g+1):
                    d2 = dxx*dxx + dyy*dyy
                    if d2 > g*g: continue
                    a = (1 - d2/(g*g))**2 * 0.45
                    xx, yy2 = int(x+dxx), int(y+dyy)
                    if 0 <= xx < W and 0 <= yy2 < H:
                        img[yy2, xx] += np.array([255, 230, 190]) * a
        yield np.clip(img, 0, 255).astype(np.uint8)

# ---------- 3. scan_beam: 垂直掃描光束（章節分隔/數據帶背景） ----------
def gen_scan_g():
    T = 6; N = int(T * FPS)
    yy = np.linspace(0, H, H)[:, None]
    base_top = np.array([13, 26, 56]); base_bot = np.array([8, 16, 40])
    for t in range(N):
        f = t / T
        grad = (base_top[None, :] * (1 - yy/H) + base_bot[None, :] * (yy/H))
        img = np.repeat(grad, W, axis=1).reshape(H, W, 3).copy().astype(np.float32)
        sy = H * (0.5 + 0.48*math.sin(2*math.pi*f - math.pi/2))
        Y = np.arange(H)[:, None]
        beam = np.exp(-((Y - sy)**2) / (2*(26.0)**2))
        halo = np.exp(-((Y - sy)**2) / (2*(140.0)**2))
        blue = np.array([90, 160, 255]); warm = np.array([255, 200, 130])
        img += (halo * 0.07)[..., None] * blue[None, None, :]
        img += (beam * 0.35)[..., None] * warm[None, None, :]
        yield np.clip(img, 0, 255).astype(np.uint8)

if __name__ == '__main__':
    import sys
    which = sys.argv[1] if len(sys.argv) > 1 else 'all'
    jobs = {'rays': (gen_rays_g, 'rays_light'), 'hope': (gen_hope_g, 'hope_light'), 'scan': (gen_scan_g, 'scan_beam')}
    if which != 'all':
        jobs = {which: jobs[which]}
    for key, (fn, name) in jobs.items():
        def g(fn=fn):
            for f in fn():
                yield f
        pipe_frames(g, name)
    print('done')
