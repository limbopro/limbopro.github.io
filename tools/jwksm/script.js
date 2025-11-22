/* 11.22.2025 version */

async function fetchCodes() {

    var dataList = {};
    try {
        const response = await fetch('./index.json');
        if (!response.ok) throw new Error('无法加载 JSON 文件');
        var dataList = await response.json();
        console.log(dataList);
    } catch (error) {
        console.error('错误:', error);
    }


    async function loadJsonFiles(files, basePath = "./") { // basePath 参数，默认为当前目录
        console.log('loadJsonFiles: ' + basePath)
        // 自动去重 + 过滤空值
        const uniqueFiles = [...new Set(files.filter(f => f && typeof f === "string"))];
        const result = {};

        try {
            const responses = await Promise.all(
                uniqueFiles.map(async (file) => {
                    const resp = await fetch(`${basePath}${file}`);
                    if (!resp.ok) {
                        throw new Error(`无法加载 ${file}（${resp.status} ${resp.statusText}）`);
                    }
                    const json = await resp.json();
                    const name = file.replace(/\.json$/i, ""); // 更健壮：去掉 .json（大小写不敏感）
                    return { name, json };
                })
            );

            responses.forEach(({ name, json }) => {
                result[name] = json;
            });
        } catch (err) {
            console.error("JSON 加载失败:", err.message || err);
        }
        return result;
    }

    // 1. 最佳评级数据
    const iBestratedfiles = [
        //"bestrated_2025_11.json",
        //"bestrated_translated.json",
        "2024best.json",
        "2024_best_netflav.json",
        "2023_best_netflav.json",
        "2022_best_netflav.json",
        "2021_best_netflav.json",
        "2020_best_netflav.json",
        "2wFav.json",
        "3wFav.json"
    ];

    window.dataBestrated = await loadJsonFiles(iBestratedfiles, "./bestrated/");

    // 2. 其他数据
    const otherfiles = [
        "friends.json", "fuqijiaohuan.json", "mostwanted_unique_translated.json",
        "mostwanted_duplicates_tranlated.json", "brother.json", "zhifuyouhuo.json",
        "yongzhuang.json", "wwr.json", "teacher.json", "siwa.json",
        "roumangaibian.json", "renqi.json", "office.json", "mom1.json",
        "mom.json", "koubao.json", "juru.json", "jiazhengfuwu.json",
        "fitness.json", "father.json", "duop.json", "chugui.json",
        "3p.json",
        "yearsViewed_2025.json"
    ];

    window.dataMax = await loadJsonFiles(otherfiles, "./others/");

    // 3. 2025年最想要

    const mostwanted = [
        "most_wanted_201511.json",
    ];

    window.dataMostwanted = await loadJsonFiles(mostwanted, "./mostwanted/");

    // 4. 年度已看

    const yearsViewed = [
        "yearsViewed_2025.json",
    ];

    window.yearsViewedW = await loadJsonFiles(yearsViewed, "./years/");


    // 5. 今日热们🔥

    const dailyBest = [
        "daily.json", "old.json", 'monthly.json',
    ];

    window.dailyBestW = await loadJsonFiles(dailyBest, "./daily/");

    // 组合数据到 dataList 对象


    // 6. 时间戳

    const timeJson = [
        "current_time.json",
    ];

    window.currenttimeW = await loadJsonFiles(timeJson, "./time/");

    // 组合数据到 dataList 对象


    dataList['2025年新片已阅推荐✨🌅🧡'] = yearsViewedW['yearsViewed_2025']


    /*
    dataList['2025年最想要[10月&未翻译🈂️]'] = [
      ...dataMostwanted['most_wanted_201511']
    ];
    */

    dataList['2024年评价最佳'] = [
        ...dataBestrated['2024best'],
        ...dataBestrated['2024_best_netflav']
    ]; // 新增 2024 年评价最佳分类

    dataList['2023年评价最佳'] = [
        ...dataBestrated['2023_best_netflav']
    ]; // 新增 2023 年评价最佳分类

    dataList['2022年评价最佳'] = [
        ...dataBestrated['2022_best_netflav']
    ]; // 新增 2022 年评价最佳分类

    dataList['2021年评价最佳'] = [
        ...dataBestrated['2021_best_netflav']
    ]; // 新增 2021 年评价最佳分类

    dataList['2020年评价最佳'] = [
        ...dataBestrated['2020_best_netflav']
    ]; // 新增 2020 年评价最佳分类

    dataList['本月热门🔥🔞'] = dailyBestW['monthly']
    dataList["综合分类破2万人收藏🧸ྀི"] = dataBestrated['2wFav']
    dataList["综合分类破3万人收藏🧸ྀི"] = dataBestrated['2wFav']
    //dataList['昨日热门🔥🔞'] = dailyBestW['old']
    dataList['夫妻交换🎎'] = dataMax['fuqijiaohuan'];
    dataList['办公室🤤'] = dataMax['office'];
    dataList['办公室🤤'] = dataMax['office'];
    dataList['出轨🍷'] = dataMax['chugui'];
    dataList['巨乳🐻'] = dataMax['juru'];
    dataList['人妻👰'] = dataMax['renqi'];
    dataList['泳装👙'] = dataMax['yongzhuang'];
    dataList['健身🥵'] = dataMax['fitness'];
    dataList['多P👥'] = dataMax['duop'];
    //dataList['3P👥'] = dataMax['3p'];
    dataList['丝袜🧦'] = dataMax['siwa'];
    dataList['未亡人👘'] = dataMax['wwr'];
    dataList['老师🧑‍🏫'] = dataMax['teacher'];
    dataList['友人の●'] = dataMax['friends'];
    dataList['父●'] = dataMax['father'];
    dataList['母●'] = [...dataMax['mom'],
    ...dataMax['mom1']];
    dataList['姐●'] = dataMax['brother'];
    dataList['口爆👅'] = dataMax['koubao'];
    dataList['制服诱惑👩🏻‍💼'] = dataMax['zhifuyouhuo'];
    dataList['肉漫改编✍️'] = dataMax['roumangaibian'];

    // dataList['综合分类破万收藏🧸ྀི'] = historyBest([dataMax['chugui'], dataMax['juru'], dataMax['renqi'], dataMax['yongzhuang'], dataMax['duop'], dataMax['roumangaibian'], dataMax['office'], dataMax['zhifuyouhuo'], dataMostwanted['most_wanted_201511']])
    // 多个分类中都出现的番号，然后汇集到一起
    const onlyDuplicates = findDuplicates(dataMax['chugui'], dataMax['juru'], dataMax['renqi'], dataMax['yongzhuang'], dataMax['duop'], dataMax['roumangaibian'], dataMax['office'], dataMax['zhifuyouhuo'], dataMostwanted['most_wanted_201511']);
    // 对汇集到一起的番号再进行一次去重
    dataList['综合分类破万人收藏🧸ྀི'] = deduplicateByNumberMaxFav(onlyDuplicates, 'no')
    dataList['综合●'] = [
        ...dataMax['friends'],
        ...dataMax['father'],
        ...dataMax['mom'],
        ...dataMax['brother']
    ];



    const iMax = Object.values(dataList) // 综合body
        .filter(arr => Array.isArray(arr))
        .flat().filter((item, index, self) =>
            index === self.findIndex(t => t.番号 === item.番号));

    dataList["全部分类"] = [...iMax,
    ...dailyBestW['old']
    ]


    window.dataList = dataList;

    window.superMax = [...dataList["全部分类"]].filter((item, index, self) =>
        index === self.findIndex(t => t.番号 === item.番号)
    ); // 去重后的 dataList["全部分类"]

    var uniqueByqbfl = dataList['全部分类'].filter((item, index, self) =>
        index === self.findIndex(t => t.番号 === item.番号)
    );

    window.uniqueByqbflCR = uniqueByqbfl;

    setTimeout(() => {
        categoryChange();
    }, 1000);
}

// 初始化数据加载
fetchCodes();

// 分类选择变化时的处理
function categoryChange() {
    const options = Object.keys(dataList)
        .map(category => `<option value="${category}">${category}</option>`)
        .join('\n');
    const selectHtml = `${options}`;
    document.getElementById('category').innerHTML = selectHtml;

    var previousValue = categorySelect.value;
    categorySelect.addEventListener('change', function (e) {
        const newValue = e.target.value;
        if (newValue !== previousValue) {
            console.log('选择已更改，新值为:', newValue);
            historyItem_percent();
        }
        previousValue = newValue;
    });

    historyItem_percent();

    addGlobalListener();
}

const categorySelect = document.getElementById('category');
var codeHover = "";
const display = document.getElementById('display');
const randomBtn = document.getElementById('randomBtn');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const historyList = document.getElementById('historyList');
const lajiList = document.getElementById('lajiList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const clearLajiBtn = document.getElementById('clearLajiBtn');
const favoritesList = document.getElementById('favoritesList');
const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');

let historyArr = [];
let historyArrTitle = [];
let favoritesArr = [];
let lajiArr = [];

function loadHistory() {

    try {
        const saved = localStorage.getItem('抽取记录_番号');
        if (saved) {
            historyArr = JSON.parse(saved);
        }
    } catch (e) {
        historyArr = [];
    }

    try {
        const savedTitle = localStorage.getItem('抽取记录_名称');
        if (savedTitle) {
            historyArrTitle = JSON.parse(savedTitle);
        }
    } catch (e) {
        historyArrTitle = [];
    }

}

function loadFavorites() {
    try {
        const saved = localStorage.getItem('收藏_番号');
        if (saved) {
            favoritesArr = JSON.parse(saved);
        }
    } catch (e) {
        favoritesArr = [];
    }
}

function loadLaji() {
    try {
        const saved = localStorage.getItem('垃圾_番号');
        if (saved) {
            lajiArr = JSON.parse(saved);
        }
    } catch (e) {
        lajiArr = [];
    }
}

loadHistory();
loadFavorites();
loadLaji();

// 调用

function saveHistory() {
    localStorage.setItem('抽取记录_番号', JSON.stringify(historyArr));
    localStorage.setItem('抽取记录_名称', JSON.stringify(historyArrTitle));
}

function saveFavorites() {
    localStorage.setItem('收藏_番号', JSON.stringify(favoritesArr));
}


function saveLaji() {
    localStorage.setItem('垃圾_番号', JSON.stringify(lajiArr));
}


function showData(data) {

    const el = document.getElementById('google_translate_element');
    if (el) {
        if (el.offsetHeight > 200) {
            document.querySelector(".collapsible-header").click()
        }
    }

    const idPrefix = data.番号;

    display.innerHTML = `
    <span class="notranslate" translate="no">番号：</span><p class="notranslate" translate="no">${data.番号}</p><br>
    <span class="notranslate" id='title' translate="no">标题：</span><p class='default'>${data.名称}'</p><br>
    <span class="notranslate" translate="no">演员：</span><p id='iactor'class="notranslate" translate="no">${data.演员}</p><br>
    <span class="notranslate" translate="no">收藏人数：</span><p id='ifav'class="notranslate" translate="no">${data.收藏人数}</p><br>
    <span id='categoryDisplay' class="notranslate" translate="no">分类：</span><p id='icategory' class="notranslate" translate="no">${getCategoryByNumber(data.番号)}</p><br>
    <div class='none'><p id='${idPrefix}'>标题：${data.名称}'</p></div>
  `;

    setTimeout(() => {

        // 使用
        if (isMobile() && getCookie('googtrans') !== '') { // 移动端且用户开启了翻译
            flashScroll('#display')

            setTimeout(() => {
                function getTitle() {
                    // 1. 选取目标元素
                    const element = document.getElementById('title'); // 替换为你想选取的元素 ID
                    if (element) {
                        // 2. 调用函数模拟选取
                        selectElementText(element);
                        element.click();
                    } else {
                        console.error('未找到 ID 为 icode 的元素。');
                    }

                    clearSelection();
                    if (window.getSelection) {
                        // 1. 获取当前的 Selection 对象（即用户高亮的区域）
                        const selection = window.getSelection();

                        // 2. 移除 Selection 对象中包含的所有 Range
                        // 这将有效地清除所有高亮文本。
                        selection.removeAllRanges();
                        //// console.log('全局文本选取已取消。');
                    }
                }
            }, 1500)

        } else {
            console.log('是桌面端');
        }

        toggleSearchState('false');

    }, 1000);

}


function getCategoryByNumber(number) {
    const matchingCategories = [];
    for (const category in dataList) {
        if (category !== "全部分类" && dataList[category].some(item => item.番号 === number)) {
            matchingCategories.push(category);
        }
    }
    return matchingCategories.length > 0 ? matchingCategories.join(', ') : '未找到分类';
}

function getRandomItem(category) {

    const items = dataList[category];
    if (!items || items.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * items.length);
    console.log("randomIndex: " + randomIndex)
    return items[randomIndex];
}



randomBtn.onclick = function () {

    let selectedCategory = categorySelect.value;
    let randomData = null;

    // 初始调用一次，初始化 lajiArr
    percentAB(dataList[selectedCategory], lajiArr);

    let attempts = 0;
    const maxAttempts = 100; // 防止极端情况死循环

    while (true) {
        // 关键：每次循环开始前，重新计算可用数量
        const availableCount = percentAB(dataList[selectedCategory], lajiArr);

        // 如果没有可用项了，退出
        if (availableCount === 0) {
            console.log("已无可选项目，结束随机选择");

            confirmndExecute('', '已无可选项目，结束随机选择！', (() => {
                console.log('wtf')
            }));

            break;
        }

        // 随机获取一个项
        randomData = getRandomItem(selectedCategory);

        // 检查是否已存在于 lajiArr
        if (!lajiArr.includes(randomData.番号)) {
            // 找到一个新的！可以退出
            break;
        }

        // 已存在，继续下一次循环
        attempts++;
        if (attempts >= maxAttempts) {
            console.warn("达到最大尝试次数，强制结束");
            randomData = null;
            break;
        }
    }



    showData(randomData);
    searchInput.value = randomData.番号;

    if (document.querySelector('input.gsc-input') !== null) {
        document.querySelector('input.gsc-input').value = randomData.番号;
    } else {
        console.log('cseScript is not loaded');
    }


    updateSearchHref();

    if (!historyArr.includes(randomData.番号)) {
        historyArr.push(randomData.番号);
        historyArrTitle.push(randomData.番号 + " " + randomData.名称 + " " + randomData.演员)
        saveHistory();
        renderHistory();
    } else {
        historyArr = historyArr.filter(num => num !== randomData.番号);
        historyArr.push(randomData.番号);


        const index = historyArrTitle.findIndex(item =>
            typeof item === 'string' && item.includes(randomData.番号)
        );

        if (index !== -1) {
            // 取出该元素
            const [matchedItem] = historyArrTitle.splice(index, 1);
            // 重新添加到末尾
            historyArrTitle.push(matchedItem);
        }

        saveHistory();
        renderHistory();

    }

    historyItem_normal();
    codeHover = randomData.番号;
    historyItem_highlights();
    historyItem_percent();

    console.log("flashScroll('.container-result',1000,'up')")
    flashScroll('.container-result', 1000, 'up'); // 随机获取番号 滚动回顶部
    historyItem_highlights('special');

};

searchInput.oninput = updateSearchHref;

function historyItem_paddingtoprebuild() {
    document.querySelector('div.container-result').style.paddingTop = document.querySelector('div.container-search').offsetHeight - 10 + "px";
}

function updateSearchHref() {
    const value = searchInput.value.trim();
    const url = value ? `https://limbopro.com/btsearch.html#gsc.tab=0&gsc.q=${encodeURIComponent(value)}` : "#";
    searchBtn.href = url;
    //// console.log('url:' + url);
}

searchBtn.onclick = function (e) {
    const searchValue = searchInput.value.trim();
    if (!searchValue) {
        e.preventDefault();
        display.innerHTML = "请输入要搜索的番号！";
    }
};


function num2Title(num) {
    var title = '';
    historyArrTitle.forEach((item) => {
        if (item.includes(num)) {
            title = item;
            // console.log(num + " " + item);
        }
    })
    return title;
}


function renderHistory() {
    historyList.innerHTML = "";

    // 找出 historyArr 中没有被 historyArrTitle 任何一项“包含”的元素
    // 然后从数据库 dataList 中找 如有则 push 到 historyArrTitle

    // Start
    // Part1
    const toAdd = historyArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );

    toAdd


    toAdd.forEach(function (item, index) {
        console.log(superMax.find(d => d.番号 === item.toUpperCase()));
        item = superMax.find(d => d.番号 === item.toUpperCase())
        if (item) {
            historyArrTitle.push(item.番号 + " " + item.名称 + " " + item.演员)
            console.log('historyArrTitle 新增番号: ' + item.番号)
            return item;
        }
    });


    // Part2
    const toAddNow = historyArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );


    toAddNow.forEach((item) => {
        if (item) {
            console.log(item)
            historyArrTitle.push(item)
            console.log('historyArrTitle 新增番号: ' + item.番号)
        }
    })

    saveHistory()

    // End


    historyArr.forEach((num, index) => {
        title = ''

        historyArrTitle.forEach((item) => {
            if (item.includes(num)) {
                title = item;
                //// console.log(num + " " + item);
            }
        })

        const span = document.createElement("span");
        span.className = "history-item";
        span.style.position = "relative";
        //// span.textContent = historyArrTitle[index];
        span.textContent = title;
        span.title = "点击填入搜索框并显示详情，长按加入收藏";

        span.onclick = function (e) {
            e.preventDefault(); // 防止默认行为干扰点击
            searchInput.value = num;
            if (isScriptLoaded()) {
                document.querySelector('input.gsc-input').value = num;
            }

            historyItem_normal();


            if (getCookie('googtrans') !== '') { // 如果用户开启翻译 codeHover = num
                codeHover = num
            } else {
                codeHover = num2Title(num);
            }

            console.log('当前点击的是：\n\n' + codeHover)
            historyItem_highlights('special');
            updateSearchHref();

            const item = superMax.find(d => d.番号 === num.toUpperCase());

            if (item) {
                showData(item);
            } else {
                display.innerHTML = "<div class='notranslate'><br>未在<span>数据库</span>找到该<span>番号/关键字</span>的详细信息！请在确保输入<span>番号/关键字</span>后<span>直接点击搜索按钮</span>进行搜索。</div>";
            }

        };

        let pressTimer;
        span.addEventListener('touchstart', function (e) {
            pressTimer = setTimeout(() => {
                e.preventDefault(); // 长按时阻止默认行为，防止文本选择
                if (num2Title(num) !== codeHover && codeHover !== num) {
                    // alert('请先点击选中此番号！');
                    confirmndExecute('', '请先点击选中此番号！', () => {
                    })
                    return;
                }

                if (favoritesArr.includes(num)) {
                    //alert('此番号已加入收藏！');
                    confirmndExecute('', '此番号已加入收藏！', () => {
                    })

                }
                else {
                    confirmndExecute('', '是否将番号 ' + num + ' 加入收藏？', () => {
                        // flashScroll('.container-result') 
                        favoritesArr.push(num);
                        saveFavorites();
                        renderFavorites();
                        setTimeout(() => {
                            historyItem_percent(); // 更新记录
                        }, 1000)
                    })

                }

            }, 1000);
        }, { passive: false });

        span.addEventListener('touchend', function () {
            clearTimeout(pressTimer);
        });

        span.addEventListener('touchcancel', function () {
            clearTimeout(pressTimer);
        });

        span.onmousedown = function () {
            pressTimer = setTimeout(() => {
                if (num2Title(num) !== codeHover && codeHover !== num) {
                    // alert('请先点击选中此番号！');
                    confirmndExecute('', '请先点击选中此番号！', () => {
                    })
                    return;
                }
                if (favoritesArr.includes(num)) {
                    // alert('此番号已加入收藏！');
                    confirmndExecute('', '此番号已加入收藏！', () => {
                    })
                }
                else {
                    confirmndExecute('', '是否将番号 ' + num + ' 加入收藏？', () => {
                        // flashScroll('.container-result') 
                        favoritesArr.push(num);
                        saveFavorites();
                        renderFavorites();
                        setTimeout(() => {
                            historyItem_percent(); // 更新记录
                        }, 1000)
                    })
                }

            }, 1000);
        };

        span.onmouseup = function () {
            clearTimeout(pressTimer);
        };

        span.onmouseleave = function () {
            clearTimeout(pressTimer);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "";
        deleteBtn.className = "delete-history-btn";
        deleteBtn.title = "删除此记录";
        deleteBtn.onclick = function (e) {
            e.stopPropagation();
            historyArr = historyArr.filter(item => item !== num);
            lajiArr.push(num);
            saveLaji();
            renderLaji();
            setTimeout(() => {
                historyItem_percent(); // 更新记录
            }, 1000)

            for (let i = historyArrTitle.length - 1; i >= 0; i--) {
                if (historyArrTitle[i].includes(num)) {
                    historyArrTitle.splice(i, 1); // 删除当前元素 // 目前正确
                }
            }

            saveHistory();
            renderHistory();
            if (searchInput.value === num) {
                searchInput.value = "";
                document.querySelector('input.gsc-input').value = "";
                updateSearchHref();
                display.innerHTML = "<br><p class='notranslate'>点击下方按钮</p><span class='notranslate'>随机抽取</span><p class='notranslate'>一个番号</p><br><p class='notranslate'>或者</p><span class='notranslate'>输入番号/关键字</span><p class='notranslate'>进行搜索</p>";
            }

        };
        span.appendChild(deleteBtn);
        historyList.appendChild(span);
    });


}




function renderFavorites() {
    favoritesList.innerHTML = "";


    // 找出 favoritesArr 中没有被 historyArrTitle 任何一项“包含”的元素
    // 然后从数据库 dataList 中找 如有则 push 到 historyArrTitle

    // Start
    // Part1
    const toAdd = favoritesArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );


    toAdd.forEach(function (item, index) {
        console.log(superMax.find(d => d.番号 === item.toUpperCase()));
        item = superMax.find(d => d.番号 === item.toUpperCase())
        if (item) {
            historyArrTitle.push(item.番号 + " " + item.名称 + " " + item.演员)
            console.log('已移至黑名单: ' + item.番号)
            return item;
        }
    });


    // Part2
    const toAddNow = favoritesArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );


    toAddNow.forEach((item) => {
        if (item) {
            console.log(item)
            historyArrTitle.push(item)
        }
    })

    saveFavorites()

    // End



    favoritesArr.forEach((num, index) => {
        title = ''

        historyArrTitle.forEach((item) => {
            if (item.includes(num)) {
                title = item
                // console.log(num + " " + item)
            }
        })


        if (getCookie('googtrans') !== '') { // 如果用户开启翻译 codeHover = num
            codeHover = num
        } else {
            codeHover = num2Title(num);
        }

        const span = document.createElement("span");
        span.className = "history-item";
        span.style.position = "relative";
        //// span.textContent = historyArrTitle[index];
        span.textContent = title;
        // span.title = "点击填入搜索框并显示详情，长按移除收藏";
        span.title = "点击填入搜索框并显示详情";

        span.onclick = function (e) {
            e.preventDefault(); // 防止默认行为干扰点击
            searchInput.value = num;

            if (isScriptLoaded()) {
                document.querySelector('input.gsc-input').value = num;
                console.log('renderFav is here.')
            }

            // historyItem_normal();

            if (getCookie('googtrans') !== '') { // 如果用户开启翻译 codeHover = num
                codeHover = num
            } else {
                codeHover = num2Title(num);
            }

            console.log('renderFav: ' + codeHover)

            historyItem_highlights('special');
            updateSearchHref();
            const item = superMax.find(d => d.番号 === num);
            if (item) {
                showData(item);
            } else {
                display.innerHTML = "<br>未在<span>数据库</span>找到该<span>番号/关键字</span>的详细信息！请在确保输入<span>番号/关键字</span>后<span>直接点击搜索按钮</span>进行搜索。";
            }

        };

        let pressTimer;
        span.addEventListener('touchstart', function (e) {
            pressTimer = setTimeout(() => {
                e.preventDefault(); // 长按时阻止默认行为，防止文本选择
                if (num !== codeHover) {
                    alert('请先点击选中此番号！' + "num: " + num + "codeHover: " + codeHover);
                    return;
                }
                confirmndExecute('', '是否将番号 ' + num + ' 从收藏移除？', () => {
                    // flashScroll('.container-result') 
                    favoritesArr = favoritesArr.filter(item => item !== num);
                    saveFavorites();
                    renderFavorites();
                    setTimeout(() => {
                        historyItem_percent(); // 更新记录
                    }, 1000)
                })


            }, 1000);
        }, { passive: false });

        span.addEventListener('touchend', function () {
            clearTimeout(pressTimer);
        });

        span.addEventListener('touchcancel', function () {
            clearTimeout(pressTimer);
        });

        span.onmousedown = function () {
            pressTimer = setTimeout(() => {
                if (num2Title(num) !== codeHover && codeHover !== num) {
                    // alert('请先点击选中此番号！');
                    confirmndExecute('', '请先点击选中此番号！', () => {
                    })
                    return;
                }
                confirmndExecute('', '是否将番号 ' + num + ' 从收藏移除？', () => {
                    favoritesArr = favoritesArr.filter(item => item !== num);
                    saveFavorites();
                    renderFavorites();
                    setTimeout(() => {
                        historyItem_percent(); // 更新记录
                    }, 1000)
                })

            }, 1000);
        };

        span.onmouseup = function () {
            clearTimeout(pressTimer);
        };

        span.onmouseleave = function () {
            clearTimeout(pressTimer);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "";
        deleteBtn.className = "delete-history-btn";
        deleteBtn.title = "移除此收藏";
        deleteBtn.onclick = function (e) {
            e.stopPropagation();
            favoritesArr = favoritesArr.filter(item => item !== num);
            saveFavorites();
            renderFavorites();
            setTimeout(() => {
                historyItem_percent(); // 更新记录
            }, 1000)
            if (searchInput.value === num) {
                searchInput.value = "";
                document.querySelector('input.gsc-input').value = "";
                updateSearchHref();
                display.innerHTML = "<br><p class='notranslate'>点击下方按钮</p><span class='notranslate'>随机抽取</span><p class='notranslate'>一个番号<><br><p class='notranslate'>或者</p><span class='notranslate'>输入番号/关键字</span><p class='notranslate'>进行搜索</p>";
            }

        };
        span.appendChild(deleteBtn);
        favoritesList.appendChild(span);
    });
}


function renderLaji() {
    lajiList.innerHTML = "";

    // 找出 lajiArr 中没有被 historyArrTitle 任何一项“包含”的元素
    // 然后从数据库 dataList 中找 如有则 push 到 historyArrTitle

    // Start
    // Part1
    const toAdd = lajiArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );


    toAdd.forEach(function (item, index) {
        console.log(superMax.find(d => d.番号 === item.toUpperCase()));

        item = superMax.find(d => d.番号 === item.toUpperCase())
        if (item) {
            historyArrTitle.push(item.番号 + " " + item.名称 + " " + item.演员)
            console.log('historyArrTitle 新增番号: ' + item.番号)
            return item;
        }
    });


    historyArrTitle.forEach((item, index) => {
        item = superMax.find(d => d.番号 === item.toUpperCase())
        if (item) {
            return item;
        }
    })


    // Part2
    const toAddNow = lajiArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );


    toAddNow.forEach((item) => {
        if (item) {
            console.log(item)
            historyArrTitle.push(item)
            console.log('historyArrTitle 新增番号: ' + item.番号)
        }
    })

    saveLaji()

    // End


    lajiArr.forEach((num, index) => {
        title = ''

        historyArrTitle.forEach((item) => {
            if (item.includes(num)) {
                title = item;
                //// console.log(num + " " + item);
            }
        })

        const span = document.createElement("span");
        span.className = "history-item";
        span.style.position = "relative";
        //// span.textContent = historyArrTitle[index];
        span.textContent = title;
        span.title = "点击填入搜索框并显示详情，长按加入收藏";

        span.onclick = function (e) {
            e.preventDefault(); // 防止默认行为干扰点击
            searchInput.value = num;
            if (isScriptLoaded()) {
                document.querySelector('input.gsc-input').value = num;
            }
            historyItem_normal();


            if (getCookie('googtrans') !== '') { // 如果用户开启翻译 codeHover = num
                codeHover = num
            } else {
                codeHover = num2Title(num);
            }

            console.log('当前点击的是：\n\n' + codeHover)
            historyItem_highlights('special');
            updateSearchHref();
            const item = superMax.find(d => d.番号 === num.toUpperCase());
            if (item) {
                showData(item);
            } else {
                display.innerHTML = "<div class='notranslate'><br>未在<span>数据库</span>找到该<span>番号/关键字</span>的详细信息！请在确保输入<span>番号/关键字</span>后<span>直接点击搜索按钮</span>进行搜索。</div>";
            }
        };

        let pressTimer;
        span.addEventListener('touchstart', function (e) {
            pressTimer = setTimeout(() => {
                e.preventDefault(); // 长按时阻止默认行为，防止文本选择
                if (num2Title(num) !== codeHover && codeHover !== num) {
                    // alert('请先点击选中此番号！');
                    confirmndExecute('', '请先点击选中此番号！', () => {
                    })
                    return;
                }

                if (favoritesArr.includes(num)) {
                    // alert('此番号已加入收藏！');
                    confirmndExecute('', '此番号已加入收藏！', () => {
                    })
                }
                else {
                    confirmndExecute('', '是否将番号 ' + num + ' 加入收藏？', () => {
                        // flashScroll('.container-result') 
                        favoritesArr.push(num);
                        saveFavorites();
                        renderFavorites();
                        setTimeout(() => {
                            historyItem_percent(); // 更新记录
                        }, 1000)
                    })

                }

            }, 1000);
        }, { passive: false });

        span.addEventListener('touchend', function () {
            clearTimeout(pressTimer);
        });

        span.addEventListener('touchcancel', function () {
            clearTimeout(pressTimer);
        });

        span.onmousedown = function () {
            pressTimer = setTimeout(() => {
                if (num2Title(num) !== codeHover && codeHover !== num) {
                    // alert('请先点击选中此番号！');
                    confirmndExecute('', '请先点击选中此番号！', () => {
                    })
                    return;
                }
                if (favoritesArr.includes(num)) {
                    // alert('此番号已加入收藏！');
                    confirmndExecute('', '此番号已加入收藏！', () => {
                    })
                }
                else {
                    confirmndExecute('', '是否将番号 ' + num + ' 加入收藏？', () => {
                        // flashScroll('.container-result') 
                        favoritesArr.push(num);
                        saveFavorites();
                        renderFavorites();
                        setTimeout(() => {
                            historyItem_percent(); // 更新记录
                        }, 1000)
                    })
                }

            }, 1000);
        };

        span.onmouseup = function () {
            clearTimeout(pressTimer);
        };

        span.onmouseleave = function () {
            clearTimeout(pressTimer);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "";
        deleteBtn.className = "delete-history-btn";
        deleteBtn.title = "删除此记录";
        deleteBtn.onclick = function (e) {
            e.stopPropagation();

            lajiArr = lajiArr.filter(item => item !== num);
            saveLaji();

            for (let i = historyArrTitle.length - 1; i >= 0; i--) {
                if (historyArrTitle[i].includes(num)) {
                    historyArrTitle.splice(i, 1); // 删除当前元素 // 目前正确
                }
            }

            saveLaji();
            renderLaji();

            setTimeout(() => {
                historyItem_percent(); // 更新记录
            }, 1000)

            if (searchInput.value === num) {
                searchInput.value = "";
                document.querySelector('input.gsc-input').value = "";
                updateSearchHref();
                display.innerHTML = "<br><p class='notranslate'>点击下方按钮</p><span class='notranslate'>随机抽取</span><p class='notranslate'>一个番号</p><br><p class='notranslate'>或者</p><span class='notranslate'>输入番号/关键字</span><p class='notranslate'>进行搜索</p>";
            }

        };
        span.appendChild(deleteBtn);
        lajiList.appendChild(span);
    });

}

/* ---------- 自定义弹窗逻辑 ---------- */
const mask = document.getElementById('confirmMask');
const cancel = mask.querySelector('.cancel');
const ok = mask.querySelector('.ok');
const maskText = document.querySelector('div.confirm-body');

let resolvePromise;   // 用于 await 方式（可选）

function showConfirm() {
    mask.classList.add('show');

    return new Promise(resolve => {
        resolvePromise = resolve;

        // 点击遮罩关闭（可选）
        mask.onclick = e => {
            if (e.target === mask) closeConfirm(false);
        };
        cancel.onclick = () => closeConfirm(false);
        ok.onclick = () => closeConfirm(true);
    });
}

function closeConfirm(result) {
    mask.classList.remove('show');
    mask.onclick = cancel.onclick = ok.onclick = null;
    resolvePromise(result);
}

/* ---------- 确认后执行原逻辑 ---------- */
async function confirmndExecute(historyOrFav, itext = '', fun) {
    // 更新提示文字
    if (itext !== '') {
        maskText.textContent = itext;
    }

    // 弹出确认框
    const confirmed = await showConfirm();
    if (!confirmed) return;   // 用户取消，直接退出

    // ---------- 原有清空逻辑 ----------
    if (historyOrFav === 'history') {
        historyArr = [];
        saveHistory();
        renderHistory();
    } else if (historyOrFav === 'Fav') {
        favoritesArr = [];
        saveFavorites();
        renderFavorites();
        setTimeout(() => {
            historyItem_percent(); // 更新记录
        }, 1000)
    }
    // ------------------------------------

    // 执行传入的回调（若有）
    if (typeof fun === 'function') {
        try {
            await fun();   // 支持同步或异步回调
        } catch (err) {
            console.error('confirmndExecute callback error:', err);
        }
    }
}

/* 替换原来的 onclick */
clearHistoryBtn.onclick = function () {
    confirmndExecute('history', '确定要清除所有搜索记录吗？');
};

clearFavoritesBtn.onclick = function () {
    confirmndExecute('Fav', '确定要清除所有收藏记录吗？'); // 
};

clearLajiBtn.onclick = function () {
    confirmndExecute('', '确定要清除所有已删除记录吗？', (() => {
        lajiArr = []
        saveLaji();
        renderLaji();

        setTimeout(() => {
            historyItem_percent(); // 更新记录
        }, 1000)

    }));
};


renderHistory();
setTimeout(() => {
    renderFavorites();
    setTimeout(() => {
        renderLaji();
        setTimeout(() => {
            historyItem_percent(); // 更新记录
        }, 1000)
    }, 1500)
}, 1500)




function customSearchEvent() {


    // 找出 historyArr 中没有被 historyArrTitle 任何一项“包含”的元素
    // 然后从数据库 dataList 中找 如有则 push 到 historyArrTitle

    // Start
    // Part1

    const toAdd = historyArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );

    console.log(`"customSearchEvent(): 未添加至 historyArrTitle ：" + toAdd`)

    toAdd.forEach(function (item, index) {
        console.log("customSearchEvent() 新增番号: " + superMax.find(d => d.番号 === item.toUpperCase()));
        item = superMax.find(d => d.番号 === item.toUpperCase())
        if (item) {
            historyArrTitle.push(item.番号 + " " + item.名称 + " " + item.演员)
            console.log('historyArrTitle 新增番号: ' + item.番号)
            return item;
        }
    });


    // Part2
    const toAddNow = historyArr.filter(itemA =>
        !historyArrTitle.some(itemB => itemB.includes(itemA))
    );


    toAddNow.forEach((item) => {
        if (item) {
            console.log("customSearchEvent() 新增番号： " + item)
            historyArrTitle.push(item)
            console.log('historyArrTitle 新增番号: ' + item.番号)
        }
    })

    saveHistory()

    // End


    codeHover = document.querySelector('input.gsc-input').value;
    var customSearchEventCode = document.querySelector('input.gsc-input').value;


    if (!historyArr.includes(customSearchEventCode) && customSearchEventCode !== "") {
        historyArr.push(customSearchEventCode);


        var list = []
        list.push(customSearchEventCode)
        var temp = dataList['全部分类']
        // dataList['出轨🍷']

        window.list = list;

        list.forEach(listItem => {
            const listText = listItem.trim();
            const listCode = listText.split(/\s+/)[0];
            console.log(listCode)
            const matchedTemp = temp.find(t => t.番号 === listCode);
            console.log(matchedTemp)

            if (matchedTemp) {
                console.log('historyArrTitle 找到了')
                // 构建 temp 的关键词（演员为 - 就忽略）
                const tempKeywords = [
                    matchedTemp.番号,
                    matchedTemp.名称,
                    matchedTemp.演员 === "-" ? "" : matchedTemp.演员
                ].join(" ").trim();
                historyArrTitle.push(matchedTemp.番号 + " " + matchedTemp.名称 + " " + matchedTemp.演员)
                return tempKeywords
            } else {
                historyArrTitle.push(customSearchEventCode); // 问题出在这里
                return customSearchEventCode
            }

        })

        // 谷歌搜索到先到 json 里找


        console.log('historyArrTitle 新增番号: ' + customSearchEventCode)
        saveHistory();
        renderHistory();
        flashScroll('div.container-result', 500, 'up');   // 搜索结果回到顶部
    } else if (historyArr.includes(customSearchEventCode) && customSearchEventCode !== "") {

        const item = superMax.find(d => d.番号 === customSearchEventCode.toUpperCase());

        if (item) {
            showData(item);
        } else {
            display.innerHTML = "<div class='notranslate'><br>未在<span>数据库</span>找到该<span>番号/关键字</span>的详细信息！请在确保输入<span>番号/关键字</span>后<span>直接点击搜索按钮</span>进行搜索。</div>";
        }

        historyArr = historyArr.filter(num => num !== customSearchEventCode);
        historyArr.push(customSearchEventCode);


        // 找到第一个包含 customSearchEventCode 的项
        const index = historyArrTitle.findIndex(item =>
            typeof item === 'string' && item.includes(customSearchEventCode)
        );

        if (index !== -1) {
            // 取出该元素
            const [matchedItem] = historyArrTitle.splice(index, 1);
            // 重新添加到末尾
            historyArrTitle.push(matchedItem);
            console.log('historyArrTitle 新增番号: ' + customSearchEventCode)
        }

        saveHistory();
        renderHistory();
        console.log('到这里了')
        historyItem_highlights('special');
    } else {
        console.log("Error: Unable to update history.");
    }

    historyItem_normal();
    historyItem_highlights();
    console.log('到这里了')
    return customSearchEventCode;
}



function historyItem_highlights(x) {
    const el = document.querySelectorAll('.history-item');
    if (x == 'special') {
        el.forEach(span => {
            if (span.textContent.indexOf(codeHover) !== -1 && codeHover !== '') {
                console.log("当前高亮的文本是：\n\n" + span.textContent)
                span.classList.add('gradient-button');
                //historyItem_normal();
            }
        });
    } else {
        el.forEach(span => {
            if (span.textContent == codeHover && codeHover !== '') {
                console.log("当前高亮的文本是：\n\n" + span.textContent)
                span.classList.add('gradient-button');
                historyItem_normal();
            }
        });
    }
}

function historyItem_normal() {
    document.querySelectorAll('.history-item').forEach(span => {
        //// if (!span.textContent.includes(codeHover)) {
        if (span.textContent !== codeHover) {
            span.classList.remove('gradient-button');
        }
    });
}


function historyItem_percent() {
    if (!window.dataList) {
        console.log("dataList 未定义，无法计算统计数据");
        setTimeout(() => {
            historyItem_percent();
        }, 1500);
        return;
    }
    const selectedCategory = categorySelect.value;
    const uniqueById = dataList[selectedCategory].filter((item, index, self) =>
        index === self.findIndex(t => t.番号 === item.番号)
    );

    window.uniqueById = uniqueById;

    const matchedCount = historyArr.reduce((count, historyItem) => {
        const isMatched = dataList[selectedCategory].some(dataItem => dataItem.番号 === historyItem);
        return count + (isMatched ? 1 : 0);
    }, 0);




    const proportion = dataList[selectedCategory].length > 0 ? (matchedCount / dataList[selectedCategory].length) * 100 : 0;
    const favcountHas = percentAB(uniqueById, favoritesArr, 'cf')
    document.getElementById('favcountHas').textContent = favcountHas
    document.getElementById('selectArrcountFav').textContent = uniqueById.length
    document.getElementById('icount').textContent = superMax.length
    console.log(`已抽取番号数量: ${matchedCount}`);
    console.log(`匹配比例: ${proportion.toFixed(4)}%`);
    console.log("数组名称: " + "dataList['" + selectedCategory + "']");
    console.log(`番号实际存在数量: ${dataList[selectedCategory].length}`);
    console.log("按番号属性去重后的数量:", uniqueById.length);
    document.getElementById('count').textContent = uniqueById.length;
    document.getElementById('selectArrcount').textContent = uniqueById.length;
    document.getElementById('lajicountHas').textContent = uniqueById.length - percentAB(uniqueById, lajiArr);
    document.getElementById('countHas').textContent = matchedCount;
    document.getElementById('percent').textContent = proportion.toFixed(1) + '%';

}


function addGlobalListener() {

    setTimeout(() => {
        if (isScriptLoaded()) {
            var button = document.querySelector('.gsc-search-button.gsc-search-button-v2');
            button.addEventListener('click', () => {
                setTimeout(() => {
                    customSearchEvent();
                }, 1000);
                console.log('按钮被点击！');
            });
            const input = document.querySelector('input[autocomplete]');
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.keyCode === 13) {
                    console.log('带有 autocomplete 属性的输入框中按下回车！');
                    console.log('输入内容:', input.value);
                    setTimeout(() => {
                        customSearchEvent();
                    }, 1000);
                }
            });
            document.querySelector('.container-search').classList.add('hidden');
        } else {
            document.querySelector('div.search-area').classList.add('show');

            if (document.getElementById('alert') == null) {
                const alertDiv = document.createElement('div');
                alertDiv.id = 'alert';
                alertDiv.className = 'alert-box';
                const alertText = document.createElement('span');
                alertText.innerHTML = '<br><br><h1 style="color: white;">嘿！朋友，</h1>你的设备现在可以打开<a href="https://www.google.com/search?q=%E6%AF%92%E5%A5%B6%E5%8D%9A%E4%B8%BB" target="_blank">谷歌搜索</a>吗？<br><br>“今晚看什么？”的搜索功能由谷歌提供技术支持，请确保你的设备可以正常使用<a href="https://www.google.com/search?q=%E6%AF%92%E5%A5%B6%E5%8D%9A%E4%B8%BB" target="_blank">谷歌搜索</a>引擎。<br><br><br>';
                alertDiv.appendChild(alertText);
                const closeButton = document.createElement('button');
                closeButton.textContent = '✖';
                closeButton.onclick = function () {
                    alertDiv.style.display = 'none';
                };
                alertDiv.appendChild(closeButton);
                document.querySelector('div.container-search').appendChild(alertDiv);
            }
        }
    }, 3000);



    // 简单的节流实现
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    }


    // 页面底部时间
    const lastModified = document.lastModified
    const mm = document.getElementById('memetime')

    const lastModifiedV = new Date(document.lastModified).getTime() // index.html 文件的最后修改日期
    const jsonTime = new Date(currenttimeW['current_time']['timestamp_millis']).getTime() // Json 获取时间

    if (jsonTime && lastModifiedV) {
        console.log("jsonTime: " + jsonTime + "lastModified :" + lastModifiedV)
        if (jsonTime > lastModifiedV) {
            mm.textContent = currenttimeW['current_time'].formatted_local;
        } else {
            mm.textContent = lastModified
        }
    }


    // 返回顶部 top UP 
    document.getElementById('up2Top').addEventListener('click', function () {

        const el = document.getElementById('google_translate_element'); // 关闭右侧菜单
        if (el) {
            if (el.offsetHeight > 200) {
                document.querySelector(".collapsible-header").click()
            }
        }

        const now = new Date().toISOString();          // 2025-11-12T03:21:xx.xxxZ
        const user = '@limboprossr';                   // 你的 X Handle
        // 顺序执行（可随意调换）
        flashScroll('.wrap', 500, 'up', null, 1, true);               // 1. 回到顶部
        flashScroll('div.container-result', 500, 'up', null, 1, true);               // 1. 回到顶部
        flashScroll('body', 500, 'up', null, 1, true);               // 1. 回到顶部
        flashScroll('html', 500, 'up', null, 1, true);               // 1. 回到顶部
        flashScroll('body', null, null, null, null, true)
    });


    // 查看


    scrollToResult("#result", ".container-result", '.container-result');
    scrollToResult("#fav", ".container-fav", '.container-result')
    scrollToResult("#laji", ".container-laji", '.container-result')
    scrollToResult("#lianxi", ".container-footer", '.container-result')


    // 监听非指定元素外的点击事件 Start
    // 1. 排除的元素
    const excludeContainer = document.querySelector('div.container-result'); // 抽取结果
    const excludeInputs = document.querySelectorAll('input[autocomplete]');

    // 2. 全局点击
    document.addEventListener('click', e => {
        const t = e.target;

        // 3. 任意一个排除区域命中 → 直接返回
        if (excludeContainer?.contains(t)) return;
        if (Array.from(excludeInputs).some(el => el.contains(t))) return;

        // 4. 外部点击逻辑
        console.log('外部点击', t);

        // 自动提取当前页面的 gsc.q 并显示
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const q = hashParams.get('gsc.q');
        const searchTerm = q ? decodeURIComponent(q) : '未找到';

        console.log('当前 URL:', window.location.href);
        console.log('搜索词 (gsc.q):', searchTerm);

        // 可选：弹窗显示
        console.log('当前搜索: ' + searchTerm);

        if (searchTerm !== '未找到') {
            customSearchEvent()
        }

    });

    // End

}

function monitorElementChanges(targetSelector, callback) {
    const targetNode = document.querySelector(targetSelector);
    if (!targetNode) {
        console.error(`Element with selector ${targetSelector} not found`);
        return;
    }
    const observer = new MutationObserver((mutationsList, observer) => {
        callback(mutationsList, observer);
    });
    const config = {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    };
    observer.observe(targetNode, config);
    return observer;
}

const observer = monitorElementChanges('body', openInNewTab);

function openInNewTab(url) {
    if (document.querySelector('body') !== null) {
        document.querySelector('body').querySelectorAll("a[target='_self']").forEach(link => {
            if (link.getAttribute('href') !== 'https://limbopro.com/tools/jwksm/') {
                link.setAttribute('target', '_blank');
            }
        });
    }
}


// 控制侧边栏按钮

const collapsible = document.querySelector('.collapsible');
const header = collapsible.querySelector('.collapsible-header');

header.addEventListener('click', () => {
    collapsible.classList.toggle('active');
});

// 单选高亮 + 输出 ID
const buttons = document.querySelectorAll('.option-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止触发容器收起
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log('选择:', btn.id);
    });
});


var temp = 0

// 其他函数



// 对比30天内新增数据
// Start 


setTimeout(() => {

    (function () {
        const VARIABLE_NAME = 'superMax';
        const BASELINE_KEY = 'superMax_baseline_record';
        // 一周的毫秒数 (7 天 * 24 小时 * 60 分 * 60 秒 * 1000 毫秒)
        const WEEK_IN_MS = 30 * 24 * 60 * 60 * 1000;

        const today = new Date();
        const currentTimestamp = today.getTime();

        // 1. 检查全局变量是否存在
        if (typeof superMax === 'undefined' || superMax === null || typeof superMax.length === 'undefined') {
            console.warn(`${VARIABLE_NAME} Length Tracker: 全局变量 ${VARIABLE_NAME} 不存在或没有 length 属性。跳过操作。`);
            return;
        }

        const currentLength = superMax.length;

        // 2. 获取存储的基准组数据
        let baselineData = null;
        try {
            const storedData = localStorage.getItem(BASELINE_KEY);
            if (storedData) {
                baselineData = JSON.parse(storedData);
            }
        } catch (e) {
            console.error(`${VARIABLE_NAME} Length Tracker: 解析 baseline 数据失败，将重新生成基准组。`, e);
            // 如果解析失败，baselineData 保持为 null，将触发新基准组的创建
        }

        let isNewBaselineSet = false;
        let baseline = baselineData ? baselineData.value : null;
        let establishedTimestamp = baselineData ? baselineData.establishedTimestamp : 0;

        // 3. 检查基准组是否过期或不存在
        if (!baselineData || (currentTimestamp - establishedTimestamp >= WEEK_IN_MS)) {
            // --- 设置新的基准组 ---

            baseline = currentLength;
            establishedTimestamp = currentTimestamp;
            isNewBaselineSet = true;

            // 构造新的基准组数据对象
            baselineData = {
                value: baseline,
                establishedTimestamp: establishedTimestamp,
                establishedDate: today.toLocaleString(),
            };

            console.log(`
            --- ${VARIABLE_NAME} Length Tracker ---
            **基准组已更新/首次设置**
            新基准组值: ${baseline}
            设置时间: ${baselineData.establishedDate}
            在未来一周内，每日记录将与此值进行对比。
        `);

            // 4. 保存新的基准组数据
            localStorage.setItem(BASELINE_KEY, JSON.stringify(baselineData));

        } else {
            // --- 基准组有效，进行对比 ---

            // 计算基准组已生效天数
            const timeElapsedDays = ((currentTimestamp - establishedTimestamp) / (24 * 60 * 60 * 1000)).toFixed(1);

            let comparisonMessage = `
            --- ${VARIABLE_NAME} Length 每日对比 ---
            基准组值 (${baselineData.establishedDate} 设定): ${baseline}
            当前 ${VARIABLE_NAME}.length (${today.toLocaleString()} 记录): ${currentLength}
            基准组已生效 ${timeElapsedDays} 天。
        `;

            // 对比结果判断
            if (currentLength > baseline) {
                comparisonMessage += `\n结果: length **新增了** ${currentLength - baseline}。`;
                document.getElementById('yesterday').innerText = "；（30天内）自您首次打开本页面以来，累计新增" + (currentLength - baseline) + "部"; // 改变说明
            } else if (currentLength < baseline) {
                comparisonMessage += `\n结果: length **减少了** ${baseline - currentLength}。`;
                document.getElementById('yesterday').innerText = "；（30天内）自您首次打开本页面以来，累计减少" + (currentLength - baseline) + "部";  // 改变说明
            } else {
                comparisonMessage += `\n结果: length **与基准组值保持一致**。`;
            }

            console.log(comparisonMessage);

            // 注意：基准组有效时，我们不修改 localStorage，等待它自然过期。
        }

    })();

}, 10000)


// 对比30天内新增数据
// END


// 右侧滚动按钮
function scrollToResult(buttonSelector, targetSelector, marginTop) {
    document.querySelector(buttonSelector).addEventListener('click', function () { //  搜索记录
        const el = document.querySelector(targetSelector);
        const elMarginTop = getMarginTop(marginTop)

        if (elMarginTop > 10) {
            var top = elMarginTop
            console.log(el + ": wtf")

            // 获取元素相对于视口的顶部位置
            const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
            // 目标滚动位置 = 元素顶部位置 - 40px
            const targetScrollY = elementTop - top - temp;

            window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth'
            });

        } else {
            flashScroll('.container-result', 500, 'up')
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

    })

}


function getMarginTop(selector) {
    const el = document.querySelector(selector);
    if (!el) {
        console.warn(`[getMarginTop] 元素未找到: ${selector}`);
        return 0;
    }

    const style = window.getComputedStyle(el);
    const marginTop = style.marginTop; // 字符串，如 "24px"

    const value = parseFloat(marginTop);
    console.log('marginTop: ' + value)
    return isNaN(value) ? 0 : value; // 防 auto / inherit 等
}



// 跳转到ID元素位置
function jumpTo(id, options = {}) {
    const el = document.querySelector(id);
    if (!el) return;

    const defaults = { behavior: 'smooth', block: 'start' };
    const opts = { ...defaults, ...options };

    el.scrollIntoView(opts);
}


// 判断随机抽取过程中全部抽取完毕的问题
function percentAB(dataMax, dataMin, whatUwant) {
    // === 提取 nvyouArr 的番号 ===
    const dataListGet = dataMax.map(item => item.番号);

    // === 转为 Set 提高查找效率 ===
    const lajiSet = new Set(dataMin);

    // === 找出交集（重复项）===
    const duplicates = dataListGet.filter(code => lajiSet.has(code));

    // === 计算统计 ===
    const totalNvyous = dataMax.length;
    const duplicateCount = duplicates.length;
    const uniqueCount = totalNvyous - duplicateCount;
    const duplicateRate = ((duplicateCount / totalNvyous) * 100).toFixed(2) + '%';

    // === 输出结果 ===
    console.log({
        dataMax: dataListGet,
        交集_重复番号: duplicates,
        重复数量: duplicateCount,
        dataMin_总数量: totalNvyous,
        未重复数量: uniqueCount,
        重复率: duplicateRate
    });

    // 控制台输出：
    // {
    //   nvyouArr_番号列表: [ 'ATID-566', 'SAME-044', 'START-036', 'JUL-787', 'ADN-619', 'MIMK-103' ],
    //   交集_重复番号: [ 'ATID-566', 'SAME-044', 'START-036', 'JUL-787', 'ADN-619', 'MIMK-103' ],
    //   重复数量: 6,
    //   nvyouArr_总数量: 6,
    //   未重复数量: 0,
    //   重复率: '100.00%'
    // }

    if (whatUwant == 'cf') {
        return duplicateCount
    } else if (whatUwant == 'wcf') {
        return uniqueCount
    } else {
        return uniqueCount;
    }
}



function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}


/**
 * 监听元素可见性（防抖 + 多元素）
 * @param {string} selector
 * @param {(el: Element, out: boolean) => void} callback
 * @param {Object} [options] { threshold, root, rootMargin, debounce }
 * @returns {() => void} 清理函数
 */
function observeElementVisibility(selector, callback, options = {}) {
    const {
        threshold = 0,
        root = null,
        rootMargin = '0px',
        debounce = 50
    } = options;

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return () => { };

    const timers = new WeakMap();
    const lastState = new WeakMap();

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                const el = entry.target;
                const isOut = !entry.isIntersecting;
                const prev = lastState.get(el);

                // 状态未变 → 直接跳过
                if (prev === isOut) return;

                // 清除旧定时器
                if (timers.has(el)) clearTimeout(timers.get(el));

                // 防抖：状态稳定 debounce ms 后回调
                const timer = setTimeout(() => {
                    lastState.set(el, isOut);
                    callback(el, isOut);
                }, debounce);

                timers.set(el, timer);
            });
        },
        { root, threshold, rootMargin }
    );

    elements.forEach(el => {
        observer.observe(el);
        lastState.set(el, null);
    });

    // 返回统一清理函数
    return () => {
        elements.forEach(el => {
            if (timers.has(el)) clearTimeout(timers.get(el));
        });
        observer.disconnect();
    };
}




/**
 * 通过 scroll 事件监听元素是否移出视口（防抖 + 状态记忆）
 * @param {string} selector
 * @param {(el: Element, isOut: boolean) => void} callback
 * @param {Object} [options] { debounce, scrollContainer }
 * @returns {() => void} 清理函数
 */
function watchScrollOutOfView(selector, callback, options = {}) {
    const {
        debounce = 80,
        scrollContainer = window
    } = options;

    const elements = document.querySelectorAll(selector);
    if (!elements.length) return () => { };

    // 记忆每个元素的上一次出视界状态
    const lastState = new WeakMap();

    let timer = null;

    // 检查是否出视界
    const isOutOfView = (el) => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const vw = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.bottom < 0 ||
            rect.top > vh ||
            rect.right < 0 ||
            rect.left > vw
        );
    };

    // 执行检查
    const runCheck = () => {
        elements.forEach(el => {
            const currentOut = isOutOfView(el);
            const prevOut = lastState.get(el);

            // 状态未变化 → 跳过
            if (prevOut === currentOut) return;

            // 状态变化 → 更新记忆 + 触发回调
            lastState.set(el, currentOut);
            callback(el, currentOut);
        });
    };

    // 滚动事件（防抖）
    const onScroll = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(runCheck, debounce);
    };

    const container = scrollContainer === window ? window : scrollContainer;
    container.addEventListener('scroll', onScroll, { passive: true });

    // 初始检查（设置初始状态）
    elements.forEach(el => lastState.set(el, null));
    runCheck();

    // 清理
    return () => {
        if (timer) clearTimeout(timer);
        container.removeEventListener('scroll', onScroll);
    };
}




/**
 * flashScroll - 高级滚动控制（带日志）
 * @param {Element|string} container - 目标容器
 * @param {number} [delay=1000] - 闪一下时等待时间
 * @param {'up'|'down'|'middle'|any} [direction] - 方向指令
 * @param {number} [ratio] - 直接滚动到指定比例 (0~1)
 * @param {number} [stepRatio] - 步进滚动：每次滚动总高度的多少比例 (0~1)
 * @param {boolean} [log=false] - 是否在滚动结束后打印当前滚动信息
 */
function flashScroll(
    container,
    delay = 1000,
    direction,
    ratio,
    stepRatio,
    log = false
) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return console.warn('flashScroll: 容器未找到');

    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) {
        if (log) console.log('flashScroll: 容器无可滚动内容');
        return;
    }

    const smooth = { behavior: 'smooth' };
    const dir = typeof direction === 'string' ? direction.toLowerCase().trim() : '';

    // ---------- 1. 直接按 ratio 滚动 ----------
    if (typeof ratio === 'number' && ratio >= 0 && ratio <= 1) {
        const target = maxScroll * ratio;
        el.scrollTo({ top: target, ...smooth });
        if (log) printScrollInfo(el, target, maxScroll);
        return;
    }

    // ---------- 2. 步进滚动 ----------
    if (typeof stepRatio === 'number' && stepRatio > 0 && stepRatio <= 1) {
        const stepDistance = maxScroll * stepRatio;
        let targetTop;

        if (dir === 'up') {
            targetTop = Math.max(el.scrollTop - stepDistance, 0);
        } else {
            // 默认 down 或其他
            targetTop = Math.min(el.scrollTop + stepDistance, maxScroll);
        }

        el.scrollTo({ top: targetTop, ...smooth });
        if (log) printScrollInfo(el, targetTop, maxScroll);
        return;
    }

    // ---------- 3. 传统行为 ----------
    let target = 0;
    if (dir === 'up') {
        target = 0;
    } else if (dir === 'down') {
        target = maxScroll;
    } else if (dir === 'middle' || dir === 'center') {
        target = maxScroll / 2;
    } else {
        // 默认：闪一下
        el.scrollTo({ top: maxScroll, ...smooth });
        setTimeout(() => el.scrollTo({ top: 0, ...smooth }), delay);
        if (log) {
            // 闪一下时分别打印两次
            printScrollInfo(el, maxScroll, maxScroll);
            setTimeout(() => printScrollInfo(el, 0, maxScroll), delay + 50);
        }
        return;
    }

    el.scrollTo({ top: target, ...smooth });
    if (log) printScrollInfo(el, target, maxScroll);
}

/** 统一的日志打印函数（在滚动结束后调用） */
function printScrollInfo(el, targetTop, maxScroll) {
    // 为了兼容平滑滚动，这里使用一次性的 scroll 监听
    const listener = () => {
        const current = el.scrollTop;
        const ratio = maxScroll ? current / maxScroll : 0;
        console.log(
            `%c[flashScroll] %c当前位置：${current.toFixed(2)} px | 比例：${(ratio * 100).toFixed(2)}% | 最大可滚动：${maxScroll.toFixed(2)} px`,
            'color:#2e86de', 'color:#555'
        );
        el.removeEventListener('scroll', listener);
    };

    // 立即执行一次（如果已经是目标位置或不支持 smooth）
    if (Math.abs(el.scrollTop - targetTop) < 1) {
        listener();
        return;
    }

    el.addEventListener('scroll', listener, { once: true });
}

/* -------------------------------------------------
   clearSelection - 保持原样
   ------------------------------------------------- */
function clearSelection() {
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            selection.removeAllRanges();
        }
    }

    const activeEl = document.activeElement;
    if (activeEl && typeof activeEl.blur === 'function') {
        activeEl.blur();
    }

    setTimeout(() => {
        if (activeEl && typeof activeEl.focus === 'function') {
            activeEl.focus();
        }
    }, 0);
}

// 去重函数 示例

function oriJsonMake() {
    let arrayDataList;
    if (!Array.isArray(dataList)) {
        console.warn('dataList 不是数组，正在转换为数组:', typeof dataList);
        arrayDataList = [dataList];
    } else {
        arrayDataList = dataList;
    }
    const deduplicatedDataList = arrayDataList.map(item => {
        const result = {};
        for (const key in item) {
            if (Array.isArray(item[key])) {
                result[key] = Array.from(
                    new Map(item[key].map(subItem => [subItem.番号, subItem])).values()
                );
            } else {
                result[key] = item[key];
            }
        }
        return result;
    });
    console.log(JSON.stringify(deduplicatedDataList, null, 2));
}

function unique(newJson_name, oldJson_name, outputChoice = "unique", outputduplicatesChoice = newJson_name) {
    const aIds = new Set(oldJson_name.map(item => item.番号));
    const duplicateIds = [...new Set(newJson_name.map(item => item.番号).filter(id => aIds.has(id)))];
    const duplicates = outputduplicatesChoice.filter(item => duplicateIds.includes(item.番号));
    const seenIds = new Set();
    const uniqueB = newJson_name.filter(item => {
        if (!seenIds.has(item.番号)) {
            seenIds.add(item.番号);
            return !aIds.has(item.番号);
        }
        return false;
    });
    if (outputChoice === "unique") {
        console.log("\n去重后的newJson，包含不在 oldJson 中的番号：");
        console.log(JSON.stringify(uniqueB, null, 2));
    } else {
        console.log("\nnewJson重复的部分，包含在 oldJson 中的番号：");
        console.log(JSON.stringify(duplicates, null, 2));
    }
}



function selectElementText(element) {
    // 1. 确保浏览器支持 Selection API
    if (window.getSelection && document.createRange) {

        // 2. 创建一个 Range 对象
        const range = document.createRange();

        // 3. 将 Range 对象的边界设置到目标元素的起始和结束位置
        // 这意味着 Range 将包含目标元素内的所有子节点和文本
        range.selectNodeContents(element);

        // 4. 获取当前的 Selection 对象
        const selection = window.getSelection();

        // 5. 在设置新 Range 之前，先清除任何现有的 Selection (防止叠加)
        selection.removeAllRanges();

        // 6. 将新的 Range 添加到 Selection 中，从而高亮显示文本
        selection.addRange(range);

        //// console.log(`成功高亮选取了 ID 为 ${element.id} 的元素内的所有文本。`);

        // 注意：虽然文本被高亮了，但浏览器安全限制通常不允许
        // JS 在没有用户交互的情况下将文本自动复制到剪贴板。

    } else {
        console.warn('您的浏览器不支持Selection API，无法模拟文本高亮选取。');
    }
}


// 若还有 D、E... 请继续添加
// const arrays = [A, B, C];  // 按顺序排列：A→B→C→...
// 多个数组中重复的部分

function historyBest(abcd) {
    const arrays = abcd // 按顺序排列：A→B→C→
    const result = [];

    for (let i = 1; i < arrays.length; i++) {
        const prev = arrays[i - 1];
        const curr = arrays[i];

        const prevCodes = new Set(prev.map(x => x.番号));
        const duplicatesInCurrent = curr.filter(x => prevCodes.has(x.番号));

        result.push(...duplicatesInCurrent);
    }

    console.log(JSON.stringify(result, null, 2));
    return result;
}

// var historyBest = historyBest([dataList['出轨🍷'], dataList['巨乳🐻'], dataList['人妻👰'], dataList['泳装👙'], dataList['多P👥'], dataList['肉漫改编✍️'], dataList['办公室🤤'], dataList['制服诱惑👩🏻‍💼'], dataList['2025年最想要[未翻译]']])


// Start // 寻找多个数组中的重复部分
function findDuplicates(...arrays) {
    // 统计每个番号出现的记录（原始对象）
    const seen = new Map(); // key: 番号 → value: [原始对象1, 原始对象2, ...]

    arrays.forEach(arr => {
        arr.forEach(item => {
            const key = item.番号;
            if (!seen.has(key)) {
                seen.set(key, []);
            }
            seen.get(key).push(item);
        });
    });

    // 只保留出现 >=2 次的番号的所有原始记录
    const duplicates = [];
    seen.forEach((records, key) => {
        if (records.length >= 2) {
            duplicates.push(...records);
        }
    });

    return duplicates;
}

// const onlyDuplicates = findDuplicates(dataMax['chugui'], dataMax['juru'], dataMax['renqi'], dataMax['yongzhuang'], dataMax['duop'], dataMax['roumangaibian'], dataMax['office'], dataMax['zhifuyouhuo'], dataMostwanted['most_wanted_201511']);
// console.log("重复出现的记录：", onlyDuplicates);

// End
