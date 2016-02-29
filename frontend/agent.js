import buildTree from './buildTree';
import serializeTree from './serializeTree';
import identifyNode from './identifyNode';
import highlighter from './highlighter';
import getDomNodeId from './getDomNodeId';

const messageHandlers = {
        init,
        shutdown,
        highlightNode,
        unhighlightNode,
        showNode
    };

const globalHook = window.__vidom__hook__;
let nodesData = { nodes : {}, domNodes : {} };

function init() {
    const rootNodes = {};

    globalHook.getRootNodes().forEach(rootNode => {
        const tree = buildTree(rootNode);

        collectTreeData(tree, nodesData);

        rootNodes[tree.id] = serializeTree(tree);
    });

    emit('init', { rootNodes });

    globalHook
        .on('mount', onRootNodeMount)
        .on('unmount', onRootNodeUnmount)
        .on('replace', onNodeReplace);
}

function onRootNodeMount(rootNode) {
    const tree = buildTree(rootNode);

    collectTreeData(tree, nodesData);

    emit('mount', { rootNode : serializeTree(tree) });
}

function onRootNodeUnmount(rootNode) {
    const rootNodeId = identifyNode(rootNode);

    uncollectNodesData(collectTreeData(nodesData.nodes[rootNodeId]), nodesData);

    emit('unmount', { rootNodeId });
}

function onNodeReplace(oldNode, newNode) {
    const oldNodeId = identifyNode(oldNode),
        { rootId, path } = nodesData.nodes[oldNodeId],
        tree = buildTree(newNode, rootId, path);

    collectTreeData(tree, nodesData);
    uncollectNodesData(collectTreeData(nodesData.nodes[oldNodeId]), nodesData);

    emit('replace', { newNode : serializeTree(tree) });
}

function shutdown() {
    nodesData = { nodes : {}, domNodes : {} };

    globalHook
        .off('mount', onRootNodeMount)
        .off('unmount', onRootNodeUnmount)
        .off('replace', onNodeReplace);
}

function highlightNode({ nodeId }) {
    const { nodes } = nodesData;

    if(nodes[nodeId]) {
        highlighter.highlight(nodes[nodeId].node.getDomNode());
    }
}

function unhighlightNode({ nodeId }) {
    highlighter.unhighlight();
}

function showNode({ nodeId }) {
    const { nodes } = nodesData;

    if(nodes[nodeId]) {
        highlighter.show(nodes[nodeId].node.getDomNode());
    }
}

function collectTreeData(treeNode, res = { nodes : {}, domNodes : {} }) {
    const { nodes, domNodes } = res,
        { domNodeId } = treeNode;

    nodes[treeNode.id] = treeNode;
    (domNodes[domNodeId] || (domNodes[domNodeId] = [])).push(treeNode.id);

    if(Array.isArray(treeNode.children)) {
        treeNode.children.forEach(child => collectTreeData(child, res));
    }

    return res;
}

function uncollectNodesData(from, res) {
    const { nodes : fromNodes, domNodes : fromDomNodes } = from,
        { nodes : resNodes, domNodes : resDomNodes } = res;

    for(let nodeId in fromNodes) {
        delete resNodes[nodeId];
    }

    for(let domNodeId in fromDomNodes) {
        fromDomNodes[domNodeId].forEach(nodeId => {
            resDomNodes[domNodeId].splice(resDomNodes[domNodeId].indexOf(nodeId), 1);
            if(!resDomNodes[domNodeId].length) {
                delete resDomNodes[domNodeId];
            }
        });
    }
}

function emit(type, payload) {
    window.postMessage({
        source : 'vidom-agent',
        message : { type, payload }
    }, '*');
}

window.addEventListener('message', ({ data }) => {
    if(data && data.source === 'vidom-inspector') {
        const { type, payload } = data.message;

        if(!messageHandlers[type]) {
            throw Error(`Unknown message: ${type}`);
        }

        messageHandlers[type](payload);
    }
});
