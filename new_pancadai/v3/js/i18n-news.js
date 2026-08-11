/* v3 news 頁字典 — 在 common 之後載入，覆蓋/新增 news 專屬 key */
window.PANCAD_I18N = window.PANCAD_I18N || {};

var _newsZh = {
  meta_title: '新聞消息 — 仲智數位健康｜PANCREASaver® 助胰見®',
  meta_desc: '仲智數位健康（PanCAD.ai）最新消息：專利佈局、醫療合作、病患衛教講座。',
  'news.head': '新聞消息',
  'news.desc': '仲智數位健康的最新動態 — 技術進展、醫療合作與社會關懷。',
  'news.n1_d': '2026 · 國際肯定', 'news.n1_t': '台美專利佈局再添一筆，全球市場擴張加速',
  'news.n1_p': 'PANCREASaver® 持續深化國際智財佈局，鞏固突破性技術領先地位。台美兩地專利組合持續擴充，為全球市場擴張奠定堅實基礎。',
  'news.n2_d': '2026 · 醫療合作', 'news.n2_t': '助胰見® 持續擴大醫療機構合作網絡',
  'news.n2_p': '從醫學中心到健檢中心，AI 早期偵測服務觸及更多國人。累積服務人次突破 300+，持續守護更多家庭。',
  'news.n3_d': '2026 · 病患關懷', 'news.n3_t': '病患衛教講座：活出精彩 不胰憾',
  'news.n3_p': '攜手醫療機構舉辦胰臟健康衛教講座，傳遞早期篩檢觀念。讓更多人了解：檢查，是為了繼續活出精彩的日子。',
  'news.n4_d': '2026 · 學術肯定', 'news.n4_t': '研究成果再獲國際頂尖期刊肯定',
  'news.n4_p': 'PANCREASaver® 核心技術相關研究持續發表於國際權威期刊，接受全球同儕審查，鞏固學術領導地位。',
  'news.n5_d': '2026 · 技術進展', 'news.n5_t': 'AI 模型效能持續優化，敏感度再提升',
  'news.n5_p': '透過持續的臨床資料回饋與模型迭代，PANCREASaver® 對微小病灶的偵測效能持續精進。',
  'news.n6_d': '2026 · 健康台灣', 'news.n6_t': '深耕計畫擴大合作，AI 早期偵測深入社區',
  'news.n6_p': '呼應「健康台灣」政策，攜手更多醫療機構與健檢中心，讓 AI 早期偵測服務深入社區。'
};
var _newsEn = {
  meta_title: 'News — PanCAD.ai｜PANCREASaver®',
  meta_desc: 'Latest news from PanCAD.ai: patents, medical partnerships, patient education.',
  'news.head': 'News',
  'news.desc': 'The latest from PanCAD.ai — technology progress, medical partnerships, and patient care.',
  'news.n1_d': '2026 · Global recognition', 'news.n1_t': 'Another US-Taiwan patent granted as global expansion accelerates',
  'news.n1_p': 'PANCREASaver® continues to deepen its international IP portfolio. The growing US-Taiwan patent family lays a solid foundation for global expansion.',
  'news.n2_d': '2026 · Medical partnerships', 'news.n2_t': 'PANCREASaver® expands its network of partner institutions',
  'news.n2_p': 'From medical centers to health check centers, AI early detection now reaches more people — surpassing 300+ cumulative exams and protecting more families.',
  'news.n3_d': '2026 · Patient care', 'news.n3_t': 'Patient education seminar: Catch it early. Live it fully.',
  'news.n3_p': 'Partnering with medical institutions to host pancreatic health seminars, spreading the message: a check-up is how we keep living fully.',
  'news.n4_d': '2026 · Academic recognition', 'news.n4_t': 'Research recognized by top international journals again',
  'news.n4_p': 'PANCREASaver® core technology research continues to be published in leading international journals, reinforcing its academic leadership.',
  'news.n5_d': '2026 · Technology progress', 'news.n5_t': 'AI model performance keeps improving — sensitivity rises further',
  'news.n5_p': 'Through continuous clinical data feedback and model iteration, PANCREASaver® detection performance for tiny lesions keeps advancing.',
  'news.n6_d': '2026 · Health Taiwan', 'news.n6_t': 'Deep cultivation expands — AI early detection reaches communities',
  'news.n6_p': 'Responding to the Health Taiwan policy, we partner with more institutions and health check centers to bring AI early detection into communities.'
};
var _newsJa = {
  meta_title: 'ニュース — 仲智数位健康｜PANCREASaver® 助胰見®',
  meta_desc: '仲智数位健康（PanCAD.ai）の最新情報：特許、医療連携、患者教育。',
  'news.head': 'ニュース',
  'news.desc': '仲智数位健康の最新情報 — 技術進展、医療連携、社会貢献。',
  'news.n1_d': '2026 · 国際的評価', 'news.n1_t': '台湾・米国特許を追加取得、グローバル展開を加速',
  'news.n1_p': 'PANCREASaver® は国際的な知的財産戦略をさらに深化。台湾・米国の特許ポートフォリオ拡充がグローバル展開の基盤を固めます。',
  'news.n2_d': '2026 · 医療連携', 'news.n2_t': '助胰見® の医療機関ネットワークが拡大',
  'news.n2_p': '医学センターから健診センターまで、AI早期発見サービスがより多くの人に届き、累計300+件を突破。より多くの家族を守ります。',
  'news.n3_d': '2026 · 患者支援', 'news.n3_t': '患者教育セミナー：人生、悔いなし。',
  'news.n3_p': '医療機関と連携し、膵臓健康セミナーを開催。検査は、人生を精一杯生き続けるために — そのメッセージを広めます。',
  'news.n4_d': '2026 · 学術的評価', 'news.n4_t': '研究成果が再び国際トップジャーナルに掲載',
  'news.n4_p': 'PANCREASaver® の中核技術研究は国際的な権威ジャーナルに掲載され続け、学術的リーダーシップを強化しています。',
  'news.n5_d': '2026 · 技術進展', 'news.n5_t': 'AIモデル性能が継続的に向上、感度さらにアップ',
  'news.n5_p': '継続的な臨床データフィードバックとモデル改善により、微小病変の検出性能は進化し続けています。',
  'news.n6_d': '2026 · 健康台湾', 'news.n6_t': '深耕計画が拡大、AI早期発見が地域社会へ',
  'news.n6_p': '「健康台湾」政策に応え、より多くの医療機関・健診センターと連携し、AI早期発見サービスを地域社会に届けます。'
};

// 與 common 字典合併（common 已定義 nav/foot 等共用 key）
function _merge(lang, extra) {
  var base = window.PANCAD_I18N[lang] || {};
  for (var k in extra) base[k] = extra[k];
  window.PANCAD_I18N[lang] = base;
}
_merge('zh', _newsZh);
_merge('en', _newsEn);
_merge('ja', _newsJa);
