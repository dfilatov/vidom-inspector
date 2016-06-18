export default function serializeTree(treeNode) {
    const { id, rootId, path, node } = treeNode;

    return {
        id,
        rootId,
        path,
        type : node.type,
        name : serializeTreeNodeName(treeNode),
        key : node._key,
        attrs : serializeTreeNodeAttrs(treeNode),
        children : serializeTreeNodeChildren(treeNode)
    };
}

function serializeTreeNodeName({ node }) {
    switch(node.type) {
        case 1:
            return node.getDomNode().parentNode.tagName.toLowerCase();

        case 2:
            return node._tag;

        case 3:
            return 'fragment';

        case 4:
        case 5:
            return node._component.name || 'Function';
    }
}

function serializeTreeNodeAttrs({ node }) {
    switch(node.type) {
        case 1:
            const domNode = node.getDomNode().parentNode,
                attrs = {};

            domNode.id && (attrs.id = domNode.id);
            domNode.className && (attrs['class'] = domNode.className);

            return serialize(attrs);

        case 2:
        case 5:
            return serialize(node._attrs);

        case 4:
            return serialize(node._instance.getAttrs());
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
