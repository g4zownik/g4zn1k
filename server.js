require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

async function getAccessToken() {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

app.get("/spotify", async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 204 || !response.data) {
      return res.json({
        playing: false,
      });
    }

    const song = response.data.item;

    res.json({
      playing: response.data.is_playing,
      title: song.name,
      artist: song.artists.map((a) => a.name).join(", "),
      album: song.album.name,
      image: song.album.images[0].url,
      url: song.external_urls.spotify,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);

    res.status(500).json({
      error: "Failed to fetch spotify data",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// faceit
app.get("/faceit", async (req, res) => {
  try {

    const response = await axios.get(
      "https://open.faceit.com/data/v4/players?nickname=G4ZOWANY",
      {
        headers: {
          Authorization: `Bearer ${process.env.FACEIT_API_KEY}`
        }
      }
    );

return res.json({
  level: response.data.games.cs2.skill_level,
  elo: response.data.games.cs2.faceit_elo,
  country: response.data.country
});

  } catch (err) {

    console.log(err.response?.data || err.message);

    res.status(500).json({
      error: "Faceit error"
    });

  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});