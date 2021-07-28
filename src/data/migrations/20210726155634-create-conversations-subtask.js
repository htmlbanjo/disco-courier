'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations_subtask', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parentTaskId: {
        type: Sequelize.NUMBER
      },
      active: {
        type: Sequelize.STRING
      },
      done: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      cancel: {
        type: Sequelize.STRING
      },
      isTimed: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Conversations_subtask');
  }
};