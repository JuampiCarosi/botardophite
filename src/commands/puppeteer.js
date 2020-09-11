const puppeteer = require("puppeteer");
module.exports = {
  name: "puppeteer",
  getLink(args, type = "name") {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(
          "https://www.youtube.com/results?search_query=" +
            (type === "name" ? args : args.split("=")[1])
        );

        const song = await page.evaluate(async () => {
          const song = {};
          song.link = document.querySelector("#video-title").href;
          song.title = document.querySelector("#video-title").innerText;
          const titleLabel = document.querySelector("#video-title").ariaLabel;
          const minutes = (titleLabel.match(/([0-9]+) minute/) || [0, 0])[1];
          const seconds = (titleLabel.match(/([0-9]+) second/) || [0, 0])[1];
          song.duration =
            (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);

          return song;
        });

        resolve(song);
        //  await browser.close();
      } catch (error) {
        reject(error);
      }
    });
  },
};
