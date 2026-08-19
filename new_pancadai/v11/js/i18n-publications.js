/* pancad.ai v11 — publications 字典（期刊論文館）?v=11 */
(function () {
  var zh = {
    meta_title: "期刊論文館 — 5 篇國際期刊論文：主題、摘要與原文連結 | PANCREASaver® 助胰見®",
    meta_desc: "PANCREASaver® 的學術根基：Lancet Digital Health、Radiology 等 5 篇國際期刊論文的中英主題、真實摘要與 PubMed 原文連結。",

    ph_badge: "期刊論文館",
    ph_title_1: "每一行證據，<span class=\"hl\">都發表在國際期刊。</span>",
    ph_sub: "五篇論文橫跨演算法開發、全國人口基礎驗證與真實世界應用——點擊「閱讀原文」，前往 PubMed 查看完整論文。",

    sec_t: "5 篇國際期刊論文",
    sec_p: "以下為 PANCREASaver® 相關的 5 篇代表學術發表，皆為臺大團隊（劉高郎／陳柏廷／廖偉智／王偉仲）之真實研究。中文摘要譯自原文 Abstract，英文摘要為原文精簡；完整內容請見論文連結。",

    p1_t: "深度學習區分胰臟癌組織與非癌胰臟組織：跨種族外部驗證之回溯性研究",
    p1_t_en: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
    p1_h1: "小於 2cm 腫瘤敏感度",
    p1_h2: "揪回放射科醫師漏診",
    p1_h3: "本地測試集",
    p1_abs: "約四成小於 2 公分的胰臟腫瘤在電腦斷層（CT）上會被漏診。本研究以卷積神經網路（CNN）區分胰臟癌與非癌胰臟組織，並與放射科醫師判讀比較。本地測試集敏感度 97.3%–99.0%、AUC 0.997–0.999；美國外部族群測試集敏感度 79.0%、AUC 0.920。CNN 敏感度優於放射科醫師（98.3% vs 92.9%）；放射科醫師漏診的 12 例胰臟癌中，CNN 正確揪回 11 例（92%）；小於 2 公分之腫瘤敏感度達 92.1%。",
    p1_abs_en: "Approximately 40% of pancreatic tumors smaller than 2 cm evade CT detection. A CNN distinguished pancreatic cancer tissue with 97.3–99.0% sensitivity and AUC 0.997–0.999 on local test sets, and 79.0% sensitivity / AUC 0.920 on a US dataset. CNN outperformed radiologists (98.3% vs 92.9%), correctly classified 11 of 12 radiologist-missed cancers (92%), and reached 92.1% sensitivity for tumors <2 cm.",

    p2_t: "以深度學習於 CT 影像偵測胰臟癌：全國人口基礎研究",
    p2_t_en: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study",
    p2_h1: "全國真實世界 CT",
    p2_h2: "全國驗證",
    p2_h3: "敏感度",
    p2_abs: "約四成小於 2 公分的胰臟腫瘤在腹部 CT 上被漏診。本研究開發端對端 AI 工具（分割卷積神經網路＋5 個 CNN 集成分類器）。內部測試集敏感度 89.9%、特異度 95.9%（AUC 0.96）；在全國 1,473 例真實世界 CT（669 例胰臟癌、804 例對照）中，敏感度 89.7%、特異度 92.8%、AUC 0.95；小於 2 公分腫瘤敏感度 74.7%。",
    p2_abs_en: "~40% of pancreatic tumors <2 cm are missed at abdominal CT. An end-to-end DL tool (segmentation CNN + ensemble of five CNNs) achieved 89.9% sensitivity / 95.9% specificity (AUC 0.96) internally, and across 1,473 nationwide real-world CT studies (669 malignant, 804 control): 89.7% sensitivity, 92.8% specificity, AUC 0.95, with 74.7% sensitivity for tumors <2 cm.",

    p3_t: "CT 影像組學特徵可區分胰臟癌與非癌胰臟",
    p3_t_en: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas",
    p3_h1: "雙族群驗證",
    p3_hx: "台／美",
    p3_h2: "台灣測試集",
    p3_h3: "敏感度・台灣",
    p3_abs: "以機器學習（XGBoost）分析 CT 影像組學特徵。以台灣與美國資料訓練的廣義模型：台灣測試集敏感度 94.7%、特異度 95.4%、AUC 0.98；美國測試集敏感度 80.6%、特異度 100%、AUC 0.91。胰臟腺癌（PDAC）相較正常胰臟呈現較低訊號強度與較高異質性的影像特徵。",
    p3_abs_en: "XGBoost radiomic analysis of CT patches distinguished PDAC from noncancerous pancreas. The generalized model (trained on Taiwanese + U.S. data) reached 94.7% sensitivity / 95.4% specificity / AUC 0.98 on the Taiwanese test set, and 80.6% / 100% / AUC 0.91 on the U.S. test set. PDACs showed lower intensity and higher heterogeneity radiomic features.",

    p4_t: "以 2D／3D 影像組學分析於全國真實世界資料集偵測胰臟癌",
    p4_t_en: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset",
    p4_h1: "全國真實世界 CT",
    p4_h2: "驗證結果",
    p4_h3: "敏感度",
    p4_abs: "自動端對端 CAD 工具結合 2D 與 3D 影像組學機器學習分析。在全國 1,477 例 CT（671 例胰臟癌、806 例對照）中，敏感度 91.8%、特異度 82.2%、AUC 0.947；小於 2 公分腫瘤敏感度 70.7%。採 2D 與 3D 分析串聯使用時，特異度可提升至 95.2%（敏感度 74.2%）。",
    p4_abs_en: "An automatic end-to-end CAD tool combining 2D and 3D radiomic machine-learning analysis reached 91.8% sensitivity / 82.2% specificity / AUC 0.947 in 1,477 nationwide CT studies (671 PC, 806 controls), with 70.7% sensitivity for tumors <2 cm. Running 2D and 3D analyses in series raised specificity to 95.2%.",

    p5_t: "人工智慧在胰臟與膽道疾病的應用（回顧性綜述）",
    p5_t_en: "Applications of artificial intelligence in pancreatic and biliary diseases",
    p5_h1: "回顧性綜述",
    p5_h2: "方法學總覽",
    p5_h3: "應用領域",
    p5_hx: "胰膽疾病",
    p5_abs: "回顧性綜述論文，介紹機器學習與深度學習兩大 AI 方法論，並梳理 AI 在胰臟膽道疾病的研究版圖。胰膽疾病診斷與治療選擇複雜，常需整合多來源資料；AI 可應用於疾病偵測／診斷、風險分層與預後預測，輔助臨床醫師決策。",
    p5_abs_en: "A concise review of major AI methodologies (machine learning, deep learning) and the current landscape of AI research in pancreatobiliary diseases — where diagnosis and treatment selection are often complex — covering detection/diagnosis, risk stratification and prognosis prediction to supplement clinicians.",

    pub_link: "閱讀原文 ↗",
    note: "摘要為譯自原文 Abstract 之整理（英文為原文精簡），完整內容請以 PubMed 原文為準。",
    back_btn: "回到臨床證據"
  };

  var en = {
    meta_title: "Journal Publications — 5 International Papers: Topics, Abstracts & Links | PANCREASaver®",
    meta_desc: "The academic foundation of PANCREASaver®: 5 international papers in Lancet Digital Health, Radiology and more — bilingual topics, real abstracts and PubMed links.",

    ph_badge: "Publications",
    ph_title_1: "Every line of evidence, <span class=\"hl\">published internationally.</span>",
    ph_sub: "Five papers spanning algorithm development, nationwide population-based validation and real-world application — click \"Read the paper\" to open the full article on PubMed.",

    sec_t: "5 international publications",
    sec_p: "Representative publications related to PANCREASaver®, all authored by the NTU team (Kao-Lang Liu, Po-Ting Chen, Wei-Chih Liao, Weichung Wang). Chinese summaries are translated from the original abstracts; English summaries are condensed from the originals.",

    p1_t: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
    p1_t_en: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
    p1_h1: "Sensitivity for tumors <2cm",
    p1_h2: "Radiologist-missed cancers recovered",
    p1_h3: "Local test sets",
    p1_abs: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation.",
    p1_abs_en: "Approximately 40% of pancreatic tumors smaller than 2 cm evade CT detection. A CNN distinguished pancreatic cancer tissue with 97.3–99.0% sensitivity and AUC 0.997–0.999 on local test sets, and 79.0% sensitivity / AUC 0.920 on a US dataset. CNN outperformed radiologists (98.3% vs 92.9%), correctly classified 11 of 12 radiologist-missed cancers (92%), and reached 92.1% sensitivity for tumors <2 cm.",

    p2_t: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study",
    p2_t_en: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study",
    p2_h1: "Nationwide real-world CT",
    p2_h2: "Nationwide validation",
    p2_h3: "Sensitivity",
    p2_abs: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study.",
    p2_abs_en: "~40% of pancreatic tumors <2 cm are missed at abdominal CT. An end-to-end DL tool (segmentation CNN + ensemble of five CNNs) achieved 89.9% sensitivity / 95.9% specificity (AUC 0.96) internally, and across 1,473 nationwide real-world CT studies (669 malignant, 804 control): 89.7% sensitivity, 92.8% specificity, AUC 0.95, with 74.7% sensitivity for tumors <2 cm.",

    p3_t: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas",
    p3_t_en: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas",
    p3_h1: "Two-population validation",
    p3_h2: "Taiwan test set",
    p3_h3: "Sensitivity · Taiwan",
    p3_abs: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas.",
    p3_abs_en: "XGBoost radiomic analysis of CT patches distinguished PDAC from noncancerous pancreas. The generalized model (trained on Taiwanese + U.S. data) reached 94.7% sensitivity / 95.4% specificity / AUC 0.98 on the Taiwanese test set, and 80.6% / 100% / AUC 0.91 on the U.S. test set. PDACs showed lower intensity and higher heterogeneity radiomic features.",

    p4_t: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset",
    p4_t_en: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset",
    p4_h1: "Nationwide real-world CT",
    p4_h2: "Validation result",
    p4_h3: "Sensitivity",
    p4_abs: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset.",
    p4_abs_en: "An automatic end-to-end CAD tool combining 2D and 3D radiomic machine-learning analysis reached 91.8% sensitivity / 82.2% specificity / AUC 0.947 in 1,477 nationwide CT studies (671 PC, 806 controls), with 70.7% sensitivity for tumors <2 cm. Running 2D and 3D analyses in series raised specificity to 95.2%.",

    p5_t: "Applications of artificial intelligence in pancreatic and biliary diseases",
    p5_t_en: "Applications of artificial intelligence in pancreatic and biliary diseases",
    p5_h1: "Review",
    p5_h2: "Methodology overview",
    p5_h3: "Application area",
    p5_hx: "Hepatobiliary",
    p5_abs: "Applications of artificial intelligence in pancreatic and biliary diseases.",
    p5_abs_en: "A concise review of major AI methodologies (machine learning, deep learning) and the current landscape of AI research in pancreatobiliary diseases — where diagnosis and treatment selection are often complex — covering detection/diagnosis, risk stratification and prognosis prediction to supplement clinicians.",

    pub_link: "Read the paper ↗",
    note: "Chinese summaries are translated from the original abstracts (English summaries condensed); the PubMed originals are authoritative.",
    back_btn: "Back to Clinical Evidence"
  };

  var ja = {
    meta_title: "ジャーナル論文 — 5 編の国際論文：テーマ・抄録・リンク | PANCREASaver®",
    meta_desc: "PANCREASaver® の学術的基盤：Lancet Digital Health、Radiology など 5 編の国際論文のテーマ、抄録と PubMed リンク。",

    ph_badge: "Publications",
    ph_title_1: "すべてのエビデンスは、<span class=\"hl\">国際ジャーナルに。</span>",
    ph_sub: "アルゴリズム開発、全国規模の検証、リアルワールド応用にわたる 5 編の論文 — 「論文を読む」から PubMed で全文を開けます。",

    sec_t: "5 編の国際論文",
    sec_p: "PANCREASaver® に関連する代表的な 5 編の学術発表（すべて台湾大学チームによる実在の研究）。日本語訳は原文抄録に基づく整理です。",

    p1_t: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
    p1_t_en: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
    p1_h1: "<2cm 腫瘍への感度",
    p1_h2: "放射線科が見逃した症例の検出",
    p1_h3: "ローカルテストセット",
    p1_abs: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation.",
    p1_abs_en: "Approximately 40% of pancreatic tumors smaller than 2 cm evade CT detection. A CNN distinguished pancreatic cancer tissue with 97.3–99.0% sensitivity and AUC 0.997–0.999 on local test sets, and 79.0% sensitivity / AUC 0.920 on a US dataset. CNN outperformed radiologists (98.3% vs 92.9%), correctly classified 11 of 12 radiologist-missed cancers (92%), and reached 92.1% sensitivity for tumors <2 cm.",

    p2_t: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study",
    p2_t_en: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study",
    p2_h1: "全国リアルワールド CT",
    p2_h2: "全国検証",
    p2_h3: "感度",
    p2_abs: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study.",
    p2_abs_en: "~40% of pancreatic tumors <2 cm are missed at abdominal CT. An end-to-end DL tool (segmentation CNN + ensemble of five CNNs) achieved 89.9% sensitivity / 95.9% specificity (AUC 0.96) internally, and across 1,473 nationwide real-world CT studies (669 malignant, 804 control): 89.7% sensitivity, 92.8% specificity, AUC 0.95, with 74.7% sensitivity for tumors <2 cm.",

    p3_t: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas",
    p3_t_en: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas",
    p3_h1: "2 集団での検証",
    p3_hx: "米／台",
    p3_h2: "台湾テストセット",
    p3_h3: "感度・台湾",
    p3_abs: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas.",
    p3_abs_en: "XGBoost radiomic analysis of CT patches distinguished PDAC from noncancerous pancreas. The generalized model (trained on Taiwanese + U.S. data) reached 94.7% sensitivity / 95.4% specificity / AUC 0.98 on the Taiwanese test set, and 80.6% / 100% / AUC 0.91 on the U.S. test set. PDACs showed lower intensity and higher heterogeneity radiomic features.",

    p4_t: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset",
    p4_t_en: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset",
    p4_h1: "全国リアルワールド CT",
    p4_h2: "検証結果",
    p4_h3: "感度",
    p4_abs: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset.",
    p4_abs_en: "An automatic end-to-end CAD tool combining 2D and 3D radiomic machine-learning analysis reached 91.8% sensitivity / 82.2% specificity / AUC 0.947 in 1,477 nationwide CT studies (671 PC, 806 controls), with 70.7% sensitivity for tumors <2 cm. Running 2D and 3D analyses in series raised specificity to 95.2%.",

    p5_t: "Applications of artificial intelligence in pancreatic and biliary diseases",
    p5_t_en: "Applications of artificial intelligence in pancreatic and biliary diseases",
    p5_h1: "Review",
    p5_h2: "方法論の概要",
    p5_h3: "応用領域",
    p5_hx: "膵胆疾患",
    p5_abs: "Applications of artificial intelligence in pancreatic and biliary diseases.",
    p5_abs_en: "A concise review of major AI methodologies (machine learning, deep learning) and the current landscape of AI research in pancreatobiliary diseases — where diagnosis and treatment selection are often complex — covering detection/diagnosis, risk stratification and prognosis prediction to supplement clinicians.",

    pub_link: "論文を読む ↗",
    note: "日本語訳は原文抄録に基づく整理です。詳細は PubMed の原文をご確認ください。",
    back_btn: "臨床エビデンスへ戻る"
  };

  Object.assign(window.PANCAD_I18N.zh, zh);
  Object.assign(window.PANCAD_I18N.en, en);
  Object.assign(window.PANCAD_I18N.ja, ja);
})();
