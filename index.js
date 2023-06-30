const connection = require("./server");
const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const xlsx = require("xlsx");
const flash = require("connect-flash");
const session = require("express-session");
var app = express();
var data_exporter = require("json2csv").Parser;

app.use(
  session({
    proxy: true,
    key: "keyin",
    secret: "webslesson",
    resave: false,
    saveUninitialized: true,
  })
);
app.set("trust proxy", 1);

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//***********************Home Page route************************

app.get("/", (req, res) => {
  const id = req.session.user_id;
  console.log(req.session.user_id);
  console.log();
  res.render("home.ejs", { id });
});

//**********************Change Password Route*********************

app.post("/cpassword", (req, res) => {
  console.log(req.body);
  connection.query(
    "update user set password=? where phone=? ",
    [req.body.password, req.body.phone],
    (err, row) => {
      if (err) {
        req.flash("error", "Contact number is not there");
        res.redirect("/");
      } else {
        if (row.affectedRows == 0) {
          req.flash("error", "Contact number does'nt exist");
          res.redirect("/");
        } else {
          req.flash("success", "Successfully updated the password ");
          res.redirect("/");
        }
      }
    }
  );
});

//************************Login form*************************

app.post("/login", (req, res) => {
  let data;
  connection.query(
    "select * from user where username=? and password=?",
    [req.body.id, req.body.password],
    (err, row) => {
      if (err) {
        console.log(err);
      } else {
        data = row;
        if (data.length > 0) {
          req.session.user_id = row[0].id;
          res.render("detail.ejs", { data });
        } else {
          req.flash("error", "Crendentials Dont match");
          res.redirect("/");
        }
      }
    }
  );
});

//********************Export Data route **************************

app.get("/export", (req, res) => {
  const id = req.session.user_id;
  console.log("session Id is:");
  console.log(id);
  const path = "./files";
  connection.query("select * from OrderItem where id=?", [id], (err, row) => {
    if (err) {
      console.log(err);
    } else {
      let data = row;
      console.log(data.length);
      if (data.length <= 0) {
        req.flash("error", "No Order history Available");
        res.redirect("/");
      } else {
        var mysql_data = JSON.parse(JSON.stringify(data));
        var json_data = new data_exporter();

        var csv_data = json_data.parse(mysql_data);

        res.setHeader("Content-Type", "text/csv");

        res.setHeader(
          "Content-Disposition",
          "attachment; filename=sample_data.csv"
        );

        res.status(200).end(csv_data);
      }
    }
  });
});

//*****************Post form Data route ****************************

app.post("/customers", (req, res) => {
  const cust = req.body;
  const id = req.session.user_id;
  console.log("session Id is:");

  console.log(id);

  let productId = 500;
  const custData = [
    cust.odate,
    cust.item,
    cust.count,
    cust.weight,
    cust.request,
    id,
    productId,
  ];

  connection.query(
    "insert into OrderItem(orderDate,package,count,result_weight,requests,id,productId) values(?)",
    [custData],
    (err, row) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Successfully added the order ");
        res.redirect("/");
      }
    }
  );
});

//**********************User Profile route ***************************
app.get("/profile", (req, res) => {
  const id = req.session.user_id;
  console.log("session Id is:");

  console.log(id);
  let data;
  connection.query("select * from user where id=?", [id], (err, row) => {
    if (err) {
      console.log(err);
    } else {
      data = row;
      res.render("profile.ejs", { data });
    }
  });
});

//************************** Order History ******************************

app.get("/orders", (req, res) => {
  let data;
  const id = req.session.user_id;
  console.log("session Id is:");
  console.log(id);

  connection.query("select * from OrderItem where id=?", [id], (err, row) => {
    if (err) {
      console.log(err);
    } else {
      data = row;
      res.render("orders.ejs", { data });
    }
  });
});

//***************login form get route *****************************

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

//************************** Order form route *********************
app.get("/detail", (req, res) => {
  let data;
  const id = req.session.user_id;
  connection.query("select * from user where id=?", [id], (err, row) => {
    if (err) {
      console.log(err);
    } else {
      data = row;
      res.render("detail.ejs", { data });
    }
  });
});

//*************************Logout route ********************************
app.get("/logout", (req, res) => {
  req.session.user_id = undefined;
  req.flash("success", "Goodbye!");
  res.redirect("/");
});

app.listen("3000", (req, res) => {
  console.log("Listening to the server");
});
