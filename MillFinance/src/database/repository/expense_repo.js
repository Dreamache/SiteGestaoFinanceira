const { where } = require('sequelize/dist')
const expense = require('../../model/expense')
// Repository for the expenses
class expenseRepository{

    insert(obj){
        return expense.create(
            {
              name: obj.name,
              value: obj.value,
              AccountId: obj.AccountId
            })
    }

    update(id, obj){
        expense.update({...obj},
        {
            where:{id: id}
        });
    }

    delete(id){
        expense.destroy({
            where:{
                id: id
            }
        })
    }

    findByName(name, uid){
        return expense.findAll({where:{name:name, AccountId:uid}})
    }

    findById(id){
        return expense.findByPk(id);
    }

    findAll(uid){
        return expense.findAll({where:{AccountId:uid}});
    }
}

module.exports= expenseRepository;