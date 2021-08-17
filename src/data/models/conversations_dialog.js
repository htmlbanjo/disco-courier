'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations_dialog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversations_dialog.init({
    parentId: DataTypes.NUMBER,
    dialogId: DataTypes.NUMBER,
    checkType: DataTypes.STRING,
    checkDifficulty: DataTypes.NUMBER,
    checkGameDifficulty: DataTypes.NUMBER,
    isRoot: DataTypes.NUMBER,
    isGroup: DataTypes.NUMBER,
    refId: DataTypes.STRING,
    isHub: DataTypes.NUMBER,
    dialogShort: DataTypes.STRING,
    dialogLong: DataTypes.TEXT,
    actorId: DataTypes.NUMBER,
    actorName: DataTypes.STRING,
    conversantId: DataTypes.NUMBER,
    conversantName: DataTypes.STRING,
    skillRefId: DataTypes.STRING,
    skillId: DataTypes.NUMBER,
    skillName: DataTypes.STRING,
    modifiers: DataTypes.STRING,
    sequence: DataTypes.STRING,
    conditionPriority: DataTypes.NUMBER,
    conditionString: DataTypes.STRING,
    userScript: DataTypes.STRING,
    inputId: DataTypes.STRING,
    outputId: DataTypes.STRING,
    flag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Conversations_dialog',
    freezeTableName: true
  });
  return Conversations_dialog;
};