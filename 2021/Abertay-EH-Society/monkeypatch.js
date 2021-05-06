// Source: https://stackoverflow.com/a/39561071
const originalSet = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML").set;

const inlineHandlers = [
    "onerror"
];

const domParser = new DOMParser();
  
Object.defineProperty(Element.prototype, "innerHTML", {
    set: function (value) {
        //console.log(value);

        // Source: https://gomakethings.com/how-saferinnerhtml-works/
        let parsedElement = domParser.parseFromString(value, "text/html");
        if(parsedElement.body && parsedElement.body.hasChildNodes){
            let detectedInlineHandlers = [];
            Array.from(parsedElement.body.childNodes).forEach((childNode) => {
                if(childNode.hasAttributes()){
                    detectedInlineHandlers = inlineHandlers.filter((inlineHanlder) => childNode.attributes.getNamedItem(inlineHanlder) !== null);
                }
            });

            if(detectedInlineHandlers.length > 0){
                console.log("[INNERHTML] Detected inline event handlers '" + detectedInlineHandlers.toString() + "' in " + value);
            }
        }
        
        return originalSet.call(this, value);
    }
});
