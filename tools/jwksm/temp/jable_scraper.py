import time
import os
import sys
# 引入 Playwright 库
from playwright.sync_api import sync_playwright, Playwright

# --- 配置 ---
BASE_URL = 'https://jable.tv/hot/'
# HTML 文件保存目录 (必须与 run-daily.sh 中的 HTML_DIR 匹配)
SAVE_DIR = '/home/typecho/tools/jwksm/temp/jable_data'
START_PAGE = 1
END_PAGE = 5

# Playwright 不需要手动设置 HEADERS，因为它自带完整的浏览器指纹。

def log(message):
    """简单的日志记录函数"""
    print(f"[{time.strftime('%H:%M:%S')}] {message}")
    sys.stdout.flush()

def ensure_dir_exists():
    """确保保存目录存在"""
    if not os.path.exists(SAVE_DIR):
        os.makedirs(SAVE_DIR)
        log(f"创建目录: {SAVE_DIR}")

def scrape_page(page_num, playwright_page):
    """使用 Playwright 抓取单个页面并保存 HTML 内容"""
    if page_num == 1:
        url = BASE_URL
    else:
        url = f'{BASE_URL}/page/{page_num}/'

    log(f"正在请求第 {page_num} 页 (使用 Playwright)...")
    
    try:
        # 核心：使用 page.goto 导航，自动执行 JS 挑战和反爬验证
        # 优化: 更改 wait_until 为 'networkidle'，确保所有反爬脚本运行完毕
        response = playwright_page.goto(
            url, 
            wait_until="networkidle", 
            timeout=45000 # 增加超时时间到 45 秒，给反爬挑战更多时间
        )
        
        status_code = response.status
        
        if status_code != 200:
            log(f"❌ Playwright 导航失败，状态码: {status_code}")
            return False
        
        # 获取完全渲染后的 HTML 内容
        html_content = playwright_page.content()
        
        # 成功保存
        file_name = f'jable_page_{page_num}.html'
        file_path = os.path.join(SAVE_DIR, file_name)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        log(f"✅ 第 {page_num} 页成功保存到: {file_name}")
        return True
            
    except Exception as e:
        log(f"❌ Playwright 抓取发生异常: {e}")
        return False

def main():
    """主函数，循环抓取所有页面"""
    print(f"--- 开始抓取第 {START_PAGE} 页到第 {END_PAGE} 页 (使用 Playwright) ---")
    ensure_dir_exists()
    
    # 启动 Playwright 实例
    with sync_playwright() as p:
        # 优化 1: 浏览器启动参数增加 stealth 选项
        browser = p.chromium.launch(
            headless=True, 
            args=[
                '--no-sandbox',
                '--disable-blink-features=AutomationControlled' # 绕过常见的headless检测
            ]
        )
        
        # 优化 2: 设置真实的视口大小和 Referer
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            extra_http_headers={
                'Referer': 'https://www.google.com/', # 伪装成从谷歌搜索进入
            }
        )
        page = context.new_page()
        
        for i in range(START_PAGE, END_PAGE + 1):
            success = scrape_page(i, page) # 传递 page 对象
            
            if not success:
                log("等待 10 秒后继续下一页...") 
                time.sleep(10)
            else:
                # 成功后暂停 2 秒，避免因速率过快再次触发封锁
                time.sleep(2)

        browser.close()
    
    print("--- 抓取任务完成 ---")

if __name__ == '__main__':
    # 确保 Playwright 依赖已安装
    # 运行此脚本前，您可能需要执行：playwright install
    main()