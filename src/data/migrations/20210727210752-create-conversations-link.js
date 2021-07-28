'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations_link', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      originConversationId: {
        type: Sequelize.NUMBER
      },
      originDialogId: {
        type: Sequelize.NUMBER
      },
      destinationConversationId: {
        type: Sequelize.NUMBER
      },
      destinationDialogId: {
        type: Sequelize.NUMBER
      },
      isConnector: {
        type: Sequelize.NUMBER
      },
      priority: {
        type: Sequelize.NUMBER
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
    await queryInterface.dropTable('Conversations_link');
  }
};