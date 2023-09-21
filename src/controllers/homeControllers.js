const getHomeText = (req, res) => {
    res.send("Hello World!");
}

const getHomePic = (req, res) => {
    res.render("sample.ejs");
}

module.exports = {
    getHomeText,
    getHomePic
}