/* pancad.ai v11 — publications 字典（期刊論文館）?v=11 */
(function () {
  var zh = {
    meta_title: "胰臟癌 CT AI 文獻｜6 篇期刊研究與原文｜PANCREASaver®",
    meta_desc: "查閱 6 篇胰臟癌與 PDAC 的 CT AI 同行審查研究，涵蓋診斷前影像、多中心驗證與影像組學，附摘要、DOI 與 PubMed 原文連結。",

    ph_badge: "期刊論文館",
    ph_title_1: "胰臟癌 CT AI 研究，<span class=\"hl\">每篇都有原文依據。</span>",
    ph_sub: "6 篇同行審查研究，涵蓋胰臟癌與 PDAC 的 CT AI、診斷前影像、多中心驗證與影像組學；每篇附摘要整理與 DOI／PubMed 查證連結。",

    sec_t: "6 篇國際期刊論文",
    sec_p: "以下為 PANCREASaver® 相關的 6 篇代表學術發表，涵蓋胰臟導管腺癌（pancreatic ductal adenocarcinoma, PDAC）與 CT 醫學影像 AI；皆為臺大團隊之真實研究。摘要為整理，完整內容請見 PubMed 原文。",

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

    p6_t: "人工智慧於診斷前與診斷時電腦斷層檢查中早期偵測胰臟癌：多中心回溯性病例對照研究",
    p6_t_en: "Artificial Intelligence for Early Detection of Pancreatic Cancer in Prediagnostic and Diagnostic Computed Tomography Examinations: A Multicenter Retrospective Case-control Study",
    p6_tag: "多中心病例對照研究",
    p6_h1_value: "診斷前 CT",
    p6_h1: "臨床診斷前 1–12 個月",
    p6_h2_value: "多中心",
    p6_h2: "回溯性研究",
    p6_h3_value: "病例對照",
    p6_h3: "胰臟癌偵測",
    p6_abs: "本多中心回溯性病例對照研究以顯影增強 CT 評估 AI 工具，包含臨床診斷前 1–12 個月取得的影像，並以正常胰臟及其他胰臟疾病為對照，評估胰臟癌偵測。",
    p6_abs_en: "A multicenter retrospective case-control study evaluated an AI tool on contrast-enhanced CT, including scans obtained 1–12 months before clinical diagnosis. It assessed pancreatic cancer detection against normal pancreas and other pancreatic diseases.",

    pub_link: "閱讀原文 ↗",
    note: "摘要為原文摘要的整理與翻譯；完整研究內容請以 DOI 對應的期刊原文為準，PubMed 提供索引與摘要資訊。",
    back_btn: "回到臨床證據"
  };

  var en = {
    meta_title: "Pancreatic Cancer CT AI Research | 6 Publications | PANCREASaver®",
    meta_desc: "Explore 6 peer-reviewed pancreatic cancer and PDAC CT AI studies, including prediagnostic imaging, multicenter validation and radiomics, with summaries, DOI and PubMed links.",

    ph_badge: "Publications",
    ph_title_1: "Pancreatic cancer CT AI research,<span class=\"hl\">with links to the evidence.</span>",
    ph_sub: "Six peer-reviewed studies on pancreatic cancer and PDAC CT AI, spanning prediagnostic imaging, multicenter validation and radiomics — with summaries and source links.",

    sec_t: "6 international publications",
    sec_p: "Representative PANCREASaver® publications covering pancreatic ductal adenocarcinoma (PDAC), CT detection, and AI-assisted medical imaging. The work comes from the NTU team; summaries are condensed from the original abstracts, and PubMed is authoritative.",

    p1_t: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
    p1_t_en: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation",
    p1_h1: "Sensitivity for tumors under 2 cm",
    p1_h2: "Radiologist-missed cancers recovered",
    p1_h3: "Local test sets",
    p1_abs: "Deep learning to distinguish pancreatic cancer tissue from non-cancerous pancreatic tissue: a retrospective study with cross-racial external validation.",
    p1_abs_en: "Some pancreatic tumors smaller than 2 cm may be missed on CT; the cited study reports results for a defined study population. A CNN distinguished pancreatic cancer tissue with 97.3–99.0% sensitivity and AUC 0.997–0.999 on local test sets, and 79.0% sensitivity / AUC 0.920 on a U.S. dataset. CNN outperformed radiologists (98.3% vs. 92.9%), correctly classified 11 of 12 radiologist-missed cancers (92%), and reached 92.1% sensitivity for tumors under 2 cm.",

    p2_t: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study",
    p2_t_en: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study",
    p2_h1: "Nationwide real-world CT",
    p2_h2: "Nationwide validation",
    p2_h3: "Sensitivity",
    p2_abs: "Pancreatic Cancer Detection on CT Scans with Deep Learning: A Nationwide Population-based Study.",
    p2_abs_en: "The cited study reports that some pancreatic tumors under 2 cm may be missed on abdominal CT. An end-to-end deep-learning tool (segmentation CNN plus an ensemble of five CNNs) achieved 89.9% sensitivity, 95.9% specificity, and AUC 0.96 internally. Across 1,473 nationwide real-world CT studies (669 malignant, 804 controls), it achieved 89.7% sensitivity, 92.8% specificity, and AUC 0.95, with 74.7% sensitivity for tumors under 2 cm.",

    p3_t: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas",
    p3_t_en: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas",
    p3_h1: "Two-population validation",
    p3_hx: "Taiwan / U.S.",
    p3_h2: "Taiwan test set",
    p3_h3: "Sensitivity · Taiwan",
    p3_abs: "Radiomic Features at CT Can Distinguish Pancreatic Cancer from Noncancerous Pancreas.",
    p3_abs_en: "XGBoost radiomic analysis of CT patches distinguished PDAC from noncancerous pancreas. The generalized model (trained on Taiwan and U.S. cohorts) reached 94.7% sensitivity / 95.4% specificity / AUC 0.98 on the Taiwanese test set, and 80.6% / 100% / AUC 0.91 on the U.S. test set. PDACs showed lower intensity and higher heterogeneity radiomic features.",

    p4_t: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset",
    p4_t_en: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset",
    p4_h1: "Nationwide real-world CT",
    p4_h2: "Validation result",
    p4_h3: "Sensitivity",
    p4_abs: "Detection of pancreatic cancer with two- and three-dimensional radiomic analysis in a nationwide population-based real-world dataset.",
    p4_abs_en: "An automatic end-to-end CAD tool combining 2D and 3D radiomic machine-learning analysis reached 91.8% sensitivity, 82.2% specificity, and AUC 0.947 in 1,477 nationwide CT studies (671 cancer cases, 806 controls), with 70.7% sensitivity for tumors under 2 cm. Running 2D and 3D analyses in series raised specificity to 95.2%.",

    p5_t: "Applications of artificial intelligence in pancreatic and biliary diseases",
    p5_t_en: "Applications of artificial intelligence in pancreatic and biliary diseases",
    p5_h1: "Review",
    p5_h2: "Methodology overview",
    p5_h3: "Application area",
    p5_hx: "Hepatobiliary",
    p5_abs: "Applications of artificial intelligence in pancreatic and biliary diseases.",
    p5_abs_en: "A concise review of major AI methodologies (machine learning, deep learning) and the current landscape of AI research in pancreatobiliary diseases — where diagnosis and treatment selection are often complex — covering detection/diagnosis, risk stratification and prognosis prediction to supplement clinicians.",

    p6_t: "Artificial Intelligence for Early Detection of Pancreatic Cancer in Prediagnostic and Diagnostic Computed Tomography Examinations: A Multicenter Retrospective Case-control Study",
    p6_t_en: "Artificial Intelligence for Early Detection of Pancreatic Cancer in Prediagnostic and Diagnostic Computed Tomography Examinations: A Multicenter Retrospective Case-control Study",
    p6_tag: "Multicenter case-control study",
    p6_h1_value: "Earlier CT",
    p6_h1: "1–12 months before diagnosis",
    p6_h2_value: "Multicenter",
    p6_h2: "Retrospective study",
    p6_h3_value: "Case-control",
    p6_h3: "Pancreatic cancer detection",
    p6_abs: "A multicenter retrospective case-control study evaluated an AI tool on contrast-enhanced CT, including scans obtained 1–12 months before clinical diagnosis. It assessed pancreatic cancer detection against normal pancreas and other pancreatic diseases.",
    p6_abs_en: "A multicenter retrospective case-control study evaluated an AI tool on contrast-enhanced CT, including scans obtained 1–12 months before clinical diagnosis. It assessed pancreatic cancer detection against normal pancreas and other pancreatic diseases.",

    pub_link: "Read the paper ↗",
    note: "Summaries are condensed from the original abstracts. DOI links identify the journal articles; PubMed provides citation and abstract information.",
    back_btn: "Back to Clinical Evidence"
  };

  var ja = {
    meta_title: "膵がん CT AI 研究｜6 編の論文・抄録・原文 | PANCREASaver®",
    meta_desc: "膵がん・PDAC の CT AI に関する 6 編の査読論文。診断前画像、多施設検証、ラジオミクスの研究概要と DOI・PubMed 原文リンクを掲載しています。",

    ph_badge: "Publications",
    ph_title_1: "膵がん CT AI の研究を、<span class=\"hl\">原文で確かめる。</span>",
    ph_sub: "膵がん・PDAC の CT AI、診断前画像、多施設検証、ラジオミクスを扱う 6 編の査読論文。研究概要と DOI／PubMed の参照リンクを掲載しています。",

    sec_t: "6 編の国際論文",
    sec_p: "PANCREASaver® に関連する代表的な 6 編の学術発表（すべて台湾大学チームによる実在の研究）。日本語訳は原文抄録に基づく整理です。",

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

    p6_t: "診断前および診断時の CT 検査における人工知能による膵がんの早期検出：多施設後ろ向き症例対照研究",
    p6_t_en: "診断前および診断時の CT 検査における人工知能による膵がんの早期検出：多施設後ろ向き症例対照研究",
    p6_tag: "多施設症例対照研究",
    p6_h1_value: "診断前 CT",
    p6_h1: "臨床診断の 1–12 か月前",
    p6_h2_value: "多施設",
    p6_h2: "後ろ向き研究",
    p6_h3_value: "症例対照",
    p6_h3: "膵がんの検出",
    p6_abs: "多施設後ろ向き症例対照研究で、臨床診断の 1–12 か月前に撮影された画像を含む造影 CT を用いて AI ツールを評価しました。正常膵臓および他の膵疾患を対照として、膵がんの検出を検討しました。",
    p6_abs_en: "多施設後ろ向き症例対照研究で、臨床診断の 1–12 か月前に撮影された画像を含む造影 CT を用いて AI ツールを評価しました。正常膵臓および他の膵疾患を対照として、膵がんの検出を検討しました。",

    pub_link: "論文を読む ↗",
    note: "研究概要は原文抄録に基づく要約・翻訳です。詳細は DOI から論文原文をご確認ください。PubMed では書誌情報と抄録を参照できます。",
    back_btn: "臨床エビデンスへ戻る"
  };

  Object.assign(window.PANCAD_I18N.zh, zh);
  Object.assign(window.PANCAD_I18N.en, en);
  Object.assign(window.PANCAD_I18N.ja, ja);
})();
