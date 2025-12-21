/**
 * 自动化提示模态框 (V5.5 - 集成一键屏蔽功能)
 * 新增：在复制按钮左侧添加“🛡️ 屏蔽”按钮，直接调用屏蔽逻辑。
 */
window.showLinkTipsModalOnce = function() {
    if (document.getElementById('gemini-tips-modal-overlay')) {
        document.getElementById('gemini-tips-modal-overlay').style.display = 'block';
        return;
    }

    // --- 1. 核心屏蔽逻辑函数 ---
    window.geminiApplyBlock = (sel) => {
        let savedCount = 0;
        try {
            // 验证语法合法性
            document.createDocumentFragment().querySelector(sel);

            // 调用你的 saveCssRemovalChoice 函数
            if (typeof saveCssRemovalChoice === 'function') {
                if (saveCssRemovalChoice(sel)) {
                    savedCount++;
                    // 调用确认执行弹窗 (假设 confirmndExecuteFC 已定义)
                    if (typeof confirmndExecuteFC === 'function') {
                        confirmndExecuteFC(`✅ 成功保存 ${savedCount} 个 CSS 选择器！是否立即刷新页面应用新规则？`, () => { location.reload() });
                    } else if (confirm('✅ 成功保存！是否立即刷新页面？')) {
                        location.reload();
                    }
                } else {
                    if (typeof confirmndExecuteFC === 'function') {
                        confirmndExecuteFC(`${sel} 已存在于屏蔽列表。`);
                    } else {
                        alert('该选择器已屏蔽过。');
                    }
                }
            } else {
                console.error('[错误] 找不到 saveCssRemovalChoice 函数');
                alert(`无法屏蔽：未找到 saveCssRemovalChoice 函数。\n拟屏蔽选择器: ${sel}`);
            }
        } catch (e) {
            console.warn(`[Gemini屏蔽] 语法错误: ${sel}`, e);
            alert('生成的选择器语法有误，无法屏蔽。');
        }
    };

    const extractLiveInfo = () => {
        const sourceDiv = document.querySelector('#gemini-custom-modal-overlay div[style*="background: #f8f9fa"], #gemini-custom-modal-overlay div[style*="background: white"] div[style*="background: #f8f9fa"]');
        if (!sourceDiv) {
            alert("❌ 未发现捕获面板数据源。");
            return null;
        }

        const data = {};
        const rows = sourceDiv.querySelectorAll('div[style*="word-break: break-all"]');
        rows.forEach(row => {
            const labelSpan = row.querySelector('span[style*="font-weight: bold"]');
            if (labelSpan) {
                const rawLabel = labelSpan.innerText.trim();
                const key = rawLabel.replace(':', '').trim();
                const value = row.innerText.replace(rawLabel, '').trim();
                const map = {
                    "父元素": "parent", "目标元素": "target", "目标元素属性特征": "attr",
                    "目标元素尺寸": "size", "相对CSS选择器(Base parentElement)": "relCSS",
                    "精确CSS选择器(Base attributes)": "absCSS", "目标元素递归向上含链接(Href)": "href",
                    "Z/Opacity/Pos": "zPos", "内联 Click": "inline", "XPath": "xpath"
                };
                if (map[key]) data[map[key]] = value;
            }
        });
        return data;
    };

    const liveData = extractLiveInfo();
    if (!liveData) return;

    const styles = `
        .gemini-tips-modal-overlay { position: fixed !important; z-index: 114120; left: 0; top: 0; width: 100%; height: 100%; background: rgba(8, 12, 24, 0.94); backdrop-filter: blur(10px); overflow-y: auto; -webkit-overflow-scrolling: touch; }
        .gemini-tips-modal-content { background: #fff; margin: 2vh auto; padding: 25px 35px; border-radius: 20px; width: 94%; max-width: 1050px; font-family: system-ui, -apple-system, sans-serif; box-shadow: 0 30px 80px rgba(0,0,0,0.6); animation: slideIn 0.4s ease; color: #2d3748; box-sizing: border-box; }
        .full-info-grid { display: grid; grid-template-columns: 1fr; gap: 12px; margin: 15px 0; background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
        @media (min-width: 768px) { .full-info-grid { grid-template-columns: repeat(3, 1fr); padding: 20px; } }
        .info-cell { font-size: 13px; word-break: break-word; }
        .info-cell b { color: #718096; display: block; font-size: 10px; text-transform: uppercase; margin-bottom: 4px; }
        .info-cell code { background: #fff; color: #e53e3e; padding: 2px 5px; border-radius: 4px; border: 1px solid #edf2f7; font-size: 12px; display: inline-block; max-width: 100%; word-break: break-all; }
        .span-all { grid-column: 1 / -1; padding-top: 10px; }
        .code-container { position: relative; margin: 10px 0; }
        .code-box { background: #1a202c; color: #cbd5e0; padding: 15px 15px 50px 15px; border-radius: 10px; font-family: 'Fira Code', monospace; font-size: 12px; word-break: break-all; border-left: 5px solid #3182ce; line-height: 1.5; }
        @media (min-width: 768px) { .code-box { padding: 15px 160px 15px 15px; } }
        
        .btn-group { position: absolute; right: 10px; bottom: 10px; display: flex; gap: 8px; z-index: 10; }
        @media (min-width: 768px) { .btn-group { top: 10px; bottom: auto; } }
        
        .action-btn { border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 11px; border: 1px solid transparent; transition: all 0.2s; font-weight: bold; }
        .copy-btn { background: #2d3748; color: #cbd5e0; border-color: #4a5568; }
        .block-btn { background: #c53030; color: white; border-color: #9b2c2c; }
        .block-btn:hover { background: #e53e3e; }
        
        .analysis-box { display: grid; grid-template-columns: 1fr; gap: 15px; margin-top: 10px; }
        @media (min-width: 768px) { .analysis-box { grid-template-columns: 1fr 1fr; } }
        .tag-card { padding: 14px; border-radius: 10px; font-size: 12.5px; line-height: 1.6; }
        .tag-card.pros { background: #f0fff4; border-left: 4px solid #38a169; color: #22543d; }
        .tag-card.cons { background: #fff5f5; border-left: 4px solid #e53e3e; color: #742a2a; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    window.geminiCopyText = (btn, text) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '✅ 已复制';
            setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
        });
    };

    const createSection = (title, code, color, prosArr, consArr, isBlockable = true) => `
        <div style="margin-top:30px;">
            <span style="font-weight:bold; font-size:15px; color:${color}; margin-bottom:10px; display:block;">${title}</span>
            <div class="code-container">
                <div class="code-box" style="border-left-color:${color};">${code}</div>
                <div class="btn-group">
                    ${isBlockable ? `<button class="action-btn block-btn" onclick="geminiApplyBlock('${code.replace(/'/g, "\\'")}')">🛡️ 屏蔽</button>` : ''}
                    <button class="action-btn copy-btn" onclick="geminiCopyText(this, '${code.replace(/'/g, "\\'")}')">📋 复制</button>
                </div>
            </div>
            ${prosArr ? `
            <div class="analysis-box">
                <div class="tag-card pros"><b>✅ 优势分析：</b><br>${prosArr.map(p => `• ${p.replace(/\${liveData.parent}/g, `<code>${liveData.parent}</code>`)}`).join('<br>')}</div>
                <div class="tag-card cons"><b>❌ 劣势分析：</b><br>${consArr.map(c => `• ${c.replace(/\${liveData.target}/g, `<code>${liveData.target}</code>`)}`).join('<br>')}</div>
            </div>` : ''}
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'gemini-tips-modal-overlay';
    modal.className = 'gemini-tips-modal-overlay notranslate';
    modal.innerHTML = `
        <div class="gemini-tips-modal-content">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0; font-size:24px; color:#1a202c;">🔍 自动化脚本：元素定位审查报告</h2>
                <span onclick="this.closest('.gemini-tips-modal-overlay').remove()" style="cursor:pointer; font-size:35px; color:#cbd5e0;">&times;</span>
            </div>
            <div class="full-info-grid">
                <div class="info-cell"><b>父级容器</b><code>${liveData.parent}</code></div>
                <div class="info-cell"><b>当前目标</b><code>${liveData.target}</code></div>
                <div class="info-cell"><b>属性特征</b><code>${liveData.attr || '无'}</code></div>
                <div class="info-cell"><b>元素尺寸</b>${liveData.size}</div>
                <div class="info-cell"><b>Z/Opacity/Pos</b>${liveData.zPos}</div>
                <div class="info-cell"><b>内联点击事件</b>${liveData.inline}</div>
                <div class="info-cell span-all"><b>目标元素递归向上含链接(Href)</b><small style="color:#3182ce; font-family:monospace; word-break:break-all;">${liveData.href}</small></div>
            </div>

            ${createSection("🛠️ 提取到的目标元素属性特征", liveData.attr || '', "#ed8936", 
                ["精准定位：直接反射目标元素的内在特征属性。", "独立性强：不依赖外部 DOM 层级。"], 
                ["内容耦合：属性值可能包含动态参数。"], true)}

            ${createSection("[ 方案 A ] 相对 CSS 选择器 (最佳实践)", liveData.relCSS, "#38a169", 
                ["结构稳定性极高：仅依赖 ${liveData.parent} 内部结构。", "代码简洁：适合在 <code>eval()</code> 中使用。", "浏览器解析效率最高。"], 
                ["索引依赖：需确保 <code>nth-child</code> 正确。"])}

            ${createSection("[ 方案 B ] 精确属性选择器 (Base Attributes)", liveData.absCSS, "#3182ce", 
                ["全局唯一性：能 100% 锁定特定业务对象。", "无视位置变动：只要链接属性不变即可捕获。"], 
                ["极度脆弱：中间层级 Class 改变会失效。", "包含业务数据：不具备通用性。"])}

            ${createSection("[ 方案 C ] 完整 XPath 路径 (强力保底)", liveData.xpath, "#805ad5", 
                ["定位维度最全：支持文本匹配和向上查找。", "逻辑保底：复杂页面唯一方案。"], 
                ["性能开销稍大：在大型 DOM 树中稍慢。", "维护难度高：路径对层级敏感。"], false)}

            <button onclick="this.closest('.gemini-tips-modal-overlay').remove()" style="width:100%; margin-top:35px; padding:16px; background:#f7fafc; border:1px solid #e2e8f0; border-radius:12px; font-weight:bold; cursor:pointer;">返回调试界面</button>
        </div>
    `;
    document.body.appendChild(modal);
}