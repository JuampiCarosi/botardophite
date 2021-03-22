const puppeteer = require("puppeteer");
module.exports = {
  name: "autoplay",
  searchAutoPlay(queue, playedSongs) {
    link = queue[0].link;
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.goto(link);

        skipSong(page, browser);
      } catch (error) {
        console.log("no ok");
      }
      function skipSong(page, browser) {
        setTimeout(() => {
          page.keyboard.down("Shift");
          page.keyboard.press("N");
          page.keyboard.up("Shift");
        }, 1500);
        setTimeout(async () => {
          const autoPlaySong = page.url();
          if (playedSongs.includes(autoPlaySong)) {
            console.log("shit 1");
            skipSong(page, browser);
          } else {
            console.log("shit 2");
            browser.close();
            resolve(autoPlaySong);
          }
        }, 2500);
      }
    });
  },
};
