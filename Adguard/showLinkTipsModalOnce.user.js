/**
 * 自动化提示模态框 (V5.0 - 终极整合版)
 * 特点：动态占位符替换、全量属性展示、一键复制、深度优劣势分析
 */
window.showLinkTipsModalOnce = function() {
    // 1. 存在性检查：防止重复创建
    if (document.getElementById('gemini-tips-modal-overlay')) {
        document.getElementById('gemini-tips-modal-overlay').style.display = 'block';
        return;
    }

    // --- 2. 数据提取逻辑 ---
    const extractLiveInfo = () => {
        const sourceDiv = document.querySelector('#gemini-custom-modal-overlay div[style*="background: #f8f9fa"]');
        if (!sourceDiv) {
            alert("❌ 未发现捕获面板数据源，请先点击页面元素触发调试面板。");
            return null;
        }

        const data = {};
        const rows = sourceDiv.querySelectorAll('div[style*="word-break: break-all"]');
        
        rows.forEach(row => {
            const labelSpan = row.querySelector('span[style*="font-weight: bold"]');
            if (labelSpan) {
                const key = labelSpan.innerText.replace(':', '').trim();
                const value = row.innerText.replace(labelSpan.innerText, '').trim();
                
                // 核心字段映射
                const map = {
                    "父元素": "parent",
                    "目标元素": "target",
                    "目标元素尺寸": "size",
                    "相对CSS选择器(Base parentElement)": "relCSS",
                    "精确CSS选择器(Base attributes)": "absCSS",
                    "链接 (Href)": "href",
                    "Z/Opacity/Pos": "zPos",
                    "内联 Click": "inline",
                    "XPath": "xpath"
                };
                if (map[key]) data[map[key]] = value;
            }
        });
        return data;
    };

    const liveData = extractLiveInfo();
    if (!liveData) return;

    // --- 3. UI 样式定义 ---
    const styles = `
        .gemini-tips-modal-overlay { position: fixed !important; z-index: 210000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(8, 12, 24, 0.94); backdrop-filter: blur(10px); overflow-y: auto; }
        .gemini-tips-modal-content { background: #fff; margin: 2vh auto; padding: 25px 35px; border-radius: 20px; width: 94%; max-width: 1050px; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 30px 80px rgba(0,0,0,0.6); animation: slideIn 0.4s ease; color: #2d3748; }
        
        .full-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 15px 0; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .info-cell { font-size: 13px; }
        .info-cell b { color: #718096; display: block; font-size: 10px; text-transform: uppercase; margin-bottom: 4px; }
        .info-cell code { background: #fff; color: #e53e3e; padding: 2px 5px; border-radius: 4px; border: 1px solid #edf2f7; font-size: 12px; }
        .span-all { grid-column: span 3; border-top: 1px dashed #cbd5e0; padding-top: 10px; }

        .code-container { position: relative; margin: 10px 0; }
        .code-box { background: #1a202c; color: #cbd5e0; padding: 15px 60px 15px 15px; border-radius: 10px; font-family: 'Fira Code', monospace; font-size: 12px; word-break: break-all; border-left: 5px solid #3182ce; line-height: 1.5; }
        
        .copy-btn { position: absolute; right: 10px; top: 10px; background: #2d3748; color: #cbd5e0; border: 1px solid #4a5568; border-radius: 6px; padding: 6px 10px; cursor: pointer; font-size: 11px; transition: all 0.2s; z-index: 10; }
        .copy-btn:hover { background: #4a5568; color: #fff; }
        .copy-btn.copied { background: #38a169; color: #fff; border-color: #38a169; }

        .analysis-box { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px; }
        .tag-card { padding: 14px; border-radius: 10px; font-size: 12.5px; line-height: 1.6; }
        .tag-card.pros { background: #f0fff4; border-left: 4px solid #38a169; color: #22543d; }
        .tag-card.cons { background: #fff5f5; border-left: 4px solid #e53e3e; color: #742a2a; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- 4. 功能函数 (复制与替换) ---
    window.geminiCopyText = (btn, text) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '✅ 已复制';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copied');
            }, 2000);
        });
    };

    // 关键修正：在渲染时处理变量替换
    const renderAnalysis = (text) => {
        return text
            .replace(/\${liveData.parent}/g, `<code>${liveData.parent}</code>`)
            .replace(/\${liveData.target}/g, `<code>${liveData.target}</code>`);
    };

    const createSection = (title, code, color, prosArr, consArr) => `
        <div style="margin-top:30px;">
            <span style="font-weight:bold; font-size:15px; color:${color}; margin-bottom:10px; display:block;">${title}</span>
            <div class="code-container">
                <div class="code-box" style="border-left-color:${color};">${code}</div>
                <button class="copy-btn" onclick="geminiCopyText(this, '${code.replace(/'/g, "\\'")}')">📋 复制</button>
            </div>
            <div class="analysis-box">
                <div class="tag-card pros">
                    <b>✅ 优势分析：</b><br>
                    ${prosArr.map(p => `• ${renderAnalysis(p)}`).join('<br>')}
                </div>
                <div class="tag-card cons">
                    <b>❌ 劣势分析：</b><br>
                    ${consArr.map(c => `• ${renderAnalysis(c)}`).join('<br>')}
                </div>
            </div>
        </div>
    `;

    // --- 5. 构建模态框 HTML ---
    const modal = document.createElement('div');
    modal.id = 'gemini-tips-modal-overlay';
    modal.className = 'gemini-tips-modal-overlay notranslate';

    modal.innerHTML = `
        <div class="gemini-tips-modal-content">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0; font-size:24px; color:#1a202c;">🔍 自动化脚本：元素定位审查报告</h2>
                <span onclick="this.closest('.gemini-tips-modal-overlay').remove()" style="cursor:pointer; font-size:35px; color:#cbd5e0; line-height:1;">&times;</span>
            </div>

            <div class="full-info-grid">
                <div class="info-cell"><b>父级容器</b><code>${liveData.parent}</code></div>
                <div class="info-cell"><b>当前目标</b><code>${liveData.target}</code></div>
                <div class="info-cell"><b>元素尺寸</b>${liveData.size}</div>
                <div class="info-cell"><b>Z/Opacity/Pos</b>${liveData.zPos}</div>
                <div class="info-cell"><b>内联点击事件</b>${liveData.inline}</div>
                <div class="info-cell"><b>捕获源版本</b>V26.39.12+</div>
                <div class="info-cell span-all"><b>目标链接 (Href)</b><small style="color:#3182ce; font-family:monospace;">${liveData.href}</small></div>
            </div>

            ${createSection("[ 方案 A ] 相对 CSS 选择器 (最佳实践)", liveData.relCSS, "#38a169", 
                ["结构稳定性极高：仅依赖 \${liveData.parent} 内部结构，不受外部页面大改版影响。", "代码简洁：非常适合在 <code>eval()</code> 或自定义脚本中进行逻辑判断。", "浏览器解析效率最高。"], 
                ["索引依赖：若同一 \${liveData.parent} 下有多个相同元素，需确保 <code>nth-child</code> 正确。"])}

            ${createSection("[ 方案 B ] 精确属性选择器 (Base Attributes)", liveData.absCSS, "#3182ce", 
                ["全局唯一性：通过 Href 特征或 ID 锚点，能 100% 锁定该特定业务对象。", "无视位置变动：只要链接属性不变，无论元素如何位移都能被捕获。"], 
                ["极度脆弱：路径属于长链条依赖，中间任何一个层级的 Class 改变都会失效。", "包含业务数据：不具备通用性，仅适用于处理该特定链接。"])}

            ${createSection("[ 方案 C ] 完整 XPath 路径 (强力保底)", liveData.xpath, "#805ad5", 
                ["定位维度最全：支持 CSS 无法实现的“文本内容匹配”和“向上查找父级”。", "逻辑保底：在某些极其动态、无规律的 Class 页面中是唯一的解决方案。"], 
                ["性能开销稍大：在特大型 DOM 树中略逊于 CSS 选择器。", "维护难度高：路径对层级顺序高度敏感，插入一个广告 div 即可破坏定位。"])}

            <button onclick="this.closest('.gemini-tips-modal-overlay').remove()" style="width:100%; margin-top:35px; padding:16px; background:#f7fafc; color:#4a5568; border:1px solid #e2e8f0; border-radius:12px; font-weight:bold; cursor:pointer; font-size:14px;">返回调试界面</button>
        </div>
    `;

    document.body.appendChild(modal);
}