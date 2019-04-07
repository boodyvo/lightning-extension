import axios from "axios/index";
import https from "https";
import { types } from "general";

const URL = "https://192.168.0.104:8080/v1";

export default class Lnd {
    constructor(url = URL) {
        const httpsAgent = new https.Agent({ rejectUnauthorised: false });
        this.api = axios.create({
            baseURL: url,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            httpsAgent
        });
    }

    async getInfo() {
        return this.api.get("/getinfo");
    }

    async walletBalance() {
        return this.api.get("/balance/channels");
    }

    async payInvoice(args) {
        return this.api.post("/channels/transactions", {
            payment_request: args.payment_request,
        });
    }

    async signMessage(args) {
        return this.api.post("/signmessage", {
            msg: Buffer.from(args.msg.toString()).toString('base64'),
        });
    }

    async checkInvoice(args) {
        console.log("Will check inveoice", args);
        return this.api.get(`/invoice/${args.r_hash_str}`);
    }

    async verifyMessage(args) {
        return this.api.post("/verifymessage", {
            msg: args.msg,
            signature: args.signature,
        });
    }

    async addInvoice(args) {
        let body = {
            amt: args.amt,
        };
        if (args.memo) {
            body.memo = args.memo;
        }
        return this.api.post("/invoices", body);
    }

    async call(type, args) {
        switch(type) {
            case types.getInfo:
                return this.getInfo();
            case types.walletBalance:
                return this.walletBalance();
            case types.addInvoice:
                return this.addInvoice(args);
            case types.payInvoice:
                return this.payInvoice(args);
            case types.signMessage:
                return this.signMessage(args);
            case types.verifyMessage:
                return this.verifyMessage(args);
            case types.checkInvoice:
                return this.checkInvoice(args);

        }
    }
}
