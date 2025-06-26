"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // A room belongs to a hostel (e.g., West Wing Block A)
      Room.belongsTo(models.Hostel, {
        foreignKey: "hostelId",
        as: "hostel"
      });

      // A room may optionally belong to one student (occupant)
      Room.belongsTo(models.Student, {
        foreignKey: "occupantId",
        as: "occupant"
      });
    }
  }

  Room.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "available", // options: 'available', 'occupied', 'locked'
        validate: {
          isIn: [["available", "occupied", "locked"]]
        }
      },
      hostelId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      occupantId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Room",
      tableName: "rooms",
      underscored: true
    }
  );

  return Room;
};
