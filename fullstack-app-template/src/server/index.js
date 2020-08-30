import express from "express";

const app = express();
const getTime = () => new Date().toLocaleString();
const publicPath = path.join(__dirname, "../client");

app.get("/api", function (req, res) {
  console.log(`${getTime()}: Request /api from ${req.ip}`);
  res.send({ message: "Hello from API!" });
});

// Необходимо для деплоя проекта без применения Docker, например для Heroku
app.use(express.static(publicPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log(`${getTime()}: App listening on port ${listener.address().port}`);
});
