const puppeteer = require("puppeteer");
module.exports = {
  name: "autoplay",
  searchAutoPlay({ queue, playedSongs }) {
    const link = queue[0].url;
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.goto(link);

        skipSong(page, browser);
      } catch (error) {
        console.log(error);
      }
      function skipSong(page, browser) {
        setTimeout(() => {
          page.keyboard.down("Shift");
          page.keyboard.press("N");
          page.keyboard.up("Shift");
        }, 1500);
        setTimeout(async () => {
          const autoPlaySong = page.url();

          if (hasBeenPlayed(autoPlaySong)) {
            console.log("cancion repetida, pasando a la siguiente...");
            skipSong(page, browser);
          } else {
            browser.close();
            resolve(autoPlaySong);
          }
        }, 2500);
      }
    });
    function hasBeenPlayed(newSong) {
      for (iteratedSong of playedSongs) {
        return iteratedSong.url === newSong;
      }
    }
  },
};
