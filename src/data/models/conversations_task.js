'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations_task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversations_task.init({
    conversationId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    taskActive: DataTypes.STRING,
    taskComplete: DataTypes.STRING,
    taskCanceled: DataTypes.STRING,
    taskReward: DataTypes.STRING,
    taskTimed: DataTypes.BOOLEAN,
    actorId: DataTypes.NUMBER,
    conversantId: DataTypes.NUMBER,
    subtasks: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Conversations_task',
  });
  return Conversations_task;
};