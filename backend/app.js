require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()

const connectDB = require("./db/connect")
const url = process.env.MONGO_URI

const productsRouter = require("./routes/products")

const notFoundMidlleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

//middleware
app.use(express.json())


// routes
app.get("/", (req, res) => {
    res.send('<h1>Store API</h1> <a href = "/api/v1/products">products route</a>')
})

app.use("/api/v1/products", productsRouter)

// products route



app.use(notFoundMidlleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(url)
        app.listen(port, console.log(`Server is listening on port:${port}...`))
    } catch (error) {
        console.log(error);
    }
}

start()