'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations_orb', {
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
      checkType: {
        type: Sequelize.NUMBER
      },
      condition: {
        type: Sequelize.STRING,
      },
      instruction: {
        type: Sequelize.STRING
      },
      difficulty: {
        type: Sequelize.NUMBER
      },
      placement: {
        type: Sequelize.STRING
      },
      actorId: {
        type: Sequelize.NUMBER
      },
      conversantId: {
        type: Sequelize.NUMBER
      },
      altOrbText: {
        type: Sequelize.STRING
      },
      onUse: {
        type: Sequelize.STRING
      },
      dialogOverrideCondition: {
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
    await queryInterface.dropTable('Conversations_orb');
  }
};