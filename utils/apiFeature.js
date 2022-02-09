class ApiFeature {
  constructor(query, queryobj, numberOfDoc) {
    this.query = query;
    this.queryObj = queryobj;
    this.numberOfDoc = numberOfDoc;
  }
  filter() {
    // creating the query object
    const queryObj = { ...this.queryObj };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //Advance filtering
    //replacing the simple query parameter with $ query parameter as mongoose has $gte|$gt|so on.. in their query object.
    let queryObjStr = JSON.stringify(queryObj);
    queryObjStr = queryObjStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryObjStr));
    return this;
  }
  sort() {
    if (this.queryObj.sort) {
      let sortingStr = this.queryObj.sort.split(',').join(' ');

      this.query = this.query.sort(sortingStr);
    } else {
      this.query = this.query.sort('createAt');
    }
    return this;
  }
  field() {
    if (this.queryObj.fields) {
      let fieldStr = this.queryObj.fields.split(',').join(' ');
      this.query = this.query.select(fieldStr);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    if (this.queryObj.page || this.queryObj.limit) {
      let skip = this.queryObj.page * 1 || 1;

      let limit = this.queryObj.limit * 1 || 100;
      //page1=1-10,page2=11-20....

      const skipData = (skip - 1) * limit;
      this.query = this.query.skip(skipData).limit(limit);
      // //let throw an error if the page has no data..

      if (skipData >= this.numberOfDoc) {
        throw new Error('this page does not exists.');
      }
    }
    return this;
  }
}
export default ApiFeature;
