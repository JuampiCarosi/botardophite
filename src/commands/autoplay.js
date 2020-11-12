const puppeteer = require("puppeteer");
module.exports = {
  name: "autoplay",
  searchAutoPlay(queue) {
    link = queue[0].link;
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          headless: true,
        });
        const page = await browser.newPage();
        await page.goto(link);

        page.click(".ytp-next-button");
        setTimeout(async () => {
          autoPlaySong = page.url();
          resolve(autoPlaySong);
        }, 1500);
      } catch (error) {
        console.log("no ok");
      }
    });
  },
};
