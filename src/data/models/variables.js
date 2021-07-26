'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Variables extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Variables.init({
    internalID: DataTypes.NUMBER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    initialValue: DataTypes.STRING,
    type: DataTypes.STRING,
    label: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Variables',
  });
  return Variables;
};