import { consts, types } from "general";
import uuid from "uuid/v4";

const DEFAULT_AMOUNT = 1;

export default class LightningProvider {
    async signMessage(message) {
        return this.request(types.signMessage, {
            msg: message,
        });
    }

    async verifyMessage(message, signature) {
        return this.request(types.verifyMessage, {
            msg: message,
            signature,
        })
    }

    async sendPayment(paymentRequest) {
        return this.request(types.payInvoice, {
            payment_request: paymentRequest,
        });
    }

    async getInfo() {
        return this.request(types.getInfo)
    }

    async makeInvoice(amount = DEFAULT_AMOUNT, memo = "") {
        return this.request(types.addInvoice, {
            amt: amount,
            memo,
        });
    }

    async request(type, args = {}) {
        const customuuid = uuid();
        return new Promise((resolve, reject) => {
            window.postMessage({
                application: consts.extensionName,
                custom: true,
                uuid: customuuid,
                type,
                args,
            }, '*');

            function handleWindowMessage(e) {
                if (!e.data ||
                    e.data.application !== consts.extensionName ||
                    e.data.custom ||
                    e.data.uuid !== customuuid) {
                    return;
                }
                if (e.data.error) {
                    reject(e.data.error);
                } else {
                    resolve(e.data.data);
                }
                window.removeEventListener('message', handleWindowMessage);
            }

            window.addEventListener('message', handleWindowMessage);
        });
    }
}