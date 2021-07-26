'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Actors.init({
    internalID: DataTypes.NUMBER,
    gameID: DataTypes.STRING,
    name: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    longDescription: DataTypes.TEXT,
    isPlayer: DataTypes.BOOLEAN,
    isNPC: DataTypes.BOOLEAN,
    isFemale: DataTypes.BOOLEAN,
    PSY: DataTypes.INTEGER,
    COR: DataTypes.INTEGER,
    ITL: DataTypes.INTEGER,
    MOT: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Actors',
  });
  return Actors;
};