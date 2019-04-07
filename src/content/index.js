import browser from "webextension-polyfill";
import { consts } from "general";

console.log("Lightning extension is running");

function injectScript() {
    try {
        if (!document)
            throw new Error("No document");
        const container = document.head || document.documentElement;
        if (!container)
            throw new Error("No container element");
        const scriptEl = document.createElement("script");
        scriptEl.setAttribute("async", "false");
        scriptEl.setAttribute("type", "text/javascript");
        scriptEl.src = chrome.runtime.getURL("inpage.js");
        container.appendChild(scriptEl);
        console.log("Successfully injected script");
    } catch(err) {
        console.error("Failed to inject index.js", err);
    }
}

injectScript();

window.addEventListener("message", async (e) => {
    if (e.source !== window) {
        return;
    }

    if (e.data && e.data.application === consts.extensionName && !e.data.response) {

        browser.runtime.sendMessage(e.data).then(response => {
            window.postMessage({
                application: consts.extensionName,
                response: true,
                error: response.error,
                data: response.data,
                uuid: response.uuid,
            }, '*');
        });
    }
});
