const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EventParticipant = sequelize.define(
    "EventParticipant",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Events",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      attended: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  EventParticipant.associate = (models) => {
    EventParticipant.belongsTo(models.Event, {
      foreignKey: "eventId",
      as: "event",
    });
    EventParticipant.belongsTo(models.User, {
      foreignKey: "userId",
      as: "participant",
    });
  };

  return EventParticipant;
};
