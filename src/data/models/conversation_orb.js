'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation_orb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversation_orb.init({
    conversationId: DataTypes.NUMBER,
    name: DataTypes.STRING,
    conversationType: DataTypes.STRING,
    conversationSubType: DataTypes.STRING,
    description: DataTypes.STRING,
    checkType: DataTypes.NUMBER,
    condition: DataTypes.STRING,
    instruction: DataTypes.STRING,
    difficulty: DataTypes.NUMBER,
    placement: DataTypes.STRING,
    actorId: DataTypes.NUMBER,
    conversantId: DataTypes.NUMBER,
    altOrbText: DataTypes.STRING,
    onUse: DataTypes.STRING,
    dialogOverrideCondition: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Conversations_orb',
    freezeTableName: true
  });
  return Conversation_orb;
};