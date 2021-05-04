const puppeteer = require("puppeteer");
const fs = require("fs");

const testUrl = "https://pupitest.tiiny.site/";
const monkeyPatch = fs.readFileSync("./monkeypatch.js","utf8"); 

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    
  await page.on("console", (message) => {
    if(message.text().includes("PAYLOAD-ID")){
       console.log("[*] Payload detected: " + message.text()); 
    }
  });
    
  await page.evaluateOnNewDocument(monkeyPatch);
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
  
  const testPayload = "<img src=x onerror=alert('PAYLOAD-ID')>";  
    
  await page.type("#reflective-input", testPayload);
  await page.click("#add-input");    
  await page.waitForTimeout(1000);
  await page.close();    
    
  await browser.close();
})();