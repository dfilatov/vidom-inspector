import { Component } from 'vidom';
import connect from '../../util/connect';
import * as treeActions from '../../actions/tree';
import ToolbarButton from './ToolbarButton';
import bem from 'b_';

const b = bem.with('Toolbar');

class Toolbar extends Component {
    onRender() {
        const { tree, actions } = this.attrs,
            { nodeSelectorEnabled, rootNodes } = tree;

        return Object.keys(rootNodes).length?
            <div class={ b() }>
                { nodeSelectorEnabled?
                    <ToolbarButton
                        iconId="selector-enabled"
                        onClick={ actions.disableNodeSelector }
                        title="Disable element selector"
                    /> :
                    <ToolbarButton
                        iconId="selector-disabled"
                        onClick={ actions.enableNodeSelector }
                        title="Enable element selector"
                    />
                }
            </div> :
            null;
    }
}

export default connect(({ tree }) => ({ tree }), treeActions)(Toolbar);

