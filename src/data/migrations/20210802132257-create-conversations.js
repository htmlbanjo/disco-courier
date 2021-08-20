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
      conversationType: {
        type: Sequelize.STRING
      },
      conversationSubType: {
        type: Sequelize.STRING
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
      hasSubtask: {
        type: Sequelize.BOOLEAN
      },
      numSubtasks: {
        type: Sequelize.NUMBER
      },
      subtasks: {
        type: Sequelize.TEXT
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
      hasALocation: {
        type: Sequelize.BOOLEAN
      },
      location: {
        type: Sequelize.STRING
      },
      floor: {
        type: Sequelize.STRING
      },
      floorNumber: {
        type: Sequelize.NUMBER
      },
      subject: {
        type: Sequelize.STRING
      },
      onUse: {
        type: Sequelize.STRING
      },
      dialogOverrideCondition: {
        type: Sequelize.STRING
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