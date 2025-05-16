const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("employee", "supervisor", "manager", "admin"),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    programType: {
      type: DataTypes.ENUM(
        "inkompass",
        "earlyTalent",
        "apprenticeship",
        "academicPlacement",
        "workExperience"
      ),
      allowNull: true,
    },
    supervisorId: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    onboardingProgress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("passwordHash")) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
    },
  }
);

// Instance method to check password
User.prototype.checkPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = User;
