import { Component } from 'vidom';

export default class extends Component {
    onInit() {
        this._prevState = this.getInitialState(this.getAttrs());
        this._state = this._prevState;
    }

    getInitialState() {
        return {};
    }

    setState(state) {
        this._prevState = this._state;
        this._state = { ...this._state, ...state };

        this.update(function() {
            this._prevState = this._state;
        });
    }

    getState() {
        return this._state;
    }

    getPrevState() {
        return this._prevState;
    }
}
