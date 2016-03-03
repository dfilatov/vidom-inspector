export const ADD_ROOT_NODE = 'ADD_ROOT_NODE';
export const REMOVE_ROOT_NODE = 'REMOVE_ROOT_NODE';
export const REPLACE_NODE = 'REPLACE_NODE';
export const EXPAND_NODES = 'EXPAND_NODES';
export const HIGHLIGHT_NODE = 'HIGHLIGHT_NODE';
export const UNHIGHLIGHT_NODE = 'UNHIGHLIGHT_NODE';
export const SHOW_NODE = 'SHOW_NODE';
export const ENABLE_NODE_SELECTOR = 'ENABLE_NODE_SELECTOR';
export const DISABLE_NODE_SELECTOR = 'DISABLE_NODE_SELECTOR';

export function addRootNode(node) {
    return {
        type : ADD_ROOT_NODE,
        payload : { node }
    };
}

export function removeRootNode(nodeId) {
    return {
        type : REMOVE_ROOT_NODE,
        payload : { nodeId }
    };
}

export function replaceNode(newNode) {
    return {
        type : REPLACE_NODE,
        payload : { newNode }
    };
}

export function expandNodes(rootId, path) {
    return {
        type : EXPAND_NODES,
        payload : { rootId, path }
    };
}

export function highlightNode(node) {
    return {
        type : HIGHLIGHT_NODE,
        payload : { node }
    };
}

export function unhighlightNode(node) {
    return {
        type : UNHIGHLIGHT_NODE,
        payload : { node }
    };
}

export function showNode(node) {
    return {
        type : SHOW_NODE,
        payload : { node }
    };
}

export function enableNodeSelector() {
    return { type : ENABLE_NODE_SELECTOR };
}

export function disableNodeSelector() {
    return { type : DISABLE_NODE_SELECTOR };
}
