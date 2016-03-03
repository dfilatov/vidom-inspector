import { Component } from 'vidom';

export default class Provider extends Component {
    onInit({ store }) {
        this._childCtx = { store };

        let prevState = store.getState();

        this._unsubscribeFromStore = store.subscribe(() => {
            const newState = store.getState();

            if(newState !== prevState) {
                this.update();
            }
        });
    }

    onChildContextRequest() {
        return this._childCtx;
    }

    onRender({ Component }) {
        return <Component/>;
    }

    onUnmount() {
        this._unsubscribeFromStore();
    }
}
