'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items_book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Items_book.init({
    internalID: DataTypes.NUMBER,
    name: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemType: DataTypes.NUMBER,
    itemGroup: DataTypes.NUMBER,
    conversation: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Items_book',
  });
  return Items_book;
};