var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/explore_it", { useNewUrlParser: true });
mongoose.set("useUnifiedTopology", true);

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//Schema Setup

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// 	{
// 		name: "Winden Cave",
// 		image: "https://i1.wp.com/inverselattice.com/wp-content/uploads/2018/10/dark-season-1.png?fit=1024%2C545&ssl=1",
// 		description: "This is the famous Winden cave. Stay away from here or you may find yourself in 1986",
// 	},
// 	function (err, campground) {
// 		if (err) {
// 			console.log("You encountered an error");
// 			console.log(err);
// 		} else {
// 			console.log("Newly created Campground : ");
// 			console.log(campground);
// 		}
// 	}
// );

app.get("/", function (req, res) {
	res.render("landing");
});

//INDEX ROUTE - shows all campgrounds
app.get("/campgrounds", function (req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("index", { campgrounds: allCampgrounds });
		}
	});
});

//CREATE ROUTE - create new campground
app.post("/campgrounds", function (req, res) {
	//get data from the form and add it to the above array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;

	var newCamp = { name: name, image: image, description: desc };
	//create new campground and save to DB
	Campground.create(newCamp, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//redirect back to campgrounds array
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create a campground
app.get("/campgrounds/new", function (req, res) {
	res.render("new.ejs");
});

//SHOW - show info about the campground
app.get("/campgrounds/:id", function (req, res) {
	//find campground with the provided ID

	Campground.findById(req.params.id, function (err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			//render show template with that campground
			res.render("show", { campground: foundCampground });
		}
	});
});

const PORT = process.env.Port || 5000;
app.listen(PORT, function () {
	console.log(`ExploreIt server started on Port: ${PORT}`);
});
