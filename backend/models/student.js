"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE"
      });

      Student.hasOne(models.Room, {
        foreignKey: "occupantId",
        as: "room"
      });
    }
  }

  Student.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      admissionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lecturerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      feesCleared: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      paymentMode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      paymentRef: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Student",
      tableName: "students",
      underscored: true
    }
  );

  return Student;
};
