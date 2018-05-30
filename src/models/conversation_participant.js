export default (sequelize, DataTypes) => {
  const conversationParticipant = sequelize.define('conversation_participant', {
    device_token: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {})
  conversationParticipant.associate = function (models) {
    // associations can be defined here
  }

  return conversationParticipant
}
