'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recepientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'recepientId',
      targetKey: 'id',
      as: 'recepient',
      onDelete: 'CASCADE',
    });
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      targetKey: 'id',
      as: 'sender',
      onDelete: 'CASCADE',
    });
  };
  return Message;
};
