import { Component, mountToDom, unmountFromDom } from 'vidom';

function FunctionComponent({ idx, cnt }) {
    return (
        <tr class={ idx % 2? 'odd' : 'even' }>
            <td>{ idx } item</td>
            <ClassComponent strProp="stringValue" boolProp={ true } numProp={ cnt }/>
        </tr>
    );
}

class ClassComponent extends Component {
    onRender({ numProp }) {
        return (
            <td>
                <span>{ numProp }</span>
            </td>
        );
    }
}

class App extends Component {
    onInit() {
        this._cnt = 0;
    }

    onRender() {
        return (
            <table class="app">
                {
                    Array.apply(null, Array(100)).map((_, i) => <FunctionComponent key={ i } idx={ i } cnt={ this._cnt }/>)
                }
            </table>
        );
    }

    onMount() {
        setInterval(() => {
            this._cnt++;
            this.update();
        }, 1000);
    }
}

mountToDom(document.getElementById('app'), <App/>);

//
//setTimeout(function() {
//    unmountFromDom(document.getElementById('app'));
//}, 1000)
//
