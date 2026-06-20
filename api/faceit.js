const axios = require("axios");

module.exports = async (req, res) => {

  try {

    const player = await axios.get(
      "https://open.faceit.com/data/v4/players?nickname=G4ZOWANY",
      {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
        }
      }
    );

    const stats = await axios.get(
      `https://open.faceit.com/data/v4/players/${player.data.player_id}/stats/cs2`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
        }
      }
    );

console.log("STATS TEST");
console.log(stats.data);

return res.json({
  level: player.data.games.cs2.skill_level,
  elo: player.data.games.cs2.faceit_elo,
  country: player.data.country,
  avatar: player.data.avatar,

  kd: stats.data.lifetime["Average K/D Ratio"],
  winRate: stats.data.lifetime["Win Rate %"],
  matches: stats.data.lifetime["Matches"],
  recent: stats.data.lifetime["Recent Results"]
});

  } catch (err) {
  console.log("FACEIT ERROR:");
  console.log(err.response?.data || err.message);

  return res.status(500).json({
    error: "Faceit API error"
  });
}

};