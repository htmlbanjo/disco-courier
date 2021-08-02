'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations_dialogtext', {
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
      dialogLong: {
        type: Sequelize.TEXT
      },
      actorName: {
        type: Sequelize.STRING
      },
      conversantName: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conversations_dialogtext');
  }
};