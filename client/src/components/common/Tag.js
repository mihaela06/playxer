import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import TagHead from "../../assets/images/TagHead.png";
import TagHeadWhite from "../../assets/images/TagHeadWhite.png";
import { getContrast } from "../../functions/Helpers.js";
import "../styles/Tag.css";

function Tag({
  name,
  color,
  onIconClickFunction,
  onBodyClickFunction,
  addTag = false,
}) {
  let theme = localStorage.getItem("theme");
  const isWhite = theme === "dark";
  return (
    <div className="tag__div">
      <div className="tag-text center-items" style={{ backgroundColor: color }}>
        <div>
          {!addTag && (
            <MdClose
              style={{
                color: getContrast(color),
              }}
              className="increase-hover tag-close"
              onClick={onIconClickFunction}
            />
          )}
          {addTag && (
            <AiOutlinePlus
              className="increase-hover tag-add"
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
      <div className="tag-head__div">
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
