import {
    ADD_ROOT_NODE,
    REMOVE_ROOT_NODE,
    REPLACE_NODE,
    EXPAND_NODES,
    ENABLE_NODE_SELECTOR,
    DISABLE_NODE_SELECTOR
} from '../actions/tree';

const INITIAL_STATE = {
        rootNodes : {},
        expandPath : null,
        nodeSelectorEnabled : false
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
                rootNodes,
                expandPath : state.expandPath && state.expandPath[0] === payload.nodeId?
                    null :
                    state.expandPath
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
        },

        EXPAND_NODES(state, payload) {
            const { path, rootId } = payload,
                expandPath = [rootId];

            let node = state.rootNodes[rootId],
                i = 0;

            while(i < path.length) {
                node = node.children[path[i++]];
                expandPath.push(node.id);
            }

            return {
                ...state,
                expandPath
            };
        },

        ENABLE_NODE_SELECTOR(state) {
            return {
                ...state,
                nodeSelectorEnabled : true
            };
        },

        DISABLE_NODE_SELECTOR(state) {
            return {
                ...state,
                nodeSelectorEnabled : false,
                expandPath : null
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
