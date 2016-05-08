function addEvent(element, type, listner) {
    if ((element.nodeType === 1 || element.nodeType === 9) &&
        typeof type === "string") {
        element.addEventListener(type, listner);
    }
}

function deleteElement(event) {
    var target = event.target;

    if (target.nodeName.toLowerCase() === "label") {
        return;
    } else {
        return target.parentElement === this ? this.removeChild(target) :
            this.removeChild(target.parentElement);
    }
}


addEvent(document, "DOMContentLoaded", function() {
    var tagsList = document.getElementById("tags-list"),
        interestsList = document.getElementById("interests-list"),
        submitButton = document.getElementById("submit"),
        tagInput = document.querySelector(".tag-input");

    addEvent(submitButton, "click", function(event) {
        var target = event.target,
            textarea = document.querySelector(".input-text"),
            splitWords;
        // 非确认按钮
        if (target.name !== "submit") {
            return;
        }
        // 拆分输入的字符串
        splitWords = textarea.value.split(/[\s;,.；，。、]/g);
        splitWords.forEach(function(currentValue, index) {
            // 跳过空值
            if (!currentValue) {
                return;
            }
            var element = document.createElement("span"),
                text = document.createTextNode(currentValue),
                hoverElement = document.createElement("span"),
                hoverText = document.createTextNode("点击删除"),
                child;

            hoverElement.appendChild(hoverText);
            hoverElement.setAttribute("class", "tag-hover");
            element.appendChild(hoverElement);
            element.setAttribute("class", "interest");
            element.appendChild(text);
            interestsList.appendChild(element);
        });
    });

    addEvent(interestsList, "click", deleteElement);
    addEvent(tagsList, "click", deleteElement);

    addEvent(tagInput, "keyup", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.value) {
            switch (event.code.toLowerCase()) {
                case "space":
                case "comma":
                case "enter":
                    var newTag = document.createElement("span");
                    var newText = document.createTextNode(this.value.substr(0,
                        this.value.length - 1));
                    newTag.setAttribute("class", "tag");
                    newTag.appendChild(newText);
                    tagsList.appendChild(newTag);
                    this.value = "";
                    break;
                default:
                    return;
            }
        }
    });
    // 点击队列时，删除被点击的元素

});
