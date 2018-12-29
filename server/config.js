module.exports = {
  ServelPort: process.env.PORT || 3000,
  DatabaseUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/arcanote",
  cloudinary: {
    cloud_name: "streamline-scrum",
    api_key: "374486718926526",
    api_secret: "ZXcRV-LLNJgDoDiMeA9n_SSiW-g"
  }
};
