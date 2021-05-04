const puppeteer = require("puppeteer");
const fs = require("fs");
const resemble = require("resemblejs");

const testUrl = "https://pupitest.tiiny.site/";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(testUrl, { waitUntil: "domcontentloaded" });
  await page.click("#show-hidden");    
  await page.waitForTimeout(1000);    
  await page.screenshot({path: "./current-screenshot.png"});     
  await page.waitForTimeout(1000);
  await page.close();    
    
  await browser.close();
    
  resemble("./original-screenshot.png").compareTo("./current-screenshot.png").onComplete(
    async (data) => {
        if (data.misMatchPercentage > 0) {
            console.log(data.misMatchPercentage);
            console.log("[*] Changes in UI detected");
            await fs.writeFile("./diff-screenshot.png", data.getBuffer(), (error) => { if(error){ throw error; }});
            await fs.unlink("./current-screenshot.png", (error) => { if(error){ throw error; }});
        }
    }
  );
})();