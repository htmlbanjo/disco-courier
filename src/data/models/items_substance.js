'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items_substance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Items_substance.init({
    itemId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemType: DataTypes.NUMBER,
    itemGroup: DataTypes.NUMBER,
    itemValue: DataTypes.NUMBER,
    mediumText: DataTypes.STRING,
    multipleAllowed: DataTypes.BOOLEAN,
    equipOrb: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Items_substance',
    freezeTableName: true
  });
  return Items_substance;
};