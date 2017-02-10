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
        domNodeId :
            node.type === 1?
                getDomNodeId(node.getDomNode().parentNode) :
                node.type === 2?
                    getDomNodeId(node.getDomNode()) :
                    null,
        children : buildNodeChildren(node, rootId, path)
    };
}

function buildNodeChildren(node, rootId, path) {
    switch(node.type) {
        case 1:
            return [buildTree(
                node._childNode,
                rootId,
                [...path, 0])
            ];

        case 2:
        case 3:
        case 4:
            const { children } = node;

            return children?
                typeof children === 'string'?
                    children :
                    children.map((node, i) => buildTree(node, rootId, [...path, i])) :
                null;

        case 5:
            return [buildTree(
                node._instance.getRootNode(),
                rootId,
                [...path, 0])
            ];

        case 6:
            return [buildTree(
                node._getRootNode(),
                rootId,
                [...path, 0])
            ];
    }
}
