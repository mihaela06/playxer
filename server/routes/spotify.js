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

router.post("/get_followed_artists", loadTokens, (req, res) => {
    console.log("token access", req.accessToken);
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    console.log("after", req.body.after);
    var options = {};
    if (req.body.after == "") options = { limit: 24 };
    else options = { limit: 24, after: req.body.after };
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

router.post("/get_liked_albums", loadTokens, (req, res) => {
    console.log("token access", req.accessToken);
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    console.log("after", req.body.after);
    var options = {};
    if (req.body.after == "") options = { limit: 24 };
    else options = { limit: 24, offset: req.body.after };
    console.log(options);
    spotifyApi.getMySavedAlbums(options).then(
        function(data) {
            console.log(
                "This user is following ",
                data.body.total,
                " albums!",
                data.body.offset
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

router.post("/get_artist", loadTokens, (req, res) => {
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    var following = false;
    let artistIds = [req.body.artistId];
    spotifyApi.isFollowingArtists(artistIds).then(
        function(data) {
            following = data.body[0];
            spotifyApi.getArtist(req.body.artistId).then(
                function(data) {
                    return res.status(200).json({
                        success: true,
                        isFollowing: following,
                        spotifyData: data,
                    });
                },
                function(err) {
                    console.log("Something went wrong!", err);
                    return res.status(400).send(err);
                }
            );
        },
        function(err) {
            console.log("Something went wrong!", err);
        }
    );
});

router.post("/get_album", loadTokens, (req, res) => {
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    var saved = false;
    let albumIds = [req.body.albumId];
    spotifyApi.containsMySavedAlbums(albumIds).then(
        function(data) {
            saved = data.body[0];
            spotifyApi.getAlbum(req.body.albumId).then(
                function(data) {
                    return res.status(200).json({
                        success: true,
                        isFollowing: saved,
                        spotifyData: data,
                    });
                },
                function(err) {
                    console.log("Something went wrong!", err);
                    return res.status(400).send(err);
                }
            );
        },
        function(err) {
            console.log("Something went wrong!", err);
        }
    );
});

router.post("/change_artist_following", loadTokens, (req, res) => {
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    var following = req.body.following;
    let artistIds = [req.body.artistId];
    if (following)
        spotifyApi.unfollowArtists(artistIds).then(
            function(data) {
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
    else
        spotifyApi.followArtists(artistIds).then(
            function(data) {
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

router.post("/get_artist_albums", loadTokens, (req, res) => {
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    let artistIds = [req.body.artistId];
    console.log("id", req.body.artistId);
    console.log("offset", req.body.offset);
    spotifyApi
        .getArtistAlbums(artistIds, {
            limit: 50,
            market: "from_token",
            offset: req.body.offset,
        })
        .then(
            function(data) {
                //console.log("Album information", data.body);
                return res.status(200).json({
                    success: true,
                    spotifyData: data,
                });
            },
            function(err) {
                console.error(err);
            }
        );
});

router.get("/get_profile", loadTokens, (req, res) => {
    spotifyApi.setAccessToken(req.accessToken);
    spotifyApi.setRefreshToken(req.refreshToken);
    spotifyApi.getMe().then(
        function(data) {
            console.log("Some information about the authenticated user", data.body);
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