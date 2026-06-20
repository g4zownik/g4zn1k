const axios = require("axios");

module.exports = async (req, res) => {

  try {

    const tokenResponse =
      await axios.post(
        "https://accounts.spotify.com/api/token",

        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token:
            process.env.SPOTIFY_REFRESH_TOKEN,
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

            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

    const accessToken =
      tokenResponse.data.access_token;

    /* ========================= */
    /* CURRENT SONG */
    /* ========================= */

    const current =
      await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },

          validateStatus: false,
        }
      );

    if (
      current.status !== 204 &&
      current.data &&
      current.data.item
    ) {

      const song =
        current.data.item;

      return res.json({

        playing:
          current.data.is_playing,

        paused:
          !current.data.is_playing,

        offline: false,

        title:
          song.name,

        artist:
          song.artists
            .map(a => a.name)
            .join(", "),

        album:
          song.album.name,

        image:
          song.album.images[0]?.url,

        url:
          song.external_urls.spotify,

        progress:
          current.data.progress_ms,

        duration:
          song.duration_ms,

      });

    }

    /* ========================= */
    /* RECENTLY PLAYED */
    /* ========================= */

    const recent =
      await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },

          validateStatus: false,
        }
      );
      console.log(recent.data);

      console.log(
  "RECENT STATUS:",
  recent.status
);

console.log(
  "RECENT DATA:",
  JSON.stringify(recent.data)
);
    if (
      recent.status !== 200 ||
      !recent.data ||
      !recent.data.items ||
      recent.data.items.length === 0
    ) {

      return res.json({

        playing: false,
        paused: false,
        offline: false,

      });

    }
    const last =
      recent.data.items[0];

    const song =
      last.track;

    return res.json({

      playing: false,
      paused: false,
      offline: true,

      title:
        song.name,

      artist:
        song.artists
          .map(a => a.name)
          .join(", "),

      album:
        song.album.name,

      image:
        song.album.images[0]?.url,

      url:
        song.external_urls.spotify,

      playedAt:
        last.played_at,

      duration:
        song.duration_ms,

    });

  } catch (err) {

  console.log(
    "SPOTIFY ERROR:"
  );

  console.log(
    err.response?.data
  );

  console.log(
    err.response?.status
  );

  return res.status(500).json({
    error: err.response?.data || err.message
  });

}

};