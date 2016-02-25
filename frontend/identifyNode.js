const NODE_ID_PROP = '__vidom__node__id__';
let nodeIdCnt = 1;

export default function identifyNode(node) {
    return node[NODE_ID_PROP] || (node[NODE_ID_PROP] = '' + nodeIdCnt++);
}
