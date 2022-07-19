const { DataTypes, Model } = require("sequelize");
const sequelize = require('../database');

const expense= require('./expense');
const revenue= require('./revenue');

class Account extends Model{}

Account.init({
    username:{
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false
    },
},{
    sequelize,
    modelName: 'Account',
    tableName: 'accounts'
});

Account.hasMany(expense);
Account.hasMany(revenue);
expense.belongsTo(Account);
revenue.belongsTo(Account);

module.exports= Account;