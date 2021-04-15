const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const {
    getTokens,
    refreshTokens,
    spotifyApi,
} = require("../middleware/spotifyAPI");
const { auth } = require("../middleware/auth");

var loadTokens = [auth, getTokens, refreshTokens];

router.get("/get_followed_artists", loadTokens, (req, res) => {
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    //console.log("token access", req.accessToken);
    console.log("after", req.headers.after);
    var options = {};
    if (req.headers.after == "") options = { limit: 24 };
    else options = { limit: 24, after: req.headers.after };
    console.log(options);
    spotifyApi.getFollowedArtists(options).then(
        function(data) {
            console.log(
                "This user is following ",
                data.body.artists.total,
                " artists!",
                data.body.artists.cursors.after
            );
            return res.status(200).json({
                success: true,
                spotifyData: data,
            });
        },
        function(err) {
            console.log("Something went wrong!", err);
            return res.status(400).send(err);
        }
    );
});

module.exports = router;