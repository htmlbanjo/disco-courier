'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Items_thought extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Items_thought.init({
    itemId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    displayName: DataTypes.STRING,
    description: DataTypes.TEXT,
    itemType: DataTypes.NUMBER,
    itemGroup: DataTypes.NUMBER,
    thoughtType: DataTypes.NUMBER,
    thoughtType: DataTypes.NUMBER,
    bonus: DataTypes.STRING,
    fixtureBonus: DataTypes.STRING,
    fixtureDescription: DataTypes.STRING,
    requirement: DataTypes.STRING,
    timeLeft: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Items_thought',
    freezeTableName: true
  });
  return Items_thought;
};