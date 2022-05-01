const User = require('../models/users')
const jwt = require('jsonwebtoken')
const Entry = require('../models/entries')
const fs = require('fs')
const path = require('path')
const { request } = require('http')
const bcrypt = require('bcrypt')

const maxAge = 60*60*24

const createToken = (id) =>{
    return jwt.sign({id}, 'secret word',{expiresIn: maxAge})
}

const user_get_profile = (req,res)=>{
    var username = req.params.username;
    if (!username && res.locals.user){
        username = res.locals.user.username;
    }
    const user = User.findOne({username: username}, (err,user)=>{
        if(err){
            console.log(err)
        }else{
            Entry.find({_id: {$in: user.entries}}).sort('-createdAt')
            .then(async(entries)=>{
                Entry.find({_id: {$in: user.likedEntries}})
                .then(async(likedEntries)=>{
                    res.render('user', {profile :user, title: username, entries: entries, likedEntries})
                })
                .catch((err)=>{
                    console.log(err)
                })  
            })
        }
})}

const user_login_get = (req,res)=>{
    res.render('login',{title:'Login', error: ''})
}

const user_login_post = async (req,res)=>{
    const {username, password} = req.body
    try{
        const user = await User.login(username,password)
        const token = createToken(user._id)
        res.cookie('jwt', token,{httpOnly: true, maxAge: maxAge * 1000})
        res.redirect('/')
    }catch(e){
        res.render('login',{title: 'Login ||', error: e.message })
    }
    
}
const user_signup_get = (req,res)=>{
    res.render('signup',{title:'Sign Up', error:''})
}   
const user_signup_post = (req,res)=>{
    const user = new User(req.body)
    user.save()
    .then((result)=>{
        const token = createToken(result._id)
        res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge * 1000})
        res.redirect('/')
    })
    .catch((e)=>{
        var error;
        if(e.name === 'MongoServerError' && e.code === 11000){
            error = new Error('this username has been taken.')
        }
        res.render('signup',{title: 'Signup ||' +  e.message,error: error.message })
    })
}
const user_logout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/login')
}

const user_update_get = (req,res)=>{
    res.render('userUpdate',{title: 'Update Profile',})
}

const user_update_post = (req,res)=>{
    const username = req.params.username;
    if(req.file){
        User.findOneAndUpdate({username:username},{picture:{data: fs.readFileSync(path.join(__dirname, '../uploads', req.file.filename)), contentType: 'image/' + path.extname(req.file.filename)}, biography: req.body.biography})
    .then((user)=>{
        try{
            fs.unlinkSync(path.join(__dirname, '../uploads/', req.file.filename))
        }
        catch(err){
            console.log(err);
            res.status(400).render('404.ejs', {error: err, title: "Error"})
        }
        res.status(200).redirect('/user/'+username)
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).render('404', {title: err.toString()})
    })
    }else{
        User.findOneAndUpdate({username:username},{biography: req.body.biography})
    .then((user)=>{
        res.status(200).redirect('/user/'+username)
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).render('404', {title: err.toString()})
    })
    }
}

const user_follow_get = async (req, res) => {
    
    const username = req.params.username ;

    await User.findByIdAndUpdate(res.locals.user._id, {$push:{followings: username}},{new: true})
    .then(async (result)=>{
        await User.findOneAndUpdate({username: username}, {$push: {followers: res.locals.user.username}}, {new: true})
        .then((result1)=>{
            res.status(200).send(true);
        })
        .catch((error)=>{
            console.log(error);
            res.status(400).send(false);
        })
    })
    .catch((err)=>{
        console.error(err);
        res.status(400).send(false);
    })
}

const user_unfollow_get = async (req, res) => {
    
    const username = req.params.username ;

    await User.findByIdAndUpdate(res.locals.user._id, {$pull: {followings: username}},{new: true})
    .then(async (result)=>{
        await User.findOneAndUpdate({username: username}, {$pull: {followers: res.locals.user.username}}, {new: true})
        .then((result1)=>{
            res.status(200).send(true);
        })
        .catch((error)=>{
            console.log(error);
            res.status(400).send(false);
        })
        
    })
    .catch((err)=>{
        console.error(err);
        res.status(400).send(false);
    })
}

const user_change_password_post = async (req, res) => {

    var password = req.body.changePassword;

    const salt = await bcrypt.genSalt()
    password = await bcrypt.hash(password,salt)

    if(!res.locals.user){
        res.redirect('/user/login');
    }
    const userId = res.locals.user._id;

    User.findByIdAndUpdate(userId,{password:password})
    .then((user)=>{
        res.locals.user = user;
        res.redirect('/index');
    })
    .catch((err)=>{
        res.render('changePassword',{title:'Change Password', error:'an error occured while changing password. please try again'})
    })

}


const user_change_password_get = async (req, res) => {
    if(!res.locals.user){
        res.redirect('/index');
    }
    res.render('changePassword', {title:"Change Password", error:""})
}
  


module.exports = {
    user_signup_get,
    user_signup_post,
    user_get_profile,
    user_login_get,
    user_login_post,
    user_logout_get,
    user_update_get,
    user_update_post,
    user_follow_get,
    user_unfollow_get,
    user_change_password_get,
    user_change_password_post,
}


