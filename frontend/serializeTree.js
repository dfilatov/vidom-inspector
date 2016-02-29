export default function serializeTree(treeNode) {
    const { id, rootId, path, node } = treeNode;

    return {
        id,
        rootId,
        path,
        type : node._tag? 'tag' : 'component',
        name : node._tag || node._component.name || 'Function',
        key : node._key,
        attrs : serializeTreeNodeAttrs(treeNode),
        children : serializeTreeNodeChildren(treeNode)
    };
}

function serializeTreeNodeAttrs({ node }) {
    const attrs = node._tag || !node._instance?
        node._attrs :
        node._instance.getAttrs();

    return serialize(attrs);
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
