/* 修復版 script.js
   1. 使用 split(',') 產生大型陣列，避免語法錯誤
   2. 修正 saveAsJpeg 確保白色卡片無灰邊
*/

const mainCanvas = document.getElementById("main-canvas");
const iconLibrary = document.getElementById("icon-library");
const manualInputContainer = document.getElementById("manual-input-container");
const statusText = document.getElementById("status-text");
const textInput = document.getElementById("text-input");
const libraryArea = document.getElementById("library-area");
const panelBtnText = document.getElementById("panel-btn-text");
const borderBtnText = document.getElementById("border-btn-text");
const sourceSelect = document.getElementById("icon-source-select");
const manualCodeInput = document.getElementById("manual-code");
const manualLabel = document.getElementById("manual-label");

let selectedSlotIndex = 0;
let currentSourceMode = "internal";

// === 1. 內建圖示資料 ===
const originalIcons = [
    { id: "guide", name: "掛號及\n就醫指南", type: "outline", svg: '<svg viewBox="0 0 100 100"><path d="M50,90 C50,90 10,65 10,35 C10,15 25,5 45,15 C50,18 50,18 55,15 C75,5 90,15 90,35 C90,65 50,90 50,90 Z" /><polyline points="25,35 35,35 45,20 55,50 65,35 75,35" /></svg>' },
    { id: "news", name: "最新消息", type: "fill", svg: '<svg viewBox="0 0 24 24"><path d="M20,3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V5C22,3.9,21.1,3,20,3z M19,19H5v-2h14V19z M19,15H5v-2h14V15z M19,11H5V7h14V11z"/></svg>' },
    { id: "app", name: "APP下載及\n病人參與問卷", type: "outline", svg: '<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke-width="2"/><line x1="11" y1="18" x2="13" y2="18" stroke-width="2"/></svg>' },
    { id: "feature", name: "特色醫療及\n衛教專區", type: "fill", svg: '<svg viewBox="0 0 24 24"><path d="M19,11h-5V6c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v5H5c-0.55,0-1,0.45-1,1v2c0,0.55,0.45,1,1,1h5v5c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-5h5c0.55,0,1-0.45,1-1v-2C20,11.45,19.55,11,19,11z"/></svg>' },
    { id: "heart", name: "亞東❤️健康", type: "special", svg: '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
    { id: "bind", name: "綁定資訊", type: "outline", svg: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>' }
];
// 內建擴充
const basePaths = ["M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z", "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", "M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1h-1v1h1v1h-1v1h1v1h-1v2h1v1h-2z"];
let allPaths = [];
for (let i = 0; i < 70; i++) basePaths.forEach(p => allPaths.push(p));
const extendedIcons = allPaths.map((path, index) => ({ id: `ext_${index}`, name: "", type: "fill", svg: `<svg viewBox="0 0 24 24"><path d="${path}"/></svg>` }));
const internalIconData = [...originalIcons, ...extendedIcons];

// === 2. 外部圖示列表 (安全字串分割法) ===
// 這些字串透過 split 轉換為陣列，避免手動輸入引號錯誤
const faString = "fa-solid fa-house,fa-solid fa-user,fa-solid fa-check,fa-solid fa-phone,fa-solid fa-star,fa-solid fa-music,fa-solid fa-heart,fa-solid fa-gear,fa-solid fa-cloud,fa-solid fa-camera,fa-solid fa-lock,fa-solid fa-car,fa-solid fa-list,fa-solid fa-book,fa-solid fa-gift,fa-solid fa-bell,fa-solid fa-fire,fa-solid fa-eye,fa-solid fa-plane,fa-solid fa-key,fa-solid fa-leaf,fa-solid fa-truck,fa-solid fa-bicycle,fa-solid fa-rocket,fa-solid fa-shop,fa-solid fa-laptop,fa-solid fa-mobile,fa-solid fa-tablet,fa-solid fa-desktop,fa-solid fa-keyboard,fa-solid fa-mouse,fa-solid fa-printer,fa-solid fa-wifi,fa-solid fa-server,fa-solid fa-database,fa-solid fa-microchip,fa-solid fa-battery-full,fa-solid fa-plug,fa-solid fa-signal,fa-solid fa-film,fa-solid fa-video,fa-solid fa-microphone,fa-solid fa-headphones,fa-solid fa-volume-high,fa-solid fa-music,fa-solid fa-radio,fa-solid fa-podcast,fa-solid fa-rss,fa-solid fa-share,fa-solid fa-thumbs-up,fa-solid fa-thumbs-down,fa-solid fa-comment,fa-solid fa-comments,fa-solid fa-quote-left,fa-solid fa-quote-right,fa-solid fa-calendar,fa-solid fa-clock,fa-solid fa-tag,fa-solid fa-tags,fa-solid fa-map,fa-solid fa-location-dot,fa-solid fa-compass,fa-solid fa-flag,fa-solid fa-trophy,fa-solid fa-medal,fa-solid fa-crown,fa-solid fa-lightbulb,fa-solid fa-bolt,fa-solid fa-umbrella,fa-solid fa-sun,fa-solid fa-moon,fa-solid fa-snowflake,fa-solid fa-water,fa-solid fa-wind,fa-solid fa-trash,fa-solid fa-pen,fa-solid fa-pencil,fa-solid fa-eraser,fa-solid fa-scissors,fa-solid fa-copy,fa-solid fa-paste,fa-solid fa-save,fa-solid fa-folder,fa-solid fa-folder-open,fa-solid fa-file,fa-solid fa-file-pdf,fa-solid fa-file-word,fa-solid fa-file-excel,fa-solid fa-file-powerpoint,fa-solid fa-file-image,fa-solid fa-file-audio,fa-solid fa-file-video,fa-solid fa-file-code,fa-solid fa-chart-pie,fa-solid fa-chart-bar,fa-solid fa-chart-line,fa-solid fa-chart-area,fa-solid fa-table,fa-solid fa-list-ul,fa-solid fa-list-ol,fa-solid fa-check-square,fa-solid fa-square-check,fa-solid fa-square-xmark,fa-solid fa-circle-check,fa-solid fa-circle-xmark,fa-solid fa-circle-exclamation,fa-solid fa-circle-info,fa-solid fa-circle-question,fa-solid fa-circle-user,fa-solid fa-user-plus,fa-solid fa-user-minus,fa-solid fa-user-group,fa-solid fa-users,fa-solid fa-user-doctor,fa-solid fa-user-nurse,fa-solid fa-stethoscope,fa-solid fa-hospital,fa-solid fa-syringe,fa-solid fa-pills,fa-solid fa-tablets,fa-solid fa-capsules,fa-solid fa-prescription-bottle,fa-solid fa-first-aid,fa-solid fa-bandage,fa-solid fa-crutch,fa-solid fa-wheelchair,fa-solid fa-x-ray,fa-solid fa-bone,fa-solid fa-tooth,fa-solid fa-brain,fa-solid fa-lungs,fa-solid fa-heart-pulse,fa-solid fa-virus,fa-solid fa-bacteria,fa-solid fa-hand-holding-medical,fa-brands fa-facebook,fa-brands fa-twitter,fa-brands fa-instagram,fa-brands fa-linkedin,fa-brands fa-youtube,fa-brands fa-pinterest,fa-brands fa-tiktok,fa-brands fa-snapchat,fa-brands fa-whatsapp,fa-brands fa-telegram,fa-brands fa-skype,fa-brands fa-discord,fa-brands fa-slack,fa-brands fa-trello,fa-brands fa-github,fa-brands fa-gitlab,fa-brands fa-bitbucket,fa-brands fa-google,fa-brands fa-apple,fa-brands fa-android,fa-brands fa-windows,fa-brands fa-linux,fa-brands fa-chrome,fa-brands fa-firefox,fa-brands fa-edge,fa-brands fa-safari,fa-brands fa-opera,fa-brands fa-internet-explorer,fa-brands fa-amazon,fa-brands fa-ebay,fa-brands fa-paypal,fa-brands fa-stripe,fa-brands fa-cc-visa,fa-brands fa-cc-mastercard,fa-brands fa-cc-amex,fa-brands fa-cc-discover,fa-brands fa-bitcoin,fa-brands fa-ethereum";
const matString = "home,search,settings,check,favorite,add,delete,menu,close,star,login,logout,refresh,edit,done,image,account_circle,info,help,warning,error,cancel,bolt,shopping_cart,filter_list,visibility,calendar_today,schedule,language,face,lock,fingerprint,dashboard,code,description,receipt,event,list,folder,cloud,cloud_upload,save,print,share,play_arrow,pause,stop,mic,videocam,camera_alt,local_hospital,medical_services,healing,medication,health_and_safety,monitor_heart,bloodtype,vaccines,emergency,local_pharmacy,sanitizer,masks,sick,coronavirus,pregnant_woman,wheelchair_pickup,accessible,hearing,computer,laptop,smartphone,wifi,bluetooth,map,place,location_on,directions_car,directions_bus,flight,train,credit_card,payments,shopping_bag,store,restaurant,cake,sports_soccer,fitness_center,wb_sunny,dark_mode,water_drop,build,pets,recycling,mail,call,notifications,person,group";
const biString = "bi-house,bi-search,bi-gear,bi-check-lg,bi-x-lg,bi-list,bi-person,bi-envelope,bi-telephone,bi-chat,bi-heart,bi-star,bi-cloud,bi-trash,bi-pencil,bi-file-earmark,bi-image,bi-camera,bi-music-note,bi-mic,bi-play-fill,bi-geo-alt,bi-calendar,bi-clock,bi-bell,bi-info-circle,bi-question-circle,bi-exclamation-circle,bi-arrow-right,bi-arrow-left,bi-hospital,bi-prescription,bi-capsule,bi-lungs,bi-virus,bi-bandaid,bi-heart-pulse,bi-thermometer,bi-laptop,bi-phone,bi-wifi,bi-bluetooth,bi-battery-full,bi-printer,bi-cart,bi-credit-card,bi-wallet,bi-cash-coin,bi-facebook,bi-twitter,bi-instagram,bi-linkedin,bi-youtube,bi-whatsapp,bi-google,bi-apple,bi-android,bi-windows,bi-lightbulb,bi-lightning,bi-moon,bi-sun,bi-water,bi-fire,bi-bicycle,bi-car-front,bi-airplane,bi-train-front,bi-truck,bi-basket,bi-box-seam,bi-briefcase,bi-calculator,bi-controller,bi-cup-hot,bi-droplet,bi-eye,bi-film,bi-flag,bi-flower1,bi-folder,bi-globe,bi-grid,bi-hammer,bi-headphones,bi-hourglass,bi-key,bi-link,bi-lock,bi-map,bi-megaphone,bi-palette,bi-pie-chart,bi-pin,bi-power,bi-puzzle,bi-qr-code,bi-receipt,bi-robot,bi-rss,bi-scissors,bi-screwdriver,bi-shield,bi-shop,bi-signpost,bi-sliders,bi-speaker,bi-speedometer,bi-stopwatch,bi-tablet,bi-tag,bi-terminal,bi-ticket,bi-tools,bi-trophy,bi-umbrella,bi-usb,bi-vector-pen,bi-webcam,bi-window,bi-wrench,bi-zoom-in,bi-zoom-out";
const riString = "ri-home-line,ri-search-line,ri-settings-3-line,ri-user-line,ri-heart-line,ri-star-line,ri-check-line,ri-close-line,ri-menu-line,ri-add-line,ri-arrow-right-line,ri-mail-line,ri-chat-1-line,ri-phone-line,ri-share-line,ri-download-line,ri-cloud-line,ri-delete-bin-line,ri-edit-line,ri-file-line,ri-folder-line,ri-image-line,ri-camera-line,ri-music-line,ri-mic-line,ri-play-line,ri-map-pin-line,ri-car-line,ri-hospital-line,ri-heart-pulse-line,ri-capsule-line,ri-virus-line,ri-lungs-line,ri-thermometer-line,ri-stethoscope-line,ri-syringe-line,ri-first-aid-kit-line,ri-wheelchair-line,ri-nurse-line,ri-computer-line,ri-smartphone-line,ri-wifi-line,ri-bluetooth-line,ri-battery-charge-line,ri-shopping-cart-line,ri-bank-card-line,ri-facebook-line,ri-twitter-line,ri-instagram-line,ri-linkedin-line,ri-youtube-line,ri-whatsapp-line,ri-google-line,ri-apple-line,ri-android-line,ri-windows-line,ri-global-line,ri-earth-line,ri-lightbulb-line,ri-moon-line,ri-sun-line,ri-drop-line,ri-fire-line,ri-leaf-line,ri-seedling-line,ri-plant-line,ri-tree-line,ri-flower-line,ri-goblet-line,ri-cup-line,ri-restaurant-line,ri-knife-line,ri-cake-line,ri-football-line,ri-basketball-line,ri-gamepad-line,ri-store-line,ri-building-line,ri-hotel-line,ri-home-wifi-line,ri-archive-line,ri-inbox-line,ri-send-plane-line,ri-attachment-line,ri-flag-line,ri-bookmark-line,ri-notification-line,ri-alarm-line,ri-timer-line,ri-calculator-line,ri-calendar-line,ri-file-copy-line,ri-save-line,ri-folder-add-line,ri-folder-upload-line,ri-device-line,ri-sim-card-line,ri-sd-card-line,ri-u-disk-line,ri-hard-drive-line,ri-router-line,ri-qr-code-line,ri-barcode-line,ri-scan-line,ri-search-eye-line,ri-zoom-in-line,ri-zoom-out-line,ri-key-line,ri-lock-line,ri-unlock-line,ri-shield-line,ri-shield-check-line,ri-shield-user-line,ri-user-add-line,ri-user-follow-line,ri-user-unfollow-line,ri-group-line,ri-team-line,ri-emotion-line,ri-emotion-happy-line,ri-emotion-unhappy-line";
const bxString = "bx bx-home,bx bx-user,bx bx-search,bx bx-cog,bx bx-message,bx bx-phone,bx bx-envelope,bx bx-calendar,bx bx-time,bx bx-map,bx bx-car,bx bx-heart,bx bx-star,bx bx-share,bx bx-download,bx bx-cloud,bx bx-wifi,bx bx-bluetooth,bx bx-battery,bx bx-camera,bx bx-music,bx bx-image,bx bx-file,bx bx-folder,bx bx-trash,bx bx-edit,bx bx-lock,bx bx-check,bx bx-x,bx bx-plus,bx bx-menu,bx bx-play,bx bx-laptop,bx bx-mobile,bx bx-bulb,bx bx-sun,bx bx-moon,bx bx-globe,bx bx-shopping-bag,bx bx-cart,bx bx-credit-card,bx bx-wallet,bx bx-money,bx bxl-facebook,bx bxl-twitter,bx bxl-instagram,bx bxl-linkedin,bx bxl-youtube,bx bxl-whatsapp,bx bxl-google,bx bxl-apple,bx bxl-android,bx bxl-windows,bx bx-first-aid,bx bx-injection,bx bx-capsule,bx bx-pulse,bx bx-health,bx bx-plus-medical,bx bx-accessibility,bx bx-run,bx bx-walk,bx bx-cycling,bx bx-train,bx bx-bus,bx bx-plane,bx bx-rocket,bx bx-anchor,bx bx-world,bx bx-planet,bx bx-buildings,bx bx-store,bx bx-restaurant,bx bx-coffee,bx bx-beer,bx bx-drink,bx bx-dish,bx bx-cake,bx bx-gift,bx bx-award,bx bx-medal,bx bx-trophy,bx bx-crown,bx bx-diamond,bx bx-joystick,bx bx-game,bx bx-dice-1,bx bx-film,bx bx-video,bx bx-microphone,bx bx-headphone,bx bx-speaker,bx bx-volume-full,bx bx-volume-mute,bx bx-bell,bx bx-alarm,bx bx-stopwatch,bx bx-timer,bx bx-calculator,bx bx-pie-chart,bx bx-bar-chart,bx bx-line-chart,bx bx-table,bx bx-layout,bx bx-grid,bx bx-list-ul,bx bx-list-ol,bx bx-check-square,bx bx-checkbox,bx bx-toggle-left,bx bx-toggle-right,bx bx-slider,bx bx-adjust,bx bx-aperture,bx bx-archive,bx bx-at,bx bx-band-aid,bx bx-barcode,bx bx-beaker,bx bx-block,bx bx-book,bx bx-bookmark,bx bx-border-all,bx bx-box,bx bx-briefcase,bx bx-bug,bx bx-building";
const tiString = "ti ti-home,ti ti-user,ti ti-search,ti ti-settings,ti ti-menu-2,ti ti-x,ti ti-check,ti ti-plus,ti ti-minus,ti ti-edit,ti ti-trash,ti ti-download,ti ti-upload,ti ti-cloud,ti ti-folder,ti ti-file,ti ti-photo,ti ti-camera,ti ti-video,ti ti-music,ti ti-volume,ti ti-microphone,ti ti-mail,ti ti-message,ti ti-phone,ti ti-share,ti ti-heart,ti ti-star,ti ti-bell,ti ti-calendar,ti ti-clock,ti ti-map-pin,ti ti-car,ti ti-ambulance,ti ti-first-aid-kit,ti ti-stethoscope,ti ti-syringe,ti ti-pill,ti ti-virus,ti ti-activity,ti ti-heartbeat,ti ti-lungs,ti ti-thermometer,ti ti-microscope,ti ti-flask,ti ti-dna,ti ti-wheelchair,ti ti-device-laptop,ti ti-device-mobile,ti ti-wifi,ti ti-bluetooth,ti ti-battery,ti ti-cpu,ti ti-server,ti ti-database,ti ti-code,ti ti-shield,ti ti-lock,ti ti-key,ti ti-fingerprint,ti ti-shopping-cart,ti ti-credit-card,ti ti-wallet,ti ti-currency-dollar,ti ti-brand-facebook,ti ti-brand-twitter,ti ti-brand-instagram,ti ti-brand-linkedin,ti ti-brand-youtube,ti ti-brand-whatsapp,ti ti-brand-google,ti ti-brand-apple,ti ti-brand-android,ti ti-brand-windows,ti ti-access-point,ti ti-accessible,ti ti-ad,ti ti-adjustments,ti ti-aerial-lift,ti ti-affiliate,ti ti-alarm,ti ti-alert-circle,ti ti-alien,ti ti-align-center,ti ti-analyze,ti ti-anchor,ti ti-antenna,ti ti-aperture,ti ti-app-window,ti ti-apple,ti ti-apps,ti ti-archive,ti ti-armchair,ti ti-arrow-back,ti ti-arrow-down,ti ti-arrow-forward,ti ti-arrow-left,ti ti-arrow-right,ti ti-arrow-up,ti ti-arrows-sort,ti ti-artboard,ti ti-aspect-ratio,ti ti-assembly,ti ti-asset,ti ti-asterisk,ti ti-at,ti ti-atom,ti ti-atom-2,ti ti-award,ti ti-axe,ti ti-backhoe,ti ti-backpack,ti ti-badge,ti ti-badges,ti ti-ball-american-football,ti ti-ball-baseball,ti ti-ball-basketball,ti ti-ball-bowling,ti ti-ball-football,ti ti-ball-tennis,ti ti-ball-volleyball,ti ti-ban,ti ti-bandage,ti ti-barbell,ti ti-barcode,ti ti-basket,ti ti-bath,ti ti-battery-1,ti ti-battery-2,ti ti-battery-3,ti ti-battery-4,ti ti-battery-automotive,ti ti-battery-charging,ti ti-battery-off,ti ti-bed,ti ti-beer,ti ti-bell-ringing";
const phString = "ph ph-house,ph ph-magnifying-glass,ph ph-user,ph ph-gear,ph ph-list,ph ph-x,ph ph-check,ph ph-plus,ph ph-minus,ph ph-pencil-simple,ph ph-trash,ph ph-download-simple,ph ph-upload-simple,ph ph-cloud,ph ph-folder,ph ph-file,ph ph-image,ph ph-camera,ph ph-video,ph ph-music-note,ph ph-microphone,ph ph-envelope,ph ph-chat-circle,ph ph-phone,ph ph-share-network,ph ph-heart,ph ph-star,ph ph-bell,ph ph-calendar-blank,ph ph-clock,ph ph-map-pin,ph ph-car,ph ph-ambulance,ph ph-first-aid,ph ph-stethoscope,ph ph-syringe,ph ph-pill,ph ph-virus,ph ph-activity,ph ph-heartbeat,ph ph-thermometer,ph ph-flask,ph ph-dna,ph ph-wheelchair,ph ph-laptop,ph ph-desktop,ph ph-device-mobile,ph ph-wifi-high,ph ph-bluetooth,ph ph-battery-full,ph ph-cpu,ph ph-code,ph ph-shield-check,ph ph-lock-key,ph ph-fingerprint,ph ph-shopping-cart,ph ph-credit-card,ph ph-wallet,ph ph-currency-dollar,ph ph-facebook-logo,ph ph-twitter-logo,ph ph-instagram-logo,ph ph-linkedin-logo,ph ph-youtube-logo,ph ph-whatsapp-logo,ph ph-google-logo,ph ph-apple-logo,ph ph-android-logo,ph ph-windows-logo,ph ph-airplane,ph ph-airplay,ph ph-alarm,ph ph-align-bottom,ph ph-align-center,ph ph-align-left,ph ph-align-right,ph ph-align-top,ph ph-anchor,ph ph-android-logo,ph ph-aperture,ph ph-app-store-logo,ph ph-app-window,ph ph-apple-podcasts-logo,ph ph-archive,ph ph-armchair,ph ph-arrow-arc-left,ph ph-arrow-arc-right,ph ph-arrow-bend-double-up-left,ph ph-arrow-bend-down-left,ph ph-arrow-bend-left-down,ph ph-arrow-bend-right-down,ph ph-arrow-bend-up-left,ph ph-arrow-circle-down,ph ph-arrow-circle-left,ph ph-arrow-circle-right,ph ph-arrow-circle-up,ph ph-arrow-clockwise,ph ph-arrow-counter-clockwise,ph ph-arrow-down,ph ph-arrow-down-left,ph ph-arrow-down-right,ph ph-arrow-elbow-down-left,ph ph-arrow-elbow-left,ph ph-arrow-elbow-right,ph ph-arrow-fat-down,ph ph-arrow-fat-left,ph ph-arrow-fat-line-down,ph ph-arrow-fat-line-left,ph ph-arrow-fat-line-right,ph ph-arrow-fat-line-up,ph ph-arrow-fat-lines-down,ph ph-arrow-fat-lines-left,ph ph-arrow-fat-lines-right,ph ph-arrow-fat-lines-up,ph ph-arrow-fat-right,ph ph-arrow-fat-up,ph ph-arrow-left,ph ph-arrow-line-down,ph ph-arrow-line-left,ph ph-arrow-line-right,ph ph-arrow-line-up,ph ph-arrow-right,ph ph-arrow-square-down,ph ph-arrow-square-in,ph ph-arrow-square-left,ph ph-arrow-square-out,ph ph-arrow-square-right,ph ph-arrow-square-up,ph ph-arrow-u-down-left,ph ph-arrow-u-down-right,ph ph-arrow-u-left-down,ph ph-arrow-u-left-up,ph ph-arrow-u-right-down,ph ph-arrow-u-right-up,ph ph-arrow-u-up-left,ph ph-arrow-u-up-right,ph ph-arrow-up,ph ph-arrow-up-left,ph ph-arrow-up-right,ph ph-arrows-clock-wise,ph ph-arrows-counter-clockwise,ph ph-arrows-down-up,ph ph-arrows-horizontal,ph ph-arrows-in,ph ph-arrows-in-cardinal,ph ph-arrows-in-line-horizontal,ph ph-arrows-in-line-vertical,ph ph-arrows-in-simple,ph ph-arrows-left-right,ph ph-arrows-out,ph ph-arrows-out-cardinal,ph ph-arrows-out-line-horizontal,ph ph-arrows-out-line-vertical,ph ph-arrows-out-simple,ph ph-arrows-vertical,ph ph-article,ph ph-asterisk,ph ph-at,ph ph-atom,ph ph-baby,ph ph-backpack,ph ph-backspace,ph ph-bag,ph ph-balloon,ph ph-bandaids,ph ph-bank,ph ph-barbell,ph ph-barcode,ph ph-barricade,ph ph-baseball,ph ph-basketball,ph ph-bathtub,ph ph-battery-charging,ph ph-battery-charging-vertical,ph ph-battery-empty,ph ph-battery-high,ph ph-battery-low,ph ph-battery-medium,ph ph-battery-plus,ph ph-battery-warning,ph ph-battery-warning-vertical,ph ph-bed,ph ph-beer-bottle,ph ph-bezier-curve,ph ph-bicycle,ph ph-binoculars,ph ph-bird,ph ph-bluetooth-connected,ph ph-bluetooth-slash,ph ph-bluetooth-x,ph ph-boat,ph ph-book,ph ph-book-bookmark,ph ph-book-open,ph ph-bookmark,ph ph-bookmark-simple,ph ph-bookmarks,ph ph-bookmarks-simple,ph ph-books,ph ph-bounding-box,ph ph-brackets-angle,ph ph-brackets-curly,ph ph-brackets-round,ph ph-brackets-square,ph ph-brain,ph ph-brandy,ph ph-briefcase,ph ph-briefcase-metal,ph ph-broadcast,ph ph-browser,ph ph-browsers,ph ph-bug-beetle,ph ph-bug-droid,ph ph-buildings,ph ph-bus,ph ph-butterfly,ph ph-cactus,ph ph-cake,ph ph-calculator,ph ph-calendar,ph ph-calendar-check,ph ph-calendar-plus,ph ph-calendar-x,ph ph-camera-rotate,ph ph-camera-slash,ph ph-campfire,ph ph-cardholder,ph ph-cards,ph ph-caret-circle-double-down,ph ph-caret-circle-double-left,ph ph-caret-circle-double-right,ph ph-caret-circle-double-up,ph ph-caret-circle-down,ph ph-caret-circle-left,ph ph-caret-circle-right,ph ph-caret-circle-up,ph ph-caret-double-down,ph ph-caret-double-left,ph ph-caret-double-right,ph ph-caret-double-up,ph ph-caret-down,ph ph-caret-left,ph ph-caret-right,ph ph-caret-up,ph ph-cat,ph ph-cell-signal-full,ph ph-cell-signal-high,ph ph-cell-signal-low,ph ph-cell-signal-medium,ph ph-cell-signal-none,ph ph-cell-signal-slash,ph ph-cell-signal-x,ph ph-chalkboard,ph ph-chalkboard-simple,ph ph-chalkboard-teacher,ph ph-chart-bar,ph ph-chart-bar-horizontal,ph ph-chart-line,ph ph-chart-line-up,ph ph-chart-pie,ph ph-chart-pie-slice,ph ph-chat,ph ph-chat-centered,ph ph-chat-centered-dots,ph ph-chat-centered-text,ph ph-chat-circle-dots,ph ph-chat-circle-text,ph ph-chat-dots,ph ph-chat-teardrop,ph ph-chat-teardrop-dots,ph ph-chat-teardrop-text,ph ph-chat-text,ph ph-chats,ph ph-chats-circle,ph ph-chats-teardrop,ph ph-check-circle,ph ph-check-square,ph ph-check-square-offset,ph ph-checks,ph ph-circle,ph ph-circle-dashed,ph ph-circle-half,ph ph-circle-half-tilt,ph ph-circle-notch,ph ph-circles-four,ph ph-circles-three,ph ph-circles-three-plus,ph ph-circuitry,ph ph-clipboard,ph ph-clipboard-text,ph ph-clock-afternoon,ph ph-clock-clockwise,ph ph-clock-counter-clockwise,ph ph-closed-captioning,ph ph-cloud-arrow-down,ph ph-cloud-arrow-up,ph ph-cloud-check,ph ph-cloud-fog,ph ph-cloud-lightning,ph ph-cloud-moon,ph ph-cloud-rain,ph ph-cloud-slash,ph ph-cloud-snow,ph ph-cloud-sun,ph ph-club,ph ph-coat-hanger,ph ph-code-simple,ph ph-coffee,ph ph-coin,ph ph-coin-vertical,ph ph-coins,ph ph-columns,ph ph-command,ph ph-compass,ph ph-computer-tower,ph ph-confetti,ph ph-cookie,ph ph-cooking-pot,ph ph-copy,ph ph-copy-simple,ph ph-copyleft,ph ph-copyright,ph ph-corners-in,ph ph-corners-out,ph ph-cpu,ph ph-credit-card,ph ph-crop,ph ph-crosshair,ph ph-crosshair-simple,ph ph-crown,ph ph-crown-simple,ph ph-cube,ph ph-currency-circle-dollar,ph ph-currency-cn-y,ph ph-currency-cny,ph ph-currency-dollar-simple,ph ph-currency-eth,ph ph-currency-eur,ph ph-currency-gbp,ph ph-currency-inr,ph ph-currency-jpy,ph ph-currency-krw,ph ph-currency-kzt,ph ph-currency-ngn,ph ph-currency-rub,ph ph-cursor,ph ph-cursor-text,ph ph-cylinder,ph ph-database,ph ph-desktop-tower,ph ph-device-mobile-camera,ph ph-device-mobile-speaker,ph ph-device-tablet-camera,ph ph-device-tablet-speaker,ph ph-diamond,ph ph-diamonds-four,ph ph-dice-five,ph ph-dice-four,ph ph-dice-one,ph ph-dice-six,ph ph-dice-three,ph ph-dice-two,ph ph-disc,ph ph-discord-logo,ph ph-divide,ph ph-dog,ph ph-door,ph ph-dots-nine,ph ph-dots-six,ph ph-dots-six-vertical,ph ph-dots-three,ph ph-dots-three-circle,ph ph-dots-three-circle-vertical,ph ph-dots-three-outline,ph ph-dots-three-outline-vertical,ph ph-dots-three-vertical,ph ph-download,ph ph-dribbble-logo,ph ph-drop,ph ph-drop-half,ph ph-drop-half-bottom,ph ph-ear,ph ph-ear-slash,ph ph-egg,ph ph-egg-crack,ph ph-eject,ph ph-eject-simple,ph ph-envelope-open,ph ph-envelope-simple,ph ph-envelope-simple-open,ph ph-equalizer,ph ph-equals,ph ph-eraser,ph ph-export,ph ph-eye,ph ph-eye-closed,ph ph-eye-slash,ph ph-eyedropper,ph ph-eyedropper-sample,ph ph-face-mask,ph ph-facebook-logo,ph ph-factory,ph ph-faders,ph ph-faders-horizontal,ph ph-fast-forward,ph ph-fast-forward-circle,ph ph-figma-logo,ph ph-file-arrow-down,ph ph-file-arrow-up,ph ph-file-audio,ph ph-file-cloud,ph ph-file-code,ph ph-file-css,ph ph-file-csv,ph ph-file-doc,ph ph-file-dotted,ph ph-file-html,ph ph-file-image,ph ph-file-jpg,ph ph-file-js,ph ph-file-jsx,ph ph-file-lock,ph ph-file-minus,ph ph-file-pdf,ph ph-file-plus,ph ph-file-png,ph ph-file-ppt,ph ph-file-rs,ph ph-file-search,ph ph-file-text,ph ph-file-ts,ph ph-file-tsx,ph ph-file-video,ph ph-file-vue,ph ph-file-x,ph ph-file-xls,ph ph-file-zip,ph ph-files,ph ph-film-script,ph ph-film-slate,ph ph-film-strip,ph ph-fingerprint-simple,ph ph-finn-the-human,ph ph-fire,ph ph-fire-simple,ph ph-first-aid-kit,ph ph-fish,ph ph-fish-simple,ph ph-flag,ph ph-flag-banner,ph ph-flag-checkered,ph ph-flame,ph ph-flashlight,ph ph-floppy-disk,ph ph-floppy-disk-back,ph ph-flow-arrow,ph ph-flower,ph ph-flower-lotus,ph ph-flying-saucer,ph ph-folder-dashed,ph ph-folder-lock,ph ph-folder-minus,ph ph-folder-notch,ph ph-folder-notch-minus,ph ph-folder-notch-open,ph ph-folder-notch-plus,ph ph-folder-open,ph ph-folder-plus,ph ph-folder-simple,ph ph-folder-simple-dashed,ph ph-folder-simple-lock,ph ph-folder-simple-minus,ph ph-folder-simple-plus,ph ph-folder-simple-star,ph ph-folder-simple-user,ph ph-folder-star,ph ph-folder-user,ph ph-folders,ph ph-football,ph ph-fork-knife,ph ph-frame-corners,ph ph-framer-logo,ph ph-function,ph ph-funnel,ph ph-funnel-simple,ph ph-game-controller,ph ph-gas-pump,ph ph-gauge,ph ph-gear-six,ph ph-gender-female,ph ph-gender-intersex,ph ph-gender-male,ph ph-gender-neuter,ph ph-gender-nonbinary,ph ph-gender-transgender,ph ph-ghost,ph ph-gif,ph ph-gift,ph ph-git-branch,ph ph-git-commit,ph ph-git-diff,ph ph-git-fork,ph ph-git-merge,ph ph-git-pull-request,ph ph-github-logo,ph ph-gitlab-logo,ph ph-globe,ph ph-globe-hemisphere-east,ph ph-globe-hemisphere-west,ph ph-globe-stand,ph ph-google-chrome-logo,ph ph-google-logo,ph ph-google-photos-logo,ph ph-google-play-logo,ph ph-google-podcasts-logo,ph ph-gradient,ph ph-graduation-cap,ph ph-graph,ph ph-grid-four,ph ph-hamburger,ph ph-hand,ph ph-hand-fist,ph ph-hand-grabbing,ph ph-hand-palm,ph ph-hand-pointing,ph ph-hand-soap,ph ph-hand-waving,ph ph-handbag,ph ph-handbag-simple,ph ph-hands-clapping,ph ph-hands-praying,ph ph-handshake,ph ph-hard-drive,ph ph-hard-drives,ph ph-hash,ph ph-hash-straight,ph ph-headlights,ph ph-headphones,ph ph-headset,ph ph-heart-break,ph ph-heart-straight,ph ph-heart-straight-break,ph ph-heartbeat,ph ph-hexagon,ph ph-high-heel,ph ph-highlighter-circle,ph ph-horse,ph ph-hourglass,ph ph-hourglass-high,ph ph-hourglass-low,ph ph-hourglass-medium,ph ph-hourglass-simple,ph ph-hourglass-simple-high,ph ph-hourglass-simple-low,ph ph-hourglass-simple-medium,ph ph-house-line,ph ph-house-simple,ph ph-ice-cream,ph ph-identification-badge,ph ph-identification-card,ph ph-image-square,ph ph-infinity,ph ph-info,ph ph-instagram-logo,ph ph-intersect,ph ph-jeep,ph ph-kanban,ph ph-key,ph ph-key-return,ph ph-keyboard,ph ph-keyhole,ph ph-knife,ph ph-ladder,ph ph-ladder-simple,ph ph-lamp,ph ph-layout,ph ph-leaf,ph ph-lifebuoy,ph ph-lightbulb,ph ph-lightbulb-filament,ph ph-lightning,ph ph-lightning-slash,ph ph-line-segment,ph ph-line-segments,ph ph-link,ph ph-link-break,ph ph-link-simple,ph ph-link-simple-break,ph ph-link-simple-horizontal,ph ph-link-simple-horizontal-break,ph ph-linkedin-logo,ph ph-linux-logo,ph ph-list,ph ph-list-bullets,ph ph-list-checks,ph ph-list-dashes,ph ph-list-numbers,ph ph-list-plus,ph ph-lock,ph ph-lock-key,ph ph-lock-key-open,ph ph-lock-laminated,ph ph-lock-laminated-open,ph ph-lock-open,ph ph-lock-simple,ph ph-lock-simple-open,ph ph-magic-wand,ph ph-magnet,ph ph-magnet-straight,ph ph-magnifying-glass,ph ph-magnifying-glass-minus,ph ph-magnifying-glass-plus,ph ph-map-pin,ph ph-map-pin-line,ph ph-map-trifold,ph ph-marker-circle,ph ph-martini,ph ph-mask-happy,ph ph-mask-sad,ph ph-math-operations,ph ph-medal,ph ph-medium-logo,ph ph-megaphone,ph ph-megaphone-simple,ph ph-messenger-logo,ph ph-microphone,ph ph-microphone-slash,ph ph-microphone-stage,ph ph-microsoft-excel-logo,ph ph-microsoft-powerpoint-logo,ph ph-microsoft-teams-logo,ph ph-microsoft-word-logo,ph ph-minus,ph ph-minus-circle,ph ph-minus-square,ph ph-money,ph ph-monitor,ph ph-monitor-play,ph ph-moon,ph ph-moon-stars,ph ph-moped,ph ph-moped-front,ph ph-motorcycle,ph ph-mouse,ph ph-mouse-simple,ph ph-music-note,ph ph-music-note-simple,ph ph-music-notes,ph ph-music-notes-plus,ph ph-music-notes-simple,ph ph-navigation-arrow,ph ph-needle,ph ph-newspaper,ph ph-newspaper-clipping,ph ph-notches,ph ph-note,ph ph-note-blank,ph ph-note-pencil,ph ph-notebook,ph ph-notepad,ph ph-notification,ph ph-number-circle-eight,ph ph-number-circle-five,ph ph-number-circle-four,ph ph-number-circle-nine,ph ph-number-circle-one,ph ph-number-circle-seven,ph ph-number-circle-six,ph ph-number-circle-three,ph ph-number-circle-two,ph ph-number-circle-zero,ph ph-number-eight,ph ph-number-five,ph ph-number-four,ph ph-number-nine,ph ph-number-one,ph ph-number-seven,ph ph-number-six,ph ph-number-square-eight,ph ph-number-square-five,ph ph-number-square-four,ph ph-number-square-nine,ph ph-number-square-one,ph ph-number-square-seven,ph ph-number-square-six,ph ph-number-square-three,ph ph-number-square-two,ph ph-number-square-zero,ph ph-number-three,ph ph-number-two,ph ph-number-zero,ph ph-nut,ph ph-ny-times-logo,ph ph-octagon,ph ph-option,ph ph-package,ph ph-paint-brush,ph ph-paint-brush-broad,ph ph-paint-brush-household,ph ph-paint-bucket,ph ph-paint-roller,ph ph-palette,ph ph-paper-plane,ph ph-paper-plane-right,ph ph-paper-plane-tilt,ph ph-paperclip,ph ph-paperclip-horizontal,ph ph-parachute,ph ph-paragraph,ph ph-path,ph ph-pause,ph ph-pause-circle,ph ph-paw-print,ph ph-peace,ph ph-pen,ph ph-pen-nib,ph ph-pen-nib-straight,ph ph-pencil,ph ph-pencil-circle,ph ph-pencil-line,ph ph-pencil-simple,ph ph-pencil-simple-line,ph ph-pencil-simple-slash,ph ph-pencil-slash,ph ph-percent,ph ph-person,ph ph-person-arms-spread,ph ph-person-simple,ph ph-person-simple-bike,ph ph-person-simple-run,ph ph-person-simple-throw,ph ph-person-simple-walk,ph ph-perspective,ph ph-phone,ph ph-phone-call,ph ph-phone-disconnect,ph ph-phone-incoming,ph ph-phone-outgoing,ph ph-phone-slash,ph ph-phone-x,ph ph-phosphor-logo,ph ph-pi,ph ph-piano-keys,ph ph-picture-in-picture,ph ph-pill,ph ph-pinterest-logo,ph ph-pinwheel,ph ph-pizza,ph ph-placeholder,ph ph-planet,ph ph-play,ph ph-play-circle,ph ph-playlist,ph ph-plug,ph ph-plug-charging,ph ph-plugs,ph ph-plugs-connected,ph ph-plus,ph ph-plus-circle,ph ph-plus-minus,ph ph-plus-square,ph ph-poker-chip,ph ph-polygon,ph ph-popcorn,ph ph-potted-plant,ph ph-power,ph ph-prescription,ph ph-presentation,ph ph-presentation-chart,ph ph-printer,ph ph-prohibit,ph ph-prohibit-inset,ph ph-projector-screen,ph ph-projector-screen-chart,ph ph-pulse,ph ph-push-pin,ph ph-push-pin-simple,ph ph-push-pin-simple-slash,ph ph-push-pin-slash,ph ph-puzzle-piece,ph ph-qr-code,ph ph-question,ph ph-queue,ph ph-quotes,ph ph-radical,ph ph-radio,ph ph-radio-button,ph ph-rainbow,ph ph-rainbow-cloud,ph ph-receipt,ph ph-receipt-x,ph ph-record,ph ph-rectangle,ph ph-recycle,ph ph-reddit-logo,ph ph-repeat,ph ph-repeat-once,ph ph-rewind,ph ph-rewind-circle,ph ph-robot,ph ph-rocket,ph ph-rocket-launch,ph ph-rows,ph ph-rug,ph ph-ruler,ph ph-scales,ph ph-scan,ph ph-scissors,ph ph-screencast,ph ph-scribble-loop,ph ph-scroll,ph ph-selection,ph ph-selection-all,ph ph-selection-background,ph ph-selection-foreground,ph ph-selection-inverse,ph ph-selection-plus,ph ph-selection-slash,ph ph-share,ph ph-share-fat,ph ph-share-network,ph ph-shield,ph ph-shield-check,ph ph-shield-chevron,ph ph-shield-plus,ph ph-shield-slash,ph ph-shield-star,ph ph-shield-warning,ph ph-shirt-folded,ph ph-shopping-bag,ph ph-shopping-bag-open,ph ph-shopping-cart,ph ph-shopping-cart-simple,ph ph-shower,ph ph-shuffle,ph ph-shuffle-angular,ph ph-shuffle-simple,ph ph-sidebar,ph ph-sidebar-simple,ph ph-sigma,ph ph-sign-in,ph ph-sign-out,ph ph-signature,ph ph-signpost,ph ph-sim-card,ph ph-sketch-logo,ph ph-skip-back,ph ph-skip-back-circle,ph ph-skip-forward,ph ph-skip-forward-circle,ph ph-skull,ph ph-slack-logo,ph ph-sliders,ph ph-sliders-horizontal,ph ph-slideshow,ph ph-smiley,ph ph-smiley-blank,ph ph-smiley-meh,ph ph-smiley-nervous,ph ph-smiley-sad,ph ph-smiley-sticker,ph ph-smiley-wink,ph ph-smiley-x-eyes,ph ph-snapchat-logo,ph ph-sneaker,ph ph-sneaker-move,ph ph-snowflake,ph ph-soccer-ball,ph ph-sort-ascending,ph ph-sort-descending,ph ph-soundcloud-logo,ph ph-spade,ph ph-sparkle,ph ph-speaker-high,ph ph-speaker-low,ph ph-speaker-none,ph ph-speaker-simple-high,ph ph-speaker-simple-low,ph ph-speaker-simple-none,ph ph-speaker-simple-slash,ph ph-speaker-simple-x,ph ph-speaker-slash,ph ph-speaker-x,ph ph-spinner,ph ph-spinner-gap,ph ph-spiral,ph ph-split-horizontal,ph ph-split-vertical,ph ph-spotify-logo,ph ph-square,ph ph-square-half,ph ph-square-half-bottom,ph ph-square-logo,ph ph-square-split-horizontal,ph ph-square-split-vertical,ph ph-squares-four,ph ph-stack,ph ph-stack-overflow-logo,ph ph-stack-simple,ph ph-stairs,ph ph-stamp,ph ph-star,ph ph-star-four,ph ph-star-half,ph ph-sticker,ph ph-stop,ph ph-stop-circle,ph ph-storefront,ph ph-strategy,ph ph-stripe-logo,ph ph-student,ph ph-suitcase,ph ph-suitcase-simple,ph ph-sun,ph ph-sun-dim,ph ph-sun-horizon,ph ph-sunglasses,ph ph-swap,ph ph-swatches,ph ph-sword,ph ph-syringe,ph ph-t-shirt,ph ph-table,ph ph-tabs,ph ph-tag,ph ph-tag-chevron,ph ph-tag-simple,ph ph-target,ph ph-taxi,ph ph-telegram-logo,ph ph-television,ph ph-television-simple,ph ph-tennis-ball,ph ph-terminal,ph ph-terminal-window,ph ph-test-tube,ph ph-text-aa,ph ph-text-align-center,ph ph-text-align-justify,ph ph-text-align-left,ph ph-text-align-right,ph ph-text-bolder,ph ph-text-h,ph ph-text-h-five,ph ph-text-h-four,ph ph-text-h-one,ph ph-text-h-six,ph ph-text-h-three,ph ph-text-h-two,ph ph-text-indent,ph ph-text-italic,ph ph-text-outdent,ph ph-text-strikethrough,ph ph-text-t,ph ph-text-underline,ph ph-textbox,ph ph-thermometer,ph ph-thermometer-cold,ph ph-thermometer-hot,ph ph-thermometer-simple,ph ph-thumbs-down,ph ph-thumbs-up,ph ph-ticket,ph ph-tiktok-logo,ph ph-timer,ph ph-toggle-left,ph ph-toggle-right,ph ph-toilet,ph ph-toilet-paper,ph ph-toolbox,ph ph-tooth,ph ph-tote,ph ph-tote-simple,ph ph-trademark,ph ph-trademark-registered,ph ph-traffic-cone,ph ph-traffic-signal,ph ph-traffic-sign,ph ph-train,ph ph-train-regional,ph ph-train-simple,ph ph-tram,ph ph-translate,ph ph-trash,ph ph-trash-simple,ph ph-tray,ph ph-tree,ph ph-tree-evergreen,ph ph-tree-palm,ph ph-tree-structure,ph ph-trend-down,ph ph-trend-up,ph ph-triangle,ph ph-trophy,ph ph-truck,ph ph-twitch-logo,ph ph-twitter-logo,ph ph-umbrella,ph ph-umbrella-simple,ph ph-upload,ph ph-upload-simple,ph ph-user,ph ph-user-circle,ph ph-user-circle-gear,ph ph-user-circle-minus,ph ph-user-circle-plus,ph ph-user-focus,ph ph-user-gear,ph ph-user-list,ph ph-user-minus,ph ph-user-plus,ph ph-user-rectangle,ph ph-user-square,ph ph-user-switch,ph ph-users,ph ph-users-four,ph ph-users-three,ph ph-van,ph ph-vault,ph ph-vibrate,ph ph-video,ph ph-video-camera,ph ph-vignette,ph ph-vinyl-record,ph ph-virtual-reality,ph ph-virus,ph ph-voicemail,ph ph-volleyball,ph ph-wall,ph ph-wallet,ph ph-warning,ph ph-warning-circle,ph ph-warning-octagon,ph ph-watch,ph ph-wave-sawtooth,ph ph-wave-sine,ph ph-wave-square,ph ph-wave-triangle,ph ph-waves,ph ph-webcam,ph ph-whatsapp-logo,ph ph-wheelchair,ph ph-wheelchair-motion,ph ph-wifi-high,ph ph-wifi-low,ph ph-wifi-medium,ph ph-wifi-none,ph ph-wifi-slash,ph ph-wifi-x,ph ph-wind,ph ph-windows-logo,ph ph-wine,ph ph-wrench,ph ph-x,ph ph-x-circle,ph ph-x-square,ph ph-yin-yang,ph ph-youtube-logo";
const ionString = "icon ion-md-home,icon ion-ios-home,icon ion-md-search,icon ion-ios-search,icon ion-md-settings,icon ion-ios-settings,icon ion-md-person,icon ion-ios-person,icon ion-md-mail,icon ion-ios-mail,icon ion-md-call,icon ion-ios-call,icon ion-md-heart,icon ion-ios-heart,icon ion-md-star,icon ion-ios-star,icon ion-md-close,icon ion-ios-close,icon ion-md-add,icon ion-ios-add,icon ion-md-trash,icon ion-ios-trash,icon ion-md-cloud,icon ion-ios-cloud,icon ion-md-download,icon ion-ios-download,icon ion-md-camera,icon ion-ios-camera,icon ion-md-mic,icon ion-ios-mic,icon ion-md-map,icon ion-ios-map,icon ion-md-navigate,icon ion-ios-navigate,icon ion-md-car,icon ion-ios-car,icon ion-md-bus,icon ion-ios-bus,icon ion-md-bicycle,icon ion-ios-bicycle,icon ion-md-medkit,icon ion-ios-medkit,icon ion-md-pulse,icon ion-ios-pulse,icon ion-md-thermometer,icon ion-ios-thermometer,icon ion-md-wifi,icon ion-ios-wifi,icon ion-md-bluetooth,icon ion-ios-bluetooth,icon ion-md-battery-full,icon ion-ios-battery-full,icon ion-md-code,icon ion-ios-code,icon ion-md-lock,icon ion-ios-lock,icon ion-md-cart,icon ion-ios-cart,icon ion-logo-facebook,icon ion-logo-twitter,icon ion-logo-instagram,icon ion-logo-linkedin,icon ion-logo-youtube,icon ion-logo-whatsapp,icon ion-logo-skype,icon ion-logo-github,icon ion-logo-google,icon ion-logo-apple,icon ion-logo-android,icon ion-logo-windows";

// === 3. 初始化 Slot State (關鍵：放在資料變數之後) ===
// 確保變數已經宣告完畢後才初始化狀態
let slotState = [
    { type: "internal", val: 0, customText: originalIcons[0].name },
    { type: "internal", val: 1, customText: originalIcons[1].name },
    { type: "internal", val: 2, customText: originalIcons[2].name },
    { type: "internal", val: 3, customText: originalIcons[3].name },
    { type: "internal", val: 4, customText: originalIcons[4].name },
    { type: "internal", val: 5, customText: originalIcons[5].name }
];

// === 4. 主程式邏輯 (Functions) ===

// 渲染主畫布
function renderCanvas() {
    mainCanvas.innerHTML = "";
    slotState.forEach((state, slotIndex) => {
        const slot = document.createElement("div");
        slot.className = "slot-card";
        
        let isSpecial = (slotIndex === 4);
        if (isSpecial) slot.classList.add("special-green");
        if (slotIndex === selectedSlotIndex) slot.classList.add("active-slot");

        let iconHTML = "";
        
        if (state.type === "internal") {
            const icon = internalIconData[state.val] || internalIconData[0];
            let svgContent = icon.svg;
            if (icon.type === "outline") {
                svgContent = svgContent.replace("<svg", '<svg class="icon-display icon-outline"');
            } else {
                svgContent = svgContent.replace("<svg", '<svg class="icon-display icon-fill"');
            }
            iconHTML = svgContent;
        } else if (state.type === "fontawesome") {
            iconHTML = `<i class="${state.val} external-icon-render"></i>`;
        } else if (state.type === "material") {
            iconHTML = `<span class="material-icons external-icon-render">${state.val}</span>`;
        } else if (state.type === "bootstrap") {
            iconHTML = `<i class="bi ${state.val} external-icon-render"></i>`;
        } else if (state.type === "remix") {
            iconHTML = `<i class="${state.val} external-icon-render"></i>`;
        } else if (state.type === "boxicons") {
            iconHTML = `<i class="${state.val} external-icon-render"></i>`;
        } else if (state.type === "tabler") {
            iconHTML = `<i class="${state.val} external-icon-render"></i>`;
        } else if (state.type === "phosphor") {
            iconHTML = `<i class="${state.val} external-icon-render"></i>`;
        } else if (state.type === "ionicons") {
            iconHTML = `<i class="${state.val} external-icon-render"></i>`;
        }

        slot.innerHTML = `${iconHTML}<div class="label-display">${state.customText}</div>`;
        slot.onclick = () => selectSlot(slotIndex);
        mainCanvas.appendChild(slot);
    });
}

// 選擇格子
function selectSlot(index) {
    selectedSlotIndex = index;
    const state = slotState[index];
    statusText.textContent = `選取中：第 ${index + 1} 格`;
    textInput.value = state.customText;
    
    if (state.type === "internal") {
        sourceSelect.value = "internal";
        changeIconSource("internal");
    } else {
        sourceSelect.value = state.type;
        changeIconSource(state.type);
        manualCodeInput.value = state.val;
    }
    renderCanvas();
}

// 更新文字
function updateText(val) {
    slotState[selectedSlotIndex].customText = val;
    renderCanvas();
}

// 切換來源並產生列表
function changeIconSource(source) {
    currentSourceMode = source;
    iconLibrary.scrollTop = 0;

    if (source === "internal") {
        manualInputContainer.classList.remove("active");
        renderInternalLibrary();
    } else {
        manualInputContainer.classList.add("active");
        let list = [], prefix = "";
        
        // 根據來源產生列表
        if (source === "fontawesome") {
            manualLabel.textContent = "FontAwesome 代碼:";
            manualCodeInput.placeholder = "fa-solid fa-user-doctor";
            list = faString.split(',');
        } else if (source === "material") {
            manualLabel.textContent = "Material 代碼:";
            manualCodeInput.placeholder = "local_hospital";
            list = matString.split(',');
        } else if (source === "bootstrap") {
            manualLabel.textContent = "Bootstrap 代碼:";
            manualCodeInput.placeholder = "bi-hospital";
            list = biString.split(',');
        } else if (source === "remix") {
            manualLabel.textContent = "Remix 代碼:";
            manualCodeInput.placeholder = "ri-hospital-line";
            list = riString.split(',');
        } else if (source === "boxicons") {
            manualLabel.textContent = "Boxicons 代碼:";
            manualCodeInput.placeholder = "bx bx-home";
            list = bxString.split(',');
        } else if (source === "tabler") {
            manualLabel.textContent = "Tabler 代碼:";
            manualCodeInput.placeholder = "ti ti-home";
            list = tiString.split(',');
        } else if (source === "phosphor") {
            manualLabel.textContent = "Phosphor 代碼:";
            manualCodeInput.placeholder = "ph ph-house";
            list = phString.split(',');
        } else if (source === "ionicons") {
            manualLabel.textContent = "Ionicons 代碼:";
            manualCodeInput.placeholder = "icon ion-md-home";
            list = ionString.split(',');
        }
        renderLibraryList(list, source);
    }
}

// 渲染內建列表
function renderInternalLibrary() {
    iconLibrary.innerHTML = "";
    internalIconData.forEach((icon, index) => {
        const item = document.createElement("div");
        item.className = "lib-item";
        item.title = icon.name;
        
        let smallSvg = icon.svg;
        if (icon.type === "outline") {
            smallSvg = smallSvg.replace("<svg", '<svg style="fill:none; stroke:#00854a; stroke-width:5"');
        } else {
            smallSvg = smallSvg.replace("<svg", '<svg style="fill:#00854a"');
        }
        
        item.innerHTML = `${smallSvg}<div class="lib-name">${icon.name.replace("\n", "")}</div>`;
        item.onclick = () => {
            slotState[selectedSlotIndex].type = "internal";
            slotState[selectedSlotIndex].val = index;
            if (icon.name) {
                slotState[selectedSlotIndex].customText = icon.name;
                textInput.value = icon.name;
            }
            renderCanvas();
        };
        iconLibrary.appendChild(item);
    });
}

// 渲染外部列表
function renderLibraryList(list, type) {
    iconLibrary.innerHTML = "";
    // 使用 Fragment 優化效能
    const fragment = document.createDocumentFragment();
    
    list.forEach(val => {
        const item = document.createElement("div");
        item.className = "lib-item";
        let previewHTML = "";
        let shortName = val;

        // 預覽 HTML 生成
        if (type === "fontawesome") {
            shortName = val.replace("fa-solid fa-", "").replace("fa-brands fa-", "");
            previewHTML = `<i class="${val}"></i>`;
        } else if (type === "material") {
            previewHTML = `<span class="material-icons">${val}</span>`;
        } else if (type === "bootstrap") {
            shortName = val.replace("bi-", "");
            previewHTML = `<i class="bi ${val}"></i>`;
        } else if (type === "remix") {
            shortName = val.replace("ri-", "").replace("-line", "").replace("-fill", "");
            previewHTML = `<i class="${val}"></i>`;
        } else if (type === "boxicons") {
            shortName = val.replace("bx bx-", "").replace("bx bxl-", "");
            previewHTML = `<i class="${val}"></i>`;
        } else if (type === "tabler") {
            shortName = val.replace("ti ti-", "");
            previewHTML = `<i class="${val}"></i>`;
        } else if (type === "phosphor") {
            shortName = val.replace("ph ph-", "");
            previewHTML = `<i class="${val}"></i>`;
        } else if (type === "ionicons") {
            shortName = val.replace("icon ion-md-", "").replace("icon ion-ios-", "");
            previewHTML = `<i class="${val}"></i>`;
        }

        item.title = shortName;
        item.innerHTML = `${previewHTML}<div class="lib-name">${shortName}</div>`;
        item.onclick = () => {
            manualCodeInput.value = val;
            applyManualIcon();
        };
        fragment.appendChild(item);
    });
    iconLibrary.appendChild(fragment);
}

// 套用外部代碼
function applyManualIcon() {
    const val = manualCodeInput.value;
    if (!val) return;
    slotState[selectedSlotIndex].type = currentSourceMode;
    slotState[selectedSlotIndex].val = val;
    renderCanvas();
}

// 介面開關
function toggleLibrary() {
    libraryArea.classList.toggle("hidden");
    panelBtnText.textContent = libraryArea.classList.contains("hidden") ? "顯示控制面板" : "隱藏控制面板";
}

function toggleRedBorder() {
    mainCanvas.classList.toggle("hide-selection");
    borderBtnText.textContent = mainCanvas.classList.contains("hide-selection") ? "顯示選取框" : "隱藏選取框";
}

// === 下載功能修正 (關鍵：確保無灰邊) ===
function saveAsJpeg() {
    const node = document.getElementById("main-canvas");
    const wrapper = document.getElementById("scale-wrapper");
    const originalTransform = wrapper.style.transform;

    // 1. 還原縮放，確保高解析
    wrapper.style.transition = "none";
    wrapper.style.transform = "scale(1)";
    wrapper.style.transformOrigin = "top left";

    // 2. [關鍵] 針對下載時的卡片進行強制樣式修正
    // Dom-to-image 有時會抓到邊框渲染的雜訊，這裡強制在截圖前修正
    const cards = node.querySelectorAll('.slot-card');
    cards.forEach(card => {
        // 強制白色卡片背景純白，無邊框
        if (!card.classList.contains('special-green')) {
            card.style.backgroundColor = "#ffffff";
        } else {
            card.style.backgroundColor = "#00854a";
        }
        // 移除所有可能導致灰邊的邊框屬性
        card.style.border = "0px";
        card.style.outline = "none";
        // 確保圓角裁切
        card.style.borderRadius = "40px";
        card.style.overflow = "hidden";
        // 暫時移除選取框
        card.classList.remove('active-slot');
    });

    // 3. 執行截圖
    domtoimage.toPng(node, {
        width: 2500,
        height: 1686,
        bgcolor: "#f4f6f8", // 背景色
        style: {
            transform: "none",
            transformOrigin: "top left",
            margin: "0"
        }
    })
    .then(function (dataUrl) {
        const link = document.createElement("a");
        link.download = "hospital-menu-final.png";
        link.href = dataUrl;
        link.click();

        // 4. 恢復原狀
        wrapper.style.transform = originalTransform;
        wrapper.style.transformOrigin = "center center";
        setTimeout(() => { 
            wrapper.style.transition = "transform 0.3s"; 
            // 恢復選取框顯示 (重新渲染即可)
            renderCanvas();
        }, 50);
        
        // 恢復卡片樣式 (重新渲染最快)
        renderCanvas();
    })
    .catch(function (error) {
        console.error("截圖失敗:", error);
        alert("截圖發生錯誤，請稍後再試");
        wrapper.style.transform = originalTransform;
        wrapper.style.transformOrigin = "center center";
        renderCanvas();
    });
}

// 初始化執行
// 使用 addEventListener 確保 DOM 載入後才執行，避免 slotState 錯誤
document.addEventListener('DOMContentLoaded', () => {
    textInput.value = slotState[0].customText;
    renderInternalLibrary(); 
    renderCanvas();
});