/* scriptmobile.js - 手機版專用邏輯 (完整修復版) */

/* 1. 手機版邏輯 - 自動縮放功能 */
function resizePreview() {
    const wrapper = document.getElementById('scale-wrapper');
    const margin = 30;
    const availableWidth = window.innerWidth - margin;
    let scale = availableWidth / 2500;
    if (scale > 0.5) scale = 0.5; 
    if (wrapper) wrapper.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', resizePreview);
window.addEventListener('load', resizePreview);

/* 2. 定義資料庫 (最優先執行) */
// 原始 56 個圖示 (帶文字)
const originalIcons = [
    { id: "guide", name: "掛號及\n就醫指南", type: "outline", svg: '<svg viewBox="0 0 100 100"><path d="M50,90 C50,90 10,65 10,35 C10,15 25,5 45,15 C50,18 50,18 55,15 C75,5 90,15 90,35 C90,65 50,90 50,90 Z" /><polyline points="25,35 35,35 45,20 55,50 65,35 75,35" /></svg>' },
    { id: "news", name: "最新消息", type: "fill", svg: '<svg viewBox="0 0 24 24"><path d="M20,3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V5C22,3.9,21.1,3,20,3z M19,19H5v-2h14V19z M19,15H5v-2h14V15z M19,11H5V7h14V11z"/></svg>' },
    { id: "app", name: "APP下載及\n病人參與問卷", type: "outline", svg: '<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke-width="2"/><line x1="11" y1="18" x2="13" y2="18" stroke-width="2"/></svg>' },
    { id: "feature", name: "特色醫療及\n衛教專區", type: "fill", svg: '<svg viewBox="0 0 24 24"><path d="M19,11h-5V6c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v5H5c-0.55,0-1,0.45-1,1v2c0,0.55,0.45,1,1,1h5v5c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-5h5c0.55,0,1-0.45,1-1v-2C20,11.45,19.55,11,19,11z"/></svg>' },
    { id: "heart", name: "亞東❤️健康", type: "special", svg: '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
    { id: "bind", name: "綁定資訊", type: "outline", svg: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>' }
];

// 通用路徑
const basePaths = ["M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z", "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", "M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1h-1v1h1v1h-1v1h1v1h-1v2h1v1h-2z"];
// 科技醫療路徑
const techMedPaths = ["M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.5-7.5H7v-2h7.5V8H7v-2h7.5V4H20v15H6.5z", "M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M7,10H9V14H7V10M11,7H13V14H11V7M15,12H17V14H15V12Z"];

// 擴充邏輯
let allPaths = [];
for (let i = 0; i < 70; i++) basePaths.forEach(p => allPaths.push(p));
for (let i = 0; i < 10; i++) techMedPaths.forEach(p => allPaths.push(p));

const extendedIcons = allPaths.map((path, index) => ({ 
    id: `ext_${index}`, 
    name: "", 
    type: "fill", 
    svg: `<svg viewBox="0 0 24 24"><path d="${path}"/></svg>` 
}));

const internalIconData = [...originalIcons, ...extendedIcons];

// 外部圖庫列表
const faString = "fa-solid fa-house,fa-solid fa-user,fa-solid fa-check,fa-solid fa-phone,fa-solid fa-star,fa-solid fa-music,fa-solid fa-heart,fa-solid fa-gear,fa-solid fa-cloud,fa-solid fa-camera,fa-solid fa-lock,fa-solid fa-car,fa-solid fa-list,fa-solid fa-book,fa-solid fa-gift,fa-solid fa-bell,fa-solid fa-fire,fa-solid fa-eye,fa-solid fa-plane,fa-solid fa-key,fa-solid fa-leaf,fa-solid fa-truck,fa-solid fa-bicycle,fa-solid fa-rocket,fa-solid fa-shop,fa-solid fa-laptop,fa-solid fa-mobile,fa-solid fa-tablet,fa-solid fa-desktop,fa-solid fa-keyboard,fa-solid fa-mouse,fa-solid fa-printer,fa-solid fa-wifi,fa-solid fa-server,fa-solid fa-database,fa-solid fa-microchip,fa-solid fa-battery-full,fa-solid fa-plug,fa-solid fa-signal,fa-solid fa-film,fa-solid fa-video,fa-solid fa-microphone,fa-solid fa-headphones,fa-solid fa-volume-high,fa-solid fa-music,fa-solid fa-radio,fa-solid fa-podcast,fa-solid fa-rss,fa-solid fa-share,fa-solid fa-thumbs-up,fa-solid fa-thumbs-down,fa-solid fa-comment,fa-solid fa-comments,fa-solid fa-quote-left,fa-solid fa-quote-right,fa-solid fa-calendar,fa-solid fa-clock,fa-solid fa-tag,fa-solid fa-tags,fa-solid fa-map,fa-solid fa-location-dot,fa-solid fa-compass,fa-solid fa-flag,fa-solid fa-trophy,fa-solid fa-medal,fa-solid fa-crown,fa-solid fa-lightbulb,fa-solid fa-bolt,fa-solid fa-umbrella,fa-solid fa-sun,fa-solid fa-moon,fa-solid fa-snowflake,fa-solid fa-water,fa-solid fa-wind,fa-solid fa-trash,fa-solid fa-pen,fa-solid fa-pencil,fa-solid fa-eraser,fa-solid fa-scissors,fa-solid fa-copy,fa-solid fa-paste,fa-solid fa-save,fa-solid fa-folder,fa-solid fa-folder-open,fa-solid fa-file,fa-solid fa-file-pdf,fa-solid fa-file-word,fa-solid fa-file-excel,fa-solid fa-file-powerpoint,fa-solid fa-file-image,fa-solid fa-file-audio,fa-solid fa-file-video,fa-solid fa-file-code,fa-solid fa-chart-pie,fa-solid fa-chart-bar,fa-solid fa-chart-line,fa-solid fa-chart-area,fa-solid fa-table,fa-solid fa-list-ul,fa-solid fa-list-ol,fa-solid fa-check-square,fa-solid fa-square-check,fa-solid fa-square-xmark,fa-solid fa-circle-check,fa-solid fa-circle-xmark,fa-solid fa-circle-exclamation,fa-solid fa-circle-info,fa-solid fa-circle-question,fa-solid fa-circle-user,fa-solid fa-user-plus,fa-solid fa-user-minus,fa-solid fa-user-group,fa-solid fa-users,fa-solid fa-user-doctor,fa-solid fa-user-nurse,fa-solid fa-stethoscope,fa-solid fa-hospital,fa-solid fa-syringe,fa-solid fa-pills,fa-solid fa-tablets,fa-solid fa-capsules,fa-solid fa-prescription-bottle,fa-solid fa-first-aid,fa-solid fa-bandage,fa-solid fa-crutch,fa-solid fa-wheelchair,fa-solid fa-x-ray,fa-solid fa-bone,fa-solid fa-tooth,fa-solid fa-brain,fa-solid fa-lungs,fa-solid fa-heart-pulse,fa-solid fa-virus,fa-solid fa-bacteria,fa-solid fa-hand-holding-medical,fa-brands fa-facebook,fa-brands fa-twitter,fa-brands fa-instagram,fa-brands fa-linkedin,fa-brands fa-youtube,fa-brands fa-pinterest,fa-brands fa-tiktok,fa-brands fa-snapchat,fa-brands fa-whatsapp,fa-brands fa-telegram,fa-brands fa-skype,fa-brands fa-discord,fa-brands fa-slack,fa-brands fa-trello,fa-brands fa-github,fa-brands fa-gitlab,fa-brands fa-bitbucket,fa-brands fa-google,fa-brands fa-apple,fa-brands fa-android,fa-brands fa-windows,fa-brands fa-linux,fa-brands fa-chrome,fa-brands fa-firefox,fa-brands fa-edge,fa-brands fa-safari,fa-brands fa-opera,fa-brands fa-internet-explorer,fa-brands fa-amazon,fa-brands fa-ebay,fa-brands fa-paypal,fa-brands fa-stripe,fa-brands fa-cc-visa,fa-brands fa-cc-mastercard,fa-brands fa-cc-amex,fa-brands fa-cc-discover,fa-brands fa-bitcoin,fa-brands fa-ethereum";
const matString = "home,search,settings,check,favorite,add,delete,menu,close,star,login,logout,refresh,edit,done,image,account_circle,info,help,warning,error,cancel,bolt,shopping_cart,filter_list,visibility,calendar_today,schedule,language,face,lock,fingerprint,dashboard,code,description,receipt,event,list,folder,cloud,cloud_upload,save,print,share,play_arrow,pause,stop,mic,videocam,camera_alt,local_hospital,medical_services,healing,medication,health_and_safety,monitor_heart,bloodtype,vaccines,emergency,local_pharmacy,sanitizer,masks,sick,coronavirus,pregnant_woman,wheelchair_pickup,accessible,hearing,computer,laptop,smartphone,wifi,bluetooth,map,place,location_on,directions_car,directions_bus,flight,train,credit_card,payments,shopping_bag,store,restaurant,cake,sports_soccer,fitness_center,wb_sunny,dark_mode,water_drop,build,pets,recycling,mail,call,notifications,person,group";
const biString = "bi-house,bi-search,bi-gear,bi-check-lg,bi-x-lg,bi-list,bi-person,bi-envelope,bi-telephone,bi-chat,bi-heart,bi-star,bi-cloud,bi-trash,bi-pencil,bi-file-earmark,bi-image,bi-camera,bi-music-note,bi-mic,bi-play-fill,bi-geo-alt,bi-calendar,bi-clock,bi-bell,bi-info-circle,bi-question-circle,bi-exclamation-circle,bi-arrow-right,bi-arrow-left,bi-hospital,bi-prescription,bi-capsule,bi-lungs,bi-virus,bi-bandaid,bi-heart-pulse,bi-thermometer,bi-laptop,bi-phone,bi-wifi,bi-bluetooth,bi-battery-full,bi-printer,bi-cart,bi-credit-card,bi-wallet,bi-cash-coin,bi-facebook,bi-twitter,bi-instagram,bi-linkedin,bi-youtube,bi-whatsapp,bi-google,bi-apple,bi-android,bi-windows,bi-lightbulb,bi-lightning,bi-moon,bi-sun,bi-water,bi-fire,bi-bicycle,bi-car-front,bi-airplane,bi-train-front,bi-truck,bi-basket,bi-box-seam,bi-briefcase,bi-calculator,bi-controller,bi-cup-hot,bi-droplet,bi-eye,bi-film,bi-flag,bi-flower1,bi-folder,bi-globe,bi-grid,bi-hammer,bi-headphones,bi-hourglass,bi-key,bi-link,bi-lock,bi-map,bi-megaphone,bi-palette,bi-pie-chart,bi-pin,bi-power,bi-puzzle,bi-qr-code,bi-receipt,bi-robot,bi-rss,bi-scissors,bi-screwdriver,bi-shield,bi-shop,bi-signpost,bi-sliders,bi-speaker,bi-speedometer,bi-stopwatch,bi-tablet,bi-tag,bi-terminal,bi-ticket,bi-tools,bi-trophy,bi-umbrella,bi-usb,bi-vector-pen,bi-webcam,bi-window,bi-wrench,bi-zoom-in,bi-zoom-out";
const riString = "ri-home-line,ri-search-line,ri-settings-3-line,ri-user-line,ri-heart-line,ri-star-line,ri-check-line,ri-close-line,ri-menu-line,ri-add-line,ri-arrow-right-line,ri-mail-line,ri-chat-1-line,ri-phone-line,ri-share-line,ri-download-line,ri-cloud-line,ri-delete-bin-line,ri-edit-line,ri-file-line,ri-folder-line,ri-image-line,ri-camera-line,ri-music-line,ri-mic-line,ri-play-line,ri-map-pin-line,ri-car-line,ri-bus-line,ri-train-line,ri-flight-takeoff-line,ri-bike-line,ri-walk-line,ri-ship-line,ri-truck-line,ri-hospital-line,ri-heart-pulse-line,ri-capsule-line,ri-medicine-bottle-line,ri-microscope-line,ri-flask-line,ri-virus-line,ri-lungs-line,ri-thermometer-line,ri-stethoscope-line,ri-syringe-line,ri-first-aid-kit-line,ri-surgical-mask-line,ri-wheelchair-line,ri-nurse-line,ri-computer-line,ri-laptop-line,ri-smartphone-line,ri-tablet-line,ri-device-line,ri-wifi-line,ri-bluetooth-line,ri-battery-charge-line,ri-shopping-cart-line,ri-bank-card-line,ri-facebook-line,ri-twitter-line,ri-instagram-line,ri-linkedin-line,ri-youtube-line,ri-whatsapp-line,ri-google-line,ri-apple-line,ri-android-line,ri-windows-line,ri-global-line,ri-earth-line,ri-lightbulb-line,ri-moon-line,ri-sun-line,ri-drop-line,ri-fire-line,ri-leaf-line,ri-seedling-line,ri-plant-line,ri-tree-line,ri-flower-line,ri-goblet-line,ri-cup-line,ri-restaurant-line,ri-knife-line,ri-cake-line,ri-football-line,ri-basketball-line,ri-gamepad-line,ri-store-line,ri-building-line,ri-hotel-line,ri-home-wifi-line,ri-archive-line,ri-inbox-line,ri-send-plane-line,ri-attachment-line,ri-flag-line,ri-bookmark-line,ri-notification-line,ri-alarm-line,ri-timer-line,ri-calculator-line,ri-calendar-line,ri-file-copy-line,ri-save-line,ri-folder-add-line,ri-folder-upload-line,ri-device-line,ri-sim-card-line,ri-sd-card-line,ri-u-disk-line,ri-hard-drive-line,ri-router-line,ri-qr-code-line,ri-barcode-line,ri-scan-line,ri-search-eye-line,ri-zoom-in-line,ri-zoom-out-line,ri-key-line,ri-lock-line,ri-unlock-line,ri-shield-line,ri-shield-check-line,ri-shield-user-line,ri-user-add-line,ri-user-follow-line,ri-user-unfollow-line,ri-group-line,ri-team-line,ri-emotion-line,ri-emotion-happy-line,ri-emotion-unhappy-line";
const bxString = "bx bx-home,bx bx-user,bx bx-search,bx bx-cog,bx bx-message,bx bx-phone,bx bx-envelope,bx bx-calendar,bx bx-time,bx bx-map,bx bx-car,bx bx-heart,bx bx-star,bx bx-share,bx bx-download,bx bx-cloud,bx bx-wifi,bx bx-bluetooth,bx bx-battery,bx bx-camera,bx bx-music,bx bx-image,bx bx-file,bx bx-folder,bx bx-trash,bx bx-edit,bx bx-lock,bx bx-check,bx bx-x,bx bx-plus,bx bx-menu,bx bx-play,bx bx-laptop,bx bx-mobile,bx bx-bulb,bx bx-sun,bx bx-moon,bx bx-globe,bx bx-shopping-bag,bx bx-cart,bx bx-credit-card,bx bx-wallet,bx bx-money,bx bxl-facebook,bx bxl-twitter,bx bxl-instagram,bx bxl-linkedin,bx bxl-youtube,bx bxl-whatsapp,bx bxl-google,bx bxl-apple,bx bxl-android,bx bxl-windows,bx bx-first-aid,bx bx-injection,bx bx-capsule,bx bx-pulse,bx bx-health,bx bx-plus-medical,bx bx-accessibility,bx bx-run,bx bx-walk,bx bx-cycling,bx bx-train,bx bx-bus,bx bx-plane,bx bx-rocket,bx bx-anchor,bx bx-world,bx bx-planet,bx bx-buildings,bx bx-store,bx bx-restaurant,bx bx-coffee,bx bx-beer,bx bx-drink,bx bx-dish,bx bx-cake,bx bx-gift,bx bx-award,bx bx-medal,bx bx-trophy,bx bx-crown,bx bx-diamond,bx bx-joystick,bx bx-game,bx bx-dice-1,bx bx-film,bx bx-video,bx bx-microphone,bx bx-headphone,bx bx-speaker,bx bx-volume-full,bx bx-volume-mute,bx bx-bell,bx bx-alarm,bx bx-stopwatch,bx bx-timer,bx bx-calculator,bx bx-pie-chart,bx bx-bar-chart,bx bx-line-chart,bx bx-table,bx bx-layout,bx bx-grid,bx bx-list-ul,bx bx-list-ol,bx bx-check-square,bx bx-checkbox,bx bx-toggle-left,bx bx-toggle-right,bx bx-slider,bx bx-adjust,bx bx-aperture,bx bx-archive,bx bx-at,bx bx-band-aid,bx bx-barcode,bx bx-beaker,bx bx-block,bx bx-book,bx bx-bookmark,bx bx-border-all,bx bx-box,bx bx-briefcase,bx bx-bug,bx bx-building";
const tiString = "ti ti-home,ti ti-user,ti ti-search,ti ti-settings,ti ti-menu-2,ti ti-x,ti ti-check,ti ti-plus,ti ti-minus,ti ti-edit,ti ti-trash,ti ti-download,ti ti-upload,ti ti-cloud,ti ti-folder,ti ti-file,ti ti-photo,ti ti-camera,ti ti-video,ti ti-music,ti ti-volume,ti ti-microphone,ti ti-mail,ti ti-message,ti ti-phone,ti ti-share,ti ti-heart,ti ti-star,ti ti-bell,ti ti-calendar,ti ti-clock,ti ti-map-pin,ti ti-car,ti ti-ambulance,ti ti-first-aid-kit,ti ti-stethoscope,ti ti-syringe,ti ti-pill,ti ti-virus,ti ti-activity,ti ti-heartbeat,ti ti-lungs,ti ti-thermometer,ti ti-microscope,ti ti-flask,ti ti-dna,ti ti-wheelchair,ti ti-device-laptop,ti ti-device-mobile,ti ti-wifi,ti ti-bluetooth,ti ti-battery,ti ti-cpu,ti ti-server,ti ti-database,ti ti-code,ti ti-shield,ti ti-lock,ti ti-key,ti ti-fingerprint,ti ti-shopping-cart,ti ti-credit-card,ti ti-wallet,ti ti-currency-dollar,ti ti-brand-facebook,ti ti-brand-twitter,ti ti-brand-instagram,ti ti-brand-linkedin,ti ti-brand-youtube,ti ti-brand-whatsapp,ti ti-brand-google,ti ti-brand-apple,ti ti-brand-android,ti ti-brand-windows";
const phString = "ph ph-house,ph ph-magnifying-glass,ph ph-user,ph ph-gear,ph ph-list,ph ph-x,ph ph-check,ph ph-plus,ph ph-minus,ph ph-pencil-simple,ph ph-trash,ph ph-download-simple,ph ph-upload-simple,ph ph-cloud,ph ph-folder,ph ph-file,ph ph-image,ph ph-camera,ph ph-video,ph ph-music-note,ph ph-speaker-high,ph ph-microphone,ph ph-envelope,ph ph-chat-circle,ph ph-phone,ph ph-share-network,ph ph-heart,ph ph-star,ph ph-thumbs-up,ph ph-bell,ph ph-calendar-blank,ph ph-clock,ph ph-map-pin,ph ph-car,ph ph-bus,ph ph-airplane,ph ph-ambulance,ph ph-first-aid,ph ph-stethoscope,ph ph-syringe,ph ph-pill,ph ph-virus,ph ph-activity,ph ph-heartbeat,ph ph-thermometer,ph ph-flask,ph ph-dna,ph ph-wheelchair,ph ph-laptop,ph ph-desktop,ph ph-device-mobile,ph ph-device-tablet,ph ph-wifi-high,ph ph-bluetooth,ph ph-battery-full,ph ph-cpu,ph ph-code,ph ph-shield-check,ph ph-lock-key,ph ph-fingerprint,ph ph-shopping-cart,ph ph-bag,ph ph-credit-card,ph ph-wallet,ph ph-currency-dollar,ph ph-facebook-logo,ph ph-twitter-logo,ph ph-instagram-logo,ph ph-linkedin-logo,ph ph-youtube-logo,ph ph-whatsapp-logo,ph ph-google-logo,ph ph-apple-logo,ph ph-android-logo,ph ph-windows-logo";
const ionString = "icon ion-md-home,icon ion-ios-home,icon ion-md-search,icon ion-ios-search,icon ion-md-settings,icon ion-ios-settings,icon ion-md-person,icon ion-ios-person,icon ion-md-mail,icon ion-ios-mail,icon ion-md-call,icon ion-ios-call,icon ion-md-heart,icon ion-ios-heart,icon ion-md-star,icon ion-ios-star,icon ion-md-close,icon ion-ios-close,icon ion-md-add,icon ion-ios-add,icon ion-md-trash,icon ion-ios-trash,icon ion-md-cloud,icon ion-ios-cloud,icon ion-md-download,icon ion-ios-download,icon ion-md-camera,icon ion-ios-camera,icon ion-md-mic,icon ion-ios-mic,icon ion-md-map,icon ion-ios-map,icon ion-md-navigate,icon ion-ios-navigate,icon ion-md-car,icon ion-ios-car,icon ion-md-bus,icon ion-ios-bus,icon ion-md-bicycle,icon ion-ios-bicycle,icon ion-md-medkit,icon ion-ios-medkit,icon ion-md-pulse,icon ion-ios-pulse,icon ion-md-thermometer,icon ion-ios-thermometer,icon ion-md-wifi,icon ion-ios-wifi,icon ion-md-bluetooth,icon ion-ios-bluetooth,icon ion-md-battery-full,icon ion-ios-battery-full,icon ion-md-code,icon ion-ios-code,icon ion-md-lock,icon ion-ios-lock,icon ion-md-cart,icon ion-ios-cart,icon ion-logo-facebook,icon ion-logo-twitter,icon ion-logo-instagram,icon ion-logo-linkedin,icon ion-logo-youtube,icon ion-logo-whatsapp,icon ion-logo-skype,icon ion-logo-github,icon ion-logo-google,icon ion-logo-apple,icon ion-logo-android,icon ion-logo-windows";


// === 3. 程式主邏輯 ===

/* 取得 DOM 元素 */
const mainCanvas = document.getElementById("main-canvas");
const iconLibrary = document.getElementById("icon-library");
const manualInputContainer = document.getElementById("manual-input-container");
const statusText = document.getElementById("status-text");
const textInput = document.getElementById("text-input");
const fontSizeInput = document.getElementById("font-size-input");
const iconSizeInput = document.getElementById("icon-size-input");
const fontFamilySelect = document.getElementById("font-family-select");
const libraryArea = document.getElementById("library-area");
const sourceSelect = document.getElementById("icon-source-select");
const manualCodeInput = document.getElementById("manual-code");
const manualLabel = document.getElementById("manual-label");

let selectedSlotIndex = 0;
let currentSourceMode = "internal";

// 初始化 Slot 狀態
let slotState = [
    { type: "internal", val: 0, customText: originalIcons[0].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 1, customText: originalIcons[1].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 2, customText: originalIcons[2].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 3, customText: originalIcons[3].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 4, customText: originalIcons[4].name, style: "green", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 5, customText: originalIcons[5].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 }
];

// 渲染畫布
function renderCanvas() {
    mainCanvas.innerHTML = "";
    slotState.forEach((state, slotIndex) => {
        const slot = document.createElement("div");
        slot.className = "slot-card";
        if (state.style === "green") slot.classList.add("special-green");
        if (slotIndex === selectedSlotIndex) slot.classList.add("active-slot");

        let iconHTML = "";
        if (state.type === "none") {
            iconHTML = ""; 
        } else if (state.type === "internal") {
            const icon = internalIconData[state.val] || internalIconData[0];
            let svgContent = icon.svg;
            if (icon.type === "outline") {
                svgContent = svgContent.replace("<svg", `<svg style="width:${state.iconSize}px;height:${state.iconSize}px;" class="icon-display icon-outline"`);
            } else {
                svgContent = svgContent.replace("<svg", `<svg style="width:${state.iconSize}px;height:${state.iconSize}px;" class="icon-display icon-fill"`);
            }
            iconHTML = svgContent;
        } else {
            // External fonts
            let fs = state.iconSize; 
            if (state.type === "material") {
                 iconHTML = `<span style="font-size:${fs}px;" class="material-icons external-icon-render">${state.val}</span>`;
            } else if (state.type === "bootstrap") {
                 iconHTML = `<i style="font-size:${fs}px;" class="bi ${state.val} external-icon-render"></i>`;
            } else {
                 iconHTML = `<i style="font-size:${fs}px;" class="${state.val} external-icon-render"></i>`;
            }
        }

        slot.innerHTML = `${iconHTML}<div class="label-display" style="font-size: ${state.fontSize}px; font-family: ${state.fontFamily};">${state.customText}</div>`;
        slot.onclick = () => selectSlot(slotIndex);
        mainCanvas.appendChild(slot);
    });
}

// 選擇格子
function selectSlot(index) {
    selectedSlotIndex = index;
    const state = slotState[index];
    statusText.textContent = `編輯 #${index + 1}`;
    textInput.value = state.customText;
    fontSizeInput.value = state.fontSize;
    iconSizeInput.value = state.iconSize;
    fontFamilySelect.value = state.fontFamily;
    
    // Auto Open Panel via UI logic (defined in HTML)
    if(window.openPanel) window.openPanel();
    
    if (state.type === "none") {
        sourceSelect.value = "none";
        changeIconSource("none");
    } else if (state.type === "internal") {
        sourceSelect.value = "internal";
        changeIconSource("internal");
    } else {
        sourceSelect.value = state.type;
        changeIconSource(state.type);
    }
    renderCanvas();
}

function updateText(val) { slotState[selectedSlotIndex].customText = val; renderCanvas(); }
function updateFontSize(val) { slotState[selectedSlotIndex].fontSize = val; renderCanvas(); }
function updateIconSize(val) { slotState[selectedSlotIndex].iconSize = val; renderCanvas(); }
function updateFontFamily(val) { slotState[selectedSlotIndex].fontFamily = val; renderCanvas(); }
function toggleSlotStyle() {
    const currentStyle = slotState[selectedSlotIndex].style;
    slotState[selectedSlotIndex].style = currentStyle === "green" ? "white" : "green";
    renderCanvas();
}

function changeIconSource(source) {
    currentSourceMode = source;
    iconLibrary.scrollTop = 0;
    
    if (source === "internal") {
        manualInputContainer.style.display = "none";
        renderInternalLibrary();
    } else if (source === "none") {
        manualInputContainer.style.display = "none";
        iconLibrary.innerHTML = "<div style='width:100%;text-align:center;padding:20px;color:#888;'>無圖示</div>";
        slotState[selectedSlotIndex].type = "none";
        renderCanvas();
    } else {
        manualInputContainer.style.display = "flex";
        manualLabel.textContent = "代碼";
        let list = [];
        if(source === 'fontawesome') list = faString.split(',');
        else if(source === 'material') list = matString.split(',');
        else if(source === 'bootstrap') list = biString.split(',');
        else if(source === 'remix') list = riString.split(',');
        else if(source === 'boxicons') list = bxString.split(',');
        else if(source === 'tabler') list = tiString.split(',');
        else if(source === 'phosphor') list = phString.split(',');
        else if(source === 'ionicons') list = ionString.split(',');
        
        renderLibraryList(list, source);
    }
}

function renderInternalLibrary() {
    iconLibrary.innerHTML = "";
    // 渲染前 150 個優化效能
    const fragment = document.createDocumentFragment();
    internalIconData.slice(0, 200).forEach((icon, index) => {
        const item = document.createElement("div");
        item.className = "lib-item";
        let smallSvg = icon.svg.replace("<svg", '<svg style="fill:#00854a"');
        item.innerHTML = `${smallSvg}<div class="lib-name">${icon.name.replace("\n", "")}</div>`;
        item.onclick = () => {
            slotState[selectedSlotIndex].type = "internal";
            slotState[selectedSlotIndex].val = index;
            if (icon.name) {
                slotState[selectedSlotIndex].customText = icon.name;
                textInput.value = icon.name;
            } else {
                slotState[selectedSlotIndex].customText = "";
                textInput.value = "";
            }
            renderCanvas();
        };
        fragment.appendChild(item);
    });
    iconLibrary.appendChild(fragment);
}

function renderLibraryList(list, type) {
    iconLibrary.innerHTML = "";
    const fragment = document.createDocumentFragment();
    list.slice(0, 300).forEach(val => {
        const item = document.createElement("div");
        item.className = "lib-item";
        let preview = "";
        let shortName = val;
        
        if (type === "fontawesome") {
            shortName = val.replace("fa-solid fa-", "").replace("fa-brands fa-", "");
            preview = `<i class="${val}"></i>`;
        } else if (type === "material") {
            preview = `<span class="material-icons">${val}</span>`;
        } else if (type === "bootstrap") {
            shortName = val.replace("bi-", "");
            preview = `<i class="bi ${val}"></i>`;
        } else {
            preview = `<i class="${val}"></i>`;
        }
        
        item.innerHTML = `${preview}<div class="lib-name">${shortName}</div>`;
        item.onclick = () => {
            slotState[selectedSlotIndex].type = type;
            slotState[selectedSlotIndex].val = val;
            renderCanvas();
        };
        fragment.appendChild(item);
    });
    iconLibrary.appendChild(fragment);
}

function applyManualIcon() {
    const val = manualCodeInput.value;
    if (!val) return;
    slotState[selectedSlotIndex].type = currentSourceMode;
    slotState[selectedSlotIndex].val = val;
    renderCanvas();
}

function saveAsJpeg() {
    const node = document.getElementById("main-canvas");
    const originalHideState = node.classList.contains('hide-selection');
    if (!originalHideState) node.classList.add('hide-selection');

    const wrapper = document.getElementById("scale-wrapper");
    const originalTransform = wrapper.style.transform;
    
    // 恢復原始大小進行截圖
    wrapper.style.transform = "none"; 

    // Clone node & Force Styles for Download
    const clone = node.cloneNode(true);
    clone.style.width = "2500px";
    clone.style.height = "1686px";
    clone.style.position = "fixed";
    clone.style.top = "0";
    clone.style.left = "-9999px";
    clone.style.transform = "none";
    
    // [關鍵修正]：移除 border-radius 確保背景是直角
    clone.style.borderRadius = "0";
    clone.style.overflow = "hidden"; // 確保內容不溢出
    
    // 確保 Clone 裡面的 slot-card 有 border-radius
    const clonedCards = clone.querySelectorAll('.slot-card');
    clonedCards.forEach(card => {
        card.style.borderRadius = "40px"; // 強制寫入 style
    });

    document.body.appendChild(clone);

    html2canvas(clone, {
        width: 2500,
        height: 1686,
        scale: 1,
        useCORS: true,
        backgroundColor: "#f4f6f8" // 指定背景色，避免透明導致圓角失效
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "hospital-menu-mobile.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.9);
        link.click();
        
        document.body.removeChild(clone);
        wrapper.style.transform = originalTransform;
        if (!originalHideState) node.classList.remove('hide-selection');
    }).catch(err => {
        alert("截圖失敗");
        console.error(err);
        wrapper.style.transform = originalTransform;
        if(clone.parentNode) document.body.removeChild(clone);
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    textInput.value = slotState[0].customText;
    renderInternalLibrary(); 
    renderCanvas();
    resizePreview();
});