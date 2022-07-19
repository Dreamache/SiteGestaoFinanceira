const Account = require('../../model/account')
// Repository for the account
class AccountRepository{

    insert(obj){
        return Account.create(
            {
              username: obj.username,
              password: obj.password
            })
    }

    update(account){
        Account.update({
            username: account.username,
            password: account.password
        },
        {
            where:{id: account.id}
        })
    }

    delete(uid){
        Account.destroy({
            where:{
                id: uid
            }
        })
    }

    findByUsername(username){
        return Account.findAll({where:{username:username}})
    }

    findById(id){
        return Account.findByPk(id)
    }

    findAll(){
        return Account.findAll();
    }
}

module.exports= AccountRepository;