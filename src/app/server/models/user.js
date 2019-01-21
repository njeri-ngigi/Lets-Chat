'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    
  }, {});
  User.associate = (models) => {
    User.hasMany(models.Message, {
      foreignKey: 'senderId',
    });
    User.hasMany(models.Message, {
      foreignKey: 'recepientId',
    });
  };
  return User;
};