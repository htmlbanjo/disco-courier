'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Actors_skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      internalID: {
        type: Sequelize.NUMBER
      },
      gameID: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      shortDescription: {
        type: Sequelize.STRING
      },
      longDescription: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Actors_skills');
  }
};