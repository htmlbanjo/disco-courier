'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations_check extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversations_check.init({
    dialogId: DataTypes.NUMBER,
    conversationid: DataTypes.NUMBER,
    checkType: DataTypes.STRING,
    checkDifficulty: DataTypes.NUMBER,
    isRoot: DataTypes.NUMBER,
    isGroup: DataTypes.NUMBER,
    isHub: DataTypes.BOOLEAN,
    actorId: DataTypes.NUMBER,
    conversantId: DataTypes.NUMBER,
    shortDescription: DataTypes.STRING,
    longDescription: DataTypes.TEXT,
    refId: DataTypes.STRING,
    forced: DataTypes.BOOLEAN,
    flag: DataTypes.STRING,
    skillRefId: DataTypes.STRING,
    modifiers: DataTypes.TEXT,
    inputId: DataTypes.STRING,
    outputId: DataTypes.STRING,
    sequence: DataTypes.STRING,
    conditionPriority: DataTypes.NUMBER,
    conditionString: DataTypes.STRING,
    userScript: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Conversations_check',
  });
  return Conversations_check;
};