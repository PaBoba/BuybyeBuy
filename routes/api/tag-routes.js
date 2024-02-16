const router = require("express").Router();
const db = require("../../models");
const Tag = db.tag;
const Product = db.product;
const ProductTag = db.productTag;

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  try {
    const tagData = Tag.findAll({
      include: [
        {
          model: Product,
          as: "products",
          through: { model: ProductTag },
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  try {
    const tagData = Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products",
          through: { model: ProductTag },
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ],
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
  // be sure to include its associated Product data
});

router.post("/", (req, res) => {
  // create a new tag
  try {
    const tagData = Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!tagData[0]) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    res.status(200).json({ message: "Tag successfully deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
