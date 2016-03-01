import {
    ADD_ROOT_NODE,
    REMOVE_ROOT_NODE,
    REPLACE_NODE,
} from '../actions/tree';

const INITIAL_STATE = {
        rootNodes : {}
    },
    reducers = {
        ADD_ROOT_NODE(state, payload) {
            return {
                ...state,
                rootNodes : {
                    ...state.rootNodes,
                    [payload.node.id] : payload.node
                }
            };
        },

        REMOVE_ROOT_NODE(state, payload) {
            const { [payload.nodeId] : _, ...rootNodes } = state.rootNodes;

            return {
                ...state,
                rootNodes
            };
        },

        REPLACE_NODE(state, payload) {
            const { path, rootId } = payload.newNode;

            return {
                ...state,
                rootNodes : {
                    ...state.rootNodes,
                    [rootId] : replaceNodeInPath(state.rootNodes[rootId], path, 0, payload.newNode)
                }
            };
        }
    };

export default function(state = INITIAL_STATE, action) {
    return reducers[action.type]?
        reducers[action.type](state, action.payload) :
        state;
}

function replaceNodeInPath(ancestorNode, path, i, newNode) {
    const children = ancestorNode.children;

    return {
        ...ancestorNode,
        children : [
            ...children.slice(0, path[i]),
            i === path.length - 1?
                newNode :
                replaceNodeInPath({ ...children[path[i]] }, path, i + 1, newNode),
            ...children.slice(path[i] + 1)
        ]
    };
}

function updateNodeInPath(node, path, i, newProps) {
    if(i === path.length) {
        return {
            ...node,
            ...newProps
        };
    }

    const children = node.children;

    return {
        ...node,
        children : [
            ...children.slice(0, path[i]),
            updateNodeInPath({ ...children[path[i]] }, path, i + 1, newProps),
            ...children.slice(path[i] + 1)
        ]
    };
}
