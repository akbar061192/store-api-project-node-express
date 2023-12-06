const Product = require("../models/Product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({
    price: { $gt: 90 },
    rating: { $eq: 4.5 },
  });
  return res
    .status(200)
    .json({ success: true, nbHits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, page, limit, numericFilters } =
    req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true";
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(regEx, (matchOperators) => {
      bh;
      return `-${operatorMap[matchOperators]}-`;
    });

    const options = ["price", "rating"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
        //   price:          { '$gte': 90 }, rating: { '$eq': 4.5 }
      }
    });
  }
  //http://localhost:3000/api/v1/products?numericFilters=price%3E=100,rating=4.5b
  console.log(queryObject);
  // const products = await Product.find(queryObject);
  let result = Product.find(queryObject);

  // sorting the fields
  // sort example with all filters:
  // http://localhost:3000/api/v1/products?featured=false&name=en&company=ikea&sort=name-price
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("-createdAt");
  }

  // selecting the fields
  // select and sort example with all filters:
  // http://localhost:3000/api/v1/products?featured=false&name=en&company=ikea&sort=name,-price&fields=company,rating,price
  if (fields) {
    const selectList = fields.split(",").join(" ");
    result = result.select(selectList);
  }

  // pagination functionality
  let pageNumber = Number(page) || 1;
  let limitNumber = Number(limit) || 10;
  let skipNumber = (pageNumber - 1) * limitNumber;

  result = result.skip(skipNumber).limit(limitNumber);

  const products = await result;
  return res
    .status(200)
    .json({ success: true, nbHits: products.length, products });
};

module.exports = { getAllProductsStatic, getAllProducts };
