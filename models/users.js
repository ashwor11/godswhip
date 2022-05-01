const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const fs = require('fs')
const path = require('path')


const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type:String,
        require: true
    },
    isAdmin:{
        type:Boolean,
        require: true,
        default: false,
    },
    biography:{
        type: String,
        require: true,
        default: ""
    },
    entries:{
        type: [mongoose.Schema.Types.ObjectId],
        require: true,
        default: []
    },
    followers:{
        type: [String],
        require: true,
        default: []
    },
    followings:{
        type: [String],
        require: true,
        default: []
    },
    likedEntries:{
        type: [mongoose.Schema.Types.ObjectId],
        require: true,
        default: []
    },
    date: {
         type: Date,
         default: Date.now 
    },
    picture:{
        data:{
            type: Buffer,
            default: fs.readFileSync(path.join(__dirname, '../public', 'profilephoto.png'))
        },
        contentType:{
            type: String,
            default: 'image/png'
        }
    }
})

userSchema.statics.login = async function(username,password){
    
    
    const user = await this.findOne({username})
    if (user){
        const auth = await bcrypt.compare(password,user.password)
        console.log(auth)
        if (auth){
            return user
        }else{
            throw Error('Password is wrong.')
        }
    }else{
        throw Error('Username doesn\'t exist.')
    }
}

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

const User = new mongoose.model('user',userSchema)

module.exports = User

