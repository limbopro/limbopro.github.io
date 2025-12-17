
/**
 * 自动生成并显示网页元素信息提示板一次。
 * 在创建前会检查 ID 为 'gemini-tips-modal-overlay' 的元素是否已存在，
 * 以防止重复生成。
 */
function showLinkTipsModalOnce() {

    // **[新增] 1. 存在性检查：防止重复创建**
    if (document.getElementById('gemini-tips-modal-overlay')) {
        console.warn("Gemini Tips: 提示板已存在，阻止重复创建。");
        document.getElementById('gemini-tips-modal-overlay').style.display = 'block' // 那就打开
        return;
    }
    // 检查通过，继续创建...


    // 2. 定义 CSS 样式
    const styles = `
        /* 全局重置和字体优化 */
        .gemini-tips-modal-content, .gemini-tips-info-table, .gemini-tips-code-example {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            box-sizing: border-box !important;
        }

        /* 模态框背景样式 */
        .gemini-tips-modal-overlay {
            display: none; 
            position: fixed !important; 
            z-index: 114122 !important; 
            left: 0 !important;
            top: 0 !important;
            width: 100% !important; 
            height: 100% !important; 
            background-color: rgba(18, 24, 40, 0.8) !important; 
            backdrop-filter: blur(4px) !important; 
            overflow-y: auto !important; 
            -webkit-overflow-scrolling: touch !important;
        }
        
        /* 模态框内容容器 */
        .gemini-tips-modal-content {
            background-color: #ffffff !important;
            margin: 5vh auto !important; 
            padding: 20px !important;
            border-radius: 12px !important; 
            width: 95% !important; 
            max-width: 750px !important; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important; 
            border: none !important; 
        }

        /* 动画 */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .gemini-tips-modal-content { animation: fadeIn 0.3s ease-out !important; }

        /* 标题和段落 */
        .gemini-tips-modal-content h2 {
            color: #1a2a4b !important; 
            font-size: 24px !important;
            margin-bottom: 15px !important;
            padding-bottom: 5px !important;
            border-bottom: 2px solid #e9f0ff !important;
        }
        .gemini-tips-modal-content p {
            line-height: 1.6 !important;
            color: #555 !important;
            margin-bottom: 10px !important;
        }


        /* 关闭按钮 */
        .gemini-tips-close-btn {
            color: #888 !important;
            float: right !important;
            font-size: 36px !important;
            font-weight: 300 !important; 
            line-height: 1 !important;
            margin-left: 10px !important;
        }

        .gemini-tips-close-btn:hover,
        .gemini-tips-close-btn:focus {
            color: #333 !important;
            text-decoration: none !important;
            cursor: pointer !important;
        }

        /* 提示板内的表格样式 */
        .gemini-tips-info-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 20px !important;
            font-size: 13px !important;
            border-radius: 6px !important;
            overflow: hidden !important;
        }

        .gemini-tips-info-table th, .gemini-tips-info-table td {
            border: none !important; 
            padding: 12px !important;
            text-align: left !important;
            border-bottom: 1px solid #f0f0f0 !important;
        }

        .gemini-tips-info-table th {
            background-color: #007bff !important; 
            color: white !important;
            font-weight: 600 !important;
        }
        
        .gemini-tips-info-table tr:nth-child(odd) {
            background-color: #fafafa !important;
        }
        .gemini-tips-info-table tr:hover {
             background-color: #e6f7ff !important; 
        }

        /* 突出显示关键用途 */
        .gemini-tips-usage-section h3 {
            color: #007bff !important;
            border-bottom: none !important;
            padding-bottom: 0 !important;
            margin-top: 30px !important;
            font-size: 18px !important;
        }

        /* 代码块样式 */
        .gemini-tips-code-example {
            background-color: #f0f3f8 !important; 
            color: #2c3e50 !important;
            padding: 10px 15px !important;
            border-radius: 6px !important;
            font-family: 'Courier New', monospace !important;
            white-space: pre-wrap !important;
            margin-top: 10px !important;
            border-left: 4px solid #007bff !important; 
            font-size: 14px !important;
        }
        
        /* 移动端特殊调整 */
        @media (max-width: 600px) {
            .gemini-tips-modal-content {
                margin: 3vh auto !important;
                padding: 15px !important;
            }
            .gemini-tips-info-table th, .gemini-tips-info-table td {
                padding: 8px !important;
                font-size: 12px !important;
            }
        }
    `;

    // 3. 将样式添加到 <head>
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    // 4. 创建模态框元素和内容

    const modal = document.createElement('div');
    modal.className = 'gemini-tips-modal-overlay notranslate';
    modal.id = 'gemini-tips-modal-overlay';

    const content = document.createElement('div');
    content.className = 'gemini-tips-modal-content notranslate';
    content.id = 'gemini-tips-modal-content';

    // 参照信息表格 (内容)
    const referenceTable = `
        <table class="gemini-tips-info-table notranslate">
            <thead>
                <tr>
                    <th style="width: 30%;">信息项</th>
                    <th style="width: 70%;">参照信息 (文章链接 Tag: A)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>**目标类型 / Tag**</td>
                    <td>A (超链接)</td>
                </tr>
                <tr>
                    <td>**CSS 选择器**</td>
                    <td>a.title-link</td>
                </tr>
                <tr>
                    <td>**链接 / Href**</td>
                    <td>https://techcrunch.com/category/artificial-intelligence/</td>
                </tr>
                <tr>
                    <td>**父级简述**</td>
                    <td>H3#.card__title</td>
                </tr>
                <tr>
                    <td>**XPath**</td>
                    <td>//*[@id='wp--skip-link--target']/div[1]/...</td>
                </tr>
            </tbody>
        </table>
    `;

    // 提示内容 HTML
    content.innerHTML = `
        <span class="gemini-tips-close-btn notranslate" id="gemini-tips-modal-close-top">&times;</span>
        <h2>📰 如何利用目标信息</h2>
        <p>目标信息举例：</p>
        
        ${referenceTable}

        <div class="gemini-tips-usage-section notranslate">
            <h3>🔗 如何通过目标信息进行定位 (核心步骤)</h3>
            
            <table class="gemini-tips-info-table notranslate">
                <thead>
                    <tr>
                        <th style="width: 35%;">定位方法</th>
                        <th style="width: 30%;">定位表达式</th>
                        <th>适用性与优势</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>**CSS 选择器**</td>
                        <td class="notranslate"><code>a.title-link</code></td>
                        <td>**首选**：简洁、快速、易维护，适合批量操作。</td>
                    </tr>
                    <tr>
                        <td>**XPath (相对)**</td>
                        <td class="notranslate"><code>//a[@class='title-link']</code></td>
                        <td>**备选**：定位最灵活，可向上查找父节点，但执行速度略慢。</td>
                    </tr>
                </tbody>
            </table>
            
            <p style="margin-top: 15px;">**利用父级信息增强定位：** 结合父级简述（H3#.card__title）可构建更精确的 CSS 选择器：</p>
            <div class="gemini-tips-code-example notranslate">h3#card__title > a.title-link[href*='https://techcrunch.com/category/artificial-intelligence/']</div>

            <p style="margin-top: 25px; font-weight: bold; color: #cc3300 !important;">🔑 总结：工具或脚本需要利用 **CSS 选择器** 或 **XPath** 精确找到元素。</p>
        </div>
    `;

    // 将元素添加到 DOM
    document.body.appendChild(modal);
    modal.appendChild(content);


    // 5. 添加事件监听器 (Logic)

    // 获取关闭按钮元素
    const modalCloseBtn = document.getElementById('gemini-tips-modal-close-top');

    // 严格定义关闭函数
    const closeModal = () => {
        // 使用 ID 引用来确保关闭的是正确的元素
        const modalElement = document.getElementById('gemini-tips-modal-overlay');
        if (modalElement) {
            modalElement.remove()
        }
    };

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    } else {
        console.warn("Gemini Tips: 未找到关闭按钮 ID 'gemini-tips-modal-close-top'。");
    }

    // 点击背景时关闭模态框
    modal.addEventListener('click', (event) => {
        // 检查点击目标的 ID 是否等于模态框的 ID
        if (event.target.id === 'gemini-tips-modal-overlay') {
            closeModal();
        }
    });

    // 6. 显示模态框
    modal.style.display = 'block';
}