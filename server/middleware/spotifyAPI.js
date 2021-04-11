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
      function (data) {
        console.log(data);
        console.log("The token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);
        console.log("The refresh token is " + data.body["refresh_token"]);

        User.findOneAndUpdate(
          { _id: id },
          {
            accessToken: data.body["access_token"],
            refreshToken: data.body["refresh_token"],
            connectedSpotify: true,
          },
          (err, doc) => {
            if (err) return res.json({ success: false, err });
          }
        );
        req.connectedSpotify = true;
        next();
      },
      function (err) {
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

module.exports = { exchangeCode, getTokens, spotifyApi };
