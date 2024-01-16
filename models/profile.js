'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {foreignKey: "UserId"})
    }
  }
  Profile.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: DataTypes.STRING,
      age: DataTypes.INTEGER,
      imgUrl: {
        type: DataTypes.STRING,
        defaultValue:
          "https://pbs.twimg.com/profile_images/1228666363939606529/cFZCx2CB_400x400.jpg",
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id"
        }
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};