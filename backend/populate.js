// This JS is for sending many products to a DB

require("dotenv").config()

const connectDB = require("./db/connect")
const Product = require("./models/product")

const jsonProducts = require("./products.json")

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        // deleteMany() means, writing an array to DB from scratch every time you add sth..
        await Product.deleteMany()
        await Product.create(jsonProducts)       // now we created DB pushing our array..
        console.log("Connected and the data have been sended to DB...");
        console.log("Proccess is finished..");
        // process.exit() - after operations completed this function ends the process
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

start()