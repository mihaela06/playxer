const express = require("express");
const router = express.Router();
const { User, Tag } = require("../models/User");
const { Playlist, Ingredient } = require("../models/Playlist");
const { auth } = require("../middleware/auth");
const {
  getTokens,
  refreshTokens,
  spotifyApi,
} = require("../middleware/spotifyAPI");

var loadTokens = [auth, getTokens, refreshTokens];

router.post("/create_playlist", loadTokens, (req, res) => {
  spotifyApi.setAccessToken(req.accessToken);
  spotifyApi.setRefreshToken(req.refreshToken);

  let tracks = new Set();
  let artists = new Set();
  let albums = new Set();
  let tags = new Set();
  let tracksURI = new Set();
  let ingredients = [];

  req.body.ingredients.map(function (ingredient) {
    ingredients.push(
      new Ingredient({
        type: ingredient.type,
        reference: ingredient.reference,
        imageUrl: ingredient.imageUrl,
      })
    );
    if (ingredient.type === "Track") tracks.add(ingredient.reference);
    if (ingredient.type === "Album") albums.add(ingredient.reference);
    if (ingredient.type === "Artist") artists.add(ingredient.reference);
    if (ingredient.type === "Tag") tags.add(ingredient.reference);
  });

  [...tags].map(function (tag) {
    req.user.content.map(function (content) {
      if (content.tag.name === tag) {
        console.log("ct", content, tag);
        if (content.contentType === "Track") tracks.add(content.contentId);
        if (content.contentType === "Album") albums.add(content.contentId);
        if (content.contentType === "Artist") artists.add(content.contentId);
      }
    });
  });

  function getArtistAlbums(artist) {
    let artistIds = [artist];
    let total = 0;
    let offset = 0;
    return spotifyApi
      .getArtistAlbums(artistIds, {
        limit: 50,
        market: "from_token",
        offset: offset,
      })
      .then(
        function (data) {
          data.body.items.map(function (a) {
            albums.add(a.id);
          });
          total = data.body.total;
          offset += 50;
          let offsets = [];
          for (let i = offset; i < total; i += 50) offsets.push(i);
          return (promises = offsets.map(function (off) {
            return spotifyApi
              .getArtistAlbums(artistIds, {
                limit: 50,
                market: "from_token",
                offset: off,
              })
              .then(function (data) {
                return data.body.items;
              })
              .catch(function (err) {
                console.log("couldn't get albums", err);
                return [];
              });
          }));
        },
        function (err) {
          console.error(err);
          return [];
        }
      );
  }

  function getAlbumsTracks(albums) {
    let tracks = [];
    return spotifyApi
      .getAlbums(albums, {
        market: "from_token",
      })
      .then(
        function (data) {
          data.body.albums.map(function (a) {
            a.tracks.items.map(function (track) {
              tracks.push(track.id);
            });
          });
          return tracks;
        },
        function (err) {
          console.error(err);
          return [];
        }
      );
  }

  function getTracksURI(tracks) {
    let instrumentalsKeywords = ["(inst.)", "instrumental", "(inst)"];
    let remixKeywords = ["remix", "re-edit", "remixed"];
    return spotifyApi
      .getTracks(tracks, {
        market: "from_token",
      })
      .then(
        function (data) {
          return data.body.tracks.map(function (t) {
            if (
              (!req.body.checkInstrumentals ||
                (req.body.checkInstrumentals &&
                  !instrumentalsKeywords.some((el) =>
                    t.name.toLowerCase().includes(el)
                  ))) &&
              (!req.body.checkRemixes ||
                (req.body.checkRemixes &&
                  !remixKeywords.some((el) =>
                    t.name.toLowerCase().includes(el)
                  )))
            ) {
              return t.uri;
            } else return null;
          });
        },
        function (err) {
          console.error(err);
          return null;
        }
      );
  }

  var artistMainPromises = [...artists].map(function (artist) {
    return getArtistAlbums(artist);
  });

  Promise.all(artistMainPromises).then(function (mainResults) {
    var artistPromises = [];
    mainResults.map(function (results) {
      artistPromises.push(...results);
    });

    console.log(artistPromises);

    Promise.all(artistPromises).then(function (artistResults) {
      artistResults.map(function (result) {
        albums.add(...result);
      });

      let albumsSubarrays = [];
      for (let i = 0; i < albums.size; i += 20)
        albumsSubarrays.push([...albums].slice(i, i + 20));

      var albumPromises = albumsSubarrays.map(function (albumSubarray) {
        return getAlbumsTracks(albumSubarray);
      });

      Promise.all(albumPromises).then(function (albumResults) {
        albumResults.map(function (result) {
          result.forEach((item) => tracks.add(item));
        });

        let tracksSubarrays = [];
        for (let i = 0; i < tracks.size; i += 50)
          tracksSubarrays.push([...tracks].slice(i, i + 50));

        var trackPromises = tracksSubarrays.map(function (trackSubarray) {
          return getTracksURI(trackSubarray);
        });

        Promise.all(trackPromises).then(function (results) {
          results.map(function (result) {
            result.forEach((item) => {
              if (item) tracksURI.add(item);
            });
          });

          console.log("tracksUri", tracksURI);

          let playlist = new Playlist({
            userId: req.user._id,
            ingredients: ingredients,
            noRemixes: req.body.checkRemixes,
            noInstrumentals: req.body.checkInstrumentals,
            name: req.body.playlistName,
            description: req.body.playlistDescription,
            public: req.body.publicPlaylist,
          });

          playlist.save((err, doc) => {
            if (err) return res.json({ success: false, err });
            spotifyApi
              .createPlaylist(playlist.name, {
                description: playlist.description,
                public: playlist.public,
              })
              .then(
                function (data) {
                  let playlistId = data.body.id;

                  let tracksURISubarrays = [];
                  for (let i = 0; i < tracksURI.size; i += 100)
                    tracksURISubarrays.push([...tracksURI].slice(i, i + 100));

                  var addURIPromises = tracksURISubarrays.map(function (uris) {
                    return spotifyApi
                      .addTracksToPlaylist(playlistId, uris)
                      .then(
                        function (data) {
                          console.log("Added tracks to playlist!", data);
                          return true;
                        },
                        function (err) {
                          console.log("Something went wrong!", err);
                          return false;
                        }
                      );
                  });

                  Promise.all(addURIPromises).then(function (results) {
                    var success = true;
                    results.forEach((res) => (success = success && res));
                    if (success) {
                      playlist.playlistId = playlistId;
                      playlist.save();
                      return res.status(200).json({
                        success: true,
                        playlist: playlist,
                        playlistId: playlistId,
                      });
                    } else
                      return res.status(400).json({
                        success: false,
                      });
                  });
                },
                function (err) {
                  console.log("Something went wrong!", err);
                  return res.json({ success: false, err });
                }
              );
          });
        });
      });
    });
  });
});

router.post("/get_playlist", loadTokens, (req, res) => {
  spotifyApi.setAccessToken(req.accessToken);
  spotifyApi.setRefreshToken(req.refreshToken);

  var tracks = [];

  Playlist.findOne({ playlistId: req.body.playlistId }, (err, playlist) => {
    if (err) return res.json({ success: false, err });

    function getTracks(offset) {
      return spotifyApi
        .getPlaylistTracks(req.body.playlistId, {
          offset: offset,
        })
        .then(
          function (data) {
            return data.body.items;
          },
          function (err) {
            console.log(err);
            return [];
          }
        );
    }

    spotifyApi.getPlaylist(req.body.playlistId).then(
      function (data) {
        tracks.push(...data.body.tracks.items);
        if (tracks.length < data.body.tracks.total) {
          var offsets = [];
          for (let i = 100; i < data.body.tracks.total; i += 100)
            offsets.push(i);
          var promises = offsets.map(function (offset) {
            return getTracks(offset);
          });

          Promise.all(promises).then(function (results) {
            results.map(function (result) {
              tracks.push(...result);
            });

            return res.status(200).json({
              success: true,
              playlist: playlist,
              tracks: tracks,
            });
          });
        } else {
          return res.status(200).json({
            playlist: playlist,
            success: true,
            tracks: tracks,
          });
        }
      },
      function (err) {
        return res.json({ success: false, err });
      }
    );
  });
});

module.exports = router;
