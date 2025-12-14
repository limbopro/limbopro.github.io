/*
 * Quantumult X script-response-body: HTML 脚本注入
 * 目标: 匹配 </head>（忽略大小写），规范化为小写，并在其前注入 SkiAds 脚本
 */

const body = $response.body;

// 检查响应体是否存在
if (!body) {
    $done({}); // 响应体为空，直接返回
}

let modifiedBody = body;

// 注入的脚本代码，保持 defer 属性
const injectionCode = '<script src="http://limbopro.com/Adguard/SkiAds.js"></script>';

// --- 核心替换逻辑 ---

// 1. 使用正则表达式同时完成两件事：
//    - 匹配所有 </head> 标签（包括 </HEAD>, </Head> 等，因为有 /i 标志）
//    - 将匹配到的内容替换为：注入的代码 + 小写的 </head> 标签
//    - /g: 全局匹配，/i: 忽略大小写
modifiedBody = modifiedBody.replace(/<\/body>/gi, `</body>${injectionCode}`);

// --- 结束和返回逻辑 ---

if (modifiedBody !== body) {
    console.log("SkiAds 脚本注入成功，并处理了 </HEAD> 大小写问题。");
    // 返回修改后的响应体
    $done({body: modifiedBody});
} else {
    // 未发生修改（例如：响应体不是 HTML 或不包含 </head>）
    $done({});
}