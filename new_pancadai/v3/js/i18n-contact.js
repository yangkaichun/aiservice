/* v3 contact 頁字典 — 在 common 之後載入，覆蓋/新增 contact 專屬 key */
window.PANCAD_I18N = window.PANCAD_I18N || {};

var _ctZh = {
  meta_title: '聯絡我們 — 仲智數位健康｜PANCREASaver® 助胰見®',
  meta_desc: '與仲智數位健康（PanCAD.ai）聯繫：病患諮詢、醫療機構合作、健檢中心導入。',
  'ct.head': '與我們<span class="hl">聯繫</span>',
  'ct.desc': '無論您是醫療機構、健檢中心，或想了解胰臟癌早期篩檢，都歡迎與我們聯繫。',
  'ct.info': '仲智數位健康股份有限公司',
  'ct.addr_t': '地址', 'ct.mail_t': 'Email', 'ct.web_t': '網站', 'ct.license_t': '醫療器材許可證',
  'ct.license': '衛部醫器製字第 007946 號',
  'ct.tab1': '病患/家屬諮詢', 'ct.tab2': '醫療機構合作', 'ct.tab3': '媒體聯繫', 'ct.tab4': '其他',
  'ct.name': '姓名', 'ct.name_ph': '請輸入您的姓名',
  'ct.email': 'Email', 'ct.email_ph': 'name@example.com',
  'ct.topic': '主題', 'ct.msg': '訊息', 'ct.msg_ph': '請描述您的需求…',
  'ct.submit': '送出訊息'
};
var _ctEn = {
  meta_title: 'Contact Us — PanCAD.ai｜PANCREASaver®',
  meta_desc: 'Contact PanCAD.ai: patient inquiries, medical institution partnerships, health check center deployment.',
  'ct.head': 'Get in <span class="hl">touch</span>',
  'ct.desc': 'Whether you\'re a medical institution, a health check center, or curious about pancreatic cancer screening — talk to us.',
  'ct.info': 'PanCAD.ai (Zhongzhi Digital Health)',
  'ct.addr_t': 'Address', 'ct.mail_t': 'Email', 'ct.web_t': 'Website', 'ct.license_t': 'Medical Device License',
  'ct.license': 'TFDA License No. 007946',
  'ct.tab1': 'Patient / Family Inquiry', 'ct.tab2': 'Medical Institution Partnership', 'ct.tab3': 'Media', 'ct.tab4': 'Other',
  'ct.name': 'Name', 'ct.name_ph': 'Your name',
  'ct.email': 'Email', 'ct.email_ph': 'name@example.com',
  'ct.topic': 'Topic', 'ct.msg': 'Message', 'ct.msg_ph': 'Tell us how we can help…',
  'ct.submit': 'Send Message'
};
var _ctJa = {
  meta_title: 'お問い合わせ — 仲智数位健康｜PANCREASaver® 助胰見®',
  meta_desc: '仲智数位健康（PanCAD.ai）へのお問い合わせ：患者相談、医療機関連携、健診センター導入。',
  'ct.head': 'お<span class="hl">問い合わせ</span>',
  'ct.desc': '医療機関、健診センター、あるいは膵臓癌検診にご興味のある方も、お気軽にご連絡ください。',
  'ct.info': '仲智数位健康股份有限公司',
  'ct.addr_t': '住所', 'ct.mail_t': 'Email', 'ct.web_t': 'ウェブサイト', 'ct.license_t': '医療機器認可',
  'ct.license': '衛部医器製字第 007946 号',
  'ct.tab1': '患者さま・ご家族からの相談', 'ct.tab2': '医療機関との連携', 'ct.tab3': 'メディア', 'ct.tab4': 'その他',
  'ct.name': 'お名前', 'ct.name_ph': 'お名前をご入力ください',
  'ct.email': 'Email', 'ct.email_ph': 'name@example.com',
  'ct.topic': '件名', 'ct.msg': 'メッセージ', 'ct.msg_ph': 'ご要望をご記入ください…',
  'ct.submit': '送信する'
};

function _mergeCt(lang, extra) {
  var base = window.PANCAD_I18N[lang] || {};
  for (var k in extra) base[k] = extra[k];
  window.PANCAD_I18N[lang] = base;
}
_mergeCt('zh', _ctZh);
_mergeCt('en', _ctEn);
_mergeCt('ja', _ctJa);
