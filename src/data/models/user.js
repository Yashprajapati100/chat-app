'use strict';
const {
  Model
} = require('sequelize');
const bcrypt=require('bcrypt')
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    image: {
      type: DataTypes.STRING,
      allowNull:false,
      get() {
        const rawValue = this.getDataValue('image');
        return rawValue ? 'http://192.168.1.116:3000/user/' + rawValue : '';
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      }
    },
    is_online: {
      type: DataTypes.SMALLINT,
      defaultValue:0
    },

  }, {
    sequelize,
    modelName: 'user',
    tableName:'users',
    createdAt:'created_at',
    updatedAt:'updated_at'
  });
  return user;
};