var Queue = function() {
    this._data = {};
    this._head = 0;
    this._end = 0;
};

// 获取队列长度
Queue.prototype.getSize = function() {
    return this._end - this._head;
};

// 入队
Queue.prototype.enqueue = function(data) {
    this._data[this._end++] = data;
};

// 出队
Queue.prototype.dequeue = function() {
    if (this.getSize()) {
        var data = this._data[this._head];
        delete this._data[this._head++];
        return data;
    }
};


// 二叉树
var BinaryTree = function(root) {
    var node = new BinaryTree.prototype.node(root);
    this._root = node;
};

// 节结属性
BinaryTree.prototype.node = function(data) {
    this.data = data;
    this._parent = null;
    this._children = [];
};

// 前序遍历
BinaryTree.prototype.traverseDLR = function(callback) {
    if (typeof callback !== "function") {
        throw Error("Callback is not a function!");
    }
    (function findChild(currentNode) {
        if (currentNode) {
            callback(currentNode);
            for (var i = 0, length = currentNode._children.length; i < length; i++) {
                findChild(currentNode._children[i]);
            }
        }
    })(this._root);
};

// 中序遍历
BinaryTree.prototype.traverseLDR = function(callback) {
    if (typeof callback !== "function") {
        throw Error("Callback is not a function!");
    }
    var lastNode;
    (function findChild(currentNode) {
        lastNode = currentNode;
        if (currentNode) {
            for (var i = 0, length = currentNode._children.length; i < length; i++) {
                findChild(currentNode._children[i]);
                if (!i) {
                    callback(currentNode);
                }
            }
            if (!currentNode._children.length) {
                callback(currentNode);
            }

        }
    })(this._root);

    return lastNode;
};

// 后序遍历
BinaryTree.prototype.traverseLRD = function(callback) {
    if (typeof callback !== "function") {
        throw Error("Callback is not a function!");
    }
    (function findChild(currentNode) {
        if (currentNode) {
            for (var i = 0, length = currentNode._children.length; i < length; i++) {
                findChild(currentNode._children[i]);
            }
            callback(currentNode);
        }
    })(this._root);
};

// 检查是值是否存在于树中
BinaryTree.prototype.contains = function(data, traversal) {
    var findNode = null;
    if (!traversal && typeof traversal !== "function") {
        throw Error("traversal should be a traversel function of binary tree.");
    }
    traversal.call(this, function(node) {
        if (node.data === data) {
            findNode = node;
        }
    });
    return findNode;
};

// 添加树节点
BinaryTree.prototype.addNode = function(data, parentNode, traversal) {
    if (!traversal && typeof traversal !== "function") {
        throw Error("traversal should be a traversel function of binary tree.");
    }
    var len = parentNode._children.length,
        newNode = new BinaryTree.prototype.node(data);

    parentNode._children[len] = newNode;
    newNode.data = data;
    newNode._parent = parentNode;
    return newNode;
};

// 宽度遍历
BinaryTree.prototype.traverseBF = function(callback) {
    if (!callback && typeof callback !== "function") {
        throw Error("callback should be a function.");
    }
    var queue = new Queue();
    queue.enqueue(this._root);
    var currentNode = queue.dequeue();
    while (currentNode) {
        for (var i = 0, length = currentNode._children.length; i < length; i++) {
            callback(currentNode[i]);
            queue.enqueue(currentNode[i]);
        }
        currentNode = queue.dequeue();
    }
};

// 获取左子结点
BinaryTree.prototype.getLeftChild = function(node) {
    if (node === null) {
        return null;
    } else if (node !== undefined && Object.getPrototypeOf(this).constructor === BinaryTree.prototype.constructor) {
        return node._children.length && node._children[0] ? node._children[0] : null;
    } else if (node === undefined && this instanceof BinaryTree.prototype.node) {
        return this._children.length && this._children[0] ? this._children[0] : null;
    }
};

// 获取右子结点
BinaryTree.prototype.getRightChild = function(node) {
    if (node === null) {
        return null;
    } else if (node !== undefined && Object.getPrototypeOf(this).constructor === BinaryTree.prototype.constructor) {
        return node._children.length && node._children[1] ? node._children[1] : null;
    } else if (node === undefined && this instanceof BinaryTree.prototype.node) {
        return this._children.length && this._children[1] ? this._children[1] : null;
    }
};

// 获取头结点
BinaryTree.prototype.getRoot = function() {
    return this._root ? this._root : null;
};


// 获取父结点
BinaryTree.prototype.getParent = function(node) {
    if (node === null) {
        return null;
    } else if (node !== undefined && Object.getPrototypeOf(this).constructor === BinaryTree.prototype.constructor) {
        return node._parent ? node._parent : null;
    } else if (node === undefined && this instanceof BinaryTree.prototype.node) {
        return this._parent ? this._parent : null;
    }
};

BinaryTree.prototype.node.prototype = BinaryTree.prototype;
BinaryTree.prototype.node.prototype.constructor = BinaryTree.prototype.node;

/*
A
|---- B
|     |---- D
|     |     |---- H
|     |
|     |---- E
|      
|---- C
      |---- F
      |     |---- I
      |     |---- J
      |
      |---- G
            |---- 
            |---- K

                                A
                             /     \
                           B         C
                        /    \     /    \
                       D      E   F       G
                      /         /   \       \
                     H         I     J        K

H -> D -> E -> B -> I -> J -> F -> K -> G -> C -> A

H -> D -> B -> E -> A  -> I -> F -> J -> C -> G -> K

A -> B -> D -> H -> E -> C -> F -> I -> J -> G -> K


---   A
    |   \-
    0    1
  |  \  | \
 2   3  4  5
 | \ | \
 6 7 8 9

6 2 7 0 8 3 9 A 4 1 5




*/

function addEvent(element, type, listener) {
    if ((element.nodeType === 1 || element.nodeType === 9) &&
        typeof type === "string") {
        element.addEventListener(type, listener);
    }
}

function createTree(number) {
    var count = 0,
        queue = new Queue(),
        binaryTree = document.querySelector(".binary-tree"),
        parentElement = setElement(binaryTree, "ul", "", "node tree-container-ul"),
        newNode,
        link,
        newElement,
        newChildNode,
        isLeaf,
        treeIcon,
        treeWholerow;

    // 建立树形结构
    var tree = new BinaryTree(parentElement),
        currentNode = tree.getRoot();
    for (var i = 0; i < number - 1; i++) {
        ran = Math.ceil(Math.random() * 5);
        // 是否是叶子结点
        isLeaf = ran % 2 === 0 ? " tree-leaf" : "";
        treeIcon = "tree-icon-leaf";
        // 新的子结点，添加到树中
        newElement = setElement(parentElement, "li", "", "node" + isLeaf);
        newNode = tree.addNode(newElement, currentNode, tree.traverseBF);
        // hover层
        treeWholerow = setElement(newElement, "div", "", "tree-wholerow");
        setElement(treeWholerow, "input", null, "select-check");
        if (!isLeaf) {
            setElement(newElement, "i", "", "tree-anchor");
            // 目录结点将其添加到队列中
            queue.enqueue(newNode);
            treeIcon = "tree-icon-dir";
        }
        link = setElement(newElement, "a", i + 1, "tree-link");
        setElement(link, "i", "", treeIcon);

        // 换到新的父结点
        if (i % ran !== 0) {
            // 队列中没有剩余结点时不切换
            if (!queue.getSize()) {
                continue;
            }
            currentNode = queue.dequeue();
            newElement = setElement(currentNode.data, "ul", null, "tree-ul");
            newElement.style.display = "none";
            parentElement = newElement;
        }
    }
    return tree;
}

addEvent(document, "DOMContentLoaded", function(e) {
    var tree = createTree(41),
        button = document.querySelector(".doIt"),
        search = document.querySelector(".search"),
        binaryTree = document.querySelector(".binary-tree"),
        addRemove = document.querySelector(".add-remove"),
        timer;

    // 遍历事件
    addEvent(button, "click", function(event) {
        var queue = new Queue(),
            findNodes = new Queue(),
            last = null;
        if (event.target.name === "dlr") {
            tree.traverseDLR(function(node) {
                queue.enqueue(node);
            });
        } else if (event.target.name === "ldr") {
            tree.traverseLDR(function(node) {
                queue.enqueue(node);
            });
        } else if (event.target.name === "lrd") {
            tree.traverseLRD(function(node) {
                queue.enqueue(node);
            });
        } else {
            return;
        }
        clearInterval(timer);
        var e = document.querySelectorAll(".tree-wholerow"),
            node;
        for (var i = 0; i < e.length; i++) {
            e[i].style.backgroundColor = "#fff";
        }
        timer = setInterval(function(queue) {
            if (!queue.getSize()) {
                clearInterval(timer);
                last.style.backgroundColor = "#fff";
            } else {
                var node = queue.dequeue().data.querySelector(".tree-wholerow") || node.data;
                node.style.backgroundColor = "#AD1457";
                if (last) {
                    last.style.backgroundColor = "#fff";
                }
                last = node;
            }
        }, 400, queue);
    });

    // 查询某个特定值
    addEvent(search, "click", function(event) {
        var queue = new Queue(),
            isFound = false,
            node,
            input = this.querySelector("input");
        if (event.target === input || event.target === this) {
            return;
        }
        switch (event.target.name) {
            case "dlr":
                BinaryTree.prototype.queryFunction = BinaryTree.prototype.traverseDLR;
                break;
            case "ldr":
                BinaryTree.prototype.queryFunction = BinaryTree.prototype.traverseLDR;
                break;
            case "lrd":
                BinaryTree.prototype.queryFunction = BinaryTree.prototype.traverseLRD;
                break;
        }
        if (!input.value && event.target.type !== "text") {
            alert("请输入在查找的字符");
            return;
        }
        tree.queryFunction(function(node) {
            var nodeValue = node !== tree.getRoot() &&
                node.data.querySelector("a").firstChild.nodeValue;
            node.data.className = node.data.className.replace("search-item", "").trim();
            if (nodeValue === input.value) {
                isFound = true;
                node.data.className += " search-item";
                (function setParent(node) {
                    node.data.parentElement.style.display = "block";
                    if (node.getParent() !== tree.getRoot()) {
                        setParent(node.getParent());
                    }
                })(node);
            }
        });
        if (!isFound) {
            alert("Can not find what you want!!!!");
        }
    });

    // 下拉
    addEvent(binaryTree, "click", function(event) {
        var target = event.target,
            children = target.parentElement.querySelector("ul"),
            className,
            i;
        if (target.className.indexOf("tree-wholerow") === -1 ||
            target.parentElement.className.indexOf("tree-leaf") !== -1 || !children) {
            return;
        }
        // 点击隐藏
        if (children.style.display === "none") {
            children.style.display = "block";
            target.nextElementSibling.style.backgroundPosition = "-40px -6px";
        } else {
            // 点击显示
            children.style.display = "none";
            target.nextElementSibling.style.backgroundPosition = "-5px -6px";
        }
    });

    // 添加删除节点元素
    addEvent(addRemove, "click", function(event) {
        var target = event.target,
            allSelected = binaryTree.querySelectorAll(":checked"),
            i,
            j,
            listElement;

        if (target.name === "remove") {
            if (!allSelected.length) {
                alert("未选中任何结点");
                return;
            }
            var newChild = [],
                parentNode,
                node;
            for (i = 0, length = allSelected.length; i < length; i++) {
                listElement = allSelected[i].parentElement.parentElement;
                // 在树中查找是否有选中的节点
                node = tree.contains(listElement, tree.traverseDLR);

                if (node) {
                    parentNode = node.getParent();
                    // 删除树节点和节点下的子结点
                    for (j = 0, len = parentNode._children.length; j < len; j++) {
                        if (parentNode._children[j] !== node) {
                            newChild.push(parentNode._children[j]);
                        }
                    }
                    parentNode._children = newChild;
                    allSelected[i].parentElement.parentElement.remove();
                }
            }
        } else if (target.name === "add") {
            var text = this.querySelector("input").value,
                newElement,
                newNode,
                ranNum,
                link,
                treeIcon = "tree-icon-leaf";
            if (!allSelected.length) {
                alert("未选中任何结点");
                return;
            }
            if (!text) {
                alert("输入不能为空");
                return;
            }
            for (i = 0; i < allSelected.length; i++) {
                listElement = allSelected[i].parentElement.parentElement;
                // 跳过叶子结点
                if (listElement.className.indexOf("tree-leaf") === -1) {
                    // 查找ul，不存在时创建新的ul元素
                    newElement = listElement.querySelector("ul") || 
                        setElement(listElement, "ul", null, "tree-ul");
                    // 新的结点元素
                    newElement = setElement(newElement, "li", null, "node");
                    // hover层
                    treeWholerow = setElement(newElement, "div", null, "tree-wholerow");
                    // 点选标签
                    setElement(treeWholerow, "input", null, "select-check");
                    ranNum = Math.ceil(Math.random() * 10) % 2;
                    if (ranNum % 2) {
                        // 为目录时，添加三角形
                        setElement(newElement, "i", "", "tree-anchor");
                        treeIcon = "tree-icon-dir";
                    }
                    console.log(ranNum);
                    link = setElement(newElement, "a", text, "tree-link");
                    setElement(link, "i", null, treeIcon);
                    newNode = tree.addNode(newElement, tree.contains(listElement,
                        tree.traverseLDR), tree.traverseLDR);
                }
            }
        }
    });
});

function setElement(parentNode, element, msg, elementClass) {
    var el = document.createElement(element);
    if (msg) {
        var text = document.createTextNode(msg);
        el.appendChild(text);
    }
    if (elementClass) {
        el.className = elementClass;
    }
    if (element === "input") {
        el.setAttribute("type", "checkbox");
    }
    parentNode.appendChild(el);
    return el;
}
