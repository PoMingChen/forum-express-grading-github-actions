'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Restaurants', 'viewCounts', 'view_counts')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Restaurants', 'view_counts', 'viewCounts')
  }
}
