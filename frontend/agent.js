import serializeNode from './serializeNode';
import identifyNode from './identifyNode';
import highlighter from './highlighter';

const messageHandlers = {
        init,
        shutdown,
        highlightNode,
        unhighlightNode,
        showNode
    };

const globalHook = window.__vidom__hook__;
let nodes = {};

function init() {
    const rootNodes = {};

    globalHook.getRootNodes().forEach(rootNode => {
        const serializedRootNode = serializeNode(rootNode);

        nodes = { ...nodes, ...collectNodes(serializedRootNode) };

        rootNodes[serializedRootNode.id] = serializedRootNode;
    });

    emit('init', { rootNodes });

    globalHook
        .on('mount', onRootNodeMount)
        .on('unmount', onRootNodeUnmount)
        .on('replace', onNodeReplace);
}

function onRootNodeMount(rootNode) {
    const serializedRootNode = serializeNode(rootNode);

    nodes = { ...nodes, ...collectNodes(serializedRootNode) };

    emit('mount', { rootNode : serializedRootNode });
}

function onRootNodeUnmount(rootNode) {
    const rootNodeId = identifyNode(rootNode),
        nodesToRemove = collectNodes(nodes[rootNodeId]);

    nodes = { ...nodes };
    for(let nodeId in nodesToRemove) {
        delete nodes[nodeId];
    }

    emit('unmount', { rootNodeId });
}

function onNodeReplace(oldNode, newNode) {
    const oldNodeId = identifyNode(oldNode),
        { rootId, path } = nodes[oldNodeId],
        nodesToRemove = collectNodes(nodes[oldNodeId]),
        serializedNewNode = serializeNode(newNode, rootId, path);

    nodes = { ...nodes, ...collectNodes(serializedNewNode) };
    for(let nodeId in nodesToRemove) {
        delete nodes[nodeId];
    }

    emit('replace', { newNode : serializedNewNode });
}

function shutdown() {
    nodes = {};

    globalHook
        .off('mount', onRootNodeMount)
        .off('unmount', onRootNodeUnmount)
        .off('replace', onNodeReplace);
}

function highlightNode({ nodeId }) {
    if(nodes[nodeId]) {
        highlighter.highlight(nodes[nodeId].originalNode.getDomNode());
    }
}

function unhighlightNode({ nodeId }) {
    highlighter.unhighlight();
}

function showNode({ nodeId }) {
    if(nodes[nodeId]) {
        highlighter.show(nodes[nodeId].originalNode.getDomNode());
    }
}

function collectNodes(node, res = {}) {
    res[node.id] = node;

    if(Array.isArray(node.children)) {
        node.children.forEach(child => collectNodes(child, res));
    }

    return res;
}

function emit(type, payload) {
    window.postMessage({
        source : 'vidom-agent',
        message : JSON.stringify({ type, payload })
    }, '*');
}

window.addEventListener('message', ({ data }) => {
    if(data && data.source === 'vidom-inspector') {
        const { type, payload } = JSON.parse(data.message);

        if(!messageHandlers[type]) {
            throw Error(`Unknown message: ${type}`);
        }

        messageHandlers[type](payload);
    }
});
