import browser from "webextension-polyfill";
// const browser = require("webextension-polyfill");

import Lnd from "lnd";
import { consts } from "general";

const lnd = new Lnd();

browser.runtime.onInstalled.addListener(function() {
    console.log("Lightning extension is installed");
});

browser.runtime.onMessage.addListener(function(request) {
    console.log("Message", request);
    if (!request || request.application !== consts.extensionName)
        return;

    const response = lnd.call(request.type, request.args);

    return response.then(data => {
        console.log("Promise will return", request.uuid);
        return {
            uuid: request.uuid,
            data
        }
    });
});
