//Requiring important stuff
const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const session = require("express-session");

const port = process.env.port || 3000;

//Set ejs as templating engine and set the paths or directories
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/images")));

//data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Starting server
app.listen(port, (req, res) => {
  console.log(`App is listening at : http://localhost:${port}/api/login`);
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//function to check if user loggedin or not
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next(); // User is logged in
  } else {
    return res.redirect("/api/login"); // Redirect to login
  }
}

//login route
app.get("/api/login", (req, res) => {
  let error;
  res.render("login.ejs", { error });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "users.json"), "utf-8")
  );

  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
    };
    res.redirect("/api/home");    
  } else {
    res.render("login.ejs", { error: "Invalid login credentials." });
  }
});

//logout route
app.get("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/login");
  });
});

//Signup route
app.get("/api/signup", (req, res) => {
  res.render("signup", { error: null, success: null });
});

app.post("/api/signup", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const usersFile = path.join(__dirname, "data", "users.json");
  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
  }
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.render("signup", {
      error: "User already exists.",
      success: null,
    });
  }

  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    email,
    password,
  };

  users.push(newUser);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  // Redirect to login on success
  res.redirect("/api/login");
});

//Home route
app.get("/api/home", isAuthenticated , (req, res) => {
  const products = JSON.parse(
    fs.readFileSync(path.join(__dirname, "data", "products.json"))
  );
  res.render("home.ejs", { products });
});

//New arrivals route
app.get("/api/newArrival", isAuthenticated, (req, res) => {
  res.render("newArrival.ejs");
});

//collections route
app.get("/api/collection", isAuthenticated, (req, res) => {
  res.render("collection.ejs");
});

//men route
app.get("/api/men", isAuthenticated, (req, res) => {
  res.render("men.ejs");
});

//women route
app.get("/api/women", isAuthenticated, (req, res) => {
  res.render("women.ejs");
});

//about route
app.get("/api/about", (req, res) => {
  res.render("about.ejs");
});

//Misc route
app.use("/", (req, res) => {
  res.render("login.ejs");
});
