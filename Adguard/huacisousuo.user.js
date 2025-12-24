
// ==UserScript==
// @name         Limbopro 网页划词搜索神器（移动端兼容版/划词番号搜索/影视搜索/谷歌搜索）
// @namespace    https://limbopro.com
// @version      1.2
// @description  【Limbopro 网页划词搜索神器】移动端 & PC 完美适配：选中文字 → 右侧悬浮面板（谷歌搜索🔍/影视搜索🎬/番号搜索🔞），不闪退、持久悬停；支持深色模式、丝滑动画、自动防重叠定位，按 Escape 或点击空白即可隐藏。
// @author       limbopro & Grok
// @match        https://*/*
// @icon         https://limbopro.com/favicon.ico
// @grant        none
// @license MIT
// @run-at       document-idle
// ==/UserScript==


// blog: https://limbopro.com/
// Tg: https://t.me/limboprossr

function initLimoProSearch() {
    if (window.limboproSearchPro) {
        console.log('划词搜索已存在');
        return;
    }

    window.limboproSearchPro = true;

    /* ---------- 配置区 ---------- */
    const buttons = [
        { text: '使用谷歌搜索', color: '#0ea5e9' },
        { text: '使用影视搜索', color: '#8b5cf6' },
        { text: '使用番号搜索', color: '#c42a4e' },
        // 新增：设置按钮（放在番号搜索后面）
        { text: '划词搜索设置', color: '#6b7280', isSettings: true }
    ];

    const urls = [
        'https://www.google.com/search?q=',
        'https://limbopro.com/search.html#gsc.tab=0&gsc.q=',
        'https://limbopro.com/btsearch.html#gsc.tab=0&gsc.q=',
        null   // settings 占位
    ];
    /* --------------------------- */

    const container = document.createElement('div');
    container.id = 'limbopro-search-pro';
    container.className = 'notranslate';
    Object.assign(container.style, {
        position: 'absolute',
        zIndex: '2147483647',
        display: 'none',
        pointerEvents: 'none !inportant',
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
        flexDirection: 'column',
        gap: '8px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '18px',
        boxShadow: '0 10px 36px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.3)',
        transition: 'all 0.2s ease, opacity 0.15s ease',
        minWidth: '142px',
        alignItems: 'center',
        opacity: '0'
    });
    document.body.appendChild(container);

    const updateTheme = () => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        container.style.background = isDark ? 'rgba(30,30,40,0.92)' : 'rgba(255,255,255,0.95)';
        container.style.border = isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.3)';
    };
    updateTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    const btns = buttons.map((cfg, i) => {
        const btn = document.createElement('button');
        btn.textContent = cfg.text;

        // 只有普通搜索按钮才保存 URL
        if (!cfg.isSettings) {
            btn.dataset.url = urls[i];
        }

        Object.assign(btn.style, {
            width: '100%',
            padding: '4px 14px',
            fontSize: '13.5px',
            fontWeight: '600',
            color: '#fff',
            background: cfg.color,
            border: 'none',
            borderRadius: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.22)',
            pointerEvents: 'auto',
            transition: 'all 0.2s ease',
            transform: 'translateY(0)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
        });

        const hoverIn = () => {
            btn.style.transform = 'translateY(-3px) scale(1.03)';
            btn.style.boxShadow = '0 10px 24px rgba(0,0,0,0.3)';
        };
        const hoverOut = () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = '0 4px 14px rgba(0,0,0,0.22)';
        };
        btn.onmouseover = btn.ontouchstart = hoverIn;
        btn.onmouseout = btn.ontouchend = hoverOut;
        btn.onmousedown = btn.ontouchstart = e => e.stopPropagation();

        container.appendChild(btn);
        return btn;
    });

    let currentText = '';
    let showTimeout = null;

    const hide = () => {
        container.style.opacity = '0';
        setTimeout(() => {
            if (container.style.opacity === '0') {
                container.style.display = 'none';
            }
        }, 150);
        currentText = '';
        if (showTimeout) clearTimeout(showTimeout);
    };

    const showPanel = (text) => {
        const sel = window.getSelection();
        if (!sel.rangeCount) return hide();
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect.width) return hide();

        container.style.display = 'flex';
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        container.style.display = 'none';

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMultiLine = rect.height > 24;

        let left = isMultiLine
            ? window.scrollX + rect.left - w - 12
            : window.scrollX + rect.right + 12 + 70;

        let top = isMultiLine
            ? window.scrollY + rect.bottom - h
            : window.scrollY + rect.top;

        // 防重叠
        const panelTop = top - window.scrollY;
        const panelBottom = panelTop + h;
        const textTop = rect.top;
        const textBottom = rect.bottom;

        if (isMultiLine && panelTop < textBottom && panelBottom > textTop) {
            top = window.scrollY + rect.bottom + 8;
        }

        top = Math.max(window.scrollY + 12, Math.min(top, window.scrollY + vh - h - 12));
        left = Math.max(window.scrollX + 12, Math.min(left, window.scrollX + vw - w - 12));

        container.style.top = top + 'px';
        container.style.left = left + 'px';
        container.style.display = 'flex';
        container.style.opacity = '1';

        currentText = text;
    };

    /* ---------- 事件绑定 ---------- */
    document.addEventListener('selectionchange', () => {
        if (showTimeout) clearTimeout(showTimeout);
        showTimeout = setTimeout(() => {
            const text = window.getSelection().toString().trim();
            if (text && text === currentText) return;
            if (text) {
                showPanel(text);
            } else if (currentText) {
                hide();
            }
        }, 100);
    });

    btns.forEach(btn => {
        // 普通搜索按钮
        if (btn.dataset.url) {
            btn.onclick = () => {
                if (!currentText) return;

                const fullUrl = btn.dataset.url + encodeURIComponent(currentText);

                // 创建隐藏 <a> 标签并模拟点击
                const link = document.createElement('a');
                link.href = fullUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // hide(); // 搜索后收起面板
            };
        } else {
            // 设置按钮（保持原逻辑）
            btn.onclick = (e) => {
                e.stopPropagation();

                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }

                if (typeof body_build === 'function') {
                    body_build('true');
                }

                const btn_hcss = document.getElementById('huacisousuo');
                if (btn_hcss) {
                    // 防止重复插入 keyframes
                    if (!document.getElementById('limp-breathe-kf')) {
                        const styleSheet = document.createElement('style');
                        styleSheet.id = 'limp-breathe-kf';
                        styleSheet.textContent = `
                        @keyframes breathe {
                            0%, 100% { transform: scale(1); }
                            50%      { transform: scale(1.15); }
                        }
                    `;
                        document.head.appendChild(styleSheet);
                    }

                    btn_hcss.style.animation = 'breathe 0.6s ease-in-out infinite';

                    // 5秒后自动停止（可配置）
                    setTimeout(() => {
                        btn_hcss.style.animation = '';
                        btn_hcss.style.transform = '';
                    }, 5000);
                }

                // 不 hide，方便用户调节
            };
        }
    });

    document.addEventListener('mousedown', e => {
        if (!container.contains(e.target) && !window.getSelection().toString().trim()) hide();
    });

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScroll > 300 && !window.getSelection().toString().trim()) hide();
        lastScroll = now;
        // 沉浸式翻译隐藏起来 cjsfy
        console.log('页面滚动中...')
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !window.getSelection().toString().trim()) hide();
    });

    hide();
    console.log('划词搜索（终极优化版 + 设置按钮）已加载');
}

// 划词搜索函数部分结束 End



// 划词搜索状态切换
// 获取按钮
// Start of huacisousuo toggle code


window.huacibtn = document.getElementById('huacisousuo'); // 划词切换按钮
// 状态切换函数
function toggleSearchState(x) {
    const searchPro = document.getElementById('limbopro-search-pro'); // 搜索框容器
    if (!searchPro) {
        initLimoProSearch()// 如果不存在，则立即创建
        document.getElementById('limbopro-search-pro').className = 'cmsnone notranslate'
    }
    const isOn = huacibtn.dataset.state === 'on';
    if (x !== 'false') {
        if (isOn) {
            // 关闭：OFF + 红色 + false
            huacibtn.textContent = '划词搜索(OFF)';
            huacibtn.style.backgroundColor = 'red';
            huacibtn.dataset.state = 'off';
            localStorage.setItem('huacisousuo', 'false');
            searchPro.className = 'cmsnone notranslate' // 隐藏
            setTimeout(() => {
                //// body_build('false')
            }, 1500)
        } else {
            // 开启：ON + 绿色 + true
            huacibtn.textContent = '划词搜索(ON)';
            huacibtn.style.backgroundColor = 'green';
            huacibtn.dataset.state = 'on';
            localStorage.setItem('huacisousuo', 'true');
            searchPro.className = 'cms notranslate' // 隐藏
            setTimeout(() => {
                //// body_build('false')
            }, 1500)
        }
    } else if (x === 'false') {
        // 关闭：OFF + 红色 + false
        huacibtn.textContent = '划词搜索(OFF)';
        huacibtn.style.backgroundColor = 'red';
        huacibtn.dataset.state = 'off';
        // localStorage.setItem('huacisousuo', 'false');
        searchPro.className = 'cmsnone notranslate' // 隐藏
        setTimeout(() => {
            //// body_build('false')
        }, 1500)
    }
}


// 页面加载时恢复状态
function waitForElement(selector, callback) {
    function check() {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            requestAnimationFrame(check);
        }
    }
    check();
}

waitForElement('#limbopro-search-pro', (el) => {
    console.log('元素就绪:limbopro-search-pro', /*el*/);
    console.log('恢复划词搜索状态中...');
    const searchPro = document.getElementById('limbopro-search-pro'); // 搜索框容器
    const saved = localStorage.getItem('huacisousuo');

    if (saved === 'true' || saved === null) {
        huacibtn.textContent = '划词搜索(ON)';
        huacibtn.style.backgroundColor = 'green';
        huacibtn.dataset.state = 'on';
        searchPro.className = 'cms notranslate' // 隐藏
        console.log('划词搜索已开启');
    } else {
        // 默认或 saved === 'false' 或 null
        huacibtn.textContent = '划词搜索(OFF)';
        huacibtn.style.backgroundColor = 'red';
        huacibtn.dataset.state = 'off';
        searchPro.className = 'cmsnone notranslate' // 隐藏
        console.log('划词搜索已关闭');
    }
});



// 划词搜索切换按钮结束
// End of huacisousuo toggle code


if (localStorage.getItem('huacisousuo') == 'true') {
    // toggleSearchState('true');
    initLimoProSearch();
}
