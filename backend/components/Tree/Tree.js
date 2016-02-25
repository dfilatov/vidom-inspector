import { Component } from 'vidom';
import connect from '../../util/connect';
import * as treeActions from '../../actions/tree';
import bem from 'b_';
import Node from '../Node';

const b = bem.with('Tree');

class Tree extends Component {
    onRender({ tree, actions }) {
        const { rootNodes } = tree;

        return (
            <div class={ b() }>
                {
                    Object.keys(rootNodes).map(id =>
                        <Node
                            key={ id }
                            node={ rootNodes[id] }
                            onHighlight={ actions.highlightNode }
                            onUnhighlight={ actions.unhighlightNode }
                            onClick={ actions.showNode }
                        />)
                }
            </div>
        );
    }
}

export default connect(({ tree }) => ({ tree }), treeActions)(Tree);

