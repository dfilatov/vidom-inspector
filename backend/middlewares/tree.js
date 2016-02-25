import {
    HIGHLIGHT_NODE,
    UNHIGHLIGHT_NODE,
    SHOW_NODE,

    addRootNode,
    removeRootNode,
    replaceNode
} from '../actions/tree';

let inited = false;

export default store => {
    window.addEventListener('message', ({ data }) => {
        const { type, payload } = data;

        if(!inited && type !== 'init') {
            return;
        }

        switch(type) {
            case 'init':
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
                store.dispatch(replaceNode(payload.newNode));
            break;

            case 'shutdown':
                for(let rootNodeId in store.getState().tree.rootNodes) {
                    store.dispatch(removeRootNode(rootNodeId));
                }
        }
    });

    return next => action => {
        next(action);

        switch(action.type) {
            case HIGHLIGHT_NODE:
                postMessage('highlightNode', { nodeId : action.nodeId });
            break;

            case UNHIGHLIGHT_NODE:
                postMessage('unhighlightNode', { nodeId : action.nodeId });
            break;

            case SHOW_NODE:
                postMessage('showNode', { nodeId : action.nodeId });
            break;
        }
    };
}

function postMessage(type, payload) {
    window.postMessage({ source : 'vidom-inspector', message : { type, payload } }, '*');
}
