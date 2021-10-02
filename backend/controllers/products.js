const Products = require("../models/product")


// this STATIC function for only practice the real API is "getAllProducts"
const getAllProductsStatic = async (req, res) => {

    // // it means get me all products from DB
    // const products = await Products.find({})

    // // it means get me all specific products which is named {company: "liddy"}, it is for filtration
    // const products = await Products.find({company: "liddy"})

    // //  "sort" method for only for sorting documents({name: ""}) alphabetically from DB
    // // and if "-name" it will sorts documents in reverse order
    // const products = await Products.find({}).sort("-name price")
    // const products = await Products.find({}).sort("name price")   -- sorts name(alphabetically), price(ascending order)


    // // "select" method returns object of all product's  "name" and "price"  ({name: "", price: ""}) => only this
    // const products = await Products.find({}).select("name price")

    // // "limit" method returns only 4 items, "skip" method skips first-coming 2 items and returns next-coming
    // const products = await Products.find({}).limit(4).skip(2)

    // // " $gt = greater than / $lt = less than / $eq = equal "  - mongoose query operators(for numeric filtering), 
    // //  sorting in ascending order
    const products = await Products.find({price: {$gt: 30}}).sort("price")

    res.status(200).json({nbHits: products.length, products})
}




// REAL API
const getAllProducts = async (req, res) => {
    // https://localhost:5000/products?featured=false
    // check in Store-API in Postman
    const {featured, company, name, sort, fields, numericFilters} = req.query
    // now we invented new object
    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === "true" ? true : false
        // it returns queryObject = {featured: true}  or {featured: false}
    }
    if (company) {
        queryObject.company = company
    }
    if (name) {
        // "$regex" - is query operator of mongoose, it is used for finding item from DB
        // suppose you write only one letter to input, and it will find all the matched items for your inputs
        queryObject.name = {$regex: name, $options: "i"}
    }

    if (numericFilters) {
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
            // " >, >=, =, <, <= "  -  this symbols coming from clientside
            // " $gt, $lt, .... "  -  are mongoose query operators, 
            // symbols coming from client we have to convert them to "mongoose query operator symbols"
        }

        // it is a simple regEx. It says, these symbols are without any space(blank) in to side for mathcing with numericFilters, (" | ") - this is "or" operator
        const regEx = /\b(<|>|>=|=|<=)\b/g   

        // {{URL}}/products?numericFilters=price>40,rating>=4      <<== THIS IS COMING FROM CLIENT SIDE
        // here we mathcing numericFilters with regEx, if any character matches to one of regEx symbols => replace it with `-${operatorMap[match]}-`
        // operatorMap["<"]  returns   "$lt",  operatorMap[">="] returns "$gte"
        // "price<40,rating>=4"  -- this is coming from clientside(numericFilters)
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)     // these - minus symbols are added on purpose
        // now "filters"   returns   "price-$gt-40,rating-$gte-4",    new line of String
        // console.log(filters);

        const options = ["price", "rating"]     // only numeric values from DB, we can do activities above only with certain numeric options
        // our filters is a String, split() method returns an Array
        filters = filters.split(",").forEach(item => {
            const [field, operator, value] = item.split("-")
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }
    console.log(queryObject)

    // suppose, one time client may not ask about "sorting", other time client may ask about "sorting"
    // then we have to write this condition
    let result =  Products.find(queryObject)

    //  SORTING 
    if (sort) {
        // "sort" may return String ("name,price,company")
        const sortList = sort.split(",").join(" ")
        result = result.sort(sortList)
    } else {
        // it is hardcoded, and it sorts by date
        result = result.sort("createdAt")
    }

    //  SELELCTING FIELDS
    if (fields) {
        const fieldsList = fields.split(",").join(" ")
        result = result.select(fieldsList)
    }

    // SKIP AND LIMIT
    // "page" is for pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10             // 10 is default value
    
    // suppose, you have 23 items, and the limit is 10items for a page
    // so we divided 23 items to 10items and there will be 3 pages(10items, 10items, 3items)
    // to show first 10items in page1 we must not use skip or skip must be equal to 0 (skip(0))
    // and to show next 10items in page2 we have to skip 10items (skip(10))
    // calculation: skip = (page1 - 1) * limit  === skip = (1 - 1) * limit  === skip(0)  and so on..
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    
    const products = await result
    res.status(200).json({nbHits: products.length, products})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}



