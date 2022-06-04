'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items_consumable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Items_consumable.init({
    itemId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemType: DataTypes.NUMBER,
    itemGroup: DataTypes.NUMBER,
    itemValue: DataTypes.NUMBER,
    mediumText: DataTypes.STRING,
    multipleAllowed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Items_consumable',
    freezeTableName: true
  });
  return Items_consumable;
};