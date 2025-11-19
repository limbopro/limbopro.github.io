import os
from bs4 import BeautifulSoup
import pandas as pd  # 导入 pandas 库
import json          # 导入 json 库

# 您之前抓取到的 HTML 文件所在的目录
INPUT_DIR = "jable_data"

# ... (parse_local_html_files 函数保持不变) ...

def parse_local_html_files():
    # ... (函数体保持不变) ...
    all_video_data = []
    # ... (文件解析和数据提取逻辑保持不变) ...
    return all_video_data

# --- 执行解析和导出 ---
if __name__ == "__main__":
    
    # 1. 执行解析
    scraped_data = parse_local_html_files()
    
    print("\n==================================")
    print(f"总共从 {len(os.listdir(INPUT_DIR))} 个文件中提取到 {len(scraped_data)} 条视频数据。")
    print("==================================")
    
    # 打印前 5 条数据进行验证 (保持不变)
    print("--- 前 5 条数据示例 ---")
    for data in scraped_data[:5]:
        print(f"[{data['page_file']}] 标题: {data['title'][:30]}... | 链接: {data['url']}")
    print("------------------------------------------")

    # ======================================================
    #   新的导出逻辑 START
    # ======================================================

    # 1. 导出为 CSV 文件 (推荐用于表格分析)
    try:
        df = pd.DataFrame(scraped_data)
        csv_filename = 'scraped_videos_data.csv'
        
        # index=False 表示不将 pandas 自动生成的行号写入文件
        df.to_csv(csv_filename, index=False, encoding='utf-8')
        print(f"✅ 数据成功导出为 CSV 文件: {csv_filename}")
        
    except Exception as e:
        print(f"❌ 导出 CSV 时出错 (是否安装了 pandas?): {e}")

    # 2. 导出为 JSON 文件 (推荐用于数据备份或程序交换)
    try:
        json_filename = 'scraped_videos_data.json'
        # indent=4 使 JSON 文件格式更易读
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(scraped_data, f, ensure_ascii=False, indent=4)
        print(f"✅ 数据成功导出为 JSON 文件: {json_filename}")
        
    except Exception as e:
        print(f"❌ 导出 JSON 时出错: {e}")
        
    # ======================================================
    #   新的导出逻辑 END
    # ======================================================
