'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actors_attribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Actors_attribute.init({
    internalID: DataTypes.NUMBER,
    gameID: DataTypes.STRING,
    name: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    longDescription: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Actors_attribute',
  });
  return Actors_attribute;
};