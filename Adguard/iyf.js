/**
 * Quantumult X HTTP Response 重写脚本
 */

// $response.body 包含了服务器返回的原始响应字符串
let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);

        // 示例 1：如果返回结构是 { code: 0, data: [ { adId: 1, src: "..." } ] }
        // 直接将广告列表置空
        if (obj.data && Array.isArray(obj.data)) {
            obj.data = [];
        }

        // 示例 2：如果结构中包含特定标记字段，将其设为 false 或 0
        if (obj.hasOwnProperty('shouldLoadAds')) {
            obj.shouldLoadAds = false;
        }
        if (obj.hasOwnProperty('adCount')) {
            obj.adCount = 0;
        }

        // 重新序列化为 JSON 字符串
        body = JSON.stringify(obj);
        console.log('[QX AdBlock] 成功修改广告接口响应');
    } catch (e) {
        console.log('[QX AdBlock] JSON 解析失败，跳过处理: ' + e);
    }
}

// 将修改后的 response 返还给 QX 传递给前端客户端
$done({ body });