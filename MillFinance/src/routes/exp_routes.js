const express= require('express');
const router= express.Router();

const ensureAuthenticated= require('../middleware/auth');

const expenseRepository = require('../database/repository/expense_repo');
const eRepo= new expenseRepository();

router.get('/', ensureAuthenticated, async (req, res)=>{
    let items= await eRepo.findAll(parseInt(req.user.id));
    
    res.render('pages/expense', {user: req.user, items: items, title:"Expenses"});
});

router.get('/new', ensureAuthenticated, (req, res)=>{
    let options={
        formName: 'Create new Expense!',
        transaction: null,
        url: '/dashboard/expenses',
        action: null,
        type: "exp"
    }
    res.render('pages/Tran_new', {error: null, user: req.user, option: options});
});

router.get('/edit/:id', ensureAuthenticated, async (req, res)=>{
    let id= parseInt(req.params["id"]);
    let item= await eRepo.findById(id);

    let options={
        formName: 'Edit',
        transaction: item,
        url: '/dashboard/expenses/edit',
        action: 1,
        type: "exp"
    }

    res.render('pages/Tran_edit', {error: null, user: req.user, option: options});
});

router.post('/', ensureAuthenticated, (req, res)=>{
    let name= req.body.name;
    let value= parseFloat(req.body.value).toFixed(2);
    let repo

    let options={
        formName: 'Create new Expense!',
        transaction: null,
        url: '/dashboard/expenses',
        action: null,
        type: "exp"
    }

    if(name){
        if(value>0){
            repo= new expenseRepository();

            let it= {name: name, value: value, AccountId: parseInt(req.user.id)}
            repo.insert(it);
            res.redirect('/dashboard/expenses');
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

    let item= eRepo.findById(id);
    let options={
        formName: 'Edit',
        transaction: item,
        url: '/dashboard/expenses/edit',
        action: 1,
        type: "exp"
    }

    if(name.length>0){
        if(value>0){
            let it= {
                name: name,
                value: value
            }

            eRepo.update(id, it);
            res.redirect('/dashboard/expenses');
        }
        else{
            let error={
                message: "The value inserted must be filled and it cannot be null!"
            }
            res.render('pages/Tran_edit', {option: options ,user: req.user, error: error});
        }
    }
    else{
        let error={
            message: "The name field must be filled!"
        }
        res.render('pages/Tran_edit', {option: options ,user: req.user, error: error});
    }
});

router.post('/remove/:id', ensureAuthenticated, (req, res)=>{
    let id= parseInt(req.params["id"]);
    eRepo.delete(id);
    
    res.redirect('/dashboard/expenses');
});

module.exports= router;