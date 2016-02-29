const port = chrome.runtime.connect({
    name : 'content'
});

port.onMessage.addListener(onPortMessage);
port.onDisconnect.addListener(onPortDisconnect);

function postMessageToWindow(message) {
    window.postMessage({
        source : 'vidom-inspector',
        message
    }, '*');
}

function onPortMessage(message) {
    if(message.type === 'connect') {
        window.addEventListener('message', onWindowMessage);
    }
    else {
        postMessageToWindow(message);
    }
}

function onWindowMessage({ data }) {
    if(data && data.source === 'vidom-agent') {
        port.postMessage(data.message);
    }
}

function onPortDisconnect() {
    window.removeEventListener('message', onWindowMessage);
    postMessageToWindow({ type : 'shutdown' });
}
