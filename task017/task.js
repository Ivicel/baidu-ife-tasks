(function(window, undefined) {
    /* 数据格式演示
    var aqiSourceData = {
      "北京": {
        "2016-01-01": 10,
        "2016-01-02": 10,
        "2016-01-03": 10,
        "2016-01-04": 10
      }
    };
    */
    document = window.document;

    function addEvent(element, type, func) {
        if (element.nodeType !== 1 && element.nodeType !== 9 ||
            typeof type !== "string" || typeof func !== "function") {
            return;
        }
        element.addEventListener(type, func);
    }

    function setElement(parent, child, text, name) {
        var eid;
        if (/^#/.test(name)) {
            eid = document.querySelector(name);
        }
        if (!eid) {
            eid = document.createElement(child);
            if (text && typeof text !== "object") {
                textNode = document.createTextNode(text);
                eid.appendChild(textNode);
            }
            parent.appendChild(eid);
        }
        if (/^\./.test(name)) {
            eid.setAttribute("class", name.substring(1) + " " + pageState.nowGraTime);
            eid.setAttribute("title", text.date + ": " + text.aqi);
            eid.style.height = text.aqi + "px";
        }
        return eid;
    }

    function composeData() {
        var source = aqiSourceData[pageState.nowSelectCity],
            data = [],
            i;
        var keys = Object.keys(source).sort(function(a, b) {
            return a >= b ? 1 : -1;
        });
        if (pageState.nowGraTime === "day") {
            for (i = 0; i < keys.length; i++) {
                data.push({
                    date: keys[i],
                    aqi: source[keys[i]]
                });
            }
        } else {
            var weekSum = source[keys[0]],
                from = keys[0],
                to = keys[0],
                count = 1,
                num,
                isMonth,
                date;
            if (pageState.nowGraTime === "week") {
                Date.prototype.getValue = Date.prototype.getDay;
                num = 1;
            } else {
                Date.prototype.getValue = Date.prototype.getMonth;
                num = new Date(keys[0]).getMonth();
                isMonth = true;
            }
            for (i = 1; i < keys.length; i++) {
                date = new Date(keys[i]).getValue();
                if (isMonth) {
                    if (date !== num) {
                        to = keys[i - 1];
                        data.push({
                            date: from + " - " + to,
                            aqi: Math.ceil(weekSum / count)
                        });
                        from = keys[i];
                        weekSum = source[keys[i]];
                        num = date;
                        count = 1;
                    } else {
                        weekSum += source[keys[i]];
                        count++;
                    }
                } else {
                    if (date === num) {
                        to = keys[i - 1];
                        data.push({
                            date: from + " - " + to,
                            aqi: Math.ceil(weekSum / count)
                        });
                        from = keys[i];
                        weekSum = source[keys[i]];
                        count = 1;
                    } else {
                        weekSum += source[keys[i]];
                        count++;
                    }
                }
            }
            to = keys[i - 1];
            data.push({
                date: from + " - " + to,
                aqi: Math.ceil(weekSum / count)
            });
        }
        chartData = data;
    }

    // 以下两个函数用于随机模拟生成测试数据
    function getDateStr(dat) {
        var y = dat.getFullYear();
        var m = dat.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        var d = dat.getDate();
        d = d < 10 ? '0' + d : d;
        return y + '-' + m + '-' + d;
    }

    function randomBuildData(seed) {
        var returnData = {};
        var dat = new Date("2016-01-01");
        var datStr = '';
        for (var i = 1; i < 92; i++) {
            datStr = getDateStr(dat);
            returnData[datStr] = Math.ceil(Math.random() * seed);
            dat.setDate(dat.getDate() + 1);
        }
        return returnData;
    }

    var aqiSourceData = {
        "北京": randomBuildData(500),
        "上海": randomBuildData(300),
        "广州": randomBuildData(200),
        "深圳": randomBuildData(100),
        "成都": randomBuildData(300),
        "西安": randomBuildData(500),
        "福州": randomBuildData(100),
        "厦门": randomBuildData(100),
        "沈阳": randomBuildData(500)
    };

    // 用于渲染图表的数据
    var chartData = [];

    // 记录当前页面的表单选项
    var pageState = {
        nowSelectCity: -1,
        nowGraTime: "day"
    };

    /**
     * 渲染图表
     */
    function renderChart() {
        var aqiChartWrap = document.querySelector(".aqi-chart-wrap"),
            className,
            value;
        // 删除页面上旧的数据
        while (aqiChartWrap.firstChild) {
            aqiChartWrap.removeChild(aqiChartWrap.firstChild);
        }
        // 生成柱状图
        composeData();
        for (i = 0; i < chartData.length; i++) {
            value = chartData[i].aqi;
            if (value < 100) {
                className = ".green";
            } else if (value >= 100 && value < 200) {
                className = ".orange";
            } else if (value >= 200 && value < 300) {
                className = ".red";
            } else {
                className = ".maroon";
            }
            setElement(aqiChartWrap, "label", {
                "date": chartData[i].date,
                "aqi": chartData[i].aqi
            }, className);
        }
    }

    /**
     * 日、周、月的radio事件点击时的处理函数
     */
    function graTimeChange() {
        // 确定是否选项发生了变化 
        var e = arguments[0],
            element = e.target.nodeName.toLowerCase(),
            target;
        if (element === "label") {
            target = e.target.querySelector("input");
        } else if (element === "input") {
            target = e.target;
        } else {
            return;
        }
        // 设置对应数据
        if (target.value !== pageState.nowGraTime) {
            pageState.nowGraTime = target.value;
            // 调用图表渲染函数
            renderChart();
        }
    }

    /**
     * select发生变化时的处理函数
     */
    function citySelectChange() {
        // 确定是否选项发生了变化 
        var target = arguments[0].target;
        for (var i = 0, children = target.children; i < children.length; i++) {
            // 设置对应数据
            if (children[i].selected) {
                if (children[i].firstChild.nodeValue !== pageState.nowSelectCity) {
                    pageState.nowSelectCity = children[i].firstChild.nodeValue;
                    composeData();
                } else {
                    return;
                }
            }
        }
        // 调用图表渲染函数
        renderChart();
    }

    /**
     * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
     */
    function initGraTimeForm() {
        var formGraTime = document.getElementById("form-gra-time"),
            inputs = formGraTime.querySelectorAll("input"),
            i;
        for (i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                pageState.nowSelectCity = inputs[i].value;
            }
        }
        addEvent(formGraTime, "click", graTimeChange);
    }

    /**
     * 初始化城市Select下拉选择框中的选项
     */
    function initCitySelector() {
        // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
        var citySelect = document.getElementById("city-select"),
            cityNames = Object.keys(aqiSourceData),
            i,
            city;
        // 给select设置事件，当选项发生变化时调用函数citySelectChange 
        var cityValues = {
            "北京": "beijing",
            "上海": "shanghai",
            "广州": "guangzhou",
            "深圳": "shenzheng",
            "成都": "chengdou",
            "西安": "xian",
            "福州": "fuzhou",
            "厦门": "xiamen",
            "沈阳": "shengyang"
        };
        for (i = 0; i < cityNames.length; i++) {
            city = setElement(citySelect, "option", cityNames[i]);
            city.setAttribute("value", cityValues[cityNames[i]]);
        }
        i = Math.ceil(Math.random() * cityNames.length);
        pageState.nowSelectCity = cityNames[i];
        citySelect.children[i].setAttribute("selected", true);
        addEvent(citySelect, "change", citySelectChange);
    }

    /**
     * 初始化图表需要的数据格式
     */
    function initAqiChartData() {
        // 将原始的源数据处理成图表需要的数据格式
        // 处理好的数据存到 chartData 中
        renderChart();
    }

    /**
     * 初始化函数
     */
    function init() {
        initGraTimeForm();
        initCitySelector();
        initAqiChartData();
    }
    addEvent(document, "DOMContentLoaded", init);
})(window);
