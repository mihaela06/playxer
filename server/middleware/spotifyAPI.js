var SpotifyWebApi = require("spotify-web-api-node");
const config = require("../config/key");
const { User } = require("../models/User");

var credentials = {
    clientId: config.clientID,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectURL,
};

var spotifyApi = new SpotifyWebApi(credentials);

let exchangeCode = (req, res, next) => {
    let id = req.body.userID;
    let code = req.body.code;

    User.findOne({ _id: id }, (err, user) => {
        console.log("ID ", id);
        if (!user)
            return res.json({
                success: false,
                message: "User not found",
            });
        spotifyApi.authorizationCodeGrant(code).then(
            function(data) {
                console.log(data);
                console.log("The token expires in " + data.body["expires_in"]);
                console.log("The access token is " + data.body["access_token"]);
                console.log("The refresh token is " + data.body["refresh_token"]);

                User.findOneAndUpdate({ _id: id }, {
                        accessToken: data.body["access_token"],
                        refreshToken: data.body["refresh_token"],
                        connectedSpotify: true,
                        accessTokenExp: data.body["expires_in"],
                        accessTokenTimestamp: Math.floor(new Date().getTime() / 1000),
                    },
                    (err, doc) => {
                        if (err) return res.json({ success: false, err });
                    }
                );
                req.connectedSpotify = true;
                next();
            },
            function(err) {
                console.log("Something went wrong!", err);
            }
        );
    });
};

let getTokens = (req, res, next) => {
    let id = req.user._id;

    User.findOne({ _id: id }, (err, user) => {
        if (!user)
            return res.json({
                success: false,
                message: "User not found",
            });

        req.accessToken = user.accessToken;
        req.refreshToken = user.refreshToken;

        next();
    });
};

let refreshTokens = (req, res, next) => {
    let currentTimestamp = Math.floor(new Date().getTime() / 1000);
    console.log(currentTimestamp);
    console.log(req.user.accessTokenExp + req.user.accessTokenTimestamp);
    if (
        req.user.accessTokenExp + req.user.accessTokenTimestamp <=
        currentTimestamp - 10
    ) {
        spotifyApi.setRefreshToken(req.refreshToken);
        spotifyApi.refreshAccessToken().then(
            function(data) {
                console.log("The access token has been refreshed!");
                console.log("old token ", req.accessToken);
                req.accessToken = data.body["access_token"];
                console.log("new token ", req.accessToken);

                User.findOneAndUpdate({ _id: req.user._id }, {
                        accessToken: data.body["access_token"],
                        accessTokenExp: data.body["expires_in"],
                        accessTokenTimestamp: Math.floor(new Date().getTime() / 1000),
                    },
                    (err, doc) => {
                        if (err)
                            return res.json({
                                success: false,
                                message: "User not found",
                                error: err,
                            });
                    }
                );
                req.refreshed = true;
                next();
            },
            function(err) {
                req.refreshed = false;
                console.log("Could not refresh access token", err);
                return res.json({
                    success: false,
                    message: "Could not refresh access token",
                    error: err,
                });
            }
        );
    }
    next();
};

module.exports = { exchangeCode, getTokens, refreshTokens, spotifyApi };