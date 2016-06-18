import {
    HIGHLIGHT_NODE,
    UNHIGHLIGHT_NODE,
    SHOW_NODE,
    ENABLE_NODE_SELECTOR,
    DISABLE_NODE_SELECTOR,

    addRootNode,
    removeRootNode,
    replaceNode,
    expandNodes,
    disableNodeSelector
} from '../actions/tree';

let inited = false;

export default store => {
    window.addEventListener('message', ({ data }) => {
        const { type, payload } = data;

        if(!inited && type !== 'initAgent') {
            return;
        }

        switch(type) {
            case 'initAgent':
                for(let id in payload.rootNodes) {
                    store.dispatch(addRootNode(payload.rootNodes[id]));
                }
                inited = true;
            break;

            case 'mount':
                store.dispatch(addRootNode(payload.rootNode));
            break;

            case 'unmount':
                store.dispatch(removeRootNode(payload.rootNodeId));
            break;

            case 'replace':
                store.dispatch(replaceNode(payload.oldNode, payload.newNode));
            break;

            case 'expand':
                store.dispatch(expandNodes(payload.rootId, payload.path));
            break;

            case 'pause':
                store.dispatch(disableNodeSelector());
            break;

            case 'shutdown':
                for(let rootNodeId in store.getState().tree.rootNodes) {
                    store.dispatch(removeRootNode(rootNodeId));
                }
                store.dispatch(disableNodeSelector());
                inited = false;
            break;
        }
    });

    return next => action => {
        next(action);

        switch(action.type) {
            case HIGHLIGHT_NODE:
                postMessage('highlightNode', { nodeId : action.payload.node.id });
            break;

            case UNHIGHLIGHT_NODE:
                postMessage('unhighlightNode', { nodeId : action.payload.node.id });
            break;

            case SHOW_NODE:
                postMessage('showNode', { nodeId : action.payload.node.id });
            break;

            case ENABLE_NODE_SELECTOR:
                postMessage('enableNodeSelector');
            break;

            case DISABLE_NODE_SELECTOR:
                postMessage('disableNodeSelector');
            break;
        }
    };
}

function postMessage(type, payload) {
    window.postMessage({ source : 'vidom-inspector', message : { type, payload } }, '*');
}
