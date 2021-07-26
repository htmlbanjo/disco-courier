'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items_game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Items_game.init({
    internalID: DataTypes.NUMBER,
    name: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemType: DataTypes.NUMBER,
    itemGroup: DataTypes.NUMBER,
    conversation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Items_game',
  });
  return Items_game;
};