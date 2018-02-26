export default function serializeTree(treeNode) {
    const { id, rootId, path, node } = treeNode;

    return {
        id,
        rootId,
        path,
        type : node? node.type : 0,
        name : serializeTreeNodeName(treeNode),
        key : node && node.key,
        attrs : serializeTreeNodeAttrs(treeNode),
        children : serializeTreeNodeChildren(treeNode)
    };
}

function serializeTreeNodeName(treeNode) {
    const { id, rootId, node } = treeNode;

    if(id === rootId) {
        return getRootTreeNodeParentDomNode(treeNode).tagName.toLowerCase();
    }

    switch(node.type) {
        case 1:
            return node.tag;

        case 2:
            return 'text';

        case 3:
            return 'fragment';

        case 4:
        case 5:
            return node.component.name || 'Function';
    }
}

function serializeTreeNodeAttrs(treeNode) {
    const { id, rootId, node } = treeNode;

    if(id === rootId) {
        const parentDomNode = getRootTreeNodeParentDomNode(treeNode),
            attrs = {};

        parentDomNode.id && (attrs.id = parentDomNode.id);
        parentDomNode.className && (attrs['class'] = parentDomNode.className);

        return serialize(attrs);
    }

    switch(node.type) {
        case 1:
        case 4:
        case 5:
            return serialize(node.attrs);
    }
}

function serializeTreeNodeChildren(treeNode) {
    return treeNode.children &&
        (typeof treeNode.children === 'string'?
            treeNode.children :
            treeNode.children.map(serializeTree));
}

function serialize(something) {
    return serializers[typeof something](something);
}

function getRootTreeNodeParentDomNode(treeNode) {
    const domNode = treeNode.node.getDomNode();

    return (Array.isArray(domNode)? domNode[0] : domNode).parentNode;
}

const serializers = {
    'boolean' : value => ({ type : 'boolean', value }),
    'number' : value => ({ type : 'number', value }),
    'string' : value => ({ type : 'string', value }),
    'function' : ({ name }) => ({ type : 'function', name }),
    'object' : value => {
        if(!value) {
            return serializers.null();
        }

        if(Array.isArray(value)) {
            return serializers.array(value);
        }

        const isPlain = isPlainObject(value);

        return {
            type : 'object',
            isPlain,
            value : isPlain?
                Object.keys(value).reduce((res, key) => {
                    res[key] = serialize(value[key]);
                    return res;
                }, {}) :
                null
        };
    },
    'array' : value => ({ type : 'array', value : value.map(serialize) }),
    'null' : () => ({ type : 'null' }),
    'undefined' : () => undefined
};

function isPlainObject(obj) {
    if(Object.prototype.toString.call(obj) !== '[object Object]') {
        return false;
    }

    const ctor = obj.constructor;

    if(typeof ctor !== 'function') {
        return false;
    }

    const proto = ctor.prototype;

    return Object.prototype.toString.call(proto) === '[object Object]' && proto.hasOwnProperty('isPrototypeOf');
}
