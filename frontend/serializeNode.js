import identifyNode from './identifyNode';

export default function serializeNode(node, rootId, path = []) {
    const id = identifyNode(node);

    return {
        id,
        rootId : rootId || id,
        path,
        type : node._tag? 'tag' : 'component',
        name : node._tag || node._component.name || 'Function',
        key : node._key,
        attrs : serializeNodeAttrs(node),
        children : serializeNodeChildren(node, rootId || id, path),
        originalNode : node,
        toJSON
    };
}

function toJSON() {
    const { originalNode, ...json } = this;
    return json;
}

function serializeNodeAttrs(node) {
    const attrs = node._tag || !node._instance?
        node._attrs :
        node._instance.getAttrs();

    return serialize(attrs);
}

function serializeNodeChildren(node, rootId, path) {
    if(node._tag) {
        const children = node._children;

        return children?
            typeof children === 'string'?
                children :
                children.map((node, i) => serializeNode(node, rootId, [...path, i])) :
            null;
    }

    return [serializeNode(
        node._instance?
            node._instance.getRootNode() :
            node._getRootNode(),
        rootId,
        [...path, 0])
    ];
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
