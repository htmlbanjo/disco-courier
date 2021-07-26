'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items_keys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      internalID: {
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
      stackName: {
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
    await queryInterface.dropTable('Items_keys');
  }
};