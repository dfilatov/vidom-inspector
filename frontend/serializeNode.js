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
    return node._tag || !node._instance?
        node._attrs :
        node._instance.getAttrs();
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
