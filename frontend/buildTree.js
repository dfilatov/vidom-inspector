import identifyNode from './identifyNode';
import getDomNodeId from './getDomNodeId';
import getParentDomNode from './getParentDomNode';

export default function buildTree(node, rootId, path) {
    const nodeDomNode = node.getDomNode();

    if(rootId) {
        return {
            id : identifyNode(node),
            rootId,
            path,
            node,
            domNodeId : node.type === 1? getDomNodeId(nodeDomNode) : null,
            children : buildNodeChildren(node, rootId, path)
        };
    }

    const nodeDomNodeParentId = getDomNodeId(getParentDomNode(nodeDomNode)),
        id = `${nodeDomNodeParentId}_root`;

    return {
        id,
        rootId : id,
        path : [],
        node,
        domNodeId : nodeDomNodeParentId,
        children : [buildTree(node, id, [0])]
    };
}

function buildNodeChildren(node, rootId, path) {
    switch(node.type) {
        case 1:
        case 2:
        case 3:
            const { children } = node;

            return children?
                typeof children === 'string'?
                    children :
                    children.map((node, i) => buildTree(node, rootId, [...path, i])) :
                null;

        case 4:
            return [buildTree(
                node._instance.getRootElement(),
                rootId,
                [...path, 0])
            ];

        case 5:
            return [buildTree(
                node._getRootElement(),
                rootId,
                [...path, 0])
            ];
    }
}
