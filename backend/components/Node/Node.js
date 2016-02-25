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

    getInitialState({ node }) {
        return {
            hovered : false,
            collapsed : node.type !== 'tag'
        };
    }

    shouldUpdate({ node }, { node : prevNode }) {
        return node !== prevNode || this.getState() !== this.getPrevState();
    }

    onRender({ node, onHighlight, onUnhighlight, onClick, level = 0 }) {
        const { type, name, attrs, children } = node,
            { hovered, collapsed } = this.getState(),
            hasChildren = !!children && !collapsed,
            onlyStringChild = hasChildren && typeof children === 'string',
            tagStyle = { paddingLeft : (level + 1.2) + 'em' };

        return (
            <div
                class={ b({ type, onlyStringChild, hovered, collapsed }) }
                onMouseOver={ this._onMouseOver }
                onMouseOut={ this._onMouseOut }
                >
                <div key="open" class={ tagClass } style={ tagStyle } dom-ref="openTag">
                    { onlyStringChild?
                        null :
                        <span class={ collapserClass } onClick={ this._onCollapserClick }>
                            { collapsed? '▶' : '▼' }
                        </span>
                    }
                    <span class={ tagNameClass } onClick={ this._onTagNameClick }>{ '<' + name }</span>
                    { attrs && renderAttrs(node, attrs) }
                    <span>
                        { (hasChildren? '' : '/') + '>' }
                    </span>
                </div>
                { hasChildren?
                    [
                        <div key="children" class={ childrenClass }>
                            { onlyStringChild?
                                children :
                                children.map(child =>
                                    <Node
                                        node={ child }
                                        onHighlight={ onHighlight }
                                        onUnhighlight={ onUnhighlight }
                                        onClick={ onClick }
                                        level={ level + 1 }
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

    onUpdate() {
        if(this.getState().hovered) {
            const { node, onHighlight } = this.getAttrs();
            onHighlight && onHighlight(node.id);
        }
    }

    onUnmount() {
        if(this.getState().hovered) {
            const { node, onUnhighlight } = this.getAttrs();
            onUnhighlight && onUnhighlight(node.id);
        }
    }

    _onMouseOver(e) {
        e.stopPropagation();

        if(!this.getState().hovered) {
            this.setState({ hovered : true });

            const { node, onHighlight } = this.getAttrs();
            onHighlight && onHighlight(node.id);
        }
    }

    _onMouseOut(e) {
        e.stopPropagation();

        const { relatedTarget } = e.nativeEvent;

        if(['openTag', 'closeTag'].every(ref => !this.getDomRef(ref) || !this.getDomRef(ref).contains(relatedTarget))) {
            this.setState({ hovered : false });

            const { node, onUnhighlight } = this.getAttrs();
            onUnhighlight && onUnhighlight(node.id);
        }
    }

    _onCollapserClick(e) {
        e.stopPropagation();

        this.setState({ collapsed : !this.getState().collapsed });
    }

    _onTagNameClick(e) {
        e.stopPropagation();

        const { node, onClick } = this.getAttrs();
        onClick && onClick(node.id);
    }
}

function renderAttrs(node, attrs) {
    return Object.keys(attrs).map(name => {
        if(node.type === 'tag' && typeof attrs[name] === 'boolean') {
            return attrs[name]?
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
                    <Value value={ attrs[name] }/>
                </span>
            </span>
        );
    });
}
