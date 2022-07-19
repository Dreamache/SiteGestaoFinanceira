const express= require('express');
const bcrypt= require('bcrypt');
const router= express.Router();
const passport= require('passport');

const AccountRepository = require('../database/repository/account_repo')
const aRepo= new AccountRepository();

const saltRounds= 12;

router.get("/", (req, res) => {
    req.user= null;
    res.render('pages/welcome', {user: req.user})
});

router.get("/signup", (req, res) => {
    res.render('pages/signup', {error: null, values: null})
});

router.get("/signin", (req, res)=> {
    let error={
        message: req.flash('error')[0]
    }
    res.render('pages/signin', {user: req.user , error: error , values: null});
});

router.post("/signin", passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/signin",
    failureFlash: true
}));

router.post("/signup", async (req, res)=>{
    let uname= req.body.username
    let password = req.body.password
    let conf = req.body.passwordC

    if(password==conf){

        let ac= await aRepo.findByUsername(uname);

        if(ac.length==0){

            bcrypt.hash(password, saltRounds, (err, hash)=>{
                let account = {username: uname, password: hash};
                aRepo.insert(account);

                res.render('pages/signupok', {user: req.user}); 
            });

        }
        else{
            let error= {
                message: "The username is already in use!"
            }
            let values= {
                username: uname
            }
            res.render('pages/signup', {user: req.user, error: error, values: values})
        }
    }
    else{
        let error= {
            message: "The inserted passwords do not match!."
        }
        let values= {
            username: uname
        }
        res.render('pages/signup', {user: req.user, error: error, values: values})
    }
})

module.exports=  router;