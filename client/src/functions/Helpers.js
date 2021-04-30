import DefaultAlbum from "../assets/images/DefaultAlbum.jpg";
import DefaultArtist from "../assets/images/DefaultArtist.jpg";
import DefaultPlaylist from "../assets/images/DefaultPlaylist.jpg";

export function getContrast(hexcolor) {
  if (hexcolor.slice(0, 1) === "#") {
    hexcolor = hexcolor.slice(1);
  }

  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);

  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

export function getImageURL(type, urlArray, highRes = true) {
  const getDefault = (type) => {
    if (type.toLowerCase() === "album") return DefaultAlbum;
    if (type.toLowerCase() === "artist") return DefaultArtist;
    if (type.toLowerCase() === "playlist") return DefaultPlaylist;
    if (type.toLowerCase() === "track") return DefaultAlbum;
  };
  if (!urlArray) return getDefault(type);
  if (urlArray.length === 0) return getDefault(type);
  if (urlArray.length === 1) return urlArray[0].url;
  if (highRes) return urlArray[urlArray.length - 2].url;
  return urlArray[urlArray.length - 1].url;
}
