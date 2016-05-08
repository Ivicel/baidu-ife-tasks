function addEvent(element, type, listner) {
    if ((element.nodeType === 1 || element.nodeType === 9) &&
        typeof type === "string") {
        element.addEventListener(type, listner);
    }
}

addEvent(document, "DOMContentLoaded", function() {
    var inputs = document.querySelector("#inputs");
    var queue = document.getElementById("queue");
    addEvent(inputs, "click", function(e) {
        var target = e.target,
            input = this.querySelector(".input-text"),
            text,
            warn = this.querySelector(".warn");
        if (target === input) {
        	return;
        }
        if (target.name.indexOf("out") !== -1) {
            if (!input.value) {
                text = document.createTextNode("输入不能为空");
                warn.appendChild(text);
                return;
            } else if (/[^\d]/.test(input.value)) {
                text = document.createTextNode("只能输入数字");
                warn.appendChild(text);
                return;
            }
        }
        // setElement(this, "div", input.value, target.name);
        var element = document.createElement("div"),
            textValue = document.createTextNode(input.value),
            child;
        element.appendChild(textValue);
        element.setAttribute("class", "digit");
        if (target.name === "left-in") {
            queue.insertBefore(element, queue.firstChild);
        } else if (target.name === "right-in") {
            queue.appendChild(element);
        } else if (target.name === "left-out") {
            child = queue.removeChild(queue.firstChild);
            alert(child.firstChild.nodeValue);
        } else if (target.name === "right-out") {
            child = queue.removeChild(queue.lastChild);
            alert(child.firstChild.nodeValue);
        }
    });

    addEvent(queue, "click", function(e) {
    	var target = e.target;
    	if (target.getAttribute("class") === "digit") {
	    	target.remove();
	    	alert(target.firstChild.nodeValue);
	    }
    });
});
