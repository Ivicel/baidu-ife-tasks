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
                    }, 50, i, j);
                }, i * j * 10, i, j);
            }
        }, i * 10, i);
    }
}
// console.log(bubble([22, 11, 10, 5, 78, 1, 55, 78, 43, 23, 16, 55, 38, 39]));

// 随机生成柱形图
function randomElement(n) {
    var queue = document.getElementById("queue"),
        count = 0;
    while (queue.children.length) {
        queue.removeChild(queue.firstChild);
    }
    // for (var i = 0; i < 20; i++) {
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
    // }
}

addEvent(document, "DOMContentLoaded", function() {
    var inputs = document.querySelector("#inputs"),
        queue = document.getElementById("queue"),
        text = document.createTextNode(""),
        warn = inputs.querySelector(".warn");

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
                console.log(num);
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
            } else if (/[^\d]/.test(inputValue)) {
                warn.firstChild.nodeValue = "只能输入数字";
                return;
            }
        } else {
            if (!queue.children.length) {
                warn.firstChild.nodeValue = "没有可弹出的元素";
                return;
            }
        }

        // 输入是否大于等于10且小等于100
        if (inputValue < 10 || inputValue > 100) {
            warn.firstChild.nodeValue = "只能输入10-100之间的数字";
            return;
        } else if (queue.children.length > 60) {
            alert("最多只个输入60个队列元素");
            return;
        }
        warn.firstChild.nodeValue = "";
        var element = document.createElement("div"),
            child;
        element.setAttribute("class", "digit");
        element.style.height = inputValue * 6 + "px";
        if (target.name === "left-in") {
            // 左侧入
            queue.insertBefore(element, queue.firstChild);
        } else if (target.name === "right-in") {
            // 右侧入
            queue.appendChild(element);
        } else if (target.name === "left-out") {
            // 弹出左侧值
            child = queue.removeChild(queue.firstChild);
            alert(child.firstChild.nodeValue);
        } else if (target.name === "right-out") {
            // 弹出右侧值
            child = queue.removeChild(queue.lastChild);
            alert(child.firstChild.nodeValue);
        }
    });

    // 点击队列时，删除被点击的元素
    addEvent(queue, "click", function(e) {
        var target = e.target;
        if (target.getAttribute("class") === "digit") {
            target.remove();
            alert(target.style.height.split("p")[0]);
        }
    });
});
