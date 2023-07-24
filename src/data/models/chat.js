'use strict';
const moment = require('moment');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      chat.belongsTo(models.user, {
        foreignKey: 'sender_id',
        as:'sender'
      })
      chat.belongsTo(models.user, {
        foreignKey: 'receiver_id',
        as:'receiver'
      })
    }
  }
  chat.init({
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    message: DataTypes.TEXT,
    time:{
      type: DataTypes.VIRTUAL,
      get() {
        return `${moment(this.created_at).format('LT')}`;
      }
    },
    date:{
      type: DataTypes.VIRTUAL,
      get() {
        return `${moment(this.created_at).format('DD-MM-YYYY')}`;
      }
    }
  }, {
    sequelize,
    modelName: 'chat',
    createdAt:'created_at',
    updatedAt:'updated_at',
    // paranoid: true,
    deletedAt:'deleted_at'
  });
  return chat;
};