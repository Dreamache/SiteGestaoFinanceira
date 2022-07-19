const dotenv = require('dotenv')
dotenv.config()

const express= require('express');
const expressLayouts= require('express-ejs-layouts')
const database= require('./src/database');
const routes= require('./src/routes');

const session= require('express-session');
const cookieParser= require('cookie-parser');

const flash= require('connect-flash');

const passport =  require('passport');
const LocalStrategy= require('passport-local').Strategy
const AccountRepository= require('./src/database/repository/account_repo');
const bcrypt= require('bcrypt');

passport.use(new LocalStrategy(
    async (username, password, done)=>{
      let aRepo= new AccountRepository();
      let account= await aRepo.findByUsername(username);

      if(account.length==0) done(null, false, {message: 'User not found.'});
      
      bcrypt.compare(password, account[0].password, (err, result)=>{
        if(err){
          return done(err);
        }
  
        if(!result){
          return done(null, false, {message: 'Incorrect Password.'});
        }
  
        return done(null, account[0]);
      });
    })
);

passport.serializeUser((user, done)=>{
    done(null, {id: user.id})
});
  
passport.deserializeUser(async (obj, done)=>{
    let aRepo= new AccountRepository();
    let account= await aRepo.findById(obj.id);
    done(null, account);
});

const app = express();
const port = 3010;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: "54321",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(port, async () => {
    await database.sync({ force: false });
    console.log(`Milian! your site is ready and located at: http://localhost:${3010}`);
});