import mount from '../../../backend';
import checkForVidom from './checkForVidom';

let port = chrome.runtime.connect({
        name : '' + chrome.devtools.inspectedWindow.tabId
    }),
    checkForVidomInterval = null,
    messagesBuffer = [];

port.onMessage.addListener(onPortMessage);

function onPortMessage(message) {
    if(message.type === 'connect') {
        inject(chrome.runtime.getURL('build/agent.js'), () => {
            port.postMessage({ type : 'initInspector' });
        });
        chrome.devtools.network.onNavigated.addListener(onNavigated);
    }
    else if(message.type === 'initAgent') {
        messagesBuffer.push(message);
        window.addEventListener('message', onWindowMessage);
        mount(document.body, () => {
            messagesBuffer.forEach(message => {
                window.postMessage(message, '*');
            });
            messagesBuffer = [];
        });
    }
    else if(messagesBuffer.length) {
        messagesBuffer.push(message);
    }
    else {
        window.postMessage(message, '*');
    }
}

function onWindowMessage({ data }) {
    if(data && data.source === 'vidom-inspector') {
        port.postMessage(data.message);
    }
}

function onNavigated() {
    chrome.devtools.network.onNavigated.removeListener(onNavigated);
    window.removeEventListener('message', onWindowMessage);
    messagesBuffer = [];
    window.postMessage({ type : 'shutdown' }, '*');

    checkForVidomInterval = setInterval(detectVidom, 1000);
    detectVidom();
}

function detectVidom() {
    checkForVidom(pageHasVidom => {
        if(pageHasVidom) {
            clearInterval(checkForVidomInterval);
            port = chrome.runtime.connect({
                name : '' + chrome.devtools.inspectedWindow.tabId
            });
            port.onMessage.addListener(onPortMessage);
        }
    });
}

function inject(scriptName, done) {
    const src = `
        var script = document.constructor.prototype.createElement.call(document, 'script');
        script.src = "${scriptName}";
        document.documentElement.appendChild(script);
        script.parentNode.removeChild(script);
        `;

    chrome.devtools.inspectedWindow.eval(src, function(res, err) {
        if(err) {
            console.log(err);
        }

        done();
    });
}
