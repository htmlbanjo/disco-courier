'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations_task', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      conversationId: {
        type: Sequelize.NUMBER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      taskActive: {
        type: Sequelize.STRING
      },
      taskComplete: {
        type: Sequelize.STRING
      },
      taskCanceled: {
        type: Sequelize.STRING
      },
      taskReward: {
        type: Sequelize.STRING
      },
      taskTimed: {
        type: Sequelize.BOOLEAN
      },
      subtasks: {
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
    await queryInterface.dropTable('Conversations_task');
  }
};