'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {references: "UserId"})
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "E-mail cannot be empty",
          },
          notNull: {
            msg: "E-mail cannot be empty",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: "Password cannot be empty",
          },
          notNull: {
            msg: "Password cannot be empty",
          },
          min: {
            args: [8],
            msg: "Must have at least 8 characters",
          },
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: {
            msg: "Full Name cannot be empty"
          },
          notNull: {
            msg: "Full Name cannot be empty"
          }
        }
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};