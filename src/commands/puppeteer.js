const puppeteer = require("puppeteer");
module.exports = {
  name: "puppeteer",
  getLink(args) {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto("https://www.youtube.com/results?search_query=" + args);
        const song = await page.evaluate(() => {
          const link = document.querySelector("#video-title").href;
          const title = document.querySelector("#video-title").innerText;
          return { link, title };
        });
        resolve(song);
        await browser.close();
      } catch (error) {
        reject(error);
      }
    });
  },
};
