import identifyNode from './identifyNode';
import getDomNodeId from './getDomNodeId';

export default function buildTree(node, parentRootId, path = []) {
    const id = identifyNode(node),
        rootId = parentRootId || id;

    return {
        id,
        rootId,
        path,
        node,
        domNodeId : getDomNodeId(node.getDomNode()),
        children : buildNodeChildren(node, rootId, path)
    };
}

function buildNodeChildren(node, rootId, path) {
    if(node._tag) {
        const children = node._children;

        return children?
            typeof children === 'string'?
                children :
                children.map((node, i) => buildTree(node, rootId, [...path, i])) :
            null;
    }

    return [buildTree(
        node._instance?
            node._instance.getRootNode() :
            node._getRootNode(),
        rootId,
        [...path, 0])
    ];
}
