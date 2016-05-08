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
BinaryTree.prototype.addNode = function(data, parentNode, traversal, childPosition) {
    if (!traversal && typeof traversal !== "function") {
        throw Error("traversal should be a traversel function of binary tree.");
    }
    childPosition = childPosition === "right" ? 1 : 0;
    if (!parentNode._children[childPosition]) {
        var newNode = new BinaryTree.prototype.node(data);
        parentNode._children[childPosition] = newNode;
        newNode.data = data;
        newNode._parent = parentNode;
        return newNode;
    }
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
        position = "left", 
        queue = new Queue(),
        level = 1,
        newNode,
        newElement,
        newChildNode;

    var binaryTree = document.querySelector(".binary-tree"),
        parentElement = setElement(binaryTree, "div", "0", "node"),
        tree = new BinaryTree(parentElement),
        currentNode = tree.getRoot();

    for (var i = 0; i < number - 1; i++) {
        newElement = setElement(parentElement, "div", i + 1, "node");
        newNode = tree.addNode(newElement, currentNode, tree.traverseBF, position);
        queue.enqueue(newNode);
        position = "right";
        count++;
        if (count === Math.pow(2, level)) {
            level++;
            count = 0;
            parentElement = newElement;
        }
        if (i % 2 !== 0) {
            position = "left";
            currentNode = queue.dequeue();
            parentElement = currentNode.data;
        }
    }
    return tree;
}

addEvent(document, "DOMContentLoaded", function(e) {
    var tree = createTree(51),
        button = document.querySelector(".doIt"),
        timer;
    addEvent(button, "click", function(event) {
        var queue = new Queue(),
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
        var e = document.querySelectorAll(".node");
        for (var i = 0; i < e.length; i++) {
            e[i].style.backgroundColor = "#fff";
        }
        timer = setInterval(function(queue) {
            if (!queue.getSize()) {
                clearInterval(timer);
                last.data.style.backgroundColor = "#fff";
            } else {
                var node = queue.dequeue();
                node.data.style.backgroundColor = "#AD1457";
                if (last) {
                    last.data.style.backgroundColor = "#fff";
                }
                last = node;
            }
        }, 800, queue);
    });
});

function setElement(parentNode, element, msg, elementClass) {
    var el = document.createElement(element);
    var text = document.createTextNode(msg);
    el.appendChild(text);
    el.className = elementClass;
    parentNode.appendChild(el);
    return el;
}
