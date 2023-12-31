const { Model, DataTypes } = require('sequelize');
const { hash, compare } = require('bcrypt');
const db = require('../config/connection');

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING,
    unique: true, 
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      min: 6 
    }
  }
}, {
  sequelize: db,
  modelName: 'user',
  hooks: {
    async beforeCreate(user) {
      const hashPassword = await hash(user.password, 10);

      user.password = hashPassword;
    },
  }
});

// De-crypt user hash to compare to login pass
User.prototype.validatePass = async function(formPassword) {
  const isValid = await compare(formPassword, this.password)

  return isValid;
}



module.exports = User;