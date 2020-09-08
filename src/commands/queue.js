const Youtube = require("simple-youtube-api");
const youtube = new Youtube("AIzaSyAMPHm6VCHUa6el51sKU05OpLkL1Ge315w");
// api 2 AIzaSyAZu0Qhlz_kVx9W1E2EVeGVTTZxym5WtxI
module.exports = {
  name: "queue",
  description: "searches & plays youtube videos",
  execute(msg, args, yt, connection, queue) {
    return new Promise((resolve, reject) => {
      youtube
        .searchVideos(args, 4)
        .then((results) => {
          msg.channel.send(`Added  ${results[0].title} to queue`);
          resolve({ code: 200 });
          queue.push(results[0].url);
        })

        .catch((error) => {
          console.log(error);
          reject({ code: 400 });
        });
    });
  },
};
