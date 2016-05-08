function addEvent(element, type, listner) {
    if ((element.nodeType === 1 || element.nodeType === 9) &&
        typeof type === "string") {
        element.addEventListener(type, listner);
    }
}

// 冒泡排序
function bubble(children) {
    var h1, h2;
    for (var i = 0; i < children.length; i++) {
        setTimeout(function(i) {
            for (var j = i; j < children.length; j++) {
                setTimeout(function(i, j) {
                    children[i].style.backgroundColor = "#009688";
                    children[j].style.backgroundColor = "#009688";
                    h1 = Number(children[i].style.height.split("p")[0]);
                    h2 = Number(children[j].style.height.split("p")[0]);
                    if (h1 > h2) {
                        // children[i].firstChild.nodeValue = h2;
                        // children[j].firstChild.nodeValue = h1;
                        children[i].style.height = h2 + "px";
                        children[j].style.height = h1 + "px";
                    }
                    setTimeout(function() {
                        children[i].style.backgroundColor = "red";
                        children[j].style.backgroundColor = "red";
                    }, 10, i, j);
                }, i * j * 30, i, j);
            }
        }, i * 30, i);
    }
}

// 随机生成柱形图
function randomElement(n) {
    var queue = document.getElementById("queue"),
        count = 0;
    while (queue.children.length) {
        queue.removeChild(queue.firstChild);
    }
    var timeid = setInterval(function() {
        if (count === n) {
            clearInterval(timeid);
        }
        var value = Math.ceil(Math.random() * 90 + 10);
        var element = document.createElement("div");
        var text = document.createTextNode(value);
        element.setAttribute("class", "digit");
        element.style.height = value * 6 + "px";
        // element.appendChild(text);
        queue.appendChild(element);
        count++;
    }, 10);
}

addEvent(document, "DOMContentLoaded", function() {
    var inputs = document.querySelector("#inputs"),
        queue = document.getElementById("queue"),
        text = document.createTextNode(""),
        warn = inputs.querySelector(".warn"),
        query = document.querySelector("#query");

    warn.appendChild(text);
    addEvent(inputs, "click", function(e) {
        var target = e.target,
            input = this.querySelector(".input-text"),
            inputValue = input.value.trim();
        // 是否为输入框
        if (target === input || target === warn || target === this) {
            return;
        }

        // 点击演示动态排序按钮
        if (target.name === "bubble") {
            warn.firstChild.nodeValue = "动态演示冒泡排序";
            var num = 20;
            if (!isNaN(parseInt(input.value))) {
                num = parseInt(input.value);
            }
            randomElement(num);
            setTimeout(bubble, num * 20, queue.children);
            return;
        }

        // 是否为输入按钮
        if (target.name.indexOf("out") === -1) {
            if (!inputValue) {
                warn.firstChild.nodeValue = "输入不能为空";
                return;
            }
        } else {
            if (!queue.children.length) {
                warn.firstChild.nodeValue = "没有可弹出的元素";
                return;
            }
        }
        if (target.name === "left-out") {
            // 弹出左侧值
            child = queue.removeChild(queue.firstChild);
            console.log(child.firstChild.nodeValue);
        } else if (target.name === "right-out") {
            // 弹出右侧值
            child = queue.removeChild(queue.lastChild);
            console.log(child.firstChild.nodeValue);
        }
        warn.firstChild.nodeValue = "";
        // 拆分输入的字符串
        splitWords = input.value.split(/[\s;,.；，。、]/g);
        splitWords.forEach(function(currentValue, index) {
            // 跳过空值
            if (!currentValue) {
                return;
            }
            var element = document.createElement("div"),
                text = document.createTextNode(currentValue),
                child;
            element.setAttribute("class", "digit");
            element.appendChild(text);
            if (target.name === "left-in") {
                // 左侧入
                queue.insertBefore(element, queue.firstChild);
            } else if (target.name === "right-in") {
                // 右侧入
                queue.appendChild(element);
            }
        });
    });

    // 点击队列时，删除被点击的元素
    addEvent(queue, "click", function(e) {
        var target = e.target;
        if (target.getAttribute("class") === "digit") {
            target.remove();
            console.log(target.firstChild.nodeValue);
        }
    });

    // 查询特定词
    addEvent(query, "click", function(event) {
        var target = event.target,
            query = this.querySelector("input");
        inputText = document.querySelector(".input-text");
        if (target === this || target === query) {
            return;
        }
        var queryText = query.value,
            indexStart = 0,
            index,
            value,
            text,
            words,
            element;
        for (var i = 0; i < queue.children.length; i++) {
            value = queue.children[i].innerText;
            index = value.indexOf(queryText);
            if (index !== -1) {
                // 如果查找到元素，将元素置空字符串
                queue.children[i].innerText = "";
            } else {
                // 查找不到任何元素时，文字恢复成非高亮
                queue.children[i].innerText = "";
                text = document.createTextNode(value);
                queue.children[i].appendChild(text);
                continue;
            }
            // 循环直到没有查询的元素
            while (index !== -1) {
                words = value.slice(indexStart, index);
                // 如果查询的元素不是第一个字符时，加入上一个片段的字符串
                if (words) {
                    text = document.createTextNode(words);
                    queue.children[i].appendChild(text);
                }
                // 设置查询的文字颜色高亮
                words = value.slice(index, queryText.length + index);
                text = document.createTextNode(words);
                element = document.createElement("span");
                element.appendChild(text);
                element.setAttribute("class", "highlight");
                queue.children[i].appendChild(element);
                // 截取掉已查询过的字符串组
                value = value.substring(index + queryText.length);
                index = value.indexOf(queryText);
            }
            // 如果最后一个字符不是查询字符时，将剩余的字符串加到标签中
            if (value) {
                text = document.createTextNode(value);
                queue.children[i].appendChild(text);
            }
        }

    });
});