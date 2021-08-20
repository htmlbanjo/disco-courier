'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversations_dialogtext extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Conversations_dialogtext.init({
    parentId: DataTypes.NUMBER,
    dialogId: DataTypes.NUMBER,
    dialogLong: DataTypes.TEXT,
    actorName: DataTypes.STRING,
    conversantName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Conversations_dialogtext',
    freezeTableName: true
  });
  return Conversations_dialogtext;
};