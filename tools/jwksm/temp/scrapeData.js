// scrapeData.js
const { chromium } = require('playwright');
const fs = require('fs');

// ❗ 请替换为你要获取数据的网站 URL
const TARGET_URL = 'https://limbopro.com/tools/jwksm/'; 
// ❗ 这是你在控制台中看到的变量名
const TARGET_VAR_NAME = 'dataList'; 

async function runScraper() {
    let browser;
    try {
        console.log(`🚀 启动浏览器...`);
        // 使用 chromium，也可以换成 firefox 或 webkit
        browser = await chromium.launch({ headless: true }); // headless: false 可视化查看过程
        const page = await browser.newPage();

        console.log(`🌐 正在访问: ${TARGET_URL}`);
        // 访问目标 URL，等待网络稳定
        await page.goto(TARGET_URL, { waitUntil: 'networkidle' }); 
        
        console.log(`🔍 正在尝试从控制台变量 ${TARGET_VAR_NAME} 中提取数据...`);
        
        // 使用 page.evaluate() 在页面的浏览器上下文（即控制台环境）中执行代码
        const dataList = await page.evaluate((varName) => {
            // 检查目标变量是否存在于全局对象 (window) 上
            if (typeof window[varName] !== 'undefined') {
                return window[varName]; // 返回变量的值
            }
            return null;
        }, TARGET_VAR_NAME); // 将 TARGET_VAR_NAME 传递给 evaluate 函数

        if (dataList) {
            console.log(`✅ 数据提取成功！获取到 ${dataList.length} 条记录。`);
            
            // 将数据格式化为 JSON 字符串
            const jsonString = JSON.stringify(dataList, null, 2);
            const fileName = 'ori.json';

            // 写入文件
            fs.writeFileSync(fileName, jsonString);
            console.log(`💾 数据已保存到文件: ${fileName}`);
            
            // 打印前几条数据预览
            console.log('\n--- 数据预览 ---');
            console.log(jsonString.substring(0, 500) + '...');
            console.log('------------------\n');

        } else {
            console.error(`❌ 错误：在页面中未找到变量 ${TARGET_VAR_NAME}。请确保网站已完全加载且变量名正确。`);
        }

    } catch (error) {
        console.error('致命错误:', error);
    } finally {
        if (browser) {
            await browser.close();
            console.log('🚪 浏览器关闭。');
        }
    }
}

runScraper();
