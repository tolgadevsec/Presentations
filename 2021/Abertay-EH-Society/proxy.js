// Source: https://air.ghost.io/debugging-websockets-using-js-proxy-object/
window.WebSocket = new Proxy(window.WebSocket, {
    construct: function(target, args){
        console.log("PROXIED-WS-CONSTRUCTOR: " + args.toString());
        
        const instance = new target(...args);
        
        const sendProxy = new Proxy(instance.send, {
          apply: function(target, thisArg, args) {
            console.log("PROXIED-WS-SEND: " + args.toString());
            target.apply(thisArg, args);
          }
        });

        instance.send = sendProxy;
        
        return instance;
    }
});