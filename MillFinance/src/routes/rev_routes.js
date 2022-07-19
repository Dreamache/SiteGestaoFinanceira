const express= require('express');
const router= express.Router();

const ensureAuthenticated= require('../middleware/auth');

const revenueRepository = require('../database/repository/revenue_repo');
const rRepo= new revenueRepository();

router.get('/', ensureAuthenticated, async (req, res)=>{
    let rRepo= new revenueRepository();
    let items= await rRepo.findAll(parseInt(req.user.id));

    res.render('pages/revenue', {user: req.user, items:items, title:"Revenues"});
});

router.get('/new', ensureAuthenticated, async (req, res)=>{
    let options={
        formName: 'Create new Revenue!',
        transaction: null,
        url: '/dashboard/revenues',
        action: null,
        type: "rev"
    }
    res.render('pages/Tran_new', {error: null, user: req.user, option: options});
});

router.get('/edit/:id', ensureAuthenticated, async (req, res)=>{
    let id= parseInt(req.params["id"]);
    let item= await rRepo.findById(id);

    let options={
        formName: 'Edit',
        transaction: item,
        url: '/dashboard/revenues/edit',
        action: 1,
        type: "rev"
    }

    res.render("pages/Tran_edit", {option: options, user: req.user, error: null});
});

router.post('/', ensureAuthenticated, async (req, res)=>{
    let name= req.body.name;
    let value= parseFloat(req.body.value).toFixed(2);
    let repo

    let options={
        formName: 'Create new Revenue!',
        transaction: null,
        url: '/dashboard/revenues',
        action: null,
        type: "rev"
    }

    if(name){
        if(value && value>0){
            repo= new revenueRepository();

            let it= {name: name, value: value, AccountId: parseInt(req.user.id)}
            repo.insert(it);
            res.redirect('/dashboard/revenues');
        }
        else{
            let error={
                message: "The value inserted must be filled and it cannot be null!"
            }
            res.render('pages/Tran_new', {option: options ,user: req.user, error: error});
        }
    }
    else{
        let error={
            message: "The name field must be filled!"
        }
        res.render('pages/Tran_new', {option: options ,user: req.user, error: error});
    }
});

router.post('/edit', ensureAuthenticated, (req, res)=>{
    let id= parseInt(req.body.id);
    let name= req.body.name;
    let value= parseFloat(req.body.value).toFixed(2);

    let item= rRepo.findById(id);
    let options={
        formName: 'Edit',
        transaction: item,
        url: '/dashboard/revenues/edit',
        action: 1,
        type: "rev"
    }

    if(name.length>0){
        if(value>0){
            let it= {
                name: name,
                value: value
            }

            rRepo.update(id, it);
            res.redirect('/dashboard/revenues');
        }
        else{
            let error={
                message: "The value inserted must be filled and it cannot be null!"
            }
            res.render('pages/Tran_edit', {option: options ,user: req.user, error: error})
        }
    }
    else{
        let error={
            message: "The name field must be filled!"
        }
        res.render('pages/Tran_edit', {option: options ,user: req.user, error: error})
    }
});

router.post('/remove/:id', ensureAuthenticated, (req, res)=>{
    let id= parseInt(req.params["id"])
    rRepo.delete(id);
    res.redirect('/dashboard/revenues');
});

module.exports= router;