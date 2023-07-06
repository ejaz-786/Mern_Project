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

    // Filter for price range:-
    let querystr = JSON.stringify(queryCopy);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    const newqueryCopy = JSON.parse(querystr, (_, value) =>
      !isNaN(value) ? Number(value) : value
    );
    this.query = this.query.find(newqueryCopy);
    return this;
  }

  // Pagination Feature

  pagination(resultPerPage) {
    //logic:-
    // 50 => 10  skip => 10 * (crntpage - 1 ) ==> 10 * (3-1)

    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
