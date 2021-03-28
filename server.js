const User = require("./src/models/UserModel");
var multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const messagemod = require("./src/models/MessageModel");
// const apper=require('express')
const express = require("express");
const app = require("express")();
const http = require("http").createServer(app);
const { ExpressPeerServer } = require("peer");
const io = require("socket.io")(http, {
  cors: {
    origins: ["*"],
  },
});
const UserAPI = require("./src/routes/UserRoutes");
myipaddress="http://192.168.18.57:3000"


var options = {
  debug: true,
};

// server=app.listen(3000)
app.use("/peerjs", ExpressPeerServer(http, options));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

app.use("/user", UserAPI);

app.get("/", (req, res) => {
  res.send("<h1>Hey Socket.io</h1>");
});

activeusers = [];

io.on("connection", (socket) => {
  // console.log()
  activeusers.push(socket.handshake.query.username);
  console.log(socket.handshake.query.username + " user connected");
  io.emit("activeuser", { active: activeusers });
  socket.on("disconnect", () => {
    index = activeusers.indexOf(socket.handshake.query.username);
    if (index > -1) {
      activeusers.splice(index, 1);
    }
    console.log(socket.handshake.query.username + " disconnected");
  });
  socket.on("mymessage", (msg) => {
    // console.log(msg)
    messagedata = messagemod(msg);
    messagedata.save((err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        io.emit(data.from, data);
        io.emit(data.to, data);
      }
    });
  });
  socket.on("statuschange", (status) => {
    console.log(status);
    messagemod.update(
      { _id: { $in: status.message } },
      { $set: { readstatus: "read" } },
      { multi: true },
      (err, data) => {
        if (data) {
          console.log(data);
        }
        if (err) {
          console.log(err);
        }
      }
    );
    io.emit(status.from + "sc", {
      message: status.message,
      contact: status.to,
    });
  });
  socket.on("callrequest", (data) => {
    console.log(data);
    io.emit(data.reciever + "callrequest", { caller: data.caller,image:data.image });
  });
  socket.on("callresponse", (data) => {
    console.log(data);
    if (data.callresponse == "accepted") {
      io.emit(data.caller + "callresponse", {
        caller: data.caller,
        reciever: data.reciever,
        callresponse: data.callresponse,
      });
    }
    if (data.callresponse =="rejected") {
      io.emit(data.caller + "callresponse", {
        caller: data.caller,
        reciever: data.reciever,
        callresponse: data.callresponse,
      });
      io.emit(data.reciever + "callresponse", {
        caller: data.caller,
        reciever: data.reciever,
        callresponse: data.callresponse,
      });
    }
  });
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post("/user/changeimage", upload.single("file"), function (req, res) {
  username = req.body.username;
  console.log(req.file);
  console.log(req.body.username);
  if (!req.file) {
    return res.status(500).send({ message: "Upload fail" });
  } else {
    tempURL = myipaddress+"/images/" + req.file.filename;
    User.updateOne(
      { username: username },
      { profilepicURL: tempURL },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        if (data) {
          io.emit("photochange", {
            username: username,
            profilepicURL: tempURL,
          });
          console.log(data);
        }
      }
    );
  }
});

app.post("/user/sendimage", upload.single("file"), function (req, res) {
  // username = req.body.username;
  console.log(req.file);
  console.log(req.body);
  // console.log(req.body.username);
  if (!req.file) {
    console.log("fail")
    return res.status(500).send({ message: "Upload fail" });
  } else {
    console.log("hello")
    tempURL = myipaddress+"/images/" + req.file.filename;
    data = {
      from: req.body.from,
      to: req.body.to,
      image: tempURL,
      message: req.body.message,
    };
    messagedata = messagemod(data);
    messagedata.save((err, res) => {
      if (err) {
        console.log(err);
      }
      if (res) {
        console.log(res);
        io.emit(res.from, res);
        io.emit(res.to, res);
      }
    });
  }
});

// apper.listen(3000,()=>{})

http.listen(3000, () => {
  console.log("listening on *:3000");
});
