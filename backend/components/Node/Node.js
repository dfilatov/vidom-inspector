import Stateful from '../Stateful';
import bem from 'b_';
import Value from '../Value';

const b = bem.with('Node'),
    tagClass = b('tag'),
    collapserClass = b('collapser'),
    childrenClass = b('children'),
    tagNameClass = b('tagName'),
    attrClass = b('attr'),
    attrNameClass = b('attrName'),
    attrValueClass = b('attrValue');

export default class Node extends Stateful {
    onInit() {
        super.onInit();

        this._onMouseOver = this._onMouseOver.bind(this);
        this._onMouseOut = this._onMouseOut.bind(this);
        this._onCollapserClick = this._onCollapserClick.bind(this);
        this._onTagNameClick = this._onTagNameClick.bind(this);
    }

    getInitialState({ node, expandPath, level }) {
        const inExpandPath = !!(expandPath && expandPath[level] === node.id);

        return {
            hovered : false,
            collapsed : node.type !== 'tag' && !inExpandPath,
            selected : inExpandPath && expandPath.length === level + 1
        };
    }

    onAttrsReceive({ expandPath, level }, { expandPath : prevExpandPath, node }) {
        if(expandPath !== prevExpandPath) {
            if(expandPath && expandPath[level] === node.id) {
                this.setState({
                    collapsed : false,
                    selected : expandPath.length === level + 1
                });
            }
            else if(prevExpandPath) {
                this.setState({ selected : false });
            }
        }
    }

    shouldUpdate({ node }, { node : prevNode }) {
        return node !== prevNode || this.getState() !== this.getPrevState();
    }

    onRender({ node, actions, level, expandPath }) {
        const { type, name, attrs, children } = node,
            { hovered, collapsed, selected } = this.getState(),
            hasChildren = !!children,
            onlyStringChild = hasChildren && typeof children === 'string',
            tagStyle = { paddingLeft : (level + 1.2) + 'em' };

        return (
            <div
                class={ b({ type, onlyStringChild, hovered, collapsed, selected }) }
                onMouseOver={ this._onMouseOver }
                onMouseOut={ this._onMouseOut }
                >
                <div key="open" class={ tagClass } style={ tagStyle } dom-ref="openTag">
                    { !hasChildren || onlyStringChild?
                        null :
                        <span class={ collapserClass } onClick={ this._onCollapserClick }>
                            { collapsed? '▶' : '▼' }
                        </span>
                    }
                    <span class={ tagNameClass } onClick={ this._onTagNameClick }>{ '<' + name }</span>
                    { renderAttrs(node, attrs) }
                    <span>
                        { (hasChildren && !collapsed? '' : '/') + '>' }
                    </span>
                </div>
                { hasChildren && !collapsed?
                    [
                        <div key="children" class={ childrenClass }>
                            { onlyStringChild?
                                children :
                                children.map(child =>
                                    <Node
                                        node={ child }
                                        actions={ actions }
                                        level={ level + 1 }
                                        expandPath={ expandPath }
                                    />)
                            }
                        </div>,
                        <div
                            key="close"
                            class={ tagClass }
                            style={ onlyStringChild? null : tagStyle }
                            dom-ref="closeTag"
                            >
                            { '</'}
                            <span class={ tagNameClass } onClick={ this._onTagNameClick }>{ name }</span>
                            { '>' }
                        </div>
                    ] :
                    null
                }
            </div>
        );
    }

    onMount() {
        if(this.getState().selected) {
            scrollIntoViewIfNeeded(this.getDomRef('openTag'));
        }
    }

    onUpdate() {
        const { selected, hovered } = this.getState();

        if(selected && !this.getPrevState().selected) {
            scrollIntoViewIfNeeded(this.getDomRef('openTag'));
        }

        if(hovered) {
            const { node, actions } = this.getAttrs();

            actions.highlightNode(node);
        }
    }

    onUnmount() {
        if(this.getState().hovered) {
            const { node, actions } = this.getAttrs();

            actions.unhighlightNode(node);
        }
    }

    _onMouseOver(e) {
        e.stopPropagation();

        const { node, actions } = this.getAttrs();

        if(!this.getState().hovered) {
           this.setState({ hovered : true });

           actions.highlightNode(node);
        }
    }

    _onMouseOut(e) {
        e.stopPropagation();

        const { relatedTarget } = e.nativeEvent;

        if(['openTag', 'closeTag'].every(ref => !this.getDomRef(ref) || !this.getDomRef(ref).contains(relatedTarget))) {
            this.setState({ hovered : false });

            const { node, actions } = this.getAttrs();

            actions.unhighlightNode(node);
        }
    }

    _onCollapserClick(e) {
        e.stopPropagation();

        this.setState({ collapsed : !this.getState().collapsed });
    }

    _onTagNameClick(e) {
        e.stopPropagation();

        const { node, actions } = this.getAttrs();

        actions.showNode(node);
    }
}

function renderAttrs(node, { value }) {
    return value && Object.keys(value).map(name => {
        if(node.type === 'tag' && value[name].type === 'boolean') {
            return value[name].value?
                <span key={ name } class={ b('attr') }>
                    <span key="name" class={ b('attrName') }>{ name }</span>
                </span> :
                null;
        }

        return (
            <span key={ name } class={ attrClass }>
                <span class={ attrNameClass }>{ name }</span>
                <span>=</span>
                <span class={ attrValueClass }>
                    <Value value={ value[name] }/>
                </span>
            </span>
        );
    });
}

function scrollIntoViewIfNeeded(domNode) {
    const { top, height } = domNode.getBoundingClientRect(),
        { innerHeight : viewportHeight } = window;

    if(top < 0 || top + height > viewportHeight) {
        domNode.scrollIntoView();
    }
}
