// generate.js

// 1. 引入 dayjs 库
const dayjs = require('dayjs');
// 引入文件系统模块，用于保存文件 (Node.js 内置)
const fs = require('fs');

/**
 * 使用 dayjs 库创建包含当前日期时间的 JSON 对象。
 * @returns {object} 包含各种格式的日期时间对象。
 */
function createDateTimeObject() {
    const now = dayjs(); // 获取当前时间 dayjs 对象

    const dateTimeObject = {
        // 自定义格式，易读：2025年11月14日 18:19:52
        "formatted_local": now.format('YYYY年MM月DD日 HH:mm:ss'), 
        
        // ISO 8601 格式 (UTC)，推荐用于数据交换
        "iso_8601_utc": now.toISOString(), 
        
        // Unix 时间戳（毫秒）
        "timestamp_millis": now.valueOf(), 
        
        // 仅日期部分（YYYY-MM-DD）
        "date_only": now.format('YYYY-MM-DD')
    };
    
    return dateTimeObject;
}

// 2. 调用函数生成对象
const dateTimeData = createDateTimeObject();

// 3. 将对象转换为格式化的 JSON 字符串
// (null, 2) 表示美化输出，2个空格缩进
const jsonString = JSON.stringify(dateTimeData, null, 2);

// 4. 将 JSON 字符串保存到文件
const fileName = 'current_time.json';

try {
    fs.writeFileSync(fileName, jsonString);
    console.log(`✅ JSON 文件已成功生成并保存到: ${fileName}`);
    console.log('--- 文件内容预览 ---');
    console.log(jsonString);
    console.log('----------------------');
} catch (error) {
    console.error('❌ 保存文件时发生错误:', error);
}
