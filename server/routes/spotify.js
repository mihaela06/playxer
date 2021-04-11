const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { getTokens } = require("../middleware/spotifyAPI");
const { auth } = require("../middleware/auth");

var loadTokens = [auth, getTokens];

router.get("/get_followed_artists", loadTokens, (req, res) => {

    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    spotifyApi.getFollowedArtists({ limit: 1 }).then(
        function(data) {
            console.log(
                "This user is following ",
                data.body.artists.total,
                " artists!"
            );
            return res.status(200).json({
                success: true,
                spotifyData: data,
            })
        },
        function(err) {
            console.log("Something went wrong!", err);
            return res.status(400).send(err);
        }
    );
});

module.exports = router;