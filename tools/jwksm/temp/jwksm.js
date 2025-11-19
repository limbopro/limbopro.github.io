#!/usr/bin/env node
/**
 * jwksm.js v7.0 - 本地多页 HTML 解析与归档
 * 职责：
 * 1. 接收 HTML 目录路径，并遍历所有文件。
 * 2. 使用 Playwright 将每个 HTML 文件内容注入页面并提取数据。
 * 3. 校验、合并所有页面的数据。
 * 4. 将旧的 daily.json 追加到 old.json (安全 JSON 合并)。
 * 5. 对 old.json 进行去重（基于“番号”）。
 * 6. 将新的 daily.json 覆盖归档目录中的旧文件。
 * 7. 确保脚本根据成功/失败返回退出码 (0/1)。
 */

const fs = require('fs').promises;
const path = require('path');
const { chromium } = require('playwright');

// --- 文件处理与合并逻辑 ---

/**
 * 安全读取 JSON 文件
 */
async function readJsonFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        // 文件不存在、无法读取或 JSON 解析失败，返回空数组
        return []; 
    }
}

/**
 * 根据对象的指定属性（键）进行去重。
 */
function uniqueBy(data, key) {
    const map = new Map();
    for (const item of data) {
        if (item[key]) {
            map.set(item[key], item);
        }
    }
    return Array.from(map.values());
}


/**
 * 将旧的归档数据合并到历史文件中，并进行去重。
 */
async function appendHistory(archivePath, historyPath) {
    const oldArchiveData = await readJsonFile(archivePath);
    
    if (Array.isArray(oldArchiveData) && oldArchiveData.length > 0) {
        
        console.log(`正在合并 ${oldArchiveData.length} 条旧数据到历史记录...`);
        const historyData = await readJsonFile(historyPath);
        
        let newHistoryData = historyData.concat(oldArchiveData);

        const originalLength = newHistoryData.length;
        newHistoryData = uniqueBy(newHistoryData, '番号');
        const uniqueLength = newHistoryData.length;
        const removedCount = originalLength - uniqueLength;

        if (removedCount > 0) {
            console.log(`已移除 ${removedCount} 条重复数据。`);
        }
        
        try {
            await fs.writeFile(historyPath, JSON.stringify(newHistoryData, null, 2), 'utf-8');
            console.log(`历史记录更新成功！当前共计 ${uniqueLength} 条不重复记录。`);
        } catch (e) {
            console.error(`写入历史文件失败 (${historyPath}):`, e.message);
        }
    } else {
        console.log('昨天的归档数据无效或为空，跳过历史记录合并。');
    }
}


// --- 核心执行逻辑 (读取目录并循环处理) ---

(async () => {
  // 1. 解析脚本参数 (目录路径, TEMP_DIR, ARCHIVE_DIR)
  const args = process.argv.slice(2);
  const htmlDirPath = args[0]; // **第一个参数是 HTML 目录路径**
  const tempDir = args[1];
  const archiveDir = args[2];
  
  if (!htmlDirPath || !tempDir || !archiveDir) {
      console.error('Usage: node jwksm.js <HTML_DIR_PATH> <TEMP_DIR> <ARCHIVE_DIR>');
      process.exit(1);
  }
  
  // 定义文件路径
  const TEMP_OUTPUT = path.join(tempDir, 'daily.json');
  const ARCHIVE_FILE = path.join(archiveDir, 'daily.json');
  const HISTORY_FILE = path.join(archiveDir, 'old.json');

  let browser;
  let allResults = []; // <--- 存储所有页面的合并结果
  let result = [];
  let success = false;

  try {
    // ----------------------------------------------------
    // --- Playwright 启动 (只需要启动一次) ---
    // ----------------------------------------------------
    
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // ----------------------------------------------------
    // --- 遍历目录，解析所有 HTML 文件 ---
    // ----------------------------------------------------
    const files = await fs.readdir(htmlDirPath);
    // 过滤并排序文件，确保按页码顺序处理
    const htmlFiles = files.filter(f => f.endsWith('.html')).sort(); 

    if (htmlFiles.length === 0) {
        throw new Error(`目录 ${htmlDirPath} 中未找到任何 HTML 文件。`);
    }

    console.log(`找到 ${htmlFiles.length} 个页面文件，开始逐一解析...`);

    for (const filename of htmlFiles) {
        const filepath = path.join(htmlDirPath, filename);
        console.log(`\n--- 正在解析文件: ${filename} ---`);
        
        const htmlContent = await fs.readFile(filepath, 'utf-8');
        if (!htmlContent || htmlContent.length < 500) {
            console.warn(`文件 ${filename} 内容无效，跳过。`);
            continue;
        }

        // 核心步骤：将本地 HTML 内容注入到 Playwright 页面中
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
        
        // 移除 page.waitForSelector，避免超时，改为等待 DOM 渲染完成
        await page.waitForTimeout(500); 

        // 提取数据
        const pageResult = await page.evaluate(() => {
            // (数据提取逻辑)
            const isCJK = c => {
                const code = c.charCodeAt(0);
                return (code >= 0x4E00 && code <= 0x9FFF) ||
                       (code >= 0x3040 && code <= 0x309F) ||
                       (code >= 0x30A0 && code <= 0x30FF);
              };
              const countCJK = str => [...str].filter(isCJK).length;
        
              const MISJUDGED = new Set([
                '做愛', '高潮', '墮落', '出軌', '瘋狂', '輪姦', '慘遭', '被報復', '偷竊', '留宿',
                '口爆', '洗腦', '陷落', '摩擦', '快感', '完全', '純情', '可愛', '人妻', '菊花'
              ]);
        
              const items = [];
              // 请注意：如果之前报错 Timeout，这个选择器 `.video-img-box` 可能需要调整！
              document.querySelectorAll('.video-img-box').forEach(box => { 
                const titleLink = box.querySelector('.detail h6.title a');
                const subTitle = box.querySelector('.sub-title');
        
                if (!titleLink || !subTitle) return;
        
                const fullTitle = titleLink.textContent.trim();
                if (!fullTitle) return;
        
                const parts = fullTitle.split(/\s+/).filter(p => p);
                if (parts.length === 0) return;
        
                const codeMatch = parts[0].match(/^([A-Z0-9]+-\d+)$/);
                const code = codeMatch ? codeMatch[1] : '';
                if (!code) return;
        
                let name = fullTitle.replace(new RegExp(`^${code}\\s*`), '').trim();
                name = name.replace(/\s+/g, ' ').trim();
        
                let actor = '未知';
                if (parts.length >= 3) {
                  const lastPart = parts[parts.length - 1];
                  const cjkCount = countCJK(lastPart);
                  const isMisjudged = MISJUDGED.has(lastPart);
                  const isValid = cjkCount > 0 && cjkCount <= 5 && !isMisjudged;
                  if (isValid) {
                    actor = lastPart;
                    name = name.replace(new RegExp(`\\s*${lastPart}$`), '').trim();
                  }
                }
        
                const likesMatch = subTitle.innerText.match(/[\u2665❤️]?\s*([\d,]+)\s*$/);
                const likes = likesMatch ? likesMatch[1].replace(/,/g, '') : '0';
        
                items.push({
                  番号: code,
                  名称: name,
                  演员: actor,
                  收藏人数: likes
                });
              });
              return items;
        });

        console.log(`成功提取 ${pageResult.length} 条数据。`);
        allResults = allResults.concat(pageResult); // <--- 合并结果
    }
    
    // 使用合并后的结果进行后续处理
    result = allResults; 

    // ----------------------------------------------------
    // --- 文件处理与归档部分 (保持不变) ---
    // ----------------------------------------------------

    // 2. 校验数据 (条目数 < 10 视为失败)
    if (result.length < 10) {
      throw new Error(`抓取条目数不足 (仅 ${result.length} 条)，视为失败。`);
    }

    // 3. 将新数据写入临时文件
    await fs.writeFile(TEMP_OUTPUT, JSON.stringify(result, null, 2), 'utf-8');

    // 4. 执行历史记录追加 (读取旧的 ARCHIVE_FILE，合并/去重后写入 HISTORY_FILE)
    await appendHistory(ARCHIVE_FILE, HISTORY_FILE);
    
    // 5. 覆盖最新数据 (将今天的临时文件移动到归档目录，覆盖昨天的 ARCHIVE_FILE)
    await fs.rename(TEMP_OUTPUT, ARCHIVE_FILE);

    console.log(`\n最新数据已覆盖至: ${ARCHIVE_FILE}，总条目数: ${result.length}`);
    
    // 6. 成功退出
    success = true;

  } catch (error) {
    console.error('\n解析或处理失败:', error.message);
    // ... (失败时的预览代码保持不变) ...
  } finally {
    if (browser) await browser.close();
    
    // 7. 清理临时目录
    try {
        await fs.unlink(TEMP_OUTPUT);
    } catch (e) {
        // 忽略错误
    }

    // 8. 设置退出码
    if (success) {
        process.exit(0); // 成功
    } else {
        process.exit(1); // 失败
    }
  }
})();