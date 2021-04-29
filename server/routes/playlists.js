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

function getImageURL(urlArray) {
  if (!urlArray) return null;
  if (urlArray.length === 0) return null;
  if (urlArray.length === 1) return urlArray[0].url;
  return urlArray[1].url;
}

var loadTokens = [auth, getTokens, refreshTokens];

function getTracksFromIngredients(
  ingredients,
  checkInstrumentals,
  checkRemixes,
  content
) {
  let tracks = new Set();
  let artists = new Set();
  let albums = new Set();
  let tags = new Set();
  let tracksURI = new Set();

  ingredients.map(function (ingredient) {
    if (ingredient.type === "Track")
      tracks.add({ id: ingredient.reference, artist: null });
    if (ingredient.type === "Album")
      albums.add({ id: ingredient.reference, artist: null });
    if (ingredient.type === "Artist") artists.add(ingredient.reference);
    if (ingredient.type === "Tag") tags.add(ingredient.reference);
  });

  [...tags].map(function (tag) {
    content.map(function (content) {
      if (content.tag.name === tag) {
        if (content.contentType === "Track")
          tracks.add({ id: content.contentId, artist: null });
        if (content.contentType === "Album")
          albums.add({ id: content.contentId, artist: null });
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
            albums.add({ id: a.id, artist: artist });
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
                return { items: data.body.items, artist: artist };
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
    let albumsIds = [];
    albums.forEach((item) => albumsIds.push(item.id));
    return spotifyApi
      .getAlbums(albumsIds, {
        market: "from_token",
      })
      .then(
        function (data) {
          data.body.albums.map(function (a) {
            let artist = albums.find((element) => element.id === a.id).artist;
            a.tracks.items.map(function (track) {
              tracks.push({ id: track.id, artist: artist });
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

  function getTracksURI(tracks, checkInstrumentals, checkRemixes) {
    let instrumentalsKeywords = ["(inst.)", "instrumental", "(inst)", "inst."];
    let remixKeywords = ["remix", "re-edit", "remixed"];
    var tracksId = [];
    tracks.forEach((e) => tracksId.push(e.id));
    return spotifyApi
      .getTracks(tracksId, {
        market: "from_token",
      })
      .then(
        function (data) {
          return data.body.tracks.map(function (t) {
            if (
              (!checkInstrumentals ||
                (checkInstrumentals &&
                  !instrumentalsKeywords.some((el) =>
                    t.name.toLowerCase().includes(el)
                  ))) &&
              (!checkRemixes ||
                (checkRemixes &&
                  !remixKeywords.some((el) =>
                    t.name.toLowerCase().includes(el)
                  )))
            ) {
              let artist = tracks.find((tr) => tr.id === t.id)
                ? tracks.find((tr) => tr.id === t.id).artist
                : null;
              if (artist === null) return t.uri;
              else if (artist) {
                let artists = t.artists;
                if (artists.find((e) => e.id === artist)) return t.uri;
                else return null;
              }
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

  return Promise.all(artistMainPromises).then(function (mainResults) {
    var artistPromises = [];
    mainResults.map(function (results) {
      artistPromises.push(...results);
    });

    return Promise.all(artistPromises).then(function (artistResults) {
      artistResults.map(function (result) {
        var results = [];
        result.items.forEach((r) =>
          results.push({ artist: result.artist, id: r.id })
        );
        albums.add(...results);
      });

      let albumsSubarrays = [];
      for (let i = 0; i < albums.size; i += 20)
        albumsSubarrays.push([...albums].slice(i, i + 20));

      var albumPromises = albumsSubarrays.map(function (albumSubarray) {
        return getAlbumsTracks(albumSubarray);
      });

      return Promise.all(albumPromises).then(function (albumResults) {
        albumResults.map(function (result) {
          result.forEach((item) => tracks.add(item));
        });

        let tracksSubarrays = [];
        for (let i = 0; i < tracks.size; i += 50)
          tracksSubarrays.push([...tracks].slice(i, i + 50));

        var trackPromises = tracksSubarrays.map(function (trackSubarray) {
          return getTracksURI(trackSubarray, checkInstrumentals, checkRemixes);
        });

        return Promise.all(trackPromises).then(function (results) {
          results.map(function (result) {
            result.forEach((item) => {
              if (item) tracksURI.add(item);
            });
          });

          return [...tracksURI];
        });
      });
    });
  });
}

router.post("/create_playlist", loadTokens, (req, res) => {
  spotifyApi.setAccessToken(req.accessToken);
  spotifyApi.setRefreshToken(req.refreshToken);

  let ingredients = [];

  req.body.ingredients.map(function (ingredient) {
    ingredients.push(
      new Ingredient({
        type: ingredient.type,
        reference: ingredient.reference,
        imageUrl: ingredient.imageUrl,
        name: ingredient.name,
      })
    );
  });

  getTracksFromIngredients(
    ingredients,
    req.body.checkInstrumentals,
    req.body.checkRemixes,
    req.user.content
  ).then(function (tracksURI) {
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
            for (let i = 0; i < tracksURI.length; i += 100)
              tracksURISubarrays.push([...tracksURI].slice(i, i + 100));

            var addURIPromises = tracksURISubarrays.map(function (uris) {
              return spotifyApi.addTracksToPlaylist(playlistId, uris).then(
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
        let url = getImageURL(data.body.images);
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
              playlistImage: url,
            });
          });
        } else {
          return res.status(200).json({
            playlist: playlist,
            success: true,
            tracks: tracks,
            playlistImage: url,
          });
        }
      },
      function (err) {
        return res.json({ success: false, err });
      }
    );
  });
});

router.post("/edit_playlist", loadTokens, (req, res) => {
  spotifyApi.setAccessToken(req.accessToken);
  spotifyApi.setRefreshToken(req.refreshToken);

  let ingredients = [];

  req.body.ingredients.map(function (ingredient) {
    ingredients.push(
      new Ingredient({
        type: ingredient.type,
        reference: ingredient.reference,
        imageUrl: ingredient.imageUrl,
        name: ingredient.name,
      })
    );
  });

  Playlist.findOne({ playlistId: req.body.playlistId }, (err, playlist) => {
    if (err) return res.json({ success: false, err });

    playlist.noInstrumentals = req.body.checkInstrumentals;
    playlist.ingredients = ingredients;
    playlist.noRemixes = req.body.checkRemixes;
    playlist.noInstrumentals = req.body.checkInstrumentals;
    playlist.name = req.body.playlistName;
    playlist.description = req.body.playlistDescription;
    playlist.public = req.body.publicPlaylist;
    playlist.save();

    var url = "";

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

    getTracksFromIngredients(
      ingredients,
      req.body.checkInstrumentals,
      req.body.checkRemixes,
      req.user.content
    ).then(function (ingredientsURI) {
      var promiseGetTracks = spotifyApi.getPlaylist(req.body.playlistId).then(
        function (data) {
          var tracks = [];
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
                return tracks;
              });
            });
          } else return tracks;
        },
        function (err) {
          return { err: err, failed: true };
        }
      );

      promiseGetTracks.then(function (result) {
        if (!result || result.failed)
          return res.json({ success: false, err: result.err });
        var tracks = result;
        var toDel = [];
        var toAdd = [];
        tracks.forEach((t) => {
          if (!ingredientsURI.find((e) => e === t.track.uri))
            toDel.push({ uri: t.track.uri });
        });
        ingredientsURI.forEach((t) => {
          if (!tracks.find((e) => e.track.uri === t)) toAdd.push(t);
        });

        var offsetsA = [];
        var addSubarrays = [];
        for (let i = 0; i < toAdd.length; i += 100) {
          offsetsA.push(i);
          addSubarrays.push([...toAdd].slice(i, i + 100));
        }

        var offsetsD = [];
        var delSubarrays = [];
        for (let i = 0; i < toDel.length; i += 100) {
          offsetsD.push(i);
          delSubarrays.push([...toDel].slice(i, i + 100));
        }

        var promisesD = delSubarrays.map(function (a) {
          return spotifyApi
            .removeTracksFromPlaylist(req.body.playlistId, a)
            .then(
              function (data) {
                return true;
              },
              function (err) {
                return false;
              }
            );
        });

        Promise.all(promisesD).then(function (results) {
          var promisesA = addSubarrays.map(function (a) {
            return spotifyApi.addTracksToPlaylist(req.body.playlistId, a).then(
              function (data) {
                return true;
              },
              function (err) {
                return false;
              }
            );
          });

          Promise.all(promisesD).then(function (results) {
            return res.status(200).json({ success: true, playlist: playlist });
          });
        });
      });
    });
  });
});

module.exports = router;
