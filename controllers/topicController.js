const Topic = require('../models/topics')
const Entry = require('../models/entries')
const User = require('../models/users')

const topic_get = async (req, res) => {
    const topicname = req.params.topicname;
    await Topic.findOne({topic: topicname}).
    then(async (result)=>{
        await Entry.find({topicId: result._id})
        .then((entries)=>{
            res.render('entry', {entries: entries, topic: result, title: result.topic})
        })
        
    })
    .catch((err)=>{
        console.log(err)
    })
}

const topic_index_get = async (req,res)=>{
    await Topic.find().sort('-date')
    .then((result)=>{
        res.render('index', {title: "Home", topics:result})
    })
    .catch((err)=>{
        console.log(err)
        res.render('404', {title: "Error", error: err})
    })
}

const topic_index_followed_get = async (req,res)=>{
    user = res.locals.user
    var entries = []
    if(!user){
        res.status(300).redirect('/')
    }
    await User.find(user)
    .then(async(result)=>{
        await Entry.find({author: {$in: user.followings}})
        .then(async(result)=>{
            entries = result;
            for(let entry of entries){
               try{
                   var found = await Topic.findById(entry.topicId).exec();
                   entry.topic = found.topic
               }
               catch(err){
                   console.log(err)
               }
                
            }
            res.render('yourPage',{title: "Your Page",  entries:entries})
        })
        .catch((err)=>{console.error(err)})
        
    })
}

module.exports = {
    topic_get,
    topic_index_get,
    topic_index_followed_get
}


Array.prototype.pushIfNotIncluded = function(element){
    if(!this.includes(element)){
        this.push(element);
    }
}