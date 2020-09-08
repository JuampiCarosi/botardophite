const Youtube = require("simple-youtube-api");
const youtube = new Youtube("AIzaSyAZu0Qhlz_kVx9W1E2EVeGVTTZxym5WtxI");

module.exports = {
  name: "playlist",
  description: "queue youtube playlists",
  execute(msg, args) {
    args = String(args);

    youtube.getPlaylist(args).then((playlist) => {
      msg.channel.send(`Playing ${playlist.title}`);
      playlist
        .getVideos()

        .then((videos) => {
          console.log(playlist.videos[0].url);
          msg.channel.send(
            `This playlist has ${
              videos.length === 50 ? "50+" : videos.length
            } videos.`
          );
        })

        .catch(function () {
          msg.say("Playlist is either private or it does not exist!");
          return;
        });
    });
  },
};
