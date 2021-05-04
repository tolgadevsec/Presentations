const puppeteer = require("puppeteer");

const testUrl = "https://pupitest.tiiny.site/";

const urlAllowList = [
    "https://code.jquery.com/jquery-3.6.0.slim.min.js"
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
    
  await page.setRequestInterception(true);
    
  await page.on("request", (request) => {
     if(request.url() !== testUrl && !urlAllowList.includes(request.url())){
        console.log("[*] Request blocked: " + request.url()); 
        request.abort(); 
     }
     else { request.continue(); }
  });
  
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
  
  await page.waitForTimeout(1000);
  await page.close();    
    
  await browser.close();
})();