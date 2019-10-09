const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, "production")));

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "production", "index.html"));
});

app.listen(port, () => {
    console.log(`Started server on ` + port);
});
