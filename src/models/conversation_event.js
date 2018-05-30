export default (sequelize, DataTypes) => {
  const conversationEvent = sequelize.define('conversation_event', {
    scope: DataTypes.STRING,
    type: DataTypes.STRING,
    conversation_token: DataTypes.STRING,
    device_token: DataTypes.STRING,
    content: DataTypes.STRING
  }, {})

  conversationEvent.associate = (models) => {
    // associations can be defined here
  }

  return conversationEvent
}
