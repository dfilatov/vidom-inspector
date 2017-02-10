import buildTree from './buildTree';
import serializeTree from './serializeTree';
import identifyNode from './identifyNode';
import highlighter from './highlighter';
import selector from './selector';
import getDomNodeId from './getDomNodeId';

const messageHandlers = {
        initInspector : onInspectorInit,
        shutdown : onShutdown,
        highlightNode : onHighlightNode,
        unhighlightNode : onUnhighlightNode,
        showNode : onShowNode,
        enableNodeSelector : onEnableNodeSelector,
        disableNodeSelector : onDisableNodeSelector
    };

const globalHook = window.__vidom__hook__;
let nodesData = { nodes : {}, domNodes : {} };

function onInspectorInit() {
    const rootNodes = {};

    globalHook.getRootNodes().forEach(rootNode => {
        const tree = buildTree(rootNode);

        collectTreeData(tree, nodesData);
        rootNodes[tree.id] = serializeTree(tree);
    });

    emit('initAgent', { rootNodes });

    globalHook
        .on('mount', onRootNodeMount)
        .on('unmount', onRootNodeUnmount)
        .on('replace', onNodeReplace);

    highlighter.init();
    selector.init();
}

function onShutdown() {
    nodesData = { nodes : {}, domNodes : {} };

    globalHook
        .off('mount', onRootNodeMount)
        .off('unmount', onRootNodeUnmount)
        .off('replace', onNodeReplace);

    highlighter.shutdown();
    selector.shutdown();

    window.removeEventListener('message', onWindowMessage);
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
    const oldTreeNode = nodesData.nodes[identifyNode(oldNode)],
        newTreeNode = oldTreeNode.path.length?
            buildTree(newNode, oldTreeNode.rootId, oldTreeNode.path) :
            buildTree(newNode);

    updateNodesData(oldTreeNode, newTreeNode);

    emit('replace', { oldNode : serializeTree(oldTreeNode), newNode : serializeTree(newTreeNode) });
}

function onHighlightNode({ nodeId }) {
    const { nodes } = nodesData,
        treeNode = nodes[nodeId];

    if(treeNode) {
        const domNode = treeNode.node.getDomNode();

        highlighter.highlight(treeNode.node.type === 1? domNode.parentNode : domNode);
    }
}

function onUnhighlightNode({ nodeId }) {
    highlighter.unhighlight();
}

function onShowNode({ nodeId }) {
    const { nodes } = nodesData;

    if(nodes[nodeId]) {
        highlighter.show(nodes[nodeId].node.getDomNode());
    }
}

function onEnableNodeSelector() {
    selector.enable(onDomNodeHover, onDomNodeSelect);
}

function onDisableNodeSelector() {
    selector.disable();
}

function onDomNodeHover(domNode) {
    const domNodeId = getDomNodeId(domNode);

    return !!nodesData.domNodes[domNodeId];
}

function onDomNodeSelect(domNode) {
    const domNodeId = getDomNodeId(domNode),
        nodeId = nodesData.domNodes[domNodeId];

    if(nodeId) {
        const mostInnerTreeNode = nodesData.nodes[nodeId];

        emit('expand', { rootId : mostInnerTreeNode.rootId, path : mostInnerTreeNode.path });
    }
}

function collectTreeData(treeNode, res = { nodes : {}, domNodes : {} }) {
    const { nodes, domNodes } = res,
        { domNodeId } = treeNode;

    nodes[treeNode.id] = treeNode;

    if(domNodeId) {
        domNodes[treeNode.domNodeId] = treeNode.id;
    }

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
        delete resDomNodes[domNodeId];
    }
}

function updateNodesData(oldTreeNode, newTreeNode) {
    uncollectNodesData(collectTreeData(oldTreeNode), nodesData);

    const path = newTreeNode.path,
        rootId = newTreeNode.rootId;

    if(path.length) {
        let parentTreeNode = nodesData.nodes[rootId],
            i = 0;

        while(i < path.length - 1) {
            parentTreeNode = parentTreeNode.children[path[i++]];
        }

        parentTreeNode.children[path[i]] = newTreeNode;
    }

    collectTreeData(newTreeNode, nodesData);
}

function emit(type, payload) {
    window.postMessage({
        source : 'vidom-agent',
        message : { type, payload }
    }, '*');
}

function onWindowMessage({ data }) {
    if(data && data.source === 'vidom-inspector') {
        const { type, payload } = data.message;

        if(!messageHandlers[type]) {
            throw Error(`Unknown message: ${type}`);
        }

        messageHandlers[type](payload);
    }
}

window.addEventListener('message', onWindowMessage);
