import {wsRoot} from '../server';
const watchUrl = wsRoot + '/watch';
const reconnectInterval = 2000;

class Messenger {
    listeners;
    onCloseFuc;
    onConnectFunc;

    constructor() {
        this.listeners = [];
    }

    watch(listener) {
        this.listeners.push(listener);
    }

    startWatch() {
        let that = this;
        this.ws = new WebSocket(watchUrl);
        this.ws.onmessage = event => {
            let msg = JSON.parse(event.data);
            that.listeners.forEach(l => l(msg));
        };
        
        this.ws.onclose = event => {
            if (event.type === "close") {
                if (this.onCloseFuc) {
                    this.onCloseFuc();
                }
            }
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(this.startWatch.bind(that), reconnectInterval);
        };

        this.ws.onopen = e => {
            if (this.onConnectFunc) {
                this.onConnectFunc();
            }
        }
    }

    stopWatch() {
        clearTimeout(this.reconnectTimer);
        this.ws.onclose = e => { }; //prevent auto reload
        this.ws.close();
    }

    onConnected(func) {
        this.onConnectFunc = func;
    }

    onClosed(func) {
        this.onCloseFuc = func;
    }
}

const messenger = new Messenger();
export default messenger;