// Source: https://stackoverflow.com/a/39561071
var originalSet = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML").set;
  
Object.defineProperty(Element.prototype, "innerHTML", {
    set: function (value) {
        console.log(value);
        
        return originalSet.call(this, value);
    }
});