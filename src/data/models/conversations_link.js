'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations_link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversations_link.init({
    originConversationId: DataTypes.NUMBER,
    originDialogId: DataTypes.NUMBER,
    destinationConversationId: DataTypes.NUMBER,
    destinationDialogId: DataTypes.NUMBER,
    isConnector: DataTypes.NUMBER,
    priority: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'Conversations_link',
    freezeTableName: true
  });
  return Conversations_link;
};