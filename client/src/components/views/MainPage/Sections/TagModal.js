import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { HiOutlineTag } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import {
  getAllTags,
  assignTag,
  unassignTag,
  getContentTags,
  deleteTag,
  addTag,
} from "../../../../_actions/tags_actions";
import { useMediaQuery } from "../../../../hooks/MediaQuery";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Tag from "./Tag";
import MixIt from "../../../../assets/images/MixIt256.gif";
import { SliderPicker } from "react-color";
import "../../../../styles/Tag.css";
import { Input, Button } from "antd";

Modal.setAppElement("#root");

function TagModal({ contentId, iconSize = "2rem" }) {
  const [userTags, setUserTags] = useState();
  const [unusedTags, setUnusedTags] = useState();
  const [loading, setLoading] = useState(true);
  const [contentTags, setContentTags] = useState();

  const [color, setColor] = useState("#ffffff");
  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const [newTagName, setNewTagName] = useState();
  const handleTagNameChange = (e) => {
    setNewTagName(e.target.value);
  };

  useEffect(() => {
    const getUserTags = () => {
      getAllTags()
        .then((response) => {
          localStorage.setItem("tags", JSON.stringify(response.data));
          setUserTags(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    localStorage.getItem("tags")
      ? setUserTags(JSON.parse(localStorage.getItem("tags")))
      : getUserTags();
  }, []);

  useEffect(() => {
    if (!userTags) return;
    if (!loading) return;
    const getContentTagsById = () => {
      getContentTags(contentId)
        .then((response) => {
          setContentTags(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getContentTagsById();
  }, [userTags]);

  useEffect(() => {
    const assigned = (tag) => {
      return contentTags.findIndex((e) => e.name == tag.name) !== -1
        ? true
        : false;
    };
    if (!userTags) return;
    if (!contentTags) return;
    var temp = userTags.filter((tag) => !assigned(tag));
    setUnusedTags(temp);
    setLoading(false);
  }, [contentTags]);

  const smallScreen = useMediaQuery("screen and (max-width: 990px)");

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
      },
      overlay: {
        backgroundColor: "var(--border)",
      },
    }),
  };

  const assignTagByName = (name) => {
    assignTag(name, contentId)
      .then((response) => {
        console.log("response", response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    let temp = [...contentTags];
    temp.push(userTags.find((tag) => tag.name === name));

    setContentTags(temp);
  };

  const unassignTagByName = (name) => {
    unassignTag(name, contentId)
      .then((response) => {
        console.log("response unassigned", response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    let oldContent = [...contentTags].filter((e) => e.name !== name);

    setContentTags(oldContent);
  };

  const deleteTagByName = (name) => {
    const sendDelete = (name) => {
      deleteTag(name)
        .then((response) => {
          console.log("response delete", response.data);
        })
        .catch((err) => {
          console.log(err);
        });

      let temp = [...userTags].filter((e) => e.name !== name);
      setUserTags(temp);
      localStorage.setItem("tags", JSON.stringify(temp));
      let unusedTemp = [...unusedTags].filter((e) => e.name !== name);
      setUnusedTags(unusedTemp);
    };

    const options = {
      title: "Are you sure you want to delete this tag?",
      message:
        "All the contents tagged with it will be unassigned. You can edit it in settings.",
      buttons: [
        {
          label: "Yes",
          onClick: () => sendDelete(name),
        },
        {
          label: "No",
          onClick: () => null,
        },
      ],
      childrenElement: () => <div />,
      closeOnEscape: true,
      closeOnClickOutside: true,
      willUnmount: () => {},
      afterClose: () => {},
      onClickOutside: () => {},
      onKeypressEscape: () => {},
      overlayClassName: "overlay-alert",
      className: "alert",
    };
    confirmAlert(options);
  };

  const addNewTag = () => {
    addTag(newTagName, color)
      .then((response) => {
        console.log("response new", response.data);
        let temp = [...userTags];
        temp.push(response.tag);
        setUserTags(temp);
        localStorage.setItem("tags", JSON.stringify(temp));
        let tempu = [...unusedTags];
        tempu.push(response.tag);
        setUnusedTags(tempu);
      })
      .catch((err) => {
        console.log(err);
      });

    setColor("#ffffff");
    setNewTagName("");
    setIsOpenAdd(false);
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const [addModalIsOpen, setIsOpenAdd] = React.useState(false);
  function openAddModal() {
    setIsOpenAdd(true);
  }

  function closeAddModal() {
    setIsOpenAdd(false);
  }
  return (
    <div>
      <HiOutlineTag
        onClick={openModal}
        style={{ fontSize: iconSize, cursor: "pointer" }}
        className="increase-hover"
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles.modalStyle(smallScreen)}
        contentLabel="View and change tags"
      >
        {loading && <img src={MixIt} alt="Loading" />}
        {!loading && (
          <div>
            {contentTags.length == 0 && (
              <span className="center-items" style={{ cursor: "default" }}>
                No tags assigned yet! Click on one of those below or add a new
                one!
              </span>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                margin: "0px",
                marginBottom: "20px",
                paddingTop: "10px",
              }}
            >
              {contentTags.length > 0 &&
                contentTags.map(function (tag, index) {
                  return (
                    <React.Fragment key={index}>
                      <div>
                        <Tag
                          name={tag.name}
                          color={tag.color}
                          onIconClickFunction={() =>
                            unassignTagByName(tag.name)
                          }
                          onBodyClickFunction={null}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                margin: "0px",
                borderTop: "solid 1px var(--border)",
                paddingTop: "10px",
              }}
            >
              {unusedTags.map(function (tag, index) {
                return (
                  <React.Fragment key={index}>
                    <div>
                      <Tag
                        name={tag.name}
                        color={tag.color}
                        onIconClickFunction={() => deleteTagByName(tag.name)}
                        onBodyClickFunction={() => assignTagByName(tag.name)}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
              <Tag
                name="Add new tag"
                color="#90ee90"
                addTag="true"
                onIconClickFunction={() => openAddModal()}
                onBodyClickFunction={() => openAddModal()}
              />
            </div>
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
          </div>
        )}
      </Modal>
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={closeAddModal}
        style={customStyles.modalStyle(smallScreen)}
        contentLabel="Add a new tag"
      >
        <SliderPicker color={color} onChange={handleColorChange} />
        <Input
          id="tagName"
          placeholder="Tag name"
          type="text"
          value={newTagName}
          onChange={handleTagNameChange}
          size="large"
          style={{
            marginTop: "40px",
            marginBottom: "20px",
            width: "90%",
            marginLeft: "5%",
          }}
          autoComplete="off"
        />{" "}
        <div className="center-items">
          <Button onClick={() => addNewTag()}>Add</Button>
        </div>
      </Modal>
    </div>
  );
}

export default TagModal;
