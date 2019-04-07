import LightningProvider from "lightning-provider";

if (document.currentScript) {
    console.log("Will set webln");
    window.webln = new LightningProvider();
} else {
    console.warn("Failed to load lightning lightning-provider");
}
