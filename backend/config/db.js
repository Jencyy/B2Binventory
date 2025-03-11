const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://jencysodvadiya:sI3GhHeWPmWewopt@clusterb2b.1jkjf.mongodb.net/B2B_inventory', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
