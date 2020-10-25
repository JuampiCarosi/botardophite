const ytsr = require("ytsr");
module.exports = {
  name: "search",
  async getLink(queue, args) {
    return new Promise(async (resolve, reject) => {
      try {
        const song = await ytsr(args, { limit: 1 });
        resolve(song.items[0]);
      } catch (error) {
        reject(error);
      }
    });
  },
};
