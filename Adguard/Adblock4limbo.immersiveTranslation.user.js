// ==UserScript==
// @name         沉浸式翻译（Google Translate & 原文保护）
// @namespace    http://tampermonkey.net/
// @version      2025-12-08_Final_V7
// @description  通过自定义逻辑加载谷歌翻译，并创建原文副本以实现双语对照（沉浸式翻译），支持一键切换原文/双语状态。
// @author       limbopro
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=johnnydecimal.com
// @grant        none
// ==/UserScript==

// --- I. 谷歌翻译加载与配置 ---

/**
 * @function loadGoogleTranslateUI
 * @description 动态加载谷歌翻译组件，限制语言范围，并设置UI容器样式。
 * 容器被标记为 'notranslate' 以防自身被翻译。
 */
function loadGoogleTranslateUI() {
    if (document.getElementById('google_translate_element')) return;

    // 1. 定义谷歌翻译初始化函数
    window.google = window.google || {};
    window.google.translate = window.translate || {};
    window.google.translate.TranslateElementInit = function () {
        new google.translate.TranslateElement({
            includedLanguages: 'zh-CN,en',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
    };

    // 2. 创建并美化 UI 容器元素
    const uiContainerId = 'google_translate_element';
    let uiContainer = document.getElementById(uiContainerId);

    if (!uiContainer) {
        uiContainer = document.createElement('div');
        uiContainer.id = uiContainerId;
        document.body.appendChild(uiContainer);

        // 设置容器浮动样式和 notranslate 标记
        uiContainer.classList.add('notranslate');
        uiContainer.style.position = 'fixed';
        uiContainer.style.top = '40px';
        uiContainer.style.right = '0px';
        uiContainer.style.zIndex = '9999';
        uiContainer.style.backgroundColor = '#f8f8f8';
        uiContainer.style.padding = '8px 12px';
        uiContainer.style.borderRadius = '10px 0px 0px 10px';
        uiContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        uiContainer.style.border = '1px solid #ddd';
        uiContainer.style.transition = 'box-shadow 0.3s ease-in-out';
        uiContainer.style.lineHeight = '0'; // 优化内联布局
    }

    // 3. 动态加载谷歌翻译脚本
    const scriptUrl = '//translate.google.com/translate_a/element.js?cb=google.translate.TranslateElementInit';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl;
    document.head.appendChild(script);
}

// --- II. 原文保护与双语复制逻辑 ---

/**
 * @function applyNotranslateProtection
 * @description 核心函数。遍历DOM识别正文块级元素，创建带有 'notranslate' 类的副本作为原文，
 * 并标记原元素（'.thatcloned'）以防止重复复制。
 */
function applyNotranslateProtection() {
    (() => {
        const textBlocksToClone = new Set();
        // 排除：不可见、结构性或特定 UI 元素。
        const excludedAncestors = 'pre, script, style, noscript';

        // 性能优化：将正则表达式定义在 IIFE 顶部。
        // 匹配：数字, 空白, 逗号, 点号, 斜杠, 冒号, 短横线 (用于排除日期/数据块)
        const pureDataRegex = /^[0-9\s,./:\-]+$/;

        // 1. TreeWalker 找出所有需要处理的真实文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parent = node.parentElement;
                    if (!node.nodeValue?.trim() || parent?.closest(excludedAncestors)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    // 优化：跳过位于已标记（包括 protectPreTags 标记的）元素内部的文本。
                    if (parent?.closest('.notranslate') || parent?.closest('.thatcloned')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            const textContent = node.nodeValue.trim();
            // 过滤极短或纯数字的文本节点
            if (textContent.length < 2 || (/^\d+$/.test(textContent) && textContent.length <= 2)) {
                continue;
            }

            let currentElement = node.parentElement;
            while (currentElement && currentElement !== document.body) {
                if (currentElement.closest(excludedAncestors)) break; // 向上查找遇到排除元素则停止

                // 判断是否为块级元素
                const displayStyle = getComputedStyle(currentElement).display;
                const isBlock = /^(block|flex|grid|table|list-item)$/.test(displayStyle) ||
                    /table-/.test(displayStyle) ||
                    /^(H[1-6]|P|DIV|LI|ARTICLE|SECTION|MAIN|UL|OL|BLOCKQUOTE|FIGURE|DETAILS)$/.test(currentElement.tagName);

                if (isBlock) {

                    // ✨ 检查 0: 排除复杂的 UI 容器（产品卡片、列表项等）
                    const tagName = currentElement.tagName;

                    // 仅对通用容器（DIV, LI）或文章/分段容器（ARTICLE）进行检查
                    if (['DIV', 'LI', 'ARTICLE'].includes(tagName)) {

                        // 如果子元素数量超过阈值 3，则认为它是复杂的 UI 容器，立即跳出
                        if (currentElement.children.length > 5) {
                            break;
                        }
                    }

                    // 检查 1: 跳过已处理过的原始元素（防止重复复制）
                    if (currentElement.classList.contains('thatcloned')) break;

                    // 检查 2: 跳过已手动标记为不翻译的元素
                    if (currentElement.classList.contains('notranslate')) break;

                    // 检查 3: 过滤极短和纯数据文本块
                    const fullText = currentElement.textContent.trim();
                    if (fullText.length >= 2 && !pureDataRegex.test(fullText)) {
                        textBlocksToClone.add(currentElement);
                    }

                    // 复制逻辑执行完毕或检查完毕后，跳出 while 循环
                    break;
                }
                currentElement = currentElement.parentElement;
            }
        }

        if (textBlocksToClone.size === 0) {
            console.log('%c [Immersive Translate] 没有发现符合要求的正文块级元素。', 'color:#fff;background:#e74c3c;padding:2px 4px;border-radius:4px;');
            return;
        }

        // 2. 复制并插入 'notranslate' 副本，并标记原始元素
        Array.from(textBlocksToClone).reverse().forEach(originalElement => {
            // 最终防御性检查
            if (originalElement.classList.contains('thatcloned') || originalElement.classList.contains('notranslate')) {
                return;
            }

            const clone = originalElement.cloneNode(true);
            clone.classList.add('notranslate');
            originalElement.parentNode.insertBefore(clone, originalElement);
            originalElement.classList.add('thatcloned');
        });

        // 3. 完成提示
        console.log(`%c [Immersive Translate] 成功处理 ${textBlocksToClone.size} 个正文块级元素。`,
            'color:#fff;background:#0d6efd;font-weight:bold;padding:2px 4px;border-radius:4px;font-size:12px;');
    })();
}

/**
 * @function protectPreTags
 * @description 预先为代码块、表格、按钮、输入元素和常见的元数据容器添加 'notranslate' 类。
 */
function protectPreTags() {
    // 保护范围：div.house, button, input, label, table, pre, td
    // 注意：h4, h5, h6 已移除，交由动态复制逻辑处理。
    document.querySelectorAll('svg,video,div.plyr__controls,[data-fancybox="ajax"],#dh_pageContainer,div.house,button,input,label,table,pre,td').forEach((element) => {
        element.classList.add('notranslate');
    });
}

// --- III. 流程控制与用户交互 ---

/**
 * @function initiateTranslationFlow
 * @description 按照预定顺序执行所有初始化和翻译保护函数。
 */
function initiateTranslationFlow() {
    console.log("[Immersive Translate] 翻译流程开始...");
    // 步骤 1: 静态保护 UI 元素
    protectPreTags();
    // 步骤 2: 加载 Google 翻译 UI
    loadGoogleTranslateUI();
    // 步骤 3: 复制和标记原文块
    applyNotranslateProtection();
    console.log("[Immersive Translate] 翻译流程执行完毕。");
}


/**
 * @function createFloatingButton
 * @description 创建并配置右下角的浮动“译/原”按钮，作为用户触发点。
 */
function createFloatingButton() {

    if (document.getElementById('google_translate_element')) return;
    // 1. 预设 Google Translate cookie，目标为 /auto/zh-CN
    document.cookie = "googtrans=/auto/zh-CN; path=/";

    // 2. 注入 CSS 样式
    const css = `
    .translate-hidden {
    height:0px;
    opacity:0 !important;
    pointer-events:none !important;
    transition:opacity 0.3s ease !important;
    }
        #translation-button {
            position: fixed;
            bottom: 30px;
            right: 0px;
            z-index: 10000;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #4A90E2;
            color: white;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            border: none;
            user-select: none;
        }
            
        #translation-button:hover { background-color: #357ABD; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); transform: scale(1.05); }
        #translation-button:active { transform: scale(0.98); background-color: #285A90; }

        /* ✨ 新增：翻译状态下的样式变化，提供视觉反馈 */
        #translation-button.translated {
            background-color: #E74C3C; /* 翻译状态下按钮变为红色 */
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 3. 创建 HTML DOM 结构
    const button = document.createElement('div');
    button.id = 'translation-button';
    button.textContent = '译'; // 默认显示“译”
    //document.querySelectorAll('.thatcloned').forEach((e) => { e.classList.remove('translate-hidden') }) 

    // 4. 添加点击事件监听器，实现状态切换逻辑
    button.addEventListener('click', () => {
        // 通过检查 .thatcloned 元素是否存在来判断当前是否处于双语状态
        const isTranslated = document.querySelector('.thatcloned');

        if (isTranslated && !document.querySelector('.thatcloned.translate-hidden')) {
            // 如果是双语状态，点击后恢复原文
            button.textContent = '译'; // 按钮文本改为“译”
            button.classList.remove('translated');
            document.querySelectorAll('.thatcloned').forEach((e) => { e.classList.add('translate-hidden') })
            //location.reload();
        } else {
            // 如果是原文状态，点击后启动翻译
            initiateTranslationFlow();
            button.textContent = '原'; // 按钮文本改为“原”
            button.classList.add('translated');
            document.querySelectorAll('.thatcloned').forEach((e) => { e.classList.remove('translate-hidden') })
        }
    });

    // 5. 将按钮添加到页面的 body 中
    document.body.appendChild(button);
}


// --- IV. 脚本入口点 ---
createFloatingButton();