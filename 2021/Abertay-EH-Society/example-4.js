const puppeteer = require("puppeteer");
const fs = require("fs");

const testUrl = "https://pupitest.tiiny.site/";
const monkeyPatch = fs.readFileSync("./proxy.js","utf8"); 

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    
  await page.on("console", (message) => {
    if(message.text().includes("PROXIED")){
       console.log("[*] " + message.text().replace("PROXIED-", "")); 
    }
  });
  
  await page.evaluateOnNewDocument(monkeyPatch);
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
   
  await page.waitForTimeout(1000);
  await page.close();    
    
  await browser.close();
})();