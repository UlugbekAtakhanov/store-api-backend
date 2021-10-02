const notFoundMidlleware = (req, res) => {
    return res.status(500).json("Route does not exist")
}

module.exports = notFoundMidlleware