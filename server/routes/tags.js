const express = require("express");
const router = express.Router();
const { User, Tag, Content } = require("../models/User");
const { auth } = require("../middleware/auth");

router.get("/get_all", auth, (req, res) => {
  return res.status(200).send({
    success: true,
    data: req.user.tags,
  });
});

router.post("/add_tag", auth, (req, res) => {
  const tag = new Tag({ name: req.body.name, color: req.body.color });
  req.user.tags.push(tag);
  req.user.save().then(
    function (data) {
      return res.status(200).send({
        success: true,
        data: data,
        tag: tag,
      });
    },
    function (err) {
      return res.status(400).send({
        success: false,
        data: err,
      });
    }
  );
});

router.post("/delete_tag", auth, (req, res) => {
  const tag = req.user.tags.find((tag) => tag.name == req.body.tagName);
  req.user.tags.pull(tag);
  req.user.save().then(
    function (data) {
      return res.status(200).send({
        success: true,
        data: data,
      });
    },
    function (err) {
      return res.status(400).send({
        success: false,
        data: err,
      });
    }
  );
});

router.post("/get_content_tags", auth, (req, res) => {
  const filteredTags = req.user.content
    .filter(function (content) {
      return content.contentId === req.body.contentId;
    })
    .map((content) => content.tag);
  return res.status(200).send({
    success: true,
    data: filteredTags,
  });
});

router.post("/assign_tag", auth, (req, res) => {
  const tag = req.user.tags.find((tag) => tag.name == req.body.tagName);
  const content = new Content({
    contentId: req.body.contentId,
    tag: tag,
    contentType: req.body.contentType,
  });
  req.user.content.push(content);
  req.user.save().then(
    function (data) {
      return res.status(200).send({
        success: true,
        data: data,
      });
    },
    function (err) {
      return res.status(400).send({
        success: false,
        data: err,
      });
    }
  );
});

router.post("/unassign_tag", auth, (req, res) => {
  const tag = req.user.tags.find((tag) => tag.name === req.body.tagName);
  const content = req.user.content.find(
    (content) => content.tag.name === tag.name
  );
  req.user.content.pull(content);
  req.user.save().then(
    function (data) {
      return res.status(200).send({
        success: true,
        data: data,
      });
    },
    function (err) {
      return res.status(400).send({
        success: false,
        data: err,
      });
    }
  );
});

module.exports = router;
