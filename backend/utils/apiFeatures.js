class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // For Searching Product by name :-  keyword = "iphone"
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // For filtering Product by Category :-

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing some feilds from category
    const removeFeilds = ["keyword", "page", "limit"];

    removeFeilds.forEach((key) => delete queryCopy[key]);

    // Filter for price range and rating:-
    let querystr = JSON.stringify(queryCopy);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    console.log("check:", JSON.parse(querystr));
    // this.query = this.query.find(queryCopy);
    this.query = this.query.find(JSON.parse(querystr));
    return this;
  }
}

module.exports = ApiFeatures;
