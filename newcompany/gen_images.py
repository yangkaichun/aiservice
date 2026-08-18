#!/usr/bin/env python3
# 臻晟官網圖片批次生成腳本 — mflux (FLUX.2-klein-4B) 本地生成
# 用法: ./.venv-img/bin/python gen_images.py [單張編號]
import subprocess, sys, os, time

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "assets", "images")
os.makedirs(OUT, exist_ok=True)
VENV = os.path.join(BASE, ".venv-img", "bin", "mflux-generate-flux2")

STYLE = ("Photorealistic commercial lifestyle photography, "
         "golden hour warm sunlight, bright optimistic mood, "
         "ivory and soft gold color palette, shallow depth of field, "
         "high-end wellness brand aesthetic, sunny cheerful atmosphere")

# 族群 / 護理師 描述基底
ORANGE = "elegant Taiwanese couple in their late 50s to early 60s, distinguished and graceful, smart casual attire (linen shirt, light blazer, silk scarf), silver hair styled neatly"
NURSE = "a professional Taiwanese female nurse in her 30s-40s, cream and soft blue uniform, warm professional smile, gentle attentive posture"

IMAGES = [
    # ── A. 首頁 ──
    ("01_hero_main", "16:9",
     f"{ORANGE} walking through a sunlit garden at golden hour with a professional Taiwanese female nurse in her early 30s wearing a formal elegant uniform (tailored cream blazer and matching skirt, no name tag, no visible logo or brand marks) walking slightly behind and beside them with a graceful guiding hand gesture and warm professional smile, attentive premium concierge service posture, warm sunlight streaming through trees, laughing softly, {STYLE}, luxury concierge service atmosphere"),
    ("02_pain_point", "4:3",
     f"An elegant Taiwanese woman in her 50s sitting by a bright window in a sunlit café, a health check report on the table, holding a coffee cup, thoughtful yet composed expression, not ill-looking, warm morning light, {STYLE}"),
    ("03_value_health", "4:3",
     f"{NURSE} sitting with {ORANGE.split('Taiwanese')[1].strip()} lady in a bright modern living room, chatting warmly over tea, sunlight through sheer curtains, {STYLE}"),
    ("04_value_travel", "16:9",
     f"{ORANGE} strolling along a sunlit old street in Kyoto Japan with {NURSE}, maple leaves in autumn colors, warm sunlight, {STYLE}"),
    ("05_value_ecosystem", "16:9",
     f"{ORANGE} in an elegant hotel lobby or art gallery with warm natural light, speaking with a courteous concierge, {STYLE}"),
    # ── B. 關於我們 ──
    ("06_about_brand", "16:9",
     f"An elegant tea ceremony table in a sunlit garden at morning, porcelain teacups, silk scarf, a closed book, golden light rays, serene luxurious atmosphere, no people, {STYLE}"),
    ("07_about_team", "4:3",
     f"Three professional Taiwanese female nurses in their 30s-40s in cream uniforms, smiling confidently together in a bright sunlit office, warm natural light, {STYLE}"),
    # ── C. 服務方案 ──
    ("08_plan_prime", "4:3",
     f"{ORANGE.split('couple')[0].strip()} lady in her late 50s having a relaxed conversation with {NURSE} at a sunlit café window table, coffee and teacups, {STYLE}"),
    ("09_plan_primeplus", "4:3",
     f"{ORANGE} walking in a sunny park with {NURSE}, three people together, family-like warm atmosphere, golden sunlight through trees, {STYLE}"),
    ("10_plan_elite", "16:9",
     f"{ORANGE} on a resort balcony overlooking the ocean at golden hour with {NURSE} nearby, champagne glasses on the table, luxury travel mood, {STYLE}"),
    ("11_service_report", "4:3",
     f"{NURSE} reviewing a health check report together with {ORANGE.split('Taiwanese')[1].strip()} lady at a bright wooden dining table, pointing at the document, professional and caring, warm daylight, {STYLE}"),
    ("12_service_escort", "4:3",
     f"{NURSE} gently accompanying an elegant Taiwanese elderly gentleman in his 60s through a bright hospital lobby, holding his arm lightly, calm reassuring atmosphere, warm sunlight, {STYLE}"),
    ("13_service_overseas", "16:9",
     f"{ORANGE} walking with {NURSE} through a bright airport lounge with floor-to-ceiling windows, sunlight, carry-on luggage, ready for a journey, {STYLE}"),
    # ── D. 生態系 ──
    ("14_eco_travel", "16:9",
     f"{ORANGE} enjoying tea on a luxury cruise ship deck or scenic train with panoramic window views, golden light, {STYLE}"),
    ("15_eco_finance", "16:9",
     f"A private banking lounge with warm wooden tones, {ORANGE} discussing with a professional Taiwanese wealth manager, coffee on the table, soft warm light, {STYLE}"),
    ("16_eco_checkup", "4:3",
     f"A bright upscale health check center lobby, friendly Taiwanese staff welcoming {ORANGE.split('Taiwanese')[1].strip()} lady, clean modern interior, warm natural light, {STYLE}"),
    ("17_eco_insurance", "4:3",
     f"A Taiwanese insurance advisor explaining a document to {ORANGE} in a sunny modern living room, warm reassuring atmosphere, {STYLE}"),
    ("18_eco_mobility", "16:9",
     f"A chauffeur holding the door of a luxury sedan, {NURSE} gently assisting {ORANGE.split('Taiwanese')[1].strip()} lady getting in, bright sunny day, {STYLE}"),
    # ── E. 信任與招募 ──
    ("19_trust_nurse", "4:3",
     f"Portrait of {NURSE}, warm genuine smile, golden side light, soft background, professional healthcare photography, {STYLE}"),
    ("20_trust_warm", "4:3",
     f"{NURSE} gently holding the hand of {ORANGE.split('Taiwanese')[1].strip()} elderly lady, sitting together on a sunlit garden bench, tender caring moment, {STYLE}"),
    ("21_join_nurse", "16:9",
     f"Taiwanese nurses in their 30s-40s in a bright training room, learning and smiling together, laptops and notebooks, warm collaborative atmosphere, sunlight, {STYLE}"),
    ("22_contact_cta", "16:9",
     f"An afternoon tea setting in warm sunlight, two teacups, a book and flowers on an elegant table, inviting serene mood, no people, {STYLE}"),
]

def gen(idx, item, wait=True):
    name, ratio, prompt = item
    # FLUX.2 尺寸: 16:9 → 1536x1024 (3:2), 4:3 → 1344x1024
    if ratio == "16:9":
        w, h = 1536, 1024
    else:
        w, h = 1344, 1024
    out = os.path.join(OUT, f"{name}.png")
    if os.path.exists(out) and os.path.getsize(out) > 10000:
        print(f"[skip] {name} 已存在")
        return True
    cmd = [VENV, "--model", "flux2-klein-4b", "--height", str(h), "--width", str(w),
           "--steps", "8", "--seed", str(100 + idx), "--output", out, "--prompt", prompt]
    print(f"[{idx:02d}/22] {name} ({ratio}) 生成中...", flush=True)
    t0 = time.time()
    r = subprocess.run(cmd, capture_output=True, text=True)
    dt = time.time() - t0
    if r.returncode == 0 and os.path.exists(out) and os.path.getsize(out) > 10000:
        print(f"      ✅ {dt:.0f}s, {os.path.getsize(out)//1024}KB")
        return True
    else:
        print(f"      ❌ 失敗: {r.stderr[-400:]}")
        return False

if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    ok = fail = 0
    for i, item in enumerate(IMAGES, 1):
        if only and only not in item[0]:
            continue
        if gen(i, item):
            ok += 1
        else:
            fail += 1
            if only:
                break
    print(f"\n完成: {ok} 成功, {fail} 失敗")
