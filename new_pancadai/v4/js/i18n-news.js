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
  'news.n3_p': '攜手醫療機構舉辦胰臟健康衛教講座，傳遞早期篩檢觀念。讓更多人了解：檢查，是為了繼續活出精彩的日子。'
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
  'news.n3_p': 'Partnering with medical institutions to host pancreatic health seminars, spreading the message: a check-up is how we keep living fully.'
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
  'news.n3_p': '医療機関と連携し、膵臓健康セミナーを開催。検査は、人生を精一杯生き続けるために — そのメッセージを広めます。'
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
