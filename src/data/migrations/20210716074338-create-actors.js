'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Actors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      actorId: {
        type: Sequelize.NUMBER
      },
      refId: {
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
      isPlayer: {
        type: Sequelize.BOOLEAN
      },
      isNPC: {
        type: Sequelize.BOOLEAN
      },
      isFemale: {
        type: Sequelize.BOOLEAN
      },
      PSY: {
        type: Sequelize.INTEGER
      },
      COR: {
        type: Sequelize.INTEGER
      },
      ITL: {
        type: Sequelize.INTEGER
      },
      MOT: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Actors');
  }
};