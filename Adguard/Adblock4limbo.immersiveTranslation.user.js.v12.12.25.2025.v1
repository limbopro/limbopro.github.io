// ==UserScript==
// @name         沉浸式双语翻译 (Google Translate & Dual Wrapper) - 简洁滚动控制 - 纯JS版本
// @namespace    http://tampermonkey.net/
// @version      2025-12-22_Final_V17.2_ScrollSimple_CloseButton_Stable
// @description  基于 Google Translate，采用双包裹结构实现沉浸式双语对照翻译。包含：Trusted Types兼容加载、SPA路由变化监控、滚动时自动隐藏 UI、以及浮动按钮切换“双语/原文”模式。
// @author       limbopro
// @match        https://*/*
// require       https://translate.google.com/translate_a/element.js?cb=google.translate.TranslateElementInit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=translate.google.com/
// @grant        none
// ==/UserScript==

/**
 * 加载并初始化谷歌翻译用户界面组件。
 * 兼容 Trusted Types 环境，以避免 'TrustedScriptURL' 错误。
 */

//document.cookie = "googtrans=/auto/zh-CN; path=/";


// 全局转换带br的段落

function formatWholeDom(root = document.body) {
    // 1. 找出所有直接包含 br 的元素
    // 使用 TreeWalker 或 querySelectorAll 效率较高
    const containers = Array.from(root.querySelectorAll('*')).filter(el => {
        // 只处理直接子节点包含 br 的元素，避免重复嵌套处理
        return el.children.length > 0 &&
            Array.from(el.childNodes).some(node => node.nodeName === 'BR') &&
            !['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(el.tagName);
    });

    containers.forEach(container => {
        // 获取 HTML 内容
        const rawHTML = container.innerHTML;

        // 按照一个或多个 br 进行切割
        const parts = rawHTML.split(/(?:<br\s*\/?>)+/i);

        // 如果切割后的片段多于 1 个，说明需要重组
        if (parts.length > 1) {
            const newHTML = parts
                .map(part => part.trim())
                .filter(part => part !== "") // 过滤掉空段落
                .map(part => `<p style="margin-bottom: 1em; display: block;">${part}</p>`)
                .join('');

            if (newHTML) {
                container.innerHTML = newHTML;
            }
        }
    });
}




window.loadGoogleTranslateUI = async function () {
    return new Promise((resolve) => {

        const uiContainerId = 'google_translate_element';
        const successSelector = '.goog-te-gadget';
        const translationButton = document.getElementById("translation-button");

        // --- 1. 预检查：如果 UI 已存在且符合状态，直接返回成功 ---
        if (document.querySelector(successSelector)) {
            console.log("翻译组件已在运行中，跳过初始化。");
            return resolve(true);
        }

        // --- 2. 谷歌翻译初始化函数配置 ---
        window.google = window.google || {};
        window.google.translate = window.google.translate || {};
        window.google.translate.TranslateElementInit = function () {
            new google.translate.TranslateElement({
                includedLanguages: 'zh-CN,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, uiContainerId);
        };

        // --- 3. 创建 UI 容器 ---
        let uiContainer = document.getElementById(uiContainerId);
        if (!uiContainer) {
            uiContainer = document.createElement('div');
            uiContainer.id = uiContainerId;
            uiContainer.classList.add('notranslate');
            Object.assign(uiContainer.style, {
                position: 'fixed', top: '40px', right: '0px', zIndex: '9999',
                /*backgroundColor: '#f8f8f8', padding: '8px 12px', borderRadius: '10px 0px 0px 10px',*/
                /*boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', border: '1px solid #ddd',*/
                transition: 'box-shadow 0.3s ease-in-out', lineHeight: '0'
            });
            document.body.appendChild(uiContainer);
        }

        // --- 4. 核心：设置 DOM 监听器 ---
        // 在脚本注入前就开始监听，确保不漏掉任何瞬间
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(successSelector)) {
                console.log("%c[Google Translate] 检测到组件加载成功！", "color: #4CAF50; font-weight: bold;");
                obs.disconnect(); // 停止监听
                clearTimeout(timeoutTimer); // 清除超时
                resolve(true); // 告诉 await 执行完毕
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 设置超时保护
        const timeoutTimer = setTimeout(() => {
            observer.disconnect();
            console.warn("[Google Translate] 加载超时。");
            resolve(false);
        }, 8000);

        // --- 5. 动态加载脚本 (Trusted Types 兼容) ---
        const scriptUrl = '//translate.google.com/translate_a/element.js?cb=google.translate.TranslateElementInit';
        const script = document.createElement('script');
        script.type = 'text/javascript';
        let finalScriptSrc = scriptUrl;

        if (window.trustedTypes && trustedTypes.createPolicy) {
            try {
                const policy = trustedTypes.createPolicy('google-translate-loader', {
                    createScriptURL: (url) => url.startsWith('//translate.google.com/') ? url : null
                });
                finalScriptSrc = policy.createScriptURL(scriptUrl);
            } catch (e) {
                console.warn("[Trusted Types] 回退到普通字符串赋值", e);
            }
        }

        script.src = finalScriptSrc;
        document.head.appendChild(script);
        console.log("翻译脚本已注入，等待 UI 渲染...");
    });


}



// --- II. 双包裹体创建逻辑 ---

window.applyDualWrapperProtection = function () {

    (() => {
        //console.clear();
        //document.querySelectorAll('.cjsfy-original, .cjsfy-translated, .spacer').forEach(e => e.remove());

        // 检查本地存储配置
        if (localStorage.getItem('immersiveTranslate') !== 'true') return;
        const targetsToProcess = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {


                /** 重构 */

                acceptNode: node => {

                    const text = node.nodeValue.trim();
                    if (!text) return NodeFilter.FILTER_REJECT;

                    // 1. 纯数字或符号 (例如 123.45)
                    const pureNumericOrSymbolic = /^\s*[\d\s.,]+\s*$/.test(text)
                    if (pureNumericOrSymbolic) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    // 2. 日期格式 (例如 2025-12-12)
                    const dateformat = /\b(\d{1,4}[-\/.]\d{1,2}[-\/.]\d{1,4})\b/.test(text)
                    if (dateformat) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    // **【新增过滤规则：纯时间格式 (例如 45:00, 1:23:45)】**
                    const timeFormat = /^\s*(\d{1,2}:\d{2}(:\d{2})?)\s*$/.test(text);
                    if (timeFormat) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const parent = node.parentElement;

                    if (!parent) return NodeFilter.FILTER_REJECT;

                    const excludedTags = 'script, style, noscript, textarea';
                    if (parent.closest(excludedTags)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.closest('.notranslate, .cjsfy-original, .cjsfy-translated, font[dir], svg, video')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (parent.dataset._textDuplicated) return NodeFilter.FILTER_REJECT;
                    if (text.length < 2) return NodeFilter.FILTER_REJECT; // 字符长度
                    return NodeFilter.FILTER_ACCEPT;
                }

                /** 重构结束 */


            }
        );

        let textNode;

        while (textNode = walker.nextNode()) {
            const target = textNode.parentElement;
            target.dataset._textDuplicated = 'pending';
            targetsToProcess.push({
                originalText: target.innerText,
                target: target
            });
        }


        // 2. 统一处理：创建并插入 双包裹体 + 分隔符
        const results = [];
        targetsToProcess.forEach(({ originalText, target }, i) => {

            function wrapTarget() { // 打包函数开始 包裹 对于普通节点
                console.log(target.innerText)
                // 1. 创建 原文副本 (克隆：保留原结构和内容)

                const originalWrapper = target.cloneNode(true);
                originalWrapper.classList.add('notranslate', 'Original', 'ori');

                // 创建 分隔符
                const separator = document.createElement('p');
                separator.className = 'spacer';

                // 2. 创建 译文包裹层
                const translatedWrapper = originalWrapper.cloneNode(true)
                translatedWrapper.className = 'cjsfy-translated';


                // 5. 清空 target 元素，并按顺序插入
                target.innerText = ''
                target.appendChild(originalWrapper);
                target.appendChild(separator);
                target.appendChild(translatedWrapper);

                // 标记为已处理
                target.dataset._textDuplicated = 'true';

                if (i === 0) {
                    target.style.outline = '3px solid #00bcd4';
                    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    setTimeout(() => target.style.outline = '', 3000);
                }

                results.push({ target });
            } // 打包函数结束



            // 克隆函数开始

            window.cloneThat = function cloneAndModifyElements(originalElements) { // 对于含有 br 的节点
                originalElements.forEach(originalElement => {
                    const clonedElement = originalElement.cloneNode(true);
                    clonedElement.classList.remove('notranslate');
                    clonedElement.classList.add('cjsfy-translated');
                    originalElement.insertAdjacentElement('afterend', clonedElement);
                });
                console.log(`成功处理了 ${originalElements.length} 个元素。`);
            }

            window.cloneThats = function cloneAndModifyElements(originalElement) { // 对于含有 br 的节点
                const clonedElement = originalElement.cloneNode(true);
                clonedElement.classList.add('notranslate');
                originalElement.parentElement.insertBefore(clonedElement, originalElement);
                originalElement.classList.add('cjsfy-translated')
            }

            // 克隆函数结束

            wrapTarget(target)

        });


        console.log(`%c 成功为 ${results.length} 个元素创建了双包裹结构`,
            'color:#fff;background:#00bcd4;padding:8px 16px;border-radius:8px;font-size:16px;');

        window.REVERT_DUAL_WRAPPER = () => {
            document.querySelectorAll('[data-_textDuplicated]').forEach(el => {
                const translatedWrapper = el.querySelector('.cjsfy-translated');
                const separator = el.querySelector('.spacer');
                const Original = el.querySelector('.Original.ori');

                separator?.remove();
                Original?.remove();

                if (translatedWrapper) {
                    while (translatedWrapper.firstChild) {
                        el.appendChild(translatedWrapper.firstChild);
                    }
                    translatedWrapper.remove();
                }

                delete el.dataset._textDuplicated;
                el.style.outline = '';
            });
            console.log('已撤销所有双包裹结构');
        };

        console.log('%c 如需撤销包裹，执行：REVERT_DUAL_WRAPPER()',
            'background:#ff9800;color:#fff;padding:6px 12px;border-radius:4px;');

        console.log("[Immersive Translate] Google Translate UI 加载已触发。");
        localStorage.setItem('immersiveTranslate', 'true')


        // 删除实际上需要被翻译的元素上的 notranslate 类
        // 修正后的写法
        document.querySelectorAll('.cjsfy-translated.skiptranslate.is-processing')?.forEach((x) => {
            x.classList.remove('skiptranslate', 'is-processing');
        });

        document.querySelectorAll('.spacer.skiptranslate.is-processing')?.forEach((x) => {
            x.classList.remove('is-processing'); // 去掉点号
        });


        document.querySelectorAll('.spacer.skiptranslate.is-processing')?.forEach((x) => {
            x.classList.remove('is-processing'); // 去掉点号
        });


        document.querySelectorAll('.skiptranslate.is-processing')?.forEach((x) => {
            x.classList.remove('skiptranslate', 'is-processing');
        });

    })();
}


// 拆分函数开始 拆分 含有 br 的节点 转为 p



// 拆分br函数结束

function protectPreTags() { // 排除
    document.querySelectorAll('button:not(:has(> *)),span.label,#jable-skip-panel,button:has(svg),svg,video,div.plyr__controls,[data-fancybox="ajax"],#dh_pageContainer,div.house,input,label,table,pre,td').forEach((element) => {
        element.classList.add('notranslate');
    });
}

// --- III. 流程控制与用户交互 ---

window.initiateTranslationFlow = function initiateTranslationFlow() {

    // 所有资源（图片、css、js 等）都加载完毕
    console.log("[Immersive Translate] 翻译流程开始...");
    // 如果 按钮 已存在，直接返回
    protectPreTags();
    applyDualWrapperProtection();
    console.log("[Immersive Translate] 翻译流程执行完毕。");
}

function loadExternalCss(cssUrl) {
    // 1. 创建一个新的 <link> 元素
    const link = document.createElement('link');

    // 2. 设置 link 元素的属性
    link.rel = 'stylesheet';  // 必须是 stylesheet
    link.type = 'text/css';   // 设置 MIME 类型
    link.href = cssUrl;       // 设置 CSS 文件的 URL

    document.head.appendChild(link);
    console.log(`外部 CSS 文件已加载: ${cssUrl}`);
}



function createFloatingButton() {

    if (document.getElementById('translation-button')) { return }

    // 调用函数，传入您提供的 CSS 文件 URL
    const cssFileUrl = 'https://limbopro.com/CSS/Adblock4limbo.user.css'; // 含 Adguard 通用广告元素选择器 看外网网页会非常干净
    // loadExternalCss(cssFileUrl); 自行去导航里的工具箱开启
    const css = `


    /* 隐藏翻译工具栏 */
    .goog-te-banner-frame.skiptranslate, 
    .goog-te-gadget { 
        display: none !important; 
    }

    /* 修复隐藏工具栏后 body 出现的顶部空白 */
    body { 
        top: 0px !important; 
    }

    /* 隐藏鼠标悬停时的原始文字弹窗 */
    google_translate_element,
    #goog-gt-tt, .goog-tooltip, .goog-tooltip:hover { 
        display: none !important; 
        visibility: hidden !important; 
    }
        
    /* 隐藏翻译后的文字高亮阴影 */
    .goog-text-highlight { 
        background-color: transparent !important; 
        box-shadow: none !important; 
    }
    

    html, body {
    overflow-x: hidden !important;
    /* 额外保险：防止触摸设备上的橡皮筋回弹效果 */
    position: relative;
    width: 100% !important;
    }
     
    /* 该死的广告 */
    /* 部分网站似乎有“很大意见”，强制隐藏广告它直接白屏 故不再全局加载该样式
    .Ad-label,
    .ad-label,
    .widget.ad,
    [class*="acm_ad"],
    [id*="ad-unit"],
    [class*="ad-unit"],
    [data*="ad-unit"],
    [data-name*="ad-unit"],
    [data-testid*="ad-unit"],
    [class*='ads'],
    [id*='ads'] {
        display: none !important;
        pointer-events: none !important;
        opacity:0;
    }
    */

    .Original {
    /*margin: 0px;*/
    padding:0px;
    /*display: none !important;*/
    }

    .showOriginal {
    /*display: none !important;*/
    }

    .spacer {
        height:1px;
        margin:0px !important;
        padding:0px;
        border:0px;
    }

    iframe.skiptranslate,
    .dual-wrapper-hidden {
        display: none !important;
        height: 0px !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }

    .cjsfy-original, .cjsfy-translated {
        pointer-events: none;
        font-size:inherit;
        margin: 0px !important;
        color: inherit;
        word-break: break-word;
        user-select: text;
        line-height:inherit;
        /*display: block !important;*/
    }

    /* 滚动隐藏/显示所需的样式 */
    #translation-button, #google_translate_element {
        /* 添加过渡效果，让隐藏和显示更平滑 */
        transition: opacity 0.5s ease-in-out !important, visibility 0.5s ease-in-out !important;
        pointer-events: auto; /* 确保默认可点击 */
        visibility: visible;
    }

    /* 滚动隐藏时的类 */
    .scroll-hidden {
        opacity: 0 !important;
        visibility: hidden !important; /* 新增 visibility 确保元素不占用空间或阻止交互 */
        /* 使用 pointer-events: none 确保隐藏时无法被点击 */
        pointer-events: none !important;
    }

        #refresh-button,
        #translation-button {
        padding: 0px;
        border:1px solid #1a73e8;
        position: fixed;
        right: 0px;
        left: auto;
        bottom: 35% !important;
        height: auto;
        z-index: 10000;
        width: 45px;
        height: 36px;
        line-height: 36px;
        border-radius: 5px 0px 0px 5px;
        background-color:#fff;
        color:#1a73e8;
        font-size: x-small;
        font-weight: bold;
        text-align: center;
        user-select: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        /* 保持 fixed 定位 */
    }

    /* 交互效果 */
        #translation-button:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15) !important;
        }

        #translation-button:active {  transform: scale(0.98); }

        #translation-button.translated {
            border: 1px solid #34a853; /* 绿色，代表完成 */
            background-color: #34a853;
            color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* 新增：关闭按钮样式 */
        #translation-close-btn {
            position: absolute;
            top: -8px; /* 调整位置 */
            right: -8px; /* 调整位置 */
            width: 18px;
            height: 18px;
            line-height: 16px;
            font-size: 12px;
            background-color: #f44336; /* 红色背景 */
            color: white;
            border: 1px solid white;
            border-radius: 50%; /* 圆形 */
            cursor: pointer;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            z-index: 10001; /* 确保在主按钮之上 */
            font-weight: normal;
            transition: all 0.2s;
            opacity: 0.9;
        }

        #translation-close-btn:hover {
            opacity: 1;
            transform: scale(1.1);
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.id = 'translation-button';
    button.className = 'notranslate cjsfy btx';
    button.textContent = '双语';

    document.body.appendChild(button);

    // 保护主按钮不被双包裹逻辑处理
    button.setAttribute('data-_textDuplicated', 'true');

    // =======================================================
    // 新增：创建关闭按钮的函数，以便在需要时调用
    // =======================================================
    const createCloseButton = () => {


        let closeButton = document.getElementById('translation-close-btn');

        if (!closeButton) {
            closeButton = document.createElement('div');
            closeButton.id = 'translation-close-btn';
            closeButton.textContent = '×';
            closeButton.className = 'notranslate';
            // 确保按钮被添加到主按钮中
            document.getElementById('translation-button')?.appendChild(closeButton);

            // 重新绑定事件监听器
            closeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const buttonEl = document.getElementById('translation-button');

                if (buttonEl) {
                    buttonEl.classList.add('scroll-hidden');
                    console.log("[UI Control] 浮动按钮及关闭按钮已隐藏。");
                }

                window.SHOW_TRANSLATION_BUTTON = () => {
                    document.getElementById('translation-button')?.classList.remove('scroll-hidden');
                    console.log("[UI Control] 浮动按钮已重新显示。");
                };
                console.log('%c如需重新显示浮动按钮，请在控制台执行：SHOW_TRANSLATION_BUTTON()', 'background:#2196F3;color:#fff;padding:6px 12px;border-radius:4px;');
            });
            console.log("✅ 关闭按钮已重建并重新绑定事件。");
            return true;
        }
        return false;
    };
    // =======================================================

    // 1. 初始创建关闭按钮
    createCloseButton();

    // 4. 点击事件监听器 (V12 修正逻辑)
    button.addEventListener('click', () => {
        const ori = document.querySelectorAll('.notranslate.ori');
        const translatedElements = document.querySelectorAll('.cjsfy-translated, .spacer');


        const isWrapped = ori.length > 0;
        const isTranslatedHidden = translatedElements.length > 0 && translatedElements[0].classList.contains('dual-wrapper-hidden');

        if (isWrapped && !isTranslatedHidden) {

            button.textContent = '双语';
            localStorage.setItem('immersiveTranslate', 'false')
            button.classList.remove('translated');
            translatedElements.forEach((e) => { e.classList.add('dual-wrapper-hidden') });

            ori.forEach((e) => {
                e.classList.add('showOriginal')
                e.classList.remove('Original')
            });

            console.log('切换成原文模式...')

            // **【修改点 B: 停止循环】**
            if (wtfIntervalId !== null) {
                clearInterval(wtfIntervalId);
                console.log(`[UI Control] Google Translate UI 循环加载已停止 (ID: ${wtfIntervalId})。`);
                wtfIntervalId = null; // 重置 ID
            }

            hideElements(); // 隐藏样式

            // *** 增强：切换到原文模式时，检查并重建关闭按钮 ***
            if (!document.getElementById('translation-close-btn')) {
                createCloseButton();
            }


        } else {

            if (!isWrapped) {
                initiateTranslationFlow();
                // 首次调用 initiateTranslationFlow() 后，延迟检查一次，以防 DOM 重构
                setTimeout(createCloseButton, 500);
            }
            localStorage.setItem('immersiveTranslate', 'true')
            button.textContent = '原文';
            button.classList.add('translated');
            showElements() // 显示谷歌翻译小工具组件
            translatedElements.forEach((e) => { e.classList.remove('dual-wrapper-hidden') });
            console.log('切换成双语模式...')
        }
    });


    // =======================================================
    // 5. 滚动隐藏与延时显示逻辑 (严格按需简化)
    // =======================================================
    let scrollTimer;
    const hideDelay = 1000000000000; // 10 秒 (使用超长延迟相当于关闭滚动隐藏功能)

    const hideElements = () => {
        const googleEl = document.getElementById('google_translate_element');
        if (googleEl) {
            googleEl.classList.add('scroll-hidden');
        }
        document.querySelector('.skiptranslate')?.classList.add('scroll-hidden');
    };

    const showElements = () => {

        const googleEl = document.getElementById('google_translate_element');
        if (googleEl) {
            googleEl.classList.remove('scroll-hidden');
        }
        document.getElementById('translation-button')?.classList.remove('scroll-hidden');
        document.querySelector('.skiptranslate')?.classList.remove('scroll-hidden');

    };

    /*
    const handleScroll = () => {
        if (document.getElementById('google_translate_element'))
            if (document.querySelector('.cjsfy-translated').classList.value.includes('dual-wrapper-hidden') || document.querySelector('.cjsfy-translated') == null || document.querySelector('.cjsfy-translated').querySelector('font[dir]') !== null)
                hideElements();
                clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
            console.log(`%c[UI Control] 停止滚动 ${hideDelay / 1000} 秒，重新显示 UI 元素。`, 'color: #17A2B8;');
            showElements();
        }, hideDelay);
    };
    */

    // window.addEventListener('scroll', handleScroll, { passive: true });
}


// --- IV. 脚本入口点与监控 ---

createFloatingButton();

// 判断谷歌翻译是否提前翻译

window.skiptrans = function () {
    const googletraLength = document.querySelectorAll("font[dir] > font[dir]").length;
    const cjsfytraLength = document.querySelectorAll(".notranslate.ori").length;
    if (googletraLength > 0 && (googletraLength / cjsfytraLength) > 3) {
        console.log('正在重载🔃...' + "googletraLength: " + googletraLength + "; cjsfytraLength: " + cjsfytraLength)
        //forceHardReload()
    } else {
        console.log('无需重载🔃...' + "googletraLength: " + googletraLength + "; cjsfytraLength: " + cjsfytraLength)
    }
}



/**
 * 使用 MutationObserver 监控 DOM 变化，以检测 SPA 导航加载新内容。
 * 并在检测到 URL 变化和 DOM 变化时，提示用户进行操作。
 */
function monitorDomAndUrlChanges() {
    let lastUrl = window.location.href;
    console.log("[Observer] DOM 变动与 URL 监控已启动...");

    const observerConfig = {
        childList: true, // 监控子节点的增减
        subtree: true,   // 监控整个子树
        attributes: false, // 不监控属性变化
        characterData: false // 不监控文本内容变化
    };

    const domObserver = new MutationObserver((mutationsList, observer) => {
        // 仅在 URL 实际发生变化时采取行动 (这是 SPA 导航的关键判断)
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;

            // 暂停观察，防止递归调用
            observer.disconnect();

            console.log("检测到 SPA 路由变化和内容加载...");



            // ----------------------------------------------------
            // 替代原脚本中的 alert/confirm 逻辑
            // ----------------------------------------------------
            setTimeout(() => {
                /*
                                const userAction = confirm(
                                    '⚠️ 提示：\n\n存在的问题：\n当前页面未按预期进行双语对照翻译；\n\n可能的原因：\n单页应用路由跳转导致（如网站使用了PJAX/AJAX技术）\n\n需要重新加载页面以便正确执行翻译请求？\n\n（如仍不能按预期进行双语对照翻译，请手动刷新页面。更多问题请进入导航->设置-反馈/留言。）\n\n'
                                    //'⚠️ 提示：\n\n存在的问题：\n当前页面未按预期进行双语对照翻译；\n\n可能的原因：\n单页应用路由跳转导致（如网站使用了PJAX/AJAX技术）\n\n是否需要重新加载页面以便正确执行翻译请求？\n\n如仍不能按预期进行双语对照翻译，请手动刷新页面。更多问题请进入导航->设置-反馈/留言。\n\n'
                                    //'⚠️ 提示：\n检测到单页应用 (SPA) 路由跳转导致内容刷新。\n\n是否需要**重新加载页面**以便正确执行翻译和包裹？\n'
                                );
                
                                if (userAction) {
                                    forceHardReload()
                                } else {
                                    // 如果用户选择不刷新，则尝试重新应用包裹和翻译流程 (如果需要)
                                    // 注意: 强制重构 DOM 可能会导致用户体验不佳
                                    // initiateTranslationFlow(); 
                
                                    // 重启观察者
                                    observer.observe(document.body, observerConfig);
                                }
                */

                //forceHardReload()
            }, 5000); // 给浏览器一个短暂的时间来完成渲染新内容

        }
        // 如果 URL 未变，但 DOM 变动了 (例如，弹窗或懒加载内容)，通常不需要刷新。
    });

    // 开始观察 document.body
    domObserver.observe(document.body, observerConfig);
}

/**
 * 强制重新加载当前页面，通过附加时间戳参数来绕过浏览器缓存，
 * 达到模拟用户“硬刷新”的效果。
 */
window.forceHardReload = function forceHardReload() {
    const currentUrl = new URL(window.location.href);
    const timestamp = Date.now();

    // 1. 移除可能已存在的随机参数
    currentUrl.searchParams.delete('cachebuster');

    // 2. 添加新的时间戳参数
    currentUrl.searchParams.set('cachebuster', timestamp);
    window.location.href = currentUrl.toString();
}

// monitorDomAndUrlChanges();

monitorDomAndUrlChanges()

// ==========================================================
// 全局变量用于存储 setInterval ID
// ==========================================================
let wtfIntervalId = null;




// 1. 状态锁必须定义在函数外面，才能起到“拦截”作用
let isTranslating = false;

window.ybyfy = async function () { // ybyfy()Í

    // 检查本地存储配置
    if (localStorage.getItem('immersiveTranslate') !== 'true') return;

    skiptrans()
    applyDualWrapperProtection()

    createFloatingButton()
    const button = document.getElementById('translation-button');
    if (button) {
        button.textContent = '原文';
        button.classList.add('translated');
    }

    //startGoogleTranslate('zh-CN')
    /*
// 2. 检查锁状态
    if (isTranslating) {
        console.log("检测到 loadGoogleTranslateUI 正在运行中，跳过重复触发。");
        return;
    }

    // --- 开始执行逻辑 ---
    isTranslating = true; // 上锁
    console.log("准备加载翻译 UI...");

*/

    try {
        // 确保 loadGoogleTranslateUI 被 await
        // 注意：如果这个函数本身不返回 Promise，await 会立即跳过
        document.cookie = "googtrans=/auto/zh-CN; path=/";

        await loadGoogleTranslateUI();

        // 如果这里还有后续逻辑，可以继续写
        console.log("翻译 UI 加载指令已发送");

    } catch (error) {
        console.error("加载翻译时出错:", error);
    } finally {
        // 无论成功还是报错，最终都要释放锁
        /*isTranslating = false;*/
        console.log("锁已释放");
    }
};



/**
 * 开启翻译
 * @param {string} langCode - 语言代码 (如 'en', 'ja', 'ko')，默认为 'en'
 */
window.startGoogleTranslate = function startGoogleTranslate(langCode = 'en') {
    // 1. 预设 Cookie，确保全站及后续加载生效
    const domain = window.location.hostname;
    document.cookie = `googtrans=/auto/${langCode}; path=/;`;
    document.cookie = `googtrans=/auto/${langCode}; path=/; domain=.${domain};`;

    // 2. 尝试寻找下拉框进行瞬时切换
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
    }
    console.log(`[GoogleTranslate] 已尝试开启翻译至: ${langCode}`);
}


/**
 * 关闭翻译并还原原文
 */
window.stopGoogleTranslate = function stopGoogleTranslate() {
    // 1. 清除所有可能的 googtrans Cookie
    const domain = window.location.hostname;
    const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = `googtrans=; ${expire}; path=/;`;
    document.cookie = `googtrans=; ${expire}; path=/; domain=.${domain};`;

    // 2. 模拟切回原文
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
    }

    // 3. 暴力清理谷歌留下的 UI 痕迹和样式
    setTimeout(() => {
        // 重置 body 位置和间距
        document.body.style.top = '0px';
        document.body.style.position = 'static';
        document.documentElement.style.marginTop = '0px';

        // 移除 HTML 上的 class
        document.documentElement.classList.remove('translated-ltr', 'translated-rtl');

        // 隐藏工具栏 iframe
        const frames = ['.goog-te-banner-frame', '.goog-te-menu-frame', '.goog-tooltip'];
        frames.forEach(s => {
            const el = document.querySelector(s);
            if (el) el.style.display = 'none';
        });
        console.log("[GoogleTranslate] 翻译已关闭并清理残留");
    }, 300);
}






/**
 * 持久监听 DOM 变动：每当页面静止超过 waitTime 毫秒，执行 ybyfy()
 */
window.keepYbyfyAlive = function keepYbyfyAlive(waitTime = 1000) {
    console.log("🚀 持久监控已启动：将持续守护页面变动...");

    let timer = null;
    skiptrans()

    const observer = new MutationObserver((mutations) => {
        // 只要有变动，就清除旧的计时器

        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                const hasCjsfy = node?.classList?.contains('cjsfy-translated');
                const hasOriginal = node?.classList?.contains('Original');
                const hasSpacer = node?.classList?.contains('spacer');
                if (node.nodeType === 1 && !hasCjsfy && !hasOriginal && !hasSpacer) { // 元素节点
                    // 1. 立即锁定：加上谷歌官方的禁止类和你的自定义处理类
                    node.classList.add('skiptranslate', 'is-processing');

                    // 2. 执行你的业务逻辑
                    // 示例：获取原始属性或进行异步计算
                    console.log("正在处理原始节点:", node.innerText);
                }
            });
        });

        if (timer) {
            clearTimeout(timer)
        };

        // 重新开始计时
        timer = setTimeout(() => {
            console.log(`[${new Date().toLocaleTimeString()}] 页面已静默 ${waitTime}ms，触发执行...`);

            if (typeof ybyfy === "function") {
                try {
                    ybyfy();
                } catch (e) {
                    console.error("执行 ybyfy 时出错:", e);
                }
            } else {
                console.warn("未找到 ybyfy() 函数，请确保它已定义。");
            }

            // 注意：这里删除了 observer.disconnect()，所以它会一直运行
        }, waitTime);
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行一次
    timer = setTimeout(() => {
        if (typeof ybyfy === "function") ybyfy();
    }, waitTime);
};

// 立即启动
keepYbyfyAlive(1000);




// 其他函数

/**
 * 动态加载谷歌翻译脚本，并尝试使用 Trusted Types 进行安全兼容处理。
 *
 * @param {string} scriptUrl 脚本的完整 URL，例如：//translate.google.com/translate_a/element.js?cb=...
 * @param {string} policyName Trusted Types 策略的名称，例如：'google-translate-loader'
 * @param {string} urlPrefix 脚本 URL 的安全前缀，用于 Trusted Types 策略内部验证。例如：'//translate.google.com/'
 */
function loadTranslateScriptWithTrustedTypes(scriptUrl, policyName, urlPrefix) {
    // 检查参数是否有效
    if (!scriptUrl || !policyName || !urlPrefix) {
        console.error("加载脚本失败：请提供 scriptUrl, policyName 和 urlPrefix 三个参数。");
        return;
    }

    // 1. 创建 script 元素
    const script = document.createElement('script');
    script.type = 'text/javascript';

    let finalScriptSrc = scriptUrl;

    // 2. 检查并应用 Trusted Types
    if (window.trustedTypes && trustedTypes.createPolicy) {
        try {
            // 创建一个 Trusted Script URL Policy
            const policy = trustedTypes.createPolicy(policyName, {
                // 使用传入的 urlPrefix 进行验证
                createScriptURL: (url) => {
                    if (url.startsWith(urlPrefix)) {
                        return url;
                    }
                    throw new Error(`Attempted to load untrusted script URL: ${url}. Does not start with ${urlPrefix}`);
                }
            });

            // 将 URL 字符串转换为 TrustedScriptURL 对象
            finalScriptSrc = policy.createScriptURL(scriptUrl);
            console.log(`[Trusted Types] 成功使用策略 "${policyName}" 加载脚本。`);
        } catch (e) {
            console.warn(`[Trusted Types] 无法创建或应用 TrustedScriptURL 策略 "${policyName}"，回退到普通字符串赋值。`, e);
            finalScriptSrc = scriptUrl;
        }
    }

    // 3. 赋值并插入 DOM
    // 无论是否成功使用 Trusted Types，都将最终的源赋值给 script 元素的 src 属性
    script.src = finalScriptSrc;

    // 插入到文档头部或尾部
    // 检查 document.head 是否存在是最佳实践
    (document.head || document.body || document.documentElement).appendChild(script);

    console.log(`脚本加载请求已发送: ${scriptUrl}`);
}

// --- 调用示例 ---

// 传入您要求的参数
const SCRIPT_URL = '//limbopro.com/Adguard/Adblock4limbo.user.js';
const POLICY_NAME = 'limboproNavigation';
const URL_PREFIX = '//limbopro.com/';

// 调用函数以加载脚本
loadTranslateScriptWithTrustedTypes(SCRIPT_URL, POLICY_NAME, URL_PREFIX);


/**
 * 使用 Trusted Types 安全地加载 CSS 样式表。
 * * @param {string} cssUrl - 要加载的 CSS 文件的完整 URL。
 * @param {string} policyName - 创建 Trusted Type Policy 的名称（必须唯一）。
 * @param {string} urlPrefix - 允许加载 CSS 文件的 URL 前缀。
 */
function loadStylesheetWithTrustedTypes(cssUrl, policyName, urlPrefix) {
    if (!cssUrl || !policyName || !urlPrefix) {
        console.error("加载 CSS 失败：请提供 cssUrl, policyName 和 urlPrefix 三个参数。");
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';

    let finalLinkHref = cssUrl;

    // 检查并应用 Trusted Types
    if (window.trustedTypes && trustedTypes.createPolicy) {
        try {
            // 创建一个 Trusted Type 策略来验证 URL
            const policy = trustedTypes.createPolicy(policyName, {
                // 使用 createScriptURL 来验证源 URL
                createScriptURL: (url) => {
                    if (url.startsWith(urlPrefix)) {
                        return url;
                    }
                    throw new Error(`Attempted to load untrusted CSS URL: ${url}. Does not start with ${urlPrefix}`);
                }
            });

            // 将 URL 字符串转换为 TrustedScriptURL 对象
            finalLinkHref = policy.createScriptURL(cssUrl);
            console.log(`[Trusted Types] 成功使用策略 "${policyName}" 验证 CSS 链接。`);
        } catch (e) {
            console.warn(`[Trusted Types] 无法创建或应用策略 "${policyName}"，回退到普通字符串赋值。`, e);
            finalLinkHref = cssUrl;
        }
    }

    // 赋值并插入 DOM
    link.href = finalLinkHref;
    (document.head || document.body || document.documentElement).appendChild(link);

    console.log(`CSS 加载请求已发送: ${cssUrl}`);
}

/**
 * 尝试从完整主机名中提取主域名（Root Domain）。
 * 此方法避免使用完整的 Public Suffix List (PSL)，仅包含常见规则，不保证 100% 准确。
 * @param {string} hostname - 完整的主机名 (e.g., "www.news.bbc.co.uk")
 * @returns {string} 主域名 (e.g., "bbc.co.uk")
 */
window.getRootDomain = function getRootDomain(hostname) {
    if (!hostname) return '';

    // 1. 预处理：移除 www. 前缀
    let siteName = hostname.toLowerCase();
    if (siteName.startsWith('www.')) {
        siteName = siteName.substring(4);
    }

    // 2. 将域名分解成段 (Label)
    let parts = siteName.split('.');

    // 3. 定义常见的复杂公共后缀 (Public Suffix List - PSL 的简化版)
    // 如果这些后缀存在，我们需要保留其前两个标签（主域名 + TLD/SLD）
    const complexTLDs = [
        'co.uk', 'com.cn', 'co.jp', 'com.au', 'com.hk', 'com.tw',
        'nom.co', 'com.br', 'gov.cn', 'ac.jp'
    ];

    // 4. 检查是否匹配复杂的公共后缀
    if (parts.length > 2) {
        // 检查最后两段是否是一个复杂的 TLD (e.g., "co.uk")
        const lastTwo = parts.slice(-2).join('.');

        if (complexTLDs.includes(lastTwo)) {
            // 如果是复杂的 TLD，我们取最后三段作为主域名
            // e.g., ["news", "bbc", "co", "uk"] -> parts.length=4, slice(-3) -> "bbc.co.uk"
            return parts.slice(-3).join('.');
        }
    }

    // 5. 默认行为 (简单 TLD，如 .com)
    // 取最后两段作为主域名
    // e.g., ["news", "bbc", "com"] -> slice(-2) -> "bbc.com"
    // e.g., ["google", "com"] -> slice(-2) -> "google.com"
    return parts.slice(-2).join('.');
}



/**
 * 初始化广告拦截 CSS 加载器。
 */
window.initAdblockLoader = function initAdblockLoader() {
    // --- 配置 ---
    const BASE_CSS_URL = 'https://limbopro.com/CSS/';
    const TT_POLICY_NAME = 'adblock-css-loader'; // 确保策略名称唯一
    const TT_URL_PREFIX = BASE_CSS_URL; // 信任的前缀就是 CSS 文件的基础路径
    // --- 配置结束 ---

    if (typeof window === 'undefined' || !document.head) {
        return; // 非浏览器环境或 DOM 未就绪
    }

    // 1. 获取当前页面的主机名 (例如: "www.bbc.com", "news.reuters.com")
    const hostname = window.location.hostname;

    // **核心：获取主域名**
    const siteName = getRootDomain(hostname);


    // 3. 构建 CSS 文件名和完整的 URL
    const cssFileName = siteName + '.css'; // // example reddit.com.css
    const cssUrl = BASE_CSS_URL + cssFileName; // // example http://limbopro.com/CSS/reddit.com.css

    // 3.1. 构建自定义 CSS 文件名和完整的 URL
    const cssFileNameByhand = "limbopro." + siteName + '.css'; // // example limbopro.reddit.com.css
    const cssUrlByhand = BASE_CSS_URL + cssFileNameByhand; // example http://limbopro.com/CSS/limbopro.reddit.com.css

    // 4. 使用安全的函数加载样式表
    loadStylesheetWithTrustedTypes(cssUrl, TT_POLICY_NAME, TT_URL_PREFIX); // example http://limbopro.com/CSS/reddit.com.css
    loadStylesheetWithTrustedTypes(cssUrlByhand, TT_POLICY_NAME, TT_URL_PREFIX); // example http://limbopro.com/CSS/limbopro.reddit.com.css

    console.log(`[Adblock Loader] 尝试根据域名 "${hostname}" 加载 "${cssFileName}"`);
}

// 启动加载器
formatWholeDom()
initAdblockLoader();




(function() {
    // 1. 注入样式
    const style = document.createElement('style');
    style.innerHTML = `#translation-button.hidden-toggle { display: none !important; }`;
    document.head.appendChild(style);

    let clickTimes = [];
    let checkTimer = null; // 用于延迟确认是否还有后续点击

    const handleClicks = (e) => {
        const btn = document.getElementById('translation-button');
        if (btn && btn.contains(e.target)) return;

        const now = Date.now();
        clickTimes.push(now);

        // 始终只保留最近 1 秒内的点击
        clickTimes = clickTimes.filter(t => now - t <= 1000);

        // 每次点击都清除之前的等待逻辑
        if (checkTimer) clearTimeout(checkTimer);

        // 如果当前 1 秒内正好点击了 3 次，设置一个短延迟检查是否有第 4 次
        if (clickTimes.length === 3) {
            checkTimer = setTimeout(() => {
                // 延迟结束时，如果队列里依然只有 3 次（没有第4次加入），则触发
                if (clickTimes.length === 3) {
                    if (btn) {
                        btn.classList.toggle('hidden-toggle');
                        console.log("暗号匹配成功：3次点击。");
                    }
                    clickTimes = []; // 执行后重置
                }
            }, 250); // 250ms 的观察窗，足以判定用户是否在继续点击
        } 
        // 如果超过 3 次，直接清空队列，判定为“乱点”，什么也不做
        else if (clickTimes.length >= 4) {
            console.log("点击过快或过多，忽略操作。");
            clickTimes = [];
        }
    };

    const eventType = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
    document.addEventListener(eventType, handleClicks);
})();
