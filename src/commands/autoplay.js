const puppeteer = require("puppeteer");
module.exports = {
  name: "autoplay",
  searchAutoPlay(queue) {
    link = queue[0].link;
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.goto(link);

        setTimeout(() => {
          page.keyboard.down("Shift");
          page.keyboard.press("N");
          page.keyboard.up("Shift");
        }, 1500);
        setTimeout(async () => {
          const autoPlaySong = page.url();
          resolve(autoPlaySong);
        }, 2500);
      } catch (error) {
        console.log("no ok");
      }
    });
  },
};
