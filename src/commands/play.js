const Youtube = require("simple-youtube-api");
const youtube = new Youtube("AIzaSyAZu0Qhlz_kVx9W1E2EVeGVTTZxym5WtxI");

module.exports = {
  name: "play",
  description: "searches & plays youtube videos",
  execute(msg, args, yt, connection) {
    youtube
      .searchVideos(args, 4)
      .then((results) => {
        msg.channel.send(`Playing ${results[0].title} `);
        connection.play(yt(results[0].url));
      })

      .catch(console.log);
  },
};
