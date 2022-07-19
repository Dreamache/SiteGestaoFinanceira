const revenue = require('../../model/revenue')
// Repository for the revenues
class revenueRepository{

    insert(obj){
        return revenue.create(
            {
              name: obj.name,
              value: obj.value,
              AccountId: obj.AccountId
            })
    }

    update(id, obj){
        revenue.update({...obj},
        {
            where:{id: id}
        })
    }

    delete(id){
        revenue.destroy({
            where:{
                id: id
            }
        })
    }

    findByName(name, uid){
        return revenue.findAll({where:{
            name:name, 
            AccountId:uid
        }})
    }

    findById(id){
        return revenue.findByPk(id);
    }

    findAll(uid){
        return revenue.findAll({where:{AccountId:uid}});
    }
}

module.exports= revenueRepository;