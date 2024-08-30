'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('measures', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      measure_datetime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, 
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('gas', 'water'),
        allowNull: false,
      },
      hasConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      idClient: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('measures');
  },
};
