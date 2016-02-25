import bem from 'b_';

const b = bem.with('Value'),
    keyClass = b('key'),
    MAX_ITEMS_COUNT = 3;

export default function Value({ value, recursive = true }) {
    return renderers[typeof value](value, recursive);
}

const renderers = {
    'boolean' : value => <span class={ b({ type : 'boolean' }) }>{ value }</span>,
    'number' : value => <span class={ b({ type : 'number'}) }>{ value }</span>,
    'string' : value => <span class={ b({ type : 'string'}) }>{ '"' + value + '"' }</span>,
    'function' : value => <span class={ b({ type : 'function'}) }>{ (value.name || 'fn') +'() {...}' }</span>,
    'object' : (value, recursive) => value?
        Array.isArray(value)?
            renderers.array(value, recursive) :
            <span class={ b({ type : 'object' }) }>
                <span key="open">{ '{' }</span>
                { recursive && isPlainObject(value)?
                    renderObject(value) :
                    <span>...</span>
                }
                <span key="close">{ '}' }</span>
            </span> :
        renderers.null(value),
    'array' : (value, recursive) => (
        <span class={ b({ type : 'array'}) }>
            <span key="open">[</span>
            { recursive?
                renderArray(value) :
                <span>...</span>
            }
            <span key="close">]</span>
        </span>
    ),
    'null' : value => <span class={ b({ type : 'null'}) }>{ value }</span>,
    'undefined' : value => <span class={ b({ type : 'undefined'}) }>{ value }</span>
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

function isPlainObject(obj) {
    if(Object.prototype.toString.call(obj) !== '[object Object]') {
        return false;
    }

    const ctor = obj.constructor;
    if(typeof ctor !== 'function') {
        return false;
    }

    const proto = ctor.prototype;
    return Object.prototype.toString.call(proto) === '[object Object]' && proto.hasOwnProperty('isPrototypeOf');
}
