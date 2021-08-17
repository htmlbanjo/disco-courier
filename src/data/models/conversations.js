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
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    taskActive: DataTypes.STRING,
    taskComplete: DataTypes.STRING,
    taskCanceled: DataTypes.STRING,
    taskReward: DataTypes.STRING,
    taskTimed: DataTypes.BOOLEAN,
    checkType: DataTypes.NUMBER,
    condition: DataTypes.TEXT,
    instruction: DataTypes.TEXT,
    placement: DataTypes.STRING,
    actorId: DataTypes.NUMBER,
    actorName: DataTypes.STRING,
    conversantId: DataTypes.NUMBER,
    conversantName: DataTypes.STRING,
    altOrbText: DataTypes.STRING,
    onUse: DataTypes.STRING,
    dialogOverrideCondition: DataTypes.STRING,
    subtasks: DataTypes.TEXT,
    numSubtasks: DataTypes.NUMBER,
    isTask: DataTypes.BOOLEAN,
    isOrb: DataTypes.BOOLEAN,
    hasSubtask: DataTypes.BOOLEAN,
    isHub: DataTypes.BOOLEAN,
    isDoor: DataTypes.BOOLEAN,
    dialogLength: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Conversations',
    freezeTableName: true
  });
  return Conversations;
};