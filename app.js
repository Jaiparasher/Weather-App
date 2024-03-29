require('dotenv').config();
const express = require("express");
const ejs =require("ejs");

const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const { count } = require('console');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.post("/", function (req, res) {
  const query = req.body.cityName;
  const unit = "metric";
  const apiKey="a81220099e2c920a17f0d3d5c66e9893";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid="+apiKey+"&units=" +
    unit;
  https.get(url, function (response) {
    console.log(response.statusCode);
    if(response.statusCode===200){
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const country=weatherData.sys.country;
      const temp = weatherData.main.temp;
      const feelsLike=weatherData.main.feels_like;
      const humidity=weatherData.main.humidity;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      
        res.render("home",{
          Country:country,
          Query:query,
          Temp:temp,
          Desc:description,
          Icon:icon,
          IconURL:iconURL,
          FeelsLike:feelsLike,
          Humidity:humidity
        })
        res.send();
    });
  }
  else{
    res.send('<script>alert("Please enter correct location")</script>');

  }
  });

  
});
let port=process.env.PORT;
if(port==null||port==""){
  port=3000
}
app.listen(port, function (err) {
  if(err){
    process.exit(1);
  }
  else{
  console.log("server is running on port");
  }
});
