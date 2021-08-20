'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversations.init({
    conversationId: DataTypes.NUMBER,
    conversationType: DataTypes.STRING,
    conversationSubType: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    taskActive: DataTypes.STRING,
    taskComplete: DataTypes.STRING,
    taskCanceled: DataTypes.STRING,
    taskReward: DataTypes.NUMBER,
    numSubtasks: DataTypes.NUMBER,
    subtasks: DataTypes.TEXT,
    checkType: DataTypes.NUMBER,
    condition: DataTypes.TEXT,
    instruction: DataTypes.TEXT,
    placement: DataTypes.STRING,
    actorId: DataTypes.NUMBER,
    actorName: DataTypes.STRING,
    conversantId: DataTypes.NUMBER,
    conversantName: DataTypes.STRING,
    location: DataTypes.STRING,
    floor: DataTypes.STRING,
    floorNumber: DataTypes.NUMBER,
    subject: DataTypes.STRING,
    onUse: DataTypes.STRING,
    dialogOverrideCondition: DataTypes.STRING,
    dialogLength: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Conversations',
    freezeTableName: true
  });
  return Conversations;
};