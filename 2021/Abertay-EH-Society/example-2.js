const puppeteer = require("puppeteer");

const testUrl = "https://pupitest.tiiny.site/";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    
  await page.on("dialog", (dialog) => {
    if(dialog.message().includes("PAYLOAD-ID")){
        console.log("[*] Payload executed: " + dialog.message()); 
    }
    dialog.dismiss();
  });
    
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
  
  const testPayload = "<img src=x onerror=alert('PAYLOAD-ID')>";
 
  await page.type("#reflective-input", testPayload);
  await page.click("#add-input");    
  await page.waitForTimeout(1000);
  await page.close();    
    
  await browser.close();
})();