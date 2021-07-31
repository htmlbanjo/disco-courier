'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations_dialogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parentId: {
        type: Sequelize.NUMBER
      },
      dialogId: {
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
      refId: {
        type: Sequelize.STRING
      },
      isHub: {
        type: Sequelize.NUMBER
      },
      dialogShort: {
        type: Sequelize.STRING
      },
      dialogLong: {
        type: Sequelize.TEXT
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
      skillRefId: {
        type: Sequelize.STRING
      },
      skillId: {
        type: Sequelize.NUMBER
      },
      skillName: {
        type: Sequelize.STRING
      },
      modifiers: {
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
      inputId: {
        type: Sequelize.STRING
      },
      outputId: {
        type: Sequelize.STRING
      },
      flag: {
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
    await queryInterface.dropTable('Conversations_dialogs');
  }
};