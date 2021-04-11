var SpotifyWebApi = require("spotify-web-api-node");
const config = require("./config/key");
const { User } = require("./models/User");

var credentials = {
    clientId: config.clientID,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectURL,
};

var spotifyApi = new SpotifyWebApi(credentials);

let exchangeCode = (req, res) => {
    let id = req.body.userID;
    let code = req.body.code;
    console.log(id);
    //console.log(req);

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

                // Set the access token on the API object to use it in later calls
                //spotifyApi.setAccessToken(data.body["access_token"]);
                //spotifyApi.setRefreshToken(data.body["refresh_token"]);

                User.findOneAndUpdate({ _id: id }, {
                        accessToken: data.body["access_token"],
                        refreshToken: data.body["refresh_token"],
                    },
                    (err, doc) => {
                        if (err) return res.json({ success: false, err });
                    }
                );
                return res.status(200).json({
                    success: true,
                    accessToken: data.body["access_token"],
                    connectedSpotify: true,
                });
            },
            function(err) {
                console.log("Something went wrong!", err);
            }
        );
    });
};

module.exports = { exchangeCode };