const { DataTypes, Model } = require("sequelize");
const sequelize = require('../database');

class expense extends Model{}

expense.init({
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    value:{
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false
    }
},{
    sequelize,
    modelName: 'expense',
    tableName: 'expenses'
});

module.exports= expense; 

//No model expense e criado um nome e valor atribuidos e um model name expense e table name expenses 