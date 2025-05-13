const sequelize = require("../config/database");
const User = require("./User");
const OnboardingProgress = require("./OnboardingProgress");
const Task = require("./Task");
const Event = require("./Event");
const EventParticipant = require("./EventParticipant");
const Course = require("./Course");
const UserCourse = require("./UserCourse");
const Evaluation = require("./Evaluation");
const EvaluationCriteria = require("./EvaluationCriteria");
const Feedback = require("./Feedback");
const Document = require("./Document");
const DocumentAccess = require("./DocumentAccess");
const Notification = require("./Notification");
const Survey = require("./Survey");
const SurveyQuestion = require("./SurveyQuestion");
const SurveyResponse = require("./SurveyResponse");
const SurveyQuestionResponse = require("./SurveyQuestionResponse");
const CoachingSession = require("./CoachingSession");

User.hasOne(OnboardingProgress, { foreignKey: "userId" });
OnboardingProgress.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Event, { as: "createdEvents", foreignKey: "createdBy" });
Event.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

User.belongsToMany(Event, {
  through: EventParticipant,
  as: "events",
  foreignKey: "userId",
});
Event.belongsToMany(User, {
  through: EventParticipant,
  as: "participants",
  foreignKey: "eventId",
});

User.hasMany(Course, { as: "createdCourses", foreignKey: "createdBy" });
Course.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

User.belongsToMany(Course, {
  through: UserCourse,
  as: "courses",
  foreignKey: "userId",
});
Course.belongsToMany(User, {
  through: UserCourse,
  as: "users",
  foreignKey: "courseId",
});
UserCourse.belongsTo(User, { foreignKey: "userId" });
UserCourse.belongsTo(Course, { foreignKey: "courseId" });

User.hasMany(Evaluation, {
  as: "employeeEvaluations",
  foreignKey: "employeeId",
});
User.hasMany(Evaluation, {
  as: "supervisorEvaluations",
  foreignKey: "supervisorId",
});
User.hasMany(Evaluation, {
  as: "reviewedEvaluations",
  foreignKey: "reviewedBy",
});
Evaluation.belongsTo(User, { as: "employee", foreignKey: "employeeId" });
Evaluation.belongsTo(User, { as: "supervisor", foreignKey: "supervisorId" });
Evaluation.belongsTo(User, { as: "reviewer", foreignKey: "reviewedBy" });

Evaluation.hasMany(EvaluationCriteria, { foreignKey: "evaluationId" });
EvaluationCriteria.belongsTo(Evaluation, { foreignKey: "evaluationId" });

User.hasMany(Feedback, { as: "sentFeedback", foreignKey: "fromUserId" });
User.hasMany(Feedback, { as: "receivedFeedback", foreignKey: "toUserId" });
Feedback.belongsTo(User, { as: "sender", foreignKey: "fromUserId" });
Feedback.belongsTo(User, { as: "recipient", foreignKey: "toUserId" });

User.hasMany(Document, { as: "uploadedDocuments", foreignKey: "uploadedBy" });
Document.belongsTo(User, { as: "uploader", foreignKey: "uploadedBy" });

Document.hasMany(DocumentAccess, { foreignKey: "documentId" });
DocumentAccess.belongsTo(Document, { foreignKey: "documentId" });

User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Survey, { as: "createdSurveys", foreignKey: "createdBy" });
Survey.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

Survey.hasMany(SurveyQuestion, { foreignKey: "surveyId" });
SurveyQuestion.belongsTo(Survey, { foreignKey: "surveyId" });

User.hasMany(SurveyResponse, { foreignKey: "userId" });
Survey.hasMany(SurveyResponse, { foreignKey: "surveyId" });
SurveyResponse.belongsTo(User, { foreignKey: "userId" });
SurveyResponse.belongsTo(Survey, { foreignKey: "surveyId" });

SurveyResponse.hasMany(SurveyQuestionResponse, {
  foreignKey: "surveyResponseId",
});
SurveyQuestion.hasMany(SurveyQuestionResponse, { foreignKey: "questionId" });
SurveyQuestionResponse.belongsTo(SurveyResponse, {
  foreignKey: "surveyResponseId",
});
SurveyQuestionResponse.belongsTo(SurveyQuestion, { foreignKey: "questionId" });

User.hasMany(CoachingSession, {
  as: "supervisorSessions",
  foreignKey: "supervisorId",
});
User.hasMany(CoachingSession, {
  as: "employeeSessions",
  foreignKey: "employeeId",
});
CoachingSession.belongsTo(User, {
  as: "supervisor",
  foreignKey: "supervisorId",
});
CoachingSession.belongsTo(User, { as: "employee", foreignKey: "employeeId" });

// Export models and connection
module.exports = {
  sequelize,
  User,
  OnboardingProgress,
  Task,
  Event,
  EventParticipant,
  Course,
  UserCourse,
  Evaluation,
  EvaluationCriteria,
  Feedback,
  Document,
  DocumentAccess,
  Notification,
  Survey,
  SurveyQuestion,
  SurveyResponse,
  SurveyQuestionResponse,
  CoachingSession,
};
