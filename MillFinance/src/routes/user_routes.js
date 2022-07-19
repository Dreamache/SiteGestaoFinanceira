const express= require('express');
const router= express.Router();

const ensureAuthenticated= require('../middleware/auth');

const revenueRepository = require('../database/repository/revenue_repo');
const expenseRepository = require('../database/repository/expense_repo');
const rRepo= new revenueRepository();
const eRepo= new expenseRepository();

const revRoutes= require('./rev_routes');
const expRoutes= require('./exp_routes')

router.use('/revenues', revRoutes);
router.use('/expenses', expRoutes);

router.get('/', ensureAuthenticated, async (req, res)=>{
    let items= await rRepo.findAll(parseInt(req.user.id));
    let itoms= await eRepo.findAll(parseInt(req.user.id));

    res.render('pages/dashboard', {user: req.user, items: items, itoms: itoms, title:"Hub"});
});

router.get('/logout', (req, res)=>{
    req.logout();

    req.session.destroy();

    res.redirect('/')
});

router.get('/all', ensureAuthenticated, async (req, res)=>{
    let items= await rRepo.findAll(parseInt(req.user.id));
    let itoms= await eRepo.findAll(parseInt(req.user.id));

    res.render('pages/all', {user: req.user, items: items, itoms: itoms, title:"Transactions"});
});

router.get('/all/new', ensureAuthenticated, async (req, res)=>{
    let options={
        formName: 'Create new',
        transaction: null,
        url: '/dashboard/all',
        action: null,
        type: "nun"
    }
    res.render('pages/Tran_new', {error: null, user: req.user, option: options});
});

router.post('/all', ensureAuthenticated, async (req, res)=>{
    let name= req.body.name;
    let value= parseFloat(req.body.value).toFixed(2);
    let type= parseInt(req.body.type);
    let repo

    let options={
        formName: 'Create new',
        transaction: null,
        url: '/admpanel/all',
        action: null,
        type: "nun"
    }

    if(name){
        if(value && value>0){
            if(type==1){repo= new revenueRepository();}
            else{repo= new expenseRepository();}

            let it= {name: name, value: value, AccountId: parseInt(req.user.id)}
            repo.insert(it);
            res.redirect('/dashboard/all');
        }
        else{
            let error={
                message: "The value inserted must be filled and it cannot be null!"
            }
            res.render('pages/Tran_new', {option: options ,user: req.user, error: error})
        }
    }
    else{
        let error={
            message: "The name field must be filled!"
        }
        res.render('pages/Tran_new', {option: options ,user: req.user, error: error})
    }
});

module.exports= router;