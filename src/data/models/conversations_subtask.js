'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations_subtask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversations_subtask.init({
    parentTaskId: DataTypes.NUMBER,
    active: DataTypes.STRING,
    done: DataTypes.STRING,
    name: DataTypes.STRING,
    cancel: DataTypes.STRING,
    isTimed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Conversations_subtask',
    freezeTableName: true
  });
  return Conversations_subtask;
};