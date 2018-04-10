module.exports = (sequelize, DataTypes) => {
  var conversation = sequelize.define('conversation', {
    token: DataTypes.STRING
  }, {})

  conversation.associate = function(models) {
    // associations can be defined here
  }

  return conversation
}