import { Button, Checkbox, Icon, Input, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { IoMdMicrophone, IoMdPricetag } from "react-icons/io";
import { IoMusicalNote } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { TiDelete, TiPlus } from "react-icons/ti";
import Modal from "react-modal";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { useMediaQuery } from "../../../hooks/MediaQuery";
import {
  createPlaylist,
  editPlaylist,
  getPlaylist,
} from "../../../_actions/playlists_actions";
import { search } from "../../../_actions/spotify_actions";
import { getAllTags } from "../../../_actions/tags_actions";
import Loading from "../../common/Loading";
import { getImageURL } from "../../../functions/Helpers.js";

Modal.setAppElement("#root");

function NewPlaylistPage({
  match,
  history,
  location,
  userPlaylists,
  setUserPlaylists,
}) {
  const smallScreen = useMediaQuery("screen and (max-width: 990px)");

  const [playlistId, setPlaylistId] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [loadingIngr, setLoadingIngr] = useState(false);

  useEffect(() => {
    if (location.playlist) {
      console.log("play", location.playlist);
      let ingr = location.playlist.ingredients;
      ingr.forEach((i) => (i.old = true));
      setIngredients(ingr);
      setPlaylistDescription(location.playlist.description);
      setPlaylistName(location.playlist.name);
      setCheckInstrumentals(location.playlist.noInstrumentals);
      setCheckRemixes(location.playlist.noRemixes);
      setPublicPlaylist(location.playlist.public);
      setPlaylistId(location.playlist.playlistId);
    }
    if (match.path !== "/playlists/new") {
      setLoadingIngr(true);
      getPlaylist(match.params.playlistId)
        .then(function (response) {
          console.log(response);
          let ingr = response.playlist.ingredients;
          ingr.forEach((i) => (i.old = true));
          setIngredients(ingr);
          setPlaylistDescription(response.playlist.description);
          setPlaylistName(response.playlist.name);
          setCheckInstrumentals(response.playlist.noInstrumentals);
          setCheckRemixes(response.playlist.noRemixes);
          setPublicPlaylist(response.playlist.public);
          setPlaylistId(response.playlist.playlistId);
          setLoadingIngr(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    console.log(match);
  }, [match]);

  const iconStyle = {
    fontSize: "30px",
    marginLeft: "20px",
  };

  const getIcon = (type) => {
    if (type == "Artist") return <IoMdMicrophone style={iconStyle} />;
    if (type == "Track") return <IoMusicalNote style={iconStyle} />;
    if (type == "Tag") return <IoMdPricetag style={iconStyle} />;
    if (type == "Album") return <BiAlbum style={iconStyle} />;
  };

  const stackStyle = (smallScreen) => ({
    marginTop: "2%",
    backgroundColor: "var(--background-color-sec)",
    width: smallScreen ? "90vw" : "50vw",
    border: "solid 5px var(--border)",
    borderRadius: "10px",
    marginBottom: "2%",
  });

  const rowStyle = {
    border: "solid 2px var(--border)",
    borderRadius: "10px",
    width: "98%",
    margin: "1%",
    fontSize: "1.1rem",
    paddingTop: "15px",
    paddingBottom: "15px",
  };

  const customStyles = {
    modalStyle: (smallScreen) => ({
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "var(--background-color-sec)",
        opacity: "1",
        padding: "25px",
        maxWidth: smallScreen ? "90vw" : "60vw",
        minWidth: "30vw",
        maxHeight: smallScreen ? "80vh" : "90vh",
        color: "var(--text-color)",
      },
      overlay: {
        backgroundColor: "var(--border)",
      },
    }),
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownValue, setDropdownValue] = React.useState(
    "Choose ingredient type"
  );
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const clickedDropdownItem = (value) => {
    setSearchResult();
    setDropdownValue(value);
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setDropdownValue("Choose ingredient type");
    setDropdownOpen(false);
    setSearchResult();
    setSearchTerm("");
    setSelectedIndex(-1);
    setIsOpen(false);
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [checkInstrumentals, setCheckInstrumentals] = useState(false);
  const [checkRemixes, setCheckRemixes] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [publicPlaylist, setPublicPlaylist] = useState(true);

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResult();
    } else {
      setSelectedIndex(-1);
      if (dropdownValue !== "Tag")
        search(searchTerm, dropdownValue.toLowerCase())
          .then((response) => {
            setSearchResult(response.spotifyData.body);
            console.log(response.spotifyData.body);
          })
          .catch((err) => {
            console.log(err);
          });
      else setSearchResult(getUserTags());
    }
  }, [searchTerm, dropdownValue]);

  const getUserTags = () => {
    let tags = localStorage.getItem("tags")
      ? JSON.parse(localStorage.getItem("tags"))
      : null;
    if (tags) return tags;
    getAllTags()
      .then((response) => {
        localStorage.setItem("tags", JSON.stringify(response.data));
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getResultArray = () => {
    console.log(dropdownValue, searchResult, "dv");
    if (searchResult === undefined && dropdownValue !== "Tag") return;
    console.log("search res", searchResult);
    if (dropdownValue === "Artist") return searchResult.artists.items;
    if (dropdownValue === "Album") return searchResult.albums.items;
    if (dropdownValue === "Track") return searchResult.tracks.items;
    if (dropdownValue === "Tag") {
      return getUserTags().filter((t) =>
        t.name.toLowerCase().includes(searchTerm)
      );
    }
  };

  const handleChange = (e) => {
    if (searchDisabled()) {
      NotificationManager.error("Please select a type first");
      return;
    }
    setSearchTerm(e.target.value);
  };

  const searchDisabled = () => {
    return dropdownValue === "Choose ingredient type";
  };

  const getBackgroundColor = (index) => {
    return index === selectedIndex ? "gray" : "transparent";
  };

  const submitMix = () => {
    if (ingredients.length === 0) {
      NotificationManager.error("Please add at least an ingredient");
      return;
    }
    if (playlistName === "") {
      NotificationManager.error("Please enter the playlist name");
      return;
    }
    setLoading(true);
    var promise =
      playlistId === ""
        ? createPlaylist(
            ingredients,
            checkInstrumentals,
            checkRemixes,
            playlistName,
            playlistDescription,
            publicPlaylist
          )
        : editPlaylist(
            ingredients,
            checkInstrumentals,
            checkRemixes,
            playlistName,
            playlistDescription,
            publicPlaylist,
            playlistId
          );
    promise
      .then((response) => {
        console.log("rasp play", response);
        if (playlistId === "" && userPlaylists)
          setUserPlaylists([...userPlaylists, response.playlist]);
        else if (userPlaylists) {
          let temp = userPlaylists;
          let old = temp.find((el) => el._id === response.playlist._id);
          temp.splice(temp.indexOf(old), 1);
          temp.push(response.playlist);
          setUserPlaylists(temp);
        }
        history.push("/playlists/" + playlistId);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function removeIngredient(ref) {
    var i = ingredients.find((e) => e.reference === ref);
    var temp = [...ingredients];
    temp.splice(temp.indexOf(i), 1);
    console.log(temp);
    setIngredients(temp);
  }

  if (loadingIngr) return <Loading />;

  return (
    <div>
      {!loading && (
        <div className="w-100 center-items">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles.modalStyle(smallScreen)}
            contentLabel="Add a new ingredient"
          >
            <MdClose
              className="increase-hover modal-close"
              onClick={closeModal}
            />
            <div className="modal__div">
              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
                className="center-items"
              >
                <DropdownToggle caret>{dropdownValue}</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => clickedDropdownItem("Tag")}>
                    Tag
                  </DropdownItem>
                  <DropdownItem onClick={() => clickedDropdownItem("Artist")}>
                    Artist
                  </DropdownItem>
                  <DropdownItem onClick={() => clickedDropdownItem("Album")}>
                    Album
                  </DropdownItem>
                  <DropdownItem onClick={() => clickedDropdownItem("Track")}>
                    Track
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Input
                id="search"
                prefix={<Icon type="search" color="var(--text-color)" />}
                placeholder="Search..."
                type="text"
                value={searchTerm}
                onChange={handleChange}
                size="large"
                style={{ marginTop: "20px", width: "100%" }}
                autoComplete="off"
              />{" "}
              <div
                className="center-items"
                style={{ marginTop: "20px", justifySelf: "flex-end" }}
              >
                {(searchResult || dropdownValue === "Tag") &&
                  getResultArray().map(function (content, index) {
                    return (
                      <React.Fragment key={index}>
                        <div
                          className="increase-hover"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            width: "98%",
                            margin: "5px",
                            border: "solid 1px var(--border)",
                            borderRadius: "5px",
                            cursor: "pointer",
                            backgroundColor: getBackgroundColor(index),
                          }}
                          onClick={() => setSelectedIndex(index)}
                        >
                          {dropdownValue !== "Tag" && (
                            <img
                              src={
                                dropdownValue !== "Track"
                                  ? getImageURL(
                                      dropdownValue,
                                      content.images,
                                      false
                                    )
                                  : getImageURL(
                                      dropdownValue,
                                      content.album.images,
                                      false
                                    )
                              }
                              alt={content.name}
                              style={{
                                height: "40px",
                                justifySelf: "flex-start",
                                margin: "10px",
                              }}
                            />
                          )}
                          {dropdownValue !== "Tag" && (
                            <span style={{ fontSize: "20px" }}>
                              {content.name}{" "}
                              {dropdownValue === "Track" &&
                                "(by " + content.artists[0].name + ")"}
                            </span>
                          )}
                          {dropdownValue === "Tag" && (
                            <span
                              style={{
                                fontSize: "20px",
                                margin: "15px",
                              }}
                            >
                              {content.name}
                            </span>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                <Button
                  onClick={() => {
                    if (dropdownValue === "Choose ingredient type") {
                      NotificationManager.error("Please choose a type");
                      return;
                    }
                    if (selectedIndex === -1) {
                      NotificationManager.error("Please select an ingredient");
                      return;
                    }
                    setIngredients([
                      ...ingredients,
                      {
                        type: dropdownValue,
                        content: getResultArray()[selectedIndex],
                        old: false,
                      },
                    ]);
                    closeModal();
                  }}
                  style={{ margin: "10px" }}
                >
                  Add
                </Button>
              </div>
            </div>
          </Modal>
          <div style={stackStyle(smallScreen)}>
            <Input
              id="playlistName"
              placeholder="Playlist name"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              size="large"
              style={{ marginTop: "20px", width: "96%", marginLeft: "2%" }}
              autoComplete="off"
            />
            <Input.TextArea
              id="playlistDescription"
              placeholder="Playlist description"
              type="text"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              style={{ marginTop: "20px", width: "96%", marginLeft: "2%" }}
              autoComplete="off"
              rows={3}
            />
            <div
              className="center-items"
              onClick={openModal}
              style={{ ...rowStyle, cursor: "pointer", fontWeight: "bold" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TiPlus style={{ fontSize: "30px", color: "green" }} />
                <span>Add a new ingredient</span>
              </div>
            </div>
            {ingredients.length > 0 &&
              ingredients.map(function (ingredient, index) {
                return (
                  <React.Fragment key={index}>
                    <div style={rowStyle}>
                      {getIcon(ingredient.type)}
                      {ingredient.type !== "Tag" && (
                        <img
                          src={
                            !ingredient.old
                              ? ingredient.type !== "Track"
                                ? getImageURL(
                                    ingredient.type,
                                    ingredient.content.images,
                                    false
                                  )
                                : getImageURL(
                                    ingredient.type,
                                    ingredient.content.album.images,
                                    false
                                  )
                              : ingredient.imageUrl
                          }
                          alt={
                            !ingredient.old
                              ? ingredient.content.name
                              : ingredient.name
                          }
                          style={{
                            marginLeft: "15px",
                            marginRight: "15px",
                            maxHeight: "60px",
                            borderRadius: "10px",
                          }}
                        />
                      )}
                      <span style={{ marginLeft: "20px", marginRight: "60px" }}>
                        {ingredient.old
                          ? ingredient.name
                          : ingredient.content.name}
                      </span>
                      <div
                        style={{
                          float: "right",
                          marginTop: "auto",
                          marginBottom: "auto",
                        }}
                        className="center-items"
                        onClick={() => removeIngredient(ingredient.reference)}
                      >
                        <TiDelete
                          style={{
                            fontSize: "40px",
                            color: "red",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            <div style={{ padding: "15px" }}>
              <div style={{ marginTop: "20px" }}>
                <Checkbox
                  onChange={(e) => setCheckInstrumentals(e.target.checked)}
                  style={{ color: "var(--text-color)" }}
                  checked={checkInstrumentals}
                >
                  Exclude instrumentals (experimental)
                </Checkbox>
              </div>
              <div style={{ marginTop: "20px" }}>
                <Checkbox
                  onChange={(e) => setCheckRemixes(e.target.checked)}
                  style={{ color: "var(--text-color)" }}
                  checked={checkRemixes}
                >
                  Exclude remixes (experimental)
                </Checkbox>
              </div>
              <div style={{ marginTop: "20px" }}>
                <Switch
                  defaultChecked
                  checked={publicPlaylist}
                  onChange={(checked) => setPublicPlaylist(checked)}
                />
                <span style={{ marginLeft: "20px" }}>
                  {publicPlaylist ? "Public" : "Private"}
                </span>
              </div>
            </div>
            <div
              className="center-items"
              style={{ paddingTop: "15px", paddingBottom: "15px" }}
            >
              <Button
                size="large"
                className="increase-hover"
                onClick={() => submitMix()}
              >
                Mix it!
              </Button>
            </div>
          </div>
        </div>
      )}
      {loading && <Loading />}
    </div>
  );
}

export default withRouter(NewPlaylistPage);
