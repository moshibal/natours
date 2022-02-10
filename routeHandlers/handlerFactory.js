import ApiFeature from '../utils/apiFeature.js';
export const deleteOne = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: 'successfully deleted.',
    });
  } catch (error) {
    res.status(300).json({
      status: 'deleted',
    });
  }
};
export const updateOne = (Model) => async (req, res) => {
  try {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        updatedDoc,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
export const createOne = (Model) => async (req, res) => {
  try {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        newDoc,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
export const getOne = (Model, populateOption) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    if (populateOption) {
      query.populate(populateOption);
    }
    const doc = await query;
    if (!doc) {
      throw Error('there is no data belonging to that id.');
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
export const getAll = (Model) => async (req, res) => {
  try {
    let filter = {};
    if (req.body.params) {
      filter = { tour: req.params.tourId };
    }
    const numberOfDoc = await Model.countDocuments();

    const apiQuery = new ApiFeature(Model.find(filter), req.query, numberOfDoc)
      .filter()
      .sort()
      .field()
      .paginate();
    //awaiting the query object
    const Doc = await apiQuery.query;
    //sending the response object back
    res.status(200).json({
      status: 'success',
      createdAt: req.createdAt,
      results: Doc.length,
      data: {
        Doc,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message,
    });
  }
};
