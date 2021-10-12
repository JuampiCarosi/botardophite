const puppeteer = require("puppeteer");
module.exports = {
  name: "puppeteer",
  execute(args, type = "name") {
    return new Promise(async (resolve, reject) => {
      try {
        const browser = await puppeteer.launch({
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          headless: true,
        });
        const page = await browser.newPage();
        await page.goto(
          "https://www.youtube.com/results?search_query=" +
            (type === "name" ? args : args.split("=")[1])
        );

        const song = await page.evaluate(async () => {
          const titleLabel = document.querySelector("#video-title").ariaLabel;
          const minutes = (titleLabel.match(/([0-9]+) minute/) || [0, 0])[1];
          const seconds = (titleLabel.match(/([0-9]+) second/) || [0, 0])[1];

          const song = {
            url: document.querySelector("#video-title").href,
            title: document.querySelector("#video-title").innerText,
            duration: (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0),
          };

          return song;
        });
        browser.close();
        resolve(song);
      } catch (error) {
        reject(error);
      }
    });
  },
};
