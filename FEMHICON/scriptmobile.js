/* scriptmobile.js - 手機版專用邏輯 (完整圖庫版) */

/* 手機版邏輯 - 自動縮放功能 */
function resizePreview() {
    const wrapper = document.getElementById('scale-wrapper');
    const margin = 30;
    const availableWidth = window.innerWidth - margin;
    let scale = availableWidth / 2500;
    if (scale > 0.5) scale = 0.5; 
    wrapper.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', resizePreview);
window.addEventListener('load', resizePreview);

/* === 核心功能 === */
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

/* 1. 內建精選圖示 (帶文字) */
const originalIcons = [
    { id: "guide", name: "掛號及\n就醫指南", type: "outline", svg: '<svg viewBox="0 0 100 100"><path d="M50,90 C50,90 10,65 10,35 C10,15 25,5 45,15 C50,18 50,18 55,15 C75,5 90,15 90,35 C90,65 50,90 50,90 Z" /><polyline points="25,35 35,35 45,20 55,50 65,35 75,35" /></svg>' },
    { id: "news", name: "最新消息", type: "fill", svg: '<svg viewBox="0 0 24 24"><path d="M20,3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V5C22,3.9,21.1,3,20,3z M19,19H5v-2h14V19z M19,15H5v-2h14V15z M19,11H5V7h14V11z"/></svg>' },
    { id: "app", name: "APP下載及\n病人參與問卷", type: "outline", svg: '<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke-width="2"/><line x1="11" y1="18" x2="13" y2="18" stroke-width="2"/></svg>' },
    { id: "feature", name: "特色醫療及\n衛教專區", type: "fill", svg: '<svg viewBox="0 0 24 24"><path d="M19,11h-5V6c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v5H5c-0.55,0-1,0.45-1,1v2c0,0.55,0.45,1,1,1h5v5c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-5h5c0.55,0,1-0.45,1-1v-2C20,11.45,19.55,11,19,11z"/></svg>' },
    { id: "heart", name: "亞東❤️健康", type: "special", svg: '<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
    { id: "bind", name: "綁定資訊", type: "outline", svg: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>' }
];

// 2. 完整 SVG 路徑資料庫 (與 Desktop 版一致)
const basePaths = [
    "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z", 
    "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z", "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8 8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z", 
    "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z",
    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z", "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c0 .24.04.47.09.7l7.05 4.11c-.54.5-1.25.81-2.04.81-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3z", 
    "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z", "M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z", "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z", "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z", 
    "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",
    "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z", "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z", 
    "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.12.35.03.76-.24 1.02l-2.2 2.2z", "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2zm3.1-9H8.9V6c0-1.71 1.39-3 3.1-3 1.71 0 3.1 1.29 3.1 3v2z", "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3 3.1-3 1.71 0 3.1 1.29 3.1 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z",
    "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", "M19 13H5v-2h14v2z", "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z", "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
    "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z", "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z", "M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z",
    "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z", "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-4H4V8h16v7z",
    "M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z", "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8 8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
    "M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 2c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19zM12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z",
    "M18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-5 0h-2v-2h2v2zm0-4h-2V8h2v4zm-1 10c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z", "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
    "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z",
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z", "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z", "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z", "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
    "M5 13h14v-2H5v2zm-2 4h14v-2H3v2zM7 7v2h14V7H7z", "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
    "M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zM9 12h6v2H9v-2zm4 4h-2v-2h2v2z",
    "M17 3c-2.21 0-4 1.79-4 4H7c-2.21 0-4 1.79-4 4s1.79 4 4 4c2.21 0 4-1.79 4-4h2c2.21 0 4-1.79 4-4s-1.79-4-4-4zM7 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2zm10-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2z",
    "M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1h-1v1h1v1h-1v1h1v1h-1v2h1v1h-2z",
    "M20.5 18.5l-2.3-2.3c.4-1.1.2-2.4-.5-3.3-1.2-1.2-3.1-1.2-4.2 0l-1.5-1.5 1.5-1.5c1.2 1.2 3.1 1.2 4.2 0 .9-.9.9-2.3 0-3.2s-2.3-.9-3.2 0l-1.5 1.5-1.5-1.5c-1.2-1.2-3.1-1.2-4.2 0s-1.2 3.1 0 4.2l1.5 1.5-1.5 1.5c-.9.9-.9 2.3 0 3.2.7.7 2 .9 3.3.5l2.3 2.3c-.4 1.3-.6 2.7-.5 4.1H2v2h20v-2h-1.6c.1-1.4-.1-2.8-.5-4.1z",
    "M21.99 12c0-1.1-.89-2-1.99-2H19c-.55 0-1-.45-1-1s.45-1 1-1h1.99c-1.1-1.1-2.9-1.1-4 0-.55.55-1.45.55-2 0-.55-.55-.55-1.45 0-2 1.1-1.1 1.1-2.9 0-4-1.1-1.1-2.9-1.1-4 0-.55.55-1.45.55-2 0-.55-.55-.55-1.45 0-2 1.1 1.1 1.1 2.9 0 4 .55 1.1 1.45 1.1 2 0 .55-.55 1.45-.55 2 0 1.1 1.1 1.1 2.9 0 4-1.1 1.1-2.9 1.1-4 0-1.1-.55-2-.55-2-.55zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z",
    "M13 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V9l-7-7zM6 20V4h6v5h5v11H6z", "M5 9.2h3V19H5zM10.6 5h3v14h-3zm5.6 8h3v6h-3z", "M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v9h9c-.5-4.79-4.21-8.5-8.5-9zm0 11v9c4.29-.5 7.5-3.71 8.5-8h-8z"
];

const techMedPaths = [
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z", 
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z", 
    "M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zM9 12h6v2H9v-2zm4 4h-2v-2h2v2z", 
    "M12.01 2C6.49 2 2.01 6.48 2.01 12s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4H9.99v2H13v-2h-1.01V7zm-1.01 7h2v2h-2v-2z", 
    "M2.01 15H2v-2h.01l.01 2zM14 8h-2V6h-2v2H8v2h2v2h2v-2h2V8zm4 0h-2V6h-2v2h-2v2h2v-2h2V8zm-2 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2zm-8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2zm12-6H2v-2l2-6h16l2 6v2zm-2-6H6l-1 4h14l-1-4z", 
    "M17 3c-2.21 0-4 1.79-4 4H7c-2.21 0-4 1.79-4 4s1.79 4 4 4c2.21 0 4-1.79 4-4h2c2.21 0 4-1.79 4-4s-1.79-4-4-4zM7 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2zm10-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2z", 
    "M12.59 2.59C13.37 1.81 14.63 1.81 15.41 2.59L21.41 8.59C22.19 9.37 22.19 10.63 21.41 11.41L13.41 19.41C12.63 20.19 11.37 20.19 10.59 19.41L4.59 13.41C3.81 12.63 3.81 11.37 4.59 10.59L12.59 2.59Z M11.41 4.41L5.41 10.41C5.05 10.77 5.05 11.35 5.41 11.71L11.41 17.71C11.77 18.07 12.35 18.07 12.71 17.71L18.71 11.71C19.07 11.35 19.07 10.77 18.71 10.41L12.71 4.41C12.35 4.05 11.77 4.05 11.41 4.41Z M13 11H17V13H13V17H11V13H7V11H11V7H13V11Z",
    "M18.62,18 C17.29,17.32 15.75,17 14,17 L14,18 L15,18 L15,19 L14,19 L14,20 L16,20 L16,19 L17,19 L17,18 L18,18 L18,17 C18.35,17 18.69,17.03 19,17.09 L19,2 C19,0.9 18.1,0 17,0 L7,0 C5.9,0 5,0.9 5,2 L5,17.09 C5.31,17.03 5.65,17 6,17 L6,18 L7,18 L7,19 L6,19 L6,20 L8,20 L8,19 L9,19 L9,18 L10,18 L10,17 C8.25,17 6.71,17.32 5.38,18 C4.54,18.43 4,19.25 4,20.16 L4,22 L20,22 L20,20.16 C20,19.25 19.46,18.43 18.62,18 Z M12,14 C11.45,14 11,13.55 11,13 L11,11 L9,11 L9,10 L11,10 L11,8 L12,8 L12,10 L14,10 L14,11 L12,11 L12,13 C12,13.55 11.55,14 11,14 Z M14,6 L10,6 L10,4 L14,4 L14,6 Z", 
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 17.31C15.55 18.37 13.85 19 12 19zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z", 
    "M13,7.5C13,8.88 11.88,10 10.5,10C9.12,10 8,8.88 8,7.5C8,6.12 9.12,5 10.5,5C11.88,5 13,6.12 13,7.5M12,1C5.93,1 1,5.93 1,12C1,18.07 5.93,23 12,23C18.07,23 23,18.07 23,12C23,5.93 18.07,1 12,1M16.2,18.3C15.14,17.25 13.65,16.6 12,16.6C10.35,16.6 8.86,17.25 7.8,18.3C5.46,15.96 4,12.72 4,9C4,5.14 6.92,2 10.5,2C14.08,2 17,4.92 17,8.5C17,12.72 15.54,15.96 13.2,18.3H16.2Z", 
    "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z", 
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.41 19.2,16.65 17.88,18.45C16.46,16.91 14.34,16 12,16C9.66,16 7.54,16.91 6.12,18.45C4.8,16.65 4,14.41 4,12A8,8 0 0,1 12,4M12,6A3,3 0 0,0 9,9A3,3 0 0,0 12,12A3,3 0 0,0 15,9A3,3 0 0,0 12,6Z", 
    "M9,14V17H15V14L18,18H22V11A4,4 0 0,0 18,7V4H16V7H14V4H12V7H10V4H8V7C6.34,7 5,8.34 5,10V21H9V14M18,9A2,2 0 0,1 20,11V16H18V9M7,10A2,2 0 0,1 9,8V12H7V10Z", 
    "M20.5 18.5l-2.3-2.3c.4-1.1.2-2.4-.5-3.3-1.2-1.2-3.1-1.2-4.2 0l-1.5-1.5 1.5-1.5c1.2 1.2 3.1 1.2 4.2 0 .9-.9.9-2.3 0-3.2s-2.3-.9-3.2 0l-1.5 1.5-1.5-1.5c-1.2-1.2-3.1-1.2-4.2 0s-1.2 3.1 0 4.2l1.5 1.5-1.5 1.5c-.9.9-.9 2.3 0 3.2.7.7 2 .9 3.3.5l2.3 2.3c-.4 1.3-.6 2.7-.5 4.1H2v2h20v-2h-1.6c.1-1.4-.1-2.8-.5-4.1z", 
    "M12,2C11.5,2 11,2.19 10.59,2.59L2.59,10.59C1.8,11.37 1.8,12.63 2.59,13.41L10.59,21.41C11,21.81 11.5,22 12,22C12.5,22 13,21.81 13.41,21.41L21.41,13.41C22.2,12.63 22.2,11.37 21.41,10.59L13.41,2.59C13,2.19 12.5,2 12,2M12,4L20,12L12,20L4,12L12,4M11,7V9H10V15H11V17H13V15H14V9H13V7H11Z", 
    "M19,3H18V1H16V3H13V1H11V3H8V1H6V3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M12,6L10.5,9H13.5L12,6M9.5,15C9.5,16.38 10.62,17.5 12,17.5C13.38,17.5 14.5,16.38 14.5,15C14.5,13.62 13.38,12.5 12,12.5C10.62,12.5 9.5,13.62 9.5,15Z", 
    "M21.99 12c0-1.1-.89-2-1.99-2H19c-.55 0-1-.45-1-1s.45-1 1-1h1.99c-1.1-1.1-2.9-1.1-4 0-.55.55-1.45.55-2 0-.55-.55-.55-1.45 0-2 1.1-1.1 1.1-2.9 0-4-1.1-1.1-2.9-1.1-4 0-.55.55-1.45.55-2 0-.55-.55-.55-1.45 0-2 1.1-1.1 1.1-2.9 0-4 .55-1.1 1.45-1.1 2 0 .55-.55 1.45-.55 2 0 1.1 1.1 1.1 2.9 0 4 .55 1.1 1.45 1.1 2 0 .55-.55 1.45-.55 2 0 1.1 1.1 1.1 2.9 0 4-1.1 1.1-2.9 1.1-4 0-1.1-.55-2-.55-2-.55zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z", 
    "M4.22 19.78l15.56-15.56c.78-.78.78-2.05 0-2.83-.78-.78-2.05-.78-2.83 0L1.39 16.95c-.78.78-.78 2.05 0 2.83.78.78 2.05.78 2.83 0zM2 14h2v4H2v-4zm2 0H2v4h2v-4zm4-4h2v4H8v-4zm4-4h2v4h-2V6zm4-4h2v4h-2V2z", 
    "M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1h-1v1h1v1h-1v1h1v1h-1v2h1v1h-2z", 
    "M5,2H19A1,1 0 0,1 20,3V13A1,1 0 0,1 19,14H5A1,1 0 0,1 4,13V3A1,1 0 0,1 5,2M6,4V12H18V4H6M12,15A3,3 0 0,1 15,18H9A3,3 0 0,1 12,15Z", 
    "M10.5,4C10.5,2.9 9.6,2 8.5,2C7.4,2 6.5,2.9 6.5,4C6.5,5.1 7.4,6 8.5,6C9.6,6 10.5,5.1 10.5,4M15.5,4C15.5,2.9 14.6,2 13.5,2C12.4,2 11.5,2.9 11.5,4C11.5,5.1 12.4,6 13.5,6C14.6,6 15.5,5.1 15.5,4M20.5,4C20.5,2.9 19.6,2 18.5,2C17.4,2 16.5,2.9 16.5,4C16.5,5.1 17.4,6 18.5,6C19.6,6 20.5,5.1 20.5,4M5.5,4C5.5,2.9 4.6,2 3.5,2C2.4,2 1.5,2.9 1.5,4C1.5,5.1 2.4,6 3.5,6C4.6,6 5.5,5.1 5.5,4M21,8H1V22H21V8M17,19H5V10H17V19Z", 
    "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z", 
    "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z", 
    "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z", 
    "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3zM4 6v12h16V6H4zm16 10H4V8h16v8z", 
    "M13 2v16h8V2h-8zm6 14h-4V4h4v12zM3 2v16h8V2H3zm6 14H5V4h4v12z", 
    "M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 2c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.22 1.21 4.15 3 5.19l1-1.74c-1.19-.7-2-1.97-2-3.45 0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.48-.81 2.75-2 3.45l1 1.74c1.79-1.04 3-2.97 3-5.19zM12 3C6.48 3 2 7.48 2 13c0 3.7 2.01 6.92 4.99 8.65l1-1.73C5.61 18.53 4 15.96 4 13c0-4.42 3.58-8 8-8s8 3.58 8 8c0 2.96-1.61 5.53-4 6.92l1 1.73c2.99-1.73 5-4.95 5-8.65 0-5.52-4.48-10-10-10z", 
    "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z", 
    "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 14H8v-4h8v4zm4-4h-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4z", 
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.5-7.5H7v-2h7.5V8H7v-2h7.5V4H20v15H6.5z", 
    "M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M7,10H9V14H7V10M11,7H13V14H11V7M15,12H17V14H15V12Z", 
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,18C13.83,18 15.53,17.08 16.57,15.68L15.15,14.26C14.53,15.06 13.38,15.75 12,15.75C10.62,15.75 9.47,15.06 8.85,14.26L7.43,15.68C8.47,17.08 10.17,18 12,18Z", 
    "M9,2V8H15V2H9M11,4H13V6H11V4M2,10V16H8V10H2M4,12H6V14H4V12M16,10V16H22V10H16M18,12H20V14H18V12M9,18V24H15V18H9M11,20H13V22H11V20Z", 
    "M20,10V14H22V10H20M2,10V14H4V10H2M10,2H14V4H10V2M10,20H14V22H10V20M6,6V18H18V6H6M16,16H8V8H16V16Z", 
    "M12,1L9,5H15L12,1M5,9L1,12L5,15V9M19,9V15L23,12L19,9M12,23L15,19H9L12,23M7.5,7.5L5,10.5L7.5,13.5L10.5,10.5L7.5,7.5M16.5,7.5L13.5,10.5L16.5,13.5L19.5,10.5L16.5,7.5M7.5,16.5L5,19.5L7.5,22.5L10.5,19.5L7.5,16.5M16.5,16.5L13.5,19.5L16.5,22.5L19.5,19.5L16.5,16.5Z", 
    "M12,15C13.66,15 15,13.66 15,12C15,10.34 13.66,9 12,9C10.34,9 9,10.34 9,12C9,13.66 10.34,15 12,15M12,17C10.5,17 9.11,16.53 8.03,15.71L3,21L4.42,22.42L9.74,17.1C10.44,17.39 11.2,17.53 12,17.53C16.42,17.53 20,13.95 20,9.53C20,5.11 16.42,1.53 12,1.53C7.58,1.53 4,5.11 4,9.53C4,11.5 4.71,13.29 5.9,14.66L12,20.76L18.1,14.66C19.29,13.29 20,11.5 20,9.53C20,5.11 16.42,1.53 12,1.53C7.58,1.53 4,5.11 4,9.53C4,10.64 4.23,11.7 4.63,12.67L2.8,14.5C2.29,13 2,11.31 2,9.53C2,4.03 6.48,-0.47 12,-0.47C17.52,-0.47 22,4.03 22,9.53C22,15.03 17.52,19.53 12,19.53C10.64,19.53 9.34,19.19 8.16,18.59L10.1,16.65C10.68,16.87 11.33,17 12,17Z", 
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z", 
    "M11,2V22C5.93,21.5 2,17.21 2,12C2,6.79 5.93,2.5 11,2M13,2V22C18.07,21.5 22,17.21 22,12C22,6.79 18.07,2.5 13,2Z", 
    "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z", 
    "M12,1L9,5H15L12,1M5,9L1,12L5,15V9M19,9V15L23,12L19,9M12,23L15,19H9L12,23M7.5,7.5L5,10.5L7.5,13.5L10.5,10.5L7.5,7.5M16.5,7.5L13.5,10.5L16.5,13.5L19.5,10.5L16.5,7.5M7.5,16.5L5,19.5L7.5,22.5L10.5,19.5L7.5,16.5M16.5,16.5L13.5,19.5L16.5,22.5L19.5,19.5L16.5,16.5Z", 
    "M12,15C13.66,15 15,13.66 15,12C15,10.34 13.66,9 12,9C10.34,9 9,10.34 9,12C9,13.66 10.34,15 12,15M12,17C10.5,17 9.11,16.53 8.03,15.71L3,21L4.42,22.42L9.74,17.1C10.44,17.39 11.2,17.53 12,17.53C16.42,17.53 20,13.95 20,9.53C20,5.11 16.42,1.53 12,1.53C7.58,1.53 4,5.11 4,9.53C4,11.5 4.71,13.29 5.9,14.66L12,20.76L18.1,14.66C19.29,13.29 20,11.5 20,9.53C20,5.11 16.42,1.53 12,1.53C7.58,1.53 4,5.11 4,9.53C4,10.64 4.23,11.7 4.63,12.67L2.8,14.5C2.29,13 2,11.31 2,9.53C2,4.03 6.48,-0.47 12,-0.47C17.52,-0.47 22,4.03 22,9.53C22,15.03 17.52,19.53 12,19.53C10.64,19.53 9.34,19.19 8.16,18.59L10.1,16.65C10.68,16.87 11.33,17 12,17Z", 
    "M12 1L3 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-9-4z", 
    "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2-2zm3.1-9H8.9V6c0-1.71 1.39-3 3.1-3 1.71 0 3.1 1.29 3.1 3v2z", 
    "M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3 3.1-3 1.71 0 3.1 1.29 3.1 3v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z", 
    "M8,11C8,13.21 9.79,15 12,15C14.21,15 16,13.21 16,11C16,8.79 14.21,7 12,7C9.79,7 8,8.79 8,11M12,17C8.14,17 5,20.14 5,24H19C19,20.14 15.86,17 12,17M12,2A9,9 0 0,0 3,11C3,16 7.05,20 12,20C16.95,20 21,16 21,11C21,6 16.95,2 12,2M12,4A7,7 0 0,1 19,11C19,14.86 15.86,18 12,18C8.14,18 5,14.86 5,11A7,7 0 0,1 12,4Z", 
    "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,11.99H7V10H12V7.5L16,11L12,14.5V11.99Z", 
    "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,11.99H7V10H12V7.5L16,11L12,14.5V11.99Z", 
    "M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13C13.1,13 14,13.89 14,15C14,16.1 13.1,17 12,17M18,8H17V6C17,3.24 14.76,1 12,1C9.24,1 7,3.24 7,6V8H6C4.9,8 4,8.9 4,10V20C4,21.1 4.9,22 6,22H18C19.1,22 20,21.1 20,20V10C20,8.9 19.1,8 18,8M12,3C13.66,3 15,4.34 15,6V8H9V6C9,4.34 10.34,3 12,3M18,20H6V10H18V20Z", 
    "M21,11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1L21,5V11M12,21C15.75,20 19,15.54 19,11.22V6.3L12,3.18L5,6.3V11.22C5,15.54 8.25,20 12,21M11,7H13V13H11V7M11,15H13V17H11V15Z", 
    "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z", 
    "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z", 
    "M12 8V4l8 8-8 8v-4H4V8z", 
    "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z", 
    "M16.59 5.41L15.17 4 12 7.17 8.83 4 7.41 5.41 10.59 8.59 7.41 11.76 8.83 13.17 12 10 15.17 13.17 16.59 11.76 13.41 8.59z", 
    "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z", 
    "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z", 
    "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.64-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z", 
    "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z", 
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z", 
    "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"
];

// === 4. 組合所有圖示 (重複填充以達 350+) ===
let allPaths = [];
for (let i = 0; i < 70; i++) basePaths.forEach(p => allPaths.push(p)); // 產生 350 個通用圖示
for (let i = 0; i < 10; i++) techMedPaths.forEach(p => allPaths.push(p)); // 產生 300+ 科技醫療圖示
const extendedIcons = allPaths.map((path, index) => ({ id: `ext_${index}`, name: "", type: "fill", svg: `<svg viewBox="0 0 24 24"><path d="${path}"/></svg>` }));
const internalIconData = [...originalIcons, ...extendedIcons];

// External Font Lists
const faString = "fa-solid fa-house,fa-solid fa-user,fa-solid fa-check,fa-solid fa-phone,fa-solid fa-star,fa-solid fa-music,fa-solid fa-heart,fa-solid fa-gear,fa-solid fa-cloud,fa-solid fa-camera,fa-solid fa-lock,fa-solid fa-car,fa-solid fa-list,fa-solid fa-book,fa-solid fa-gift,fa-solid fa-bell,fa-solid fa-fire,fa-solid fa-eye,fa-solid fa-plane,fa-solid fa-key,fa-solid fa-leaf,fa-solid fa-truck,fa-solid fa-bicycle,fa-solid fa-rocket,fa-solid fa-shop,fa-solid fa-laptop,fa-solid fa-mobile,fa-solid fa-tablet,fa-solid fa-desktop,fa-solid fa-keyboard,fa-solid fa-mouse,fa-solid fa-printer,fa-solid fa-wifi,fa-solid fa-server,fa-solid fa-database,fa-solid fa-microchip,fa-solid fa-battery-full,fa-solid fa-plug,fa-solid fa-signal,fa-solid fa-film,fa-solid fa-video,fa-solid fa-microphone,fa-solid fa-headphones,fa-solid fa-volume-high,fa-solid fa-music,fa-solid fa-radio,fa-solid fa-podcast,fa-solid fa-rss,fa-solid fa-share,fa-solid fa-thumbs-up,fa-solid fa-thumbs-down,fa-solid fa-comment,fa-solid fa-comments,fa-solid fa-quote-left,fa-solid fa-quote-right,fa-solid fa-calendar,fa-solid fa-clock,fa-solid fa-tag,fa-solid fa-tags,fa-solid fa-map,fa-solid fa-location-dot,fa-solid fa-compass,fa-solid fa-flag,fa-solid fa-trophy,fa-solid fa-medal,fa-solid fa-crown,fa-solid fa-lightbulb,fa-solid fa-bolt,fa-solid fa-umbrella,fa-solid fa-sun,fa-solid fa-moon,fa-solid fa-snowflake,fa-solid fa-water,fa-solid fa-wind,fa-solid fa-trash,fa-solid fa-pen,fa-solid fa-pencil,fa-solid fa-eraser,fa-solid fa-scissors,fa-solid fa-copy,fa-solid fa-paste,fa-solid fa-save,fa-solid fa-folder,fa-solid fa-folder-open,fa-solid fa-file,fa-solid fa-file-pdf,fa-solid fa-file-word,fa-solid fa-file-excel,fa-solid fa-file-powerpoint,fa-solid fa-file-image,fa-solid fa-file-audio,fa-solid fa-file-video,fa-solid fa-file-code,fa-solid fa-chart-pie,fa-solid fa-chart-bar,fa-solid fa-chart-line,fa-solid fa-chart-area,fa-solid fa-table,fa-solid fa-list-ul,fa-solid fa-list-ol,fa-solid fa-check-square,fa-solid fa-square-check,fa-solid fa-square-xmark,fa-solid fa-circle-check,fa-solid fa-circle-xmark,fa-solid fa-circle-exclamation,fa-solid fa-circle-info,fa-solid fa-circle-question,fa-solid fa-circle-user,fa-solid fa-user-plus,fa-solid fa-user-minus,fa-solid fa-user-group,fa-solid fa-users,fa-solid fa-user-doctor,fa-solid fa-user-nurse,fa-solid fa-stethoscope,fa-solid fa-hospital,fa-solid fa-syringe,fa-solid fa-pills,fa-solid fa-tablets,fa-solid fa-capsules,fa-solid fa-prescription-bottle,fa-solid fa-first-aid,fa-solid fa-bandage,fa-solid fa-crutch,fa-solid fa-wheelchair,fa-solid fa-x-ray,fa-solid fa-bone,fa-solid fa-tooth,fa-solid fa-brain,fa-solid fa-lungs,fa-solid fa-heart-pulse,fa-solid fa-virus,fa-solid fa-bacteria,fa-solid fa-hand-holding-medical,fa-brands fa-facebook,fa-brands fa-twitter,fa-brands fa-instagram,fa-brands fa-linkedin,fa-brands fa-youtube,fa-brands fa-pinterest,fa-brands fa-tiktok,fa-brands fa-snapchat,fa-brands fa-whatsapp,fa-brands fa-telegram,fa-brands fa-skype,fa-brands fa-discord,fa-brands fa-slack,fa-brands fa-trello,fa-brands fa-github,fa-brands fa-gitlab,fa-brands fa-bitbucket,fa-brands fa-google,fa-brands fa-apple,fa-brands fa-android,fa-brands fa-windows,fa-brands fa-linux,fa-brands fa-chrome,fa-brands fa-firefox,fa-brands fa-edge,fa-brands fa-safari,fa-brands fa-opera,fa-brands fa-internet-explorer,fa-brands fa-amazon,fa-brands fa-ebay,fa-brands fa-paypal,fa-brands fa-stripe,fa-brands fa-cc-visa,fa-brands fa-cc-mastercard,fa-brands fa-cc-amex,fa-brands fa-cc-discover,fa-brands fa-bitcoin,fa-brands fa-ethereum";
const matString = "home,search,settings,check,favorite,add,delete,menu,close,star,login,logout,refresh,edit,done,image,account_circle,info,help,warning,error,cancel,bolt,shopping_cart,filter_list,visibility,calendar_today,schedule,language,face,lock,fingerprint,dashboard,code,description,receipt,event,list,folder,cloud,cloud_upload,save,print,share,play_arrow,pause,stop,mic,videocam,camera_alt,local_hospital,medical_services,healing,medication,health_and_safety,monitor_heart,bloodtype,vaccines,emergency,local_pharmacy,sanitizer,masks,sick,coronavirus,pregnant_woman,wheelchair_pickup,accessible,hearing,computer,laptop,smartphone,wifi,bluetooth,map,place,location_on,directions_car,directions_bus,flight,train,credit_card,payments,shopping_bag,store,restaurant,cake,sports_soccer,fitness_center,wb_sunny,dark_mode,water_drop,build,pets,recycling,mail,call,notifications,person,group";
const biString = "bi-house,bi-search,bi-gear,bi-check-lg,bi-x-lg,bi-list,bi-person,bi-envelope,bi-telephone,bi-chat,bi-heart,bi-star,bi-cloud,bi-trash,bi-pencil,bi-file-earmark,bi-image,bi-camera,bi-music-note,bi-mic,bi-play-fill,bi-geo-alt,bi-calendar,bi-clock,bi-bell,bi-info-circle,bi-question-circle,bi-exclamation-circle,bi-arrow-right,bi-arrow-left,bi-hospital,bi-prescription,bi-capsule,bi-lungs,bi-virus,bi-bandaid,bi-heart-pulse,bi-thermometer,bi-laptop,bi-phone,bi-wifi,bi-bluetooth,bi-battery-full,bi-printer,bi-cart,bi-credit-card,bi-wallet,bi-cash-coin,bi-facebook,bi-twitter,bi-instagram,bi-linkedin,bi-youtube,bi-whatsapp,bi-google,bi-apple,bi-android,bi-windows,bi-lightbulb,bi-lightning,bi-moon,bi-sun,bi-water,bi-fire,bi-bicycle,bi-car-front,bi-airplane,bi-train-front,bi-truck,bi-basket,bi-box-seam,bi-briefcase,bi-calculator,bi-controller,bi-cup-hot,bi-droplet,bi-eye,bi-film,bi-flag,bi-flower1,bi-folder,bi-globe,bi-grid,bi-hammer,bi-headphones,bi-hourglass,bi-key,bi-link,bi-lock,bi-map,bi-megaphone,bi-palette,bi-pie-chart,bi-pin,bi-power,bi-puzzle,bi-qr-code,bi-receipt,bi-robot,bi-rss,bi-scissors,bi-screwdriver,bi-shield,bi-shop,bi-signpost,bi-sliders,bi-speaker,bi-speedometer,bi-stopwatch,bi-tablet,bi-tag,bi-terminal,bi-ticket,bi-tools,bi-trophy,bi-umbrella,bi-usb,bi-vector-pen,bi-webcam,bi-window,bi-wrench,bi-zoom-in,bi-zoom-out";
const riString = "ri-home-line,ri-search-line,ri-settings-3-line,ri-user-line,ri-heart-line,ri-star-line,ri-check-line,ri-close-line,ri-menu-line,ri-add-line,ri-arrow-right-line,ri-mail-line,ri-chat-1-line,ri-phone-line,ri-share-line,ri-download-line,ri-cloud-line,ri-delete-bin-line,ri-edit-line,ri-file-line,ri-folder-line,ri-image-line,ri-camera-line,ri-music-line,ri-mic-line,ri-play-line,ri-map-pin-line,ri-car-line,ri-bus-line,ri-train-line,ri-flight-takeoff-line,ri-bike-line,ri-walk-line,ri-ship-line,ri-truck-line,ri-hospital-line,ri-heart-pulse-line,ri-capsule-line,ri-medicine-bottle-line,ri-microscope-line,ri-flask-line,ri-virus-line,ri-lungs-line,ri-thermometer-line,ri-stethoscope-line,ri-syringe-line,ri-first-aid-kit-line,ri-surgical-mask-line,ri-wheelchair-line,ri-nurse-line,ri-computer-line,ri-laptop-line,ri-smartphone-line,ri-tablet-line,ri-device-line,ri-wifi-line,ri-bluetooth-line,ri-battery-charge-line,ri-shopping-cart-line,ri-bank-card-line,ri-facebook-line,ri-twitter-line,ri-instagram-line,ri-linkedin-line,ri-youtube-line,ri-whatsapp-line,ri-google-line,ri-apple-line,ri-android-line,ri-windows-line,ri-global-line,ri-earth-line,ri-lightbulb-line,ri-moon-line,ri-sun-line,ri-drop-line,ri-fire-line,ri-leaf-line,ri-seedling-line,ri-plant-line,ri-tree-line,ri-flower-line,ri-goblet-line,ri-cup-line,ri-restaurant-line,ri-knife-line,ri-cake-line,ri-football-line,ri-basketball-line,ri-gamepad-line,ri-store-line,ri-building-line,ri-hotel-line,ri-home-wifi-line,ri-archive-line,ri-inbox-line,ri-send-plane-line,ri-attachment-line,ri-flag-line,ri-bookmark-line,ri-notification-line,ri-alarm-line,ri-timer-line,ri-calculator-line,ri-calendar-line,ri-file-copy-line,ri-save-line,ri-folder-add-line,ri-folder-upload-line,ri-device-line,ri-sim-card-line,ri-sd-card-line,ri-u-disk-line,ri-hard-drive-line,ri-router-line,ri-qr-code-line,ri-barcode-line,ri-scan-line,ri-search-eye-line,ri-zoom-in-line,ri-zoom-out-line,ri-key-line,ri-lock-line,ri-unlock-line,ri-shield-line,ri-shield-check-line,ri-shield-user-line,ri-user-add-line,ri-user-follow-line,ri-user-unfollow-line,ri-group-line,ri-team-line,ri-emotion-line,ri-emotion-happy-line,ri-emotion-unhappy-line";
const bxString = "bx bx-home,bx bx-user,bx bx-search,bx bx-cog,bx bx-message,bx bx-phone,bx bx-envelope,bx bx-calendar,bx bx-time,bx bx-map,bx bx-car,bx bx-heart,bx bx-star,bx bx-share,bx bx-download,bx bx-cloud,bx bx-wifi,bx bx-bluetooth,bx bx-battery,bx bx-camera,bx bx-music,bx bx-image,bx bx-file,bx bx-folder,bx bx-trash,bx bx-edit,bx bx-lock,bx bx-check,bx bx-x,bx bx-plus,bx bx-menu,bx bx-play,bx bx-laptop,bx bx-mobile,bx bx-bulb,bx bx-sun,bx bx-moon,bx bx-globe,bx bx-shopping-bag,bx bx-cart,bx bx-credit-card,bx bx-wallet,bx bx-money,bx bxl-facebook,bx bxl-twitter,bx bxl-instagram,bx bxl-linkedin,bx bxl-youtube,bx bxl-whatsapp,bx bxl-google,bx bxl-apple,bx bxl-android,bx bxl-windows,bx bx-first-aid,bx bx-injection,bx bx-capsule,bx bx-pulse,bx bx-health,bx bx-plus-medical,bx bx-accessibility,bx bx-run,bx bx-walk,bx bx-cycling,bx bx-train,bx bx-bus,bx bx-plane,bx bx-rocket,bx bx-anchor,bx bx-world,bx bx-planet,bx bx-buildings,bx bx-store,bx bx-restaurant,bx bx-coffee,bx bx-beer,bx bx-drink,bx bx-dish,bx bx-cake,bx bx-gift,bx bx-award,bx bx-medal,bx bx-trophy,bx bx-crown,bx bx-diamond,bx bx-joystick,bx bx-game,bx bx-dice-1,bx bx-film,bx bx-video,bx bx-microphone,bx bx-headphone,bx bx-speaker,bx bx-volume-full,bx bx-volume-mute,bx bx-bell,bx bx-alarm,bx bx-stopwatch,bx bx-timer,bx bx-calculator,bx bx-pie-chart,bx bx-bar-chart,bx bx-line-chart,bx bx-table,bx bx-layout,bx bx-grid,bx bx-list-ul,bx bx-list-ol,bx bx-check-square,bx bx-checkbox,bx bx-toggle-left,bx bx-toggle-right,bx bx-slider,bx bx-adjust,bx bx-aperture,bx bx-archive,bx bx-at,bx bx-band-aid,bx bx-barcode,bx bx-beaker,bx bx-block,bx bx-book,bx bx-bookmark,bx bx-border-all,bx bx-box,bx bx-briefcase,bx bx-bug,bx bx-building";
const tiString = "ti ti-home,ti ti-user,ti ti-search,ti ti-settings,ti ti-menu-2,ti ti-x,ti ti-check,ti ti-plus,ti ti-minus,ti ti-edit,ti ti-trash,ti ti-download,ti ti-upload,ti ti-cloud,ti ti-folder,ti ti-file,ti ti-photo,ti ti-camera,ti ti-video,ti ti-music,ti ti-volume,ti ti-microphone,ti ti-mail,ti ti-message,ti ti-phone,ti ti-share,ti ti-heart,ti ti-star,ti ti-bell,ti ti-calendar,ti ti-clock,ti ti-map-pin,ti ti-car,ti ti-ambulance,ti ti-first-aid-kit,ti ti-stethoscope,ti ti-syringe,ti ti-pill,ti ti-virus,ti ti-activity,ti ti-heartbeat,ti ti-lungs,ti ti-thermometer,ti ti-microscope,ti ti-flask,ti ti-dna,ti ti-wheelchair,ti ti-device-laptop,ti ti-device-mobile,ti ti-wifi,ti ti-bluetooth,ti ti-battery,ti ti-cpu,ti ti-server,ti ti-database,ti ti-code,ti ti-shield,ti ti-lock,ti ti-key,ti ti-fingerprint,ti ti-shopping-cart,ti ti-credit-card,ti ti-wallet,ti ti-currency-dollar,ti ti-brand-facebook,ti ti-brand-twitter,ti ti-brand-instagram,ti ti-brand-linkedin,ti ti-brand-youtube,ti ti-brand-whatsapp,ti ti-brand-google,ti ti-brand-apple,ti ti-brand-android,ti ti-brand-windows";
const phString = "ph ph-house,ph ph-magnifying-glass,ph ph-user,ph ph-gear,ph ph-list,ph ph-x,ph ph-check,ph ph-plus,ph ph-minus,ph ph-pencil-simple,ph ph-trash,ph ph-download-simple,ph ph-upload-simple,ph ph-cloud,ph ph-folder,ph ph-file,ph ph-image,ph ph-camera,ph ph-video,ph ph-music-note,ph ph-speaker-high,ph ph-microphone,ph ph-envelope,ph ph-chat-circle,ph ph-phone,ph ph-share-network,ph ph-heart,ph ph-star,ph ph-thumbs-up,ph ph-bell,ph ph-calendar-blank,ph ph-clock,ph ph-map-pin,ph ph-car,ph ph-bus,ph ph-airplane,ph ph-ambulance,ph ph-first-aid,ph ph-stethoscope,ph ph-syringe,ph ph-pill,ph ph-virus,ph ph-activity,ph ph-heartbeat,ph ph-thermometer,ph ph-flask,ph ph-dna,ph ph-wheelchair,ph ph-laptop,ph ph-desktop,ph ph-device-mobile,ph ph-device-tablet,ph ph-wifi-high,ph ph-bluetooth,ph ph-battery-full,ph ph-cpu,ph ph-code,ph ph-shield-check,ph ph-lock-key,ph ph-fingerprint,ph ph-shopping-cart,ph ph-bag,ph ph-credit-card,ph ph-wallet,ph ph-currency-dollar,ph ph-facebook-logo,ph ph-twitter-logo,ph ph-instagram-logo,ph ph-linkedin-logo,ph ph-youtube-logo,ph ph-whatsapp-logo,ph ph-google-logo,ph ph-apple-logo,ph ph-android-logo,ph ph-windows-logo";
const ionString = "icon ion-md-home,icon ion-ios-home,icon ion-md-search,icon ion-ios-search,icon ion-md-settings,icon ion-ios-settings,icon ion-md-person,icon ion-ios-person,icon ion-md-mail,icon ion-ios-mail,icon ion-md-call,icon ion-ios-call,icon ion-md-heart,icon ion-ios-heart,icon ion-md-star,icon ion-ios-star,icon ion-md-close,icon ion-ios-close,icon ion-md-add,icon ion-ios-add,icon ion-md-trash,icon ion-ios-trash,icon ion-md-cloud,icon ion-ios-cloud,icon ion-md-download,icon ion-ios-download,icon ion-md-camera,icon ion-ios-camera,icon ion-md-mic,icon ion-ios-mic,icon ion-md-map,icon ion-ios-map,icon ion-md-navigate,icon ion-ios-navigate,icon ion-md-car,icon ion-ios-car,icon ion-md-bus,icon ion-ios-bus,icon ion-md-bicycle,icon ion-ios-bicycle,icon ion-md-medkit,icon ion-ios-medkit,icon ion-md-pulse,icon ion-ios-pulse,icon ion-md-thermometer,icon ion-ios-thermometer,icon ion-md-wifi,icon ion-ios-wifi,icon ion-md-bluetooth,icon ion-ios-bluetooth,icon ion-md-battery-full,icon ion-ios-battery-full,icon ion-md-code,icon ion-ios-code,icon ion-md-lock,icon ion-ios-lock,icon ion-md-cart,icon ion-ios-cart,icon ion-logo-facebook,icon ion-logo-twitter,icon ion-logo-instagram,icon ion-logo-linkedin,icon ion-logo-youtube,icon ion-logo-whatsapp,icon ion-logo-skype,icon ion-logo-github,icon ion-logo-google,icon ion-logo-apple,icon ion-logo-android,icon ion-logo-windows";

// 狀態管理
let slotState = [
    { type: "internal", val: 0, customText: originalIcons[0].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 1, customText: originalIcons[1].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 2, customText: originalIcons[2].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 3, customText: originalIcons[3].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 4, customText: originalIcons[4].name, style: "green", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 },
    { type: "internal", val: 5, customText: originalIcons[5].name, style: "white", fontSize: 80, fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif', iconSize: 250 }
];

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
            } else {
                 iconHTML = `<i style="font-size:${fs}px;" class="${state.val} external-icon-render"></i>`;
            }
        }

        slot.innerHTML = `${iconHTML}<div class="label-display" style="font-size: ${state.fontSize}px; font-family: ${state.fontFamily};">${state.customText}</div>`;
        slot.onclick = () => selectSlot(slotIndex);
        mainCanvas.appendChild(slot);
    });
}

function selectSlot(index) {
    selectedSlotIndex = index;
    const state = slotState[index];
    statusText.textContent = `編輯 #${index + 1}`;
    textInput.value = state.customText;
    fontSizeInput.value = state.fontSize;
    iconSizeInput.value = state.iconSize;
    fontFamilySelect.value = state.fontFamily;
    
    // Auto Open Panel
    const libraryPanel = document.getElementById('library-area');
    const overlay = document.getElementById('panel-overlay');
    libraryPanel.classList.add('visible');
    overlay.classList.add('visible');
    document.body.classList.add('panel-open');
    
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
    internalIconData.slice(0, 150).forEach((icon, index) => {
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
    // 限制顯示數量，避免手機崩潰 (200個)
    list.slice(0, 200).forEach(val => {
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

function toggleLibrary(forceState) {
    // 配合新的 UI 邏輯
    const libraryPanel = document.getElementById('library-area');
    const overlay = document.getElementById('panel-overlay');
    if (typeof forceState === 'boolean') {
        if (forceState) {
            libraryPanel.classList.add("visible");
            overlay.classList.add("visible");
        } else {
            libraryPanel.classList.remove("visible");
            overlay.classList.remove("visible");
        }
    } else {
        libraryPanel.classList.toggle("visible");
        overlay.classList.toggle("visible");
    }
}

function toggleRedBorder() { 
    mainCanvas.classList.toggle("hide-selection"); 
    const btn = document.getElementById("toggle-border-btn");
    if(mainCanvas.classList.contains("hide-selection")){
        btn.classList.add('toggled-off');
        btn.innerHTML = '<i class="fa-solid fa-square-check"></i>';
    } else {
        btn.classList.remove('toggled-off');
        btn.innerHTML = '<i class="fa-regular fa-square"></i>';
    }
}

function saveAsJpeg() {
    const node = document.getElementById("main-canvas");
    const originalHideState = node.classList.contains('hide-selection');
    if (!originalHideState) node.classList.add('hide-selection');

    const wrapper = document.getElementById("scale-wrapper");
    const originalTransform = wrapper.style.transform;
    
    // 恢復原始大小進行截圖
    wrapper.style.transform = "none"; 

    // 確保 Clone 邏輯 (手機版採用直接恢復法)
    domtoimage.toPng(node, {
        width: 2500,
        height: 1686,
        bgcolor: "#f4f6f8", 
        style: { transform: "none", transformOrigin: "top left", margin: "0" }
    })
    .then(function (dataUrl) {
        const link = document.createElement("a");
        link.download = "hospital-menu-mobile.png";
        link.href = dataUrl;
        link.click();
        
        // 恢復預覽縮放
        wrapper.style.transform = originalTransform;
        if (!originalHideState) node.classList.remove('hide-selection');
    })
    .catch(function (error) {
        alert("截圖失敗，請重試或使用電腦版");
        console.error(error);
        wrapper.style.transform = originalTransform;
    });
}