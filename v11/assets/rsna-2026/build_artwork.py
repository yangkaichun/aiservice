"""Build the RSNA 2026 website artwork from the unmodified official logos."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import subprocess

HERE = Path(__file__).parent
OUT = HERE / "meet-pancad-rsna-2026.png"
PANCAD = HERE / "pancad-logo.png"
subprocess.run([
    "rsvg-convert", "-w", "900", "-o", str(PANCAD),
    str(HERE.parent / "pancad-ai-logo.svg"),
], check=True)

W, H = 1600, 900
im = Image.new("RGB", (W, H))
px = im.load()
for y in range(H):
    for x in range(W):
        t = (x / W * .45 + y / H * .55)
        px[x, y] = (int(7 + 16*t), int(25 + 39*t), int(51 + 64*t))

d = ImageDraw.Draw(im, "RGBA")
d.ellipse((1050, -280, 1790, 460), outline=(114, 171, 226, 58), width=2)
d.ellipse((1175, -150, 1665, 340), outline=(114, 171, 226, 76), width=2)
d.ellipse((1230, 80, 1810, 660), outline=(114, 171, 226, 38), width=2)
d.rounded_rectangle((86, 65, 1514, 290), radius=28, fill=(255, 255, 255, 255))

rsna = Image.open(HERE / "rsna-2026-official.png").convert("RGBA")
rsna.thumbnail((460, 185), Image.Resampling.LANCZOS)
im.paste(rsna, (140, 176 - rsna.height//2), rsna)

logo = Image.open(PANCAD).convert("RGBA")
logo.thumbnail((575, 105), Image.Resampling.LANCZOS)
im.paste(logo, (865, 180 - logo.height//2), logo)
d = ImageDraw.Draw(im, "RGBA")
d.line((794, 109, 794, 244), fill=(31, 70, 119, 60), width=2)

font_dir = Path("/System/Library/Fonts/Supplemental")
bold = lambda size: ImageFont.truetype(str(font_dir / "Arial Bold.ttf"), size)
normal = lambda size: ImageFont.truetype(str(font_dir / "Arial.ttf"), size)
d.rounded_rectangle((86, 340, 503, 389), radius=24, fill=(236, 112, 0, 255))
d.text((111, 350), "RSNA 2026  •  CHICAGO", font=bold(24), fill="white")
d.text((86, 425), "Meet PanCAD.ai", font=bold(91), fill="white")
d.text((86, 535), "at RSNA 2026", font=bold(91), fill="white")
d.rounded_rectangle((86, 686, 473, 773), radius=19, fill=(255, 255, 255, 255))
d.text((118, 700), "BOOTH 5132", font=bold(49), fill=(21, 61, 117))
d.text((510, 714), "Nov 29–Dec 2  •  McCormick Place", font=normal(36), fill=(226, 238, 253))
d.text((88, 829), "PANCREASaver®  |  AI-assisted pancreatic CT review", font=normal(29), fill=(189, 214, 238))
im.save(OUT, optimize=True)
print(OUT)
