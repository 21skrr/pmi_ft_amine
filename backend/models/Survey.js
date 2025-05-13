const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Survey = sequelize.define(
  "Survey",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM(
        "3-month",
        "6-month",
        "12-month",
        "training",
        "general"
      ),
      allowNull: false,
      defaultValue: "general",
    },
    status: {
      type: DataTypes.ENUM("draft", "active", "completed"),
      allowNull: false,
      defaultValue: "draft",
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    targetRole: {
      type: DataTypes.ENUM("employee", "supervisor", "manager", "hr", "all"),
      allowNull: false,
      defaultValue: "employee",
    },
    targetProgram: {
      type: DataTypes.ENUM(
        "inkompass",
        "earlyTalent",
        "apprenticeship",
        "academicPlacement",
        "workExperience",
        "all"
      ),
      allowNull: false,
      defaultValue: "all",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Survey;
