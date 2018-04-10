module.exports = (sequelize, DataTypes) => {
  var conversation_participant = sequelize.define('conversation_participant', {
    device_token: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {})
  conversation_participant.associate = function(models) {
    // associations can be defined here
  }

  return conversation_participant
}