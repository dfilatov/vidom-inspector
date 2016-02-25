import {
    ADD_ROOT_NODE,
    REMOVE_ROOT_NODE,
    REPLACE_NODE
} from '../actions/tree';

const INITIAL_STATE = {
    rootNodes : {}
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case ADD_ROOT_NODE:
            return {
                ...state,
                rootNodes : {
                    ...state.rootNodes,
                    [action.node.id] : action.node
                }
            };

        case REMOVE_ROOT_NODE:
            const { [action.nodeId] : _, ...rootNodes } = state.rootNodes;

            return {
                ...state,
                rootNodes
            };

        case REPLACE_NODE:
            const { path, rootId } = action.newNode;

            return {
                ...state,
                rootNodes : {
                    ...state.rootNodes,
                    [rootId] : updateInPath(state.rootNodes[rootId], path, 0, action.newNode)
                }
            };
    }

    return state;
}

function updateInPath(ancestorNode, path, i, newNode) {
    const children = ancestorNode.children;

    return {
        ...ancestorNode,
        children : [
            ...children.slice(0, path[i]),
            i === path.length - 1?
                newNode :
                updateInPath({ ...children[path[i]] }, path, i + 1, newNode),
            ...children.slice(path[i] + 1)
        ]
    };
}
