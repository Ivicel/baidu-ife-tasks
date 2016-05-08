// 检测输入是否为空或只为中文和英文
function testCityName(name) {
    if (/[^a-z\u4e00-\u9fa5]/i.test(name.trim())) {
        return "只能输入中文和英文字母!";
    } else if (/^$/.test(name.trim())) {
        return "输入不能为空";
    }
    return null;
}
// 检测输入是否为空或只为数字
function testAqi(value) {
    if (/[^0-9]/.test(value.trim())) {
        return "只能输入数字!";
    } else if (/^$/.test(value.trim())) {
        return "输入不能为空";
    }
    return null;
}

function checkAvailable() {
    var cityName = document.getElementById("aqi-city-input"),
        aqiValue = document.getElementById("aqi-value-input"),
        check = true;
    aqiData = {};

    var result = testCityName(cityName.value);
    if (result) {
        setElement(cityName.parentNode, "span", result, "aqi-city-msg");
        check = false;
    }
    result = testAqi(aqiValue.value);
    if (result) {
        setElement(aqiValue.parentNode, "span", result, "aqi-value-msg");
        check = false;
    }
    if (check) {
        aqiData[cityName.value.trim()] = aqiValue.value.trim();
        setElement(null, null, null, "aqi-value-msg");
        setElement(null, null, null, "aqi-city-msg");
    }
}

function setElement(parent, element, msg, elementId) {
    var eid = document.getElementById(elementId);
    if (eid !== null) {
        if (eid.nodeName.toLowerCase() === "span") {
            eid.firstChild.nodeValue = msg || "";
        } else {
            if (msg) {
                eid.style.display = "";
            } else {
                eid.style.display = "none";
            }
        }
    } else if (parent !== null) {
        eid = document.createElement(element);
        if (elementId) {
            eid.id = elementId;
        }
        if (typeof msg === "string") {
            var text = document.createTextNode(msg);
            eid.appendChild(text);
        }
        parent.appendChild(eid);
    }
    return eid;
}

function title(table) {
    var tableTitle = document.getElementById("table-title");
    if (tableTitle && tableTitle.style.display === "none") {
        setElement(table, null, true, "table-title");
        return;
    }
        if (table.children.length === 0) {
            var tr = setElement(table, "tr", true, "table-title");
            setElement(tr, "td", "城市");
            setElement(tr, "td", "空气质量");
            setElement(tr, "td", "操作");
        } else if (table.children.length === 1) {
            setElement(table, null, false, "table-title");
        }
    
}

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    checkAvailable();
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var table = document.querySelector("#aqi-table");
    if (arguments.length) {      
        table.removeChild(arguments[0]);
        title(table);
    } else if (Object.keys(aqiData).length) {
        title(table);
        var firstKey = Object.keys(aqiData)[0];
        var tr = setElement(table, "tr");
        setElement(tr, "td", firstKey);
        setElement(tr, "td", aqiData[firstKey]);
        var td = setElement(tr, "td");
        var input = setElement(td, "button", "删除");
    }
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
    // do sth.
    var target = arguments[0].target;
    if (target.tagName.toLowerCase() === "button") {
        renderAqiList(target.parentNode.parentNode);
    }

}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("add-btn").addEventListener("click", addBtnHandle);
        document.getElementById("aqi-table").addEventListener("click", delBtnHandle);
    });
}

init();
