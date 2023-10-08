const express = require("express");
const { default: mongoose } = require("mongoose");
const Subscriber = require('./models/Subscriber');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
mongoose
  .connect(process.env.mongo_uri)
  .then(() => console.log("DB Connected"))
  .catch((error) => console.log(error));

// Routes
app.use("/api", require("./routes"));

// POST route for subscribing to the newsletter
app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  // Create a new subscriber document
  const subscriber = new Subscriber({ email });

  // Save the subscriber to the database
  subscriber
    .save()
    .then(() => {
      res.json({
        message: "You have successfully subscribed to the newsletter",
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        // Duplicate key error (email already exists)
        res
          .status(400)
          .json({ message: "Email address is already subscribed" });
      } else {
        res
          .status(500)
          .json({ message: "An error occurred. Please try again later" });
      }
    });
});

// Start the server
const port = process.env.port || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
