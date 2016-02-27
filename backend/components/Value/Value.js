import bem from 'b_';

const b = bem.with('Value'),
    keyClass = b('key'),
    MAX_ITEMS_COUNT = 3;

export default function Value({ value, recursive = true }) {
    return renderers[value.type](value, recursive);
}

const renderers = {
    'boolean' : ({ value }) => <span class={ b({ type : 'boolean' }) }>{ value }</span>,
    'number' : ({ value }) => <span class={ b({ type : 'number'}) }>{ value }</span>,
    'string' : ({ value }) => <span class={ b({ type : 'string'}) }>{ '"' + value + '"' }</span>,
    'function' : ({ name }) => <span class={ b({ type : 'function'}) }>()</span>,
    'object' : ({ value, isPlain }, recursive) =>
        <span class={ b({ type : 'object' }) }>
            <span key="open">{ '{' }</span>
            { isPlain?
                recursive?
                    renderObject(value) :
                    <span>...</span> :
                <span>{Object}</span>
            }
            <span key="close">{ '}' }</span>
        </span>,
    'array' : ({ value }, recursive) => (
        <span class={ b({ type : 'array'}) }>
            <span key="open">[</span>
            { recursive?
                renderArray(value) :
                <span>...</span>
            }
            <span key="close">]</span>
        </span>
    ),
    'null' : () => <span class={ b({ type : 'null'}) }>null</span>,
    'undefined' : () => <span class={ b({ type : 'undefined'}) }>undefined</span>
};

function renderObject(value) {
    let keys = Object.keys(value);
    const renderAll = keys.length <= MAX_ITEMS_COUNT;

    if(!renderAll) {
        keys = keys.slice(0, MAX_ITEMS_COUNT);
    }

    const res = keys.map((key, i) =>
        [
            i? ', ' : null,
            <span class={ keyClass }>{ key }: </span>,
            <Value value={ value[key] } recursive={ false }/>
        ]
    );

    if(!renderAll) {
        res.push(', ...');
    }

    return res;
}

function renderArray(value) {
    const renderAll = value.length <= MAX_ITEMS_COUNT;

    if(!renderAll) {
        value = value.slice(0, MAX_ITEMS_COUNT);
    }

    const res = value.map((itemValue, i) =>
        [
            i? ', ' : null,
            <Value value={ itemValue } recursive={ false }/>
        ]
    );

    if(!renderAll) {
        res.push(', ...');
    }

    return res;
}
