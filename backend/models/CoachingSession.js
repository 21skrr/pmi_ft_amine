const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CoachingSession = sequelize.define(
  "CoachingSession",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    supervisorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    employeeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "scheduled",
        "completed",
        "cancelled",
        "rescheduled"
      ),
      allowNull: false,
      defaultValue: "scheduled",
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    outcome: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    topicTags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = CoachingSession;
