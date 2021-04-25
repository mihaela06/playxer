import React from "react";
import TagHead from "../../../../assets/images/TagHead.png";
import TagHeadWhite from "../../../../assets/images/TagHeadWhite.png";
import "../../../../styles/Tag.css";
import { MdClose } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";

function Tag({
  name,
  color,
  onIconClickFunction,
  onBodyClickFunction,
  addTag = false,
}) {
  const getContrast = function (hexcolor) {
    if (hexcolor.slice(0, 1) === "#") {
      hexcolor = hexcolor.slice(1);
    }

    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);

    var yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  };

  let theme = localStorage.getItem("theme");
  const isWhite = theme === "dark";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minWidth: "fit-content",
        margin: "5px",
      }}
    >
      <div className="tag-text center-items" style={{ backgroundColor: color }}>
        <div>
          {!addTag && (
            <MdClose
              style={{
                cursor: "pointer",
                height: "20px",
                marginBottom: "5px",
                marginRight: "3px",
                color: getContrast(color),
              }}
              className="increase-hover tag-close"
              onClick={onIconClickFunction}
            />
          )}
          {addTag && (
            <AiOutlinePlus
              style={{
                cursor: "pointer",
                height: "20px",
                marginBottom: "5px",
                marginRight: "3px",
                color: "green",
              }}
              className="increase-hover"
              onClick={onIconClickFunction}
            />
          )}
          <span
            style={{ color: getContrast(color), cursor: "pointer" }}
            onClick={onBodyClickFunction}
          >
            {name}
          </span>
        </div>
      </div>
      <div style={{ display: "block", position: "relative" }}>
        <img src={isWhite ? TagHeadWhite : TagHead} className="tag-head" />
        <div
          className="tag-head__background"
          style={{ backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
}

export default Tag;
