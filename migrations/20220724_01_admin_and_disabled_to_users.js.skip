const { DataTypes } = require('sequelize')

async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'admin', {
    type: DataTypes.BOOLEAN,
    default: false
  })
  await queryInterface.addColumn('users', 'disabled', {
    type: DataTypes.BOOLEAN,
    default: false
  })
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'admin')
  await queryInterface.removeColumn('users', 'disabled')
}

module.exports = { up, down };
