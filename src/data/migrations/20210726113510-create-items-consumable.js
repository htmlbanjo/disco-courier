'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Items_consumable', {
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
      itemValue: {
        type: Sequelize.NUMBER
      },
      mediumText: {
        type: Sequelize.STRING
      },
      multipleAllowed: {
        type: Sequelize.BOOLEAN
      },
      equipOrb: {
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
    await queryInterface.dropTable('Items_consumable');
  }
};