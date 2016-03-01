const ports = {};

chrome.runtime.onConnect.addListener(port => {
    let tab = null,
        name = null;

    if(isNumeric(port.name)) {
        tab = port.name;
        name = 'inspector';
        installContentScript(+tab);
    }
    else {
        tab = port.sender.tab.id;
        name = 'content';
    }

    (ports[tab] || (ports[tab] = {}))[name] = port;

    if(ports[tab].inspector && ports[tab].content) {
        ports[tab].inspector.onMessage.addListener(onContentMessage);

        function onContentMessage() {
            ports[tab].inspector.onMessage.removeListener(onContentMessage);
            installContextMenu();
        }

        function onDisconnect() {
            ports[tab].inspector.onMessage.removeListener(onContentMessage);
            uninstallContextMenu();
        }

        ports[tab].content.onDisconnect.addListener(onDisconnect);
        ports[tab].inspector.onDisconnect.addListener(onDisconnect);

        connectPorts(ports[tab].inspector, ports[tab].content, tab);
    }
});

function isNumeric(str) {
    return +str + '' === str;
}

function installContentScript(tabId) {
    chrome.tabs.executeScript(tabId, { file : '/build/content.js' });
}

function connectPorts(port1, port2, tab) {
    function onPort1Message(message) {
        port2.postMessage(message);
    }

    function onPort2Message(message) {
        port1.postMessage(message);
    }

    port1.onMessage.addListener(onPort1Message);
    port2.onMessage.addListener(onPort2Message);

    function shutdown() {
        port1.onMessage.removeListener(onPort1Message);
        port2.onMessage.removeListener(onPort2Message);
        port1.disconnect();
        port2.disconnect();
        delete ports[tab];
    }

    port1.onDisconnect.addListener(shutdown);
    port2.onDisconnect.addListener(shutdown);

    port1.postMessage({ type : 'connect' });
    port2.postMessage({ type : 'connect' });
}

function installContextMenu() {
    chrome.contextMenus.create({
        id : 'vidom-inspector',
        title : 'Inspect vidom',
        contexts : ['page', 'editable', 'image', 'video', 'audio', 'selection']
    }, () => {
        chrome.contextMenus.onClicked.addListener(onContextMenuClick);
    });
}

function uninstallContextMenu() {
    chrome.contextMenus.onClicked.removeListener(onContextMenuClick);
    chrome.contextMenus.remove('vidom-inspector');
}

function onContextMenuClick(info) {
    if(info.menuItemId === 'vidom-inspector') {
        console.log(info);
    }
}
