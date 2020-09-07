module.exports = {
  name: "play",
  description: "play music",
  execute(msg, cutMsg, yt, connection) {
    console.log(connection);

    connection.play(
      yt(
        "https://music.youtube.com/playlist?list=PLJwsO4Rx5k_S2VDcQ-zgWmH6vMwhyGuBZ",
        {
          volume: 0.5,
        }
      )
    );
  },
};
