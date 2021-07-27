'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items_thoughts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemId: {
        type: Sequelize.NUMBER
      },
      name: {
        type: Sequelize.STRING
      },
      displayName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      itemType: {
        type: Sequelize.NUMBER
      },
      itemGroup: {
        type: Sequelize.NUMBER
      },
      thoughtType: {
        type: Sequelize.NUMBER
      },
      thoughtType: {
        type: Sequelize.NUMBER
      },
      bonus: {
        type: Sequelize.STRING
      },
      fixtureBonus: {
        type: Sequelize.STRING
      },
      fixtureDescription: {
        type: Sequelize.STRING
      },
      requirement: {
        type: Sequelize.STRING
      },
      timeLeft: {
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
    await queryInterface.dropTable('Items_thoughts');
  }
};