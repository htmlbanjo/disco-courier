'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations_check', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dialogId: {
        type: Sequelize.NUMBER
      },
      conversationid: {
        type: Sequelize.NUMBER
      },
      checkType: {
        type: Sequelize.STRING
      },
      checkDifficulty: {
        type: Sequelize.NUMBER
      },
      checkGameDifficulty: {
        type: Sequelize.NUMBER
      },
      isRoot: {
        type: Sequelize.NUMBER
      },
      isGroup: {
        type: Sequelize.NUMBER
      },
      isHub: {
        type: Sequelize.BOOLEAN
      },
      actorId: {
        type: Sequelize.NUMBER
      },
      actorName: {
        type: Sequelize.STRING
      },
      conversantId: {
        type: Sequelize.NUMBER
      },
      conversantName: {
        type: Sequelize.STRING
      },
      shortDescription: {
        type: Sequelize.STRING
      },
      longDescription: {
        type: Sequelize.TEXT
      },
      refId: {
        type: Sequelize.STRING
      },
      forced: {
        type: Sequelize.BOOLEAN
      },
      flag: {
        type: Sequelize.STRING
      },
      skillRefId: {
        type: Sequelize.STRING
      },
      modifiers: {
        type: Sequelize.TEXT
      },
      inputId: {
        type: Sequelize.STRING
      },
      outputId: {
        type: Sequelize.STRING
      },
      sequence: {
        type: Sequelize.STRING
      },
      conditionPriority: {
        type: Sequelize.NUMBER
      },
      conditionString: {
        type: Sequelize.STRING
      },
      userScript: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conversations_check');
  }
};