'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Items.init({
    itemId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemType: DataTypes.NUMBER,
    itemGroup: DataTypes.NUMBER,
    itemValue: DataTypes.NUMBER,
    conversation: DataTypes.STRING,
    stackName: DataTypes.STRING,
    mediumText: DataTypes.STRING,
    multipleAllowed: DataTypes.BOOLEAN,
    isAutoEquipable: DataTypes.BOOLEAN,
    equipOrb: DataTypes.STRING,
    thoughtType: DataTypes.NUMBER,
    bonus: DataTypes.STRING,
    fixtureBonus: DataTypes.STRING,
    fixtureDescription: DataTypes.STRING,
    requirement: DataTypes.STRING,
    timeLeft: DataTypes.NUMBER,
    isStackable: DataTypes.BOOLEAN,
    isEvidence: DataTypes.BOOLEAN,
    isInventoryItem: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Items',
    freezeTableName: true
  });
  return Items;
};
