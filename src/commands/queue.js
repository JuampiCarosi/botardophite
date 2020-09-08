const Youtube = require("simple-youtube-api");
const youtube = new Youtube("AIzaSyAZu0Qhlz_kVx9W1E2EVeGVTTZxym5WtxI");

module.exports = {
  name: "queue",
  description: "searches & plays youtube videos",
  execute(msg, args, yt, connection, queue) {
    youtube
      .searchVideos(args, 4)
      .then((results) => {
        msg.channel.send(`Added  ${results[0].title} to queue`);
        queue.push(results[0].url);
        console.log(queue[0]);
      })

      .catch(console.log);
  },
};
