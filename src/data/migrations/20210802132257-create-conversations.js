'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations', {
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
        type: Sequelize.TEXT
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
      checkType: {
        type: Sequelize.NUMBER
      },
      condition: {
        type: Sequelize.TEXT
      },
      instruction: {
        type: Sequelize.TEXT
      },
      placement: {
        type: Sequelize.STRING
      },
      actorId: {
        type: Sequelize.NUMBER
      },
      actorName: {
        type: Sequelize.STRING
      },
      conversantId: {
        type: Sequelize.NUMBER
      },
      conversantName: {
        type: Sequelize.STRING
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
      subtasks: {
        type: Sequelize.TEXT
      },
      numSubtasks: {
        type: Sequelize.NUMBER
      },
      isTask: {
        type: Sequelize.BOOLEAN
      },
      isOrb: {
        type: Sequelize.BOOLEAN
      },
      hasSubtask: {
        type: Sequelize.BOOLEAN
      },
      isHub: {
        type: Sequelize.BOOLEAN
      },
      isDoor: {
        type: Sequelize.BOOLEAN
      },
      dialogLength: {
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
    await queryInterface.dropTable('Conversations');
  }
};