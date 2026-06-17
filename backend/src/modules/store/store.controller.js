const storeModel = require("./store.model");

exports.getAll = async (req, res, next) => {
  try {
    res.json(await storeModel.readAll());
  } catch (error) {
    next(error);
  }
};

exports.getByKey = async (req, res, next) => {
  try {
    const data = await storeModel.readOne(req.params.key);
    res.json({ key: req.params.key, data });
  } catch (error) {
    next(error);
  }
};

exports.putByKey = async (req, res, next) => {
  try {
    const { data } = req.body;
    if (data === undefined) {
      return res.status(400).json({ message: 'Missing "data" in request body' });
    }
    const saved = await storeModel.replaceCollection(req.params.key, data);
    res.json({ key: req.params.key, data: saved });
  } catch (error) {
    next(error);
  }
};
