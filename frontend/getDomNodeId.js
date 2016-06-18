const ID_PROP = '__vidom__inspector__id__';
let counter = 1;

export default function getDomNodeId(domNode, onlyGet) {
    return domNode[ID_PROP] || (onlyGet? null : domNode[ID_PROP] = counter++);
}
