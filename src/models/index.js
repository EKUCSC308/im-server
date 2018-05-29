/*
'use strict'

let fs = require('fs')
let path = require('path')
let Sequelize = require('sequelize')
let basename = path.basename(__filename)
let env = process.env.NODE_ENV || 'development'
let config = require(path.resolve(__dirname) + '/../../config/database.json')[env]
let db = {}
let sequelize = new Sequelize(process.env[config.use_env_variable], config)

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    console.log('file >>>', file)
    let model = sequelize['import'](__dirname, file)
    // db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
*/