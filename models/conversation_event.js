
module.exports = (sequelize, DataTypes) => {
  var conversation_event = sequelize.define('conversation_event', {
    scope: DataTypes.STRING,
    type: DataTypes.STRING,
    device_token: DataTypes.STRING,
    content: DataTypes.STRING
  }, {})

  conversation_event.associate = function(models) {
    // associations can be defined here
  }

  return conversation_event
}