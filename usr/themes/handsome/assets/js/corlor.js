
/* -- 不要文章内头图 --*/
const style = document.createElement('style');
    style.textContent = `
        div.entry-thumbnail .img-responsive {
           display: none !important;
        }
    `;
document.head.appendChild(style);

/* ---------- 自定义弹窗逻辑 ---------- */
const mask = document.getElementById('confirmMask');
const cancel = mask.querySelector('.cancel');
const ok = mask.querySelector('.ok');
const maskText = document.querySelector('div.confirm-body');

let resolvePromise;

function showConfirm() {
    mask.classList.add('show');
    return new Promise(resolve => {
        resolvePromise = resolve;
        mask.onclick = e => { if (e.target === mask) closeConfirm(false); };
        cancel.onclick = () => closeConfirm(false);
        ok.onclick = () => closeConfirm(true);
    });
}

function closeConfirm(result) {
    mask.classList.remove('show');
    mask.onclick = cancel.onclick = ok.onclick = null;
    resolvePromise(result);
}

/* ---------- 修复：确认后才执行 ---------- */
async function confirmndExecute(historyOrFav, itext = '', fun) {
    
    if (itext !== '') {
        maskText.textContent = itext;
    }

    if (!itext) maskText.textContent = '是否确认操作？';

    const confirmed = await showConfirm();  // 等待用户点击

    if (confirmed && typeof fun === 'function') {
        try {
            await fun();
        } catch (err) {
            console.error('confirmndExecute callback error:', err);
        }
    }
}

// 暴露全局
window.confirmndExecute = confirmndExecute;
window.fixPage = fixPage;

function fixPage() {
    var url_Now = window.location.protocol + "//" + window.location.host + window.location.pathname;
    if (window.location.href !== url_Now) {
        window.location.replace(url_Now);
    }
}

// 按钮绑定
const fixPageEl = document.getElementById('fixPage');
fixPageEl.onclick = function () {
    confirmndExecute('', '如果当前页面无法正常滑动或阅读，请点击确认进行重置！', () => {
        fixPage();
    });
};

// 按钮绑定
const contact = document.getElementById('contact');
contact.onclick = function () {
    confirmndExecute('', '即将跳往联系我们页面！', () => {
        sidebar_contact()
    });
};

window.addEventListener('resize', function () {
    adjustYT();
})

function adjustYT() { // 文章内 iframe 自适应宽度
    if (document.getElementById("adjustYT") !== null) {
        var iframeYT = document.getElementById("adjustYT");
        iframeYT.width = document.querySelector("div#md_handsome_origin").clientWidth;
    }
}

function sidebar_contact() {
    window.open('https://limbopro.com/6.html', '_blank');
}


function webStatus() {
    window.open('https://limbopro.com/status/', '_blank');
}

function sidebar_search() {
    //var myword = confirm("需要搜索站内文章？");
    //if (myword == true) {
    // window.open('https://bit.ly/4dheoNG', '_blank');
    window.open('https://limbopro.com/search.html', '_blank');
    //}
    //else {

    //}
}

function sidebar_jichangtuijian() {
    //var myword = confirm("需要搜索站内文章？");
    //if (myword == true) {
    window.open('https://limbopro.com/865.html', '_blank');
    // window.open('https://bit.ly/43X2aoz', '_blank');
    //}
    //else {

    //}
}

window.onload = () => { // https://limbopro.com/archives/10713.html 保留彩色模式

    setTimeout(() => {
        const url = window.location.href;
        //const re = new RegExp("10713");
        if (url.search('10713') !== -1) {
            css_add()
        }

    }, 2000)

};

// thrd_party_file('script','https://limbopro.com/Adguard/Adblock4limbo.function.js','body')

// 动态创建并引用外部资源 外部样式表 外部脚本
function thrd_party_file(tagname, url, where) {
    const ele_New = document.createElement(tagname);
    // script
    if (tagname == "script") {
        ele_New.type = "text/javascript";
        ele_New.src = url;
        ele_New.setAttribute('async', '')
        // link
    } else if (tagname == "link") {
        ele_New.rel = "stylesheet";
        ele_New.type = "text/css";
        ele_New.href = url;
    }
    if (where == "body") {
        document.body.appendChild(ele_New);
    } else if (where == "head") {
        document.head.appendChild(ele_New);
    }
}

// 优先追加style元素 以内联样式的方式
function css_add_x(css, here_write_css_name_you_want) {
    // css style 创建
    let body = document.body;
    var css_name_x = document.createElement('style');
    css_name_x.id = here_write_css_name_you_want;
    css_name_x.innerText = css;
    document.querySelector('html').insertBefore(css_name_x, body);
}

// Crisp Start
// Crisp End

var ua = navigator.userAgent;
// console.log(ua);
if (ua.indexOf("Chrome-Lighthouse") == -1
    && ua.indexOf("Googlebot") == -1
    && ua.indexOf("bot") == -1) {

    // 暂时性下架 start 全面屏蔽
    const varr = {
        ads_host1: [ // 要屏蔽的链接
            //"https://limbopro.com/archives/bygcloud.html",
            "https://limbopro.com/archives/v2ray-soCloud.html",
            "https://limbopro.com/archives/klee_trojan.html",
            "https://zhuangzhuang.cf"
        ],
        ads_host2: [ // 要屏蔽的链接
            ///"https://limbopro.com/archives/flyingbird.html",
            ///"https://limbopro.com/archives/CatNet.html",
            "https://limbopro.com/archives/cylink.html",
            "https://limbopro.com/archives/v2ray-jinkela.html",
            "https://limbopro.com/archives/unolink.html",
            "https://limbopro.com/archives/n3ro.html",
            ///'https://limbopro.com/archives/27873.html',
            ///"https://limbopro.com/archives/29202.html",
            "https://limbopro.com/archives/1423.html",
            "https://limbopro.com/archives/mdss.html",
            //"https://limbopro.com/archives/trojan_1yunti.html",
            "https://limbopro.com/archives/27873.html",
            "https://limbopro.com/archives/x-air-4-v2ray.html",
            "https://zhuangzhuang.cf",
            // 2025.02.25 "https://limbopro.com/archives/%E6%9C%BA%E5%9C%BA%E6%8E%A8%E8%8D%90.html",
        ],
        search_results_css1: [ // 屏蔽全部
            "div.panel-small.single-post.box-shadow-wrap-normal",
            "div.post-inser.post.box-shadow-wrap-normal",
            "li.list-group-item",
            "li > a.auto"
        ],
        search_results_css2: [ // 屏蔽部分
            "div.panel-small.single-post.box-shadow-wrap-normal",
            "li > a.auto",
        ]
    }

    function ads_Remove(array1, array2) {
        var i, x;
        for (i = 0; i < array1.length; i++) {
            var ads_host_css = "[href*='" + array1[i] + "']";
            var huge = document.querySelectorAll(array2);
            for (x = 0; x < huge.length; x++) {
                if (huge[x].querySelectorAll(ads_host_css).length) {
                    huge[x].remove();
                }
            }
        }
    }

    ads_Remove(varr.ads_host1, varr.search_results_css1);
    ads_Remove(varr.ads_host2, varr.search_results_css2);

    // end
}

// 监听 visibility change 事件
function visibility_local() {
    document.addEventListener('visibilitychange', function () {
        var isHidden = document.hidden;
        if (isHidden) {
            // console.log('刚刚离开了页面!')
            nsfw_check_content_and_list()
        }
    })
};

// NSFW相关 页面开启模糊效果

var nsfw_regex_local = new RegExp(/NSFW|beautyandsex|instagram/)

function img_filter_blur() {
    if (document.querySelector('#filter_blur') == null) {
        const filter = "p > img,p > a.light-link > img, div.item-thumb-small.lazy {filter: blur(5px) grayscale(1); -webkit-filter: blur(5px) grayscale(1); /* Chrome, Safari, Opera */} "
        const filter_css_new = document.createElement('style')
        filter_css_new.id = 'filter_blur'
        filter_css_new.innerHTML = filter
        document.body.appendChild(filter_css_new)
        // console.log("It's Exist! and filter & blur!")
    } else {
        // console.log("It's Exist! and filter & blur ever!")
    }
}

function img_filter_blur_close() {

    if (document.querySelector('#filter_blur') !== null) {
        document.querySelector('#filter_blur').remove()
    }

    if (document.querySelector('#alertx') !== null) {
        document.querySelector('#alertx').remove()
    }

}


function nsfw_switch_button() {
    if (document.querySelector('#nsfw_switch_button') == null) {
        var nsfw_switch_button = document.createElement('button')
        nsfw_switch_button.id = 'nsfw_switch_button'
        nsfw_switch_button.style = "color:white;font-size:large;position:fixed;right:0px;z-index:114154;background-image: linear-gradient(135deg, #f34079 40%, #fc894d); transition: 0.7s;"
        nsfw_switch_button.textContent = '开启彩图模式'
        document.querySelector('#content').appendChild(nsfw_switch_button)
        nsfw_switch_button.setAttribute('onclick', 'img_filter_blur_close()')
    } else {
        // console.log('按钮已存在!')
    }
}


function nsfw_check_content_and_list() {
    var nsfw_regex_local = new RegExp(/NSFW|beautyandsex|instagram/)
    // console.log('nsfw_check_content_and_list() 执行...')
    if (document.querySelectorAll('span.meta-value')[1] !== null && document.querySelectorAll('span.meta-value')[1] !== undefined) {
        // console.log("It's Exist! and in detail page!")
        document.querySelectorAll('span.meta-value')[1].querySelectorAll('a').forEach((x) => {
            if (x.href.match(nsfw_regex_local) !== null) {
                // console.log('Got u!')
                img_filter_blur()
                nsfw_switch_button()
                visibility_local()
                alertx()
            }
        })

    } else if (window.location.href.match(nsfw_regex_local)) {
        // console.log("It's Exist! and in page list!")
        img_filter_blur()
        nsfw_switch_button()
        visibility_local()
        alertx()
    } else {
        // console.log("It's not in detail page!")
        img_filter_blur_close()
    }

}

function f5() {
    var currentUrl = window.location.href;
    // console.log('Then url is' + currentUrl)

    setInterval(function () {
        if (window.location.href !== currentUrl) {
            visibility_local();
            currentUrl = window.location.href;
            nsfw_check_content_and_list()
            alertx()
            // console.log('wtf, 页面发生变化, Now url is' + currentUrl);
            clear();
        }
    }, 5000);

}

function tiktokx() {
    ////f5()
    ////nsfw_check_content_and_list()
    ////visibility_local()
}


//// tiktokx()


console.log('color.js')


function alertx() {
    setTimeout(() => {
        if (document.querySelector('#nsfw_switch_button') !== null) {
            if (document.querySelector('#alertx') == null) {
                var alertx = document.createElement('div')
                alertx.id = 'alertx'
                alertx.textContent = '⚠️NSFW内容已被模糊处理，请点击按钮开启彩图模式！'
                alertx.style = 'position:fixed;z-index:9999;font-size:smaller;background-color:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;'
                document.querySelector('#nsfw_switch_button').appendChild(alertx)
            } else {
                console.log('alertx 已存在!')
            }
        }
    }, 1500)
}



try {
    // 可能会抛出异常的代码
    setTimeout(() => {
        document.querySelectorAll('li > a.auto')[19].remove()
    }, 1500)
} catch (error) {
    // 发生异常时执行的代码
    console.error('发生错误:', error);
} finally {
    // 可选，无论是否发生异常都会执行
    console.log('finally 块总会执行');
}


// jqurey
//# sourceMappingURL=jquery.min.map
