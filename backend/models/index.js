const sequelize = require("../config/database");
const User = require("./User");
const OnboardingProgress = require("./OnboardingProgress");
const Task = require("./Task");
const Event = require("./Event");
const Course = require("./Course");
const Survey = require("./Survey");
const EventParticipant = require("./EventParticipant");

// User associations
User.hasOne(OnboardingProgress);
OnboardingProgress.belongsTo(User);

User.hasMany(Task);
Task.belongsTo(User);

User.hasMany(Event, { as: "createdEvents", foreignKey: "createdBy" });
Event.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

User.hasMany(Course, { as: "createdCourses", foreignKey: "createdBy" });
Course.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

User.hasMany(Survey, { as: "createdSurveys", foreignKey: "createdBy" });
Survey.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

// Self-referential association for supervisor
User.belongsTo(User, { as: "supervisor", foreignKey: "supervisorId" });
User.hasMany(User, { as: "subordinates", foreignKey: "supervisorId" });

// Export models and connection
module.exports = {
  sequelize,
  User,
  OnboardingProgress,
  Task,
  Event,
  EventParticipant,
  Course,
  Survey,
};
