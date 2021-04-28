import React, { useState, useEffect } from "react";
import { useMediaQuery } from "../../../../hooks/MediaQuery";
import { search } from "../../../../_actions/spotify_actions";
import { createPlaylist } from "../../../../_actions/playlists_actions";
import Modal from "react-modal";
import { Input, Button, Icon, Checkbox, Switch } from "antd";
import { MdClose } from "react-icons/md";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { BiAlbum } from "react-icons/bi";
import { IoMdMicrophone, IoMdPricetag } from "react-icons/io";
import { IoMusicalNote } from "react-icons/io5";
import { getAllTags } from "../../../../_actions/tags_actions";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";
import Loading from "../../../Loading";

Modal.setAppElement("#root");

function NewPlaylistPage({ history, userPlaylists, setUserPlaylists }) {
  const smallScreen = useMediaQuery("screen and (max-width: 990px)");

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
    cursor: "pointer",
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
      },
      overlay: {
        backgroundColor: "var(--border)",
      },
    }),
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = React.useState([]);
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
    createPlaylist(
      ingredients,
      checkInstrumentals,
      checkRemixes,
      playlistName,
      playlistDescription,
      publicPlaylist
    )
      .then((response) => {
        console.log("rasp play", response);
        setUserPlaylists([...userPlaylists, response.playlist]);
        history.push("/playlists/" + response.playlist.playlistId);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
              style={{
                color: "red",
                cursor: "pointer",
                position: "absolute",
                top: "5px",
                right: "5px",
                size: "15px",
              }}
              className="increase-hover"
              onClick={closeModal}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
            >
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
                                  ? content.images
                                    ? content.images[2]
                                      ? content.images[2].url
                                      : null
                                    : null
                                  : content.album.images
                                  ? content.album.images[2]
                                    ? content.album.images[2].url
                                    : null
                                  : null
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
            <div className="center-items" onClick={openModal} style={rowStyle}>
              + Add a new ingredient
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
                            ingredient.type !== "Track"
                              ? ingredient.content.images
                                ? ingredient.content.images[2]
                                  ? ingredient.content.images[2].url
                                  : null
                                : null
                              : ingredient.content.album.images
                              ? ingredient.content.album.images[2]
                                ? ingredient.content.album.images[2].url
                                : null
                              : null
                          }
                          alt={ingredient.content.name}
                          style={{
                            marginLeft: "15px",
                            marginRight: "15px",
                            maxHeight: "60px",
                            borderRadius: "10px",
                          }}
                        />
                      )}
                      <span style={{ marginLeft: "20px" }}>
                        {ingredient.content.name}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            <div style={{ padding: "15px" }}>
              <div style={{ marginTop: "20px" }}>
                <Checkbox
                  onChange={(e) => setCheckInstrumentals(e.target.checked)}
                >
                  Exclude instrumentals (experimental)
                </Checkbox>
              </div>
              <div style={{ marginTop: "20px" }}>
                <Checkbox onChange={(e) => setCheckRemixes(e.target.checked)}>
                  Exclude remixes (experimental)
                </Checkbox>
              </div>
              <div style={{ marginTop: "20px" }}>
                <Switch
                  defaultChecked
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
