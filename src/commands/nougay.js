module.exports = {
  name: "nougay",
  description: "tells the truth x2",
  execute(msg) {
    msg.channel.send({ files: ["./src/imgs/nou.png"] });
  },
};
