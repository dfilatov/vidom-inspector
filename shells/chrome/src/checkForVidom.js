export default function(done) {
    chrome.devtools.inspectedWindow.eval('typeof window.__vidom__hook__ !== "undefined"', done);
}
