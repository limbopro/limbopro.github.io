// 定义 CSS 地址
const ADGUARD_CSS_URL = 'https://limbopro.com/CSS/Adblock4limbo.user.css';
const STORAGE_KEY = 'loadAdguradGeneralFilterCSS';

/**
 * 核心检查与加载函数：确保 CSS 存在或被移除
 */
function manageAdGuardStyle(isActive) {
    let link = document.querySelector(`link[href="${ADGUARD_CSS_URL}"]`);

    if (isActive) {
        // 如果开启且不存在，则创建 link 标签加载
        if (!link) {
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = ADGUARD_CSS_URL;
            document.head.appendChild(link);
            console.log('[AdGuard] CSS 已加载');
        }
    } else {
        // 如果关闭且存在，则移除
        if (link) {
            link.remove();
            console.log('[AdGuard] CSS 已卸载');
        }
    }
}

/**
 * 完善后的切换函数
 */
function toggleAdGuardFilter() {
    const btn = document.getElementById('loadCSS');
    const statusText = document.getElementById('loadCSS_status_text');
    if (!btn || !statusText) return;

    const isActive = localStorage.getItem(STORAGE_KEY) === 'true';
    const newState = !isActive;

    localStorage.setItem(STORAGE_KEY, newState);

    // 执行状态切换逻辑
    updateAdGuardButtonUI(btn, statusText, newState);

    // 按照要求：用户点击开启时，弹窗 alert 提示
    if (newState) {
        confirmndExecuteFC('🌈 https://limbopro.com/CSS/Adblock4limbo.user.css 已加载至网页！共计1.8w+条 Adgurad 基础过滤器(CSS)，移除恼人的图片/GIF广告🪧！如仍有广告，请联系博主反馈...')
    }

}

/**
 * 完善后的 UI 更新函数：增加 CSS 检查逻辑
 */
function updateAdGuardButtonUI(btn, statusText, isActive) {
    // 1. 同步 CSS 状态
    manageAdGuardStyle(isActive);

    // 2. 更新视觉 UI
    if (isActive) {
        btn.style.setProperty('background', '#28a745', 'important');
        statusText.innerText = '已开启';
        btn.classList.replace('ads_skip_off', 'ads_skip_on');
    } else {
        btn.style.setProperty('background', '#c53f3f', 'important');
        statusText.innerText = '默认关闭';
        btn.classList.replace('ads_skip_on', 'ads_skip_off');
    }
}

/**
 * 初始化
 */
function initAdGuardButton() {
    const btn = document.getElementById('loadCSS');
    const statusText = document.getElementById('loadCSS_status_text');
    if (btn && statusText) {
        const savedState = localStorage.getItem(STORAGE_KEY) === 'true';
        updateAdGuardButtonUI(btn, statusText, savedState);
    }
}

initAdGuardButton();
