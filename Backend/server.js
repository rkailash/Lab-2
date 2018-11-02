//Express
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Cors
const cors = require("cors");
app.use(cors({ origin: "http://localhost:8080", credentials: true }));

//Passport
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("./config/settings");
require("./config/passport")(passport);
app.use(passport.initialize());

//Body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//morgan
const morgan = require("morgan");
app.use(morgan("dev"));

app.set("view engine", "ejs");

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

//AWS
const AWS = require("aws-sdk");
const fs = require("fs");
const fileType = require("file-type");
const bluebird = require("bluebird");
const multiparty = require("multiparty");

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: "",
  secretAccessKey: ""
});

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: "public-read",
    Body: buffer,
    Bucket: "kailashr",
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};
app.post("/test-upload", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `Property/${timestamp}-lg`;
      const data = await uploadFile(buffer, fileName, type);
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  });
});
app.use("/Login", require("./routes/login"));
app.use("/Register", require("./routes/register"));
app.use("/PropertyList", require("./routes/property-list"));
app.use("/Property", require("./routes/property-details"));
app.use("/AddProperty", require("./routes/add_property"));
app.use("/TravelerDash", require("./routes/traveler-dashboard"));
app.use("/OwnerDash", require("./routes/owner-dashboard"));
app.use("/Booking", require("./routes/booking"));
app.use("/Photo", require("./routes/photo"));
app.use("/Home", require("./routes/home"));
//Server listening
app.listen(3001, () => {
  console.log("Server Listening on port 3001");
});
