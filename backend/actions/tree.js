export const ADD_ROOT_NODE = 'ADD_ROOT_NODE';
export const REMOVE_ROOT_NODE = 'REMOVE_ROOT_NODE';
export const REPLACE_NODE = 'REPLACE_NODE';
export const HIGHLIGHT_NODE = 'HIGHLIGHT_NODE';
export const UNHIGHLIGHT_NODE = 'UNHIGHLIGHT_NODE';
export const SHOW_NODE = 'SHOW_NODE';

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
