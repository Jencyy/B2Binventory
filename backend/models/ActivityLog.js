const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // Description of the action (e.g., "User logged in")
    createdAt: { type: Date, default: Date.now }, // Timestamp of the action
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
