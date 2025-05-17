const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Feedback = sequelize.define(
  "Feedback",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fromUserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    toUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    toDepartment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("onboarding", "training", "support", "general"),
      allowNull: false,
      defaultValue: "general",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Feedback;
