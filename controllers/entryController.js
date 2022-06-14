const Entry = require('../models/entries')
const Topic = require('../models/topics')
const User = require('../models/users')
const mongoose = require('mongoose')

const entry_add_get = (req, res, requireAuth) =>{
    res.render('add.ejs', {title: "New Entry"})
}

const entry_add_post = async (req,res) =>{
    const topicname = req.body.topic

    // const topic =await topic.findOne({topic: topicname },(err,topic)=>{
    //     if(err){
    //         console.log(err)
    //         return err
    //     }else if(topic){

    //     }
    // })
    const topic = await Topic.findOne({topic: topicname});
    if (topic){
        const entry = new Entry(req.body)
        entry.author = res.locals.user.username;
        entry.topicId = topic._id;
        entry.topic = topicname
        entry.save()
        .then((createdEntry) => {
            topic.entries.push(createdEntry._id)
            topic.date = createdEntry.createdAt;
            topic.save()
            .then(async(updatedTopic) => {
                const user = await User.findOne({username: res.locals.user.username})
                user.entries.push(entry._id);
                user.save()
                .then((result)=>{
                    res.redirect('/topic/' + updatedTopic.topic)
                })
            })
            

        })
    }else {
        const newTopic = new Topic({topic: topicname})
        const entry = new Entry(req.body)
        entry.author = res.locals.user.username;
        entry.topicId = newTopic._id;
        entry.save()
        .then((createdEntry) => {
            newTopic.entries.push(createdEntry._id)
            newTopic.date = createdEntry.createdAt;
            newTopic.save()
            .then(async(updatedTopic) => {
                const user = await User.findOne({username: res.locals.user.username})
                user.entries.push(entry._id);
                user.save()
                .then((result)=>{
                    res.redirect('/topic/' + updatedTopic.topic)
                })
            })
            

        })

    }
    
}

entry_like_get = async (req, res) =>{
    entryId = req.params.entryId;
    user = res.locals.user;
     
    await Entry.findById(entryId, 'likes')
    .then(async (entry)=>{
        
        var like = entry.likes.count
        if(entry.likes.authors.includes(user.username)){
            console.log(entry.likes.count)
            await Entry.findOneAndUpdate({_id: entryId},
                  {$pull:{'likes.authors': user.username}, 'likes.count': like - 1  },
                {new: true})
                .then(async(result)=>{
                    await User.findOneAndUpdate(user, {$pull:{likedEntries: entryId} })
                    res.status(200).send(result);
                })
                .catch((err)=>{
                    console.log(err)
                    res.sendStatus(400)
                })
        }else {
            console.log("yes")
            console.log(entry.likes.count)
            await Entry.findOneAndUpdate({_id: entryId},
                {$push:{'likes.authors': user.username}, 'likes.count': like + 1 } ,
                {new: true})
                .then(async(result)=>{
                    await User.findOneAndUpdate(user, {$push:{likedEntries: entryId} })
                    res.status(200).send(result);
                })
                .catch((err)=>{
                    console.log(err)
                    res.sendStatus(400)
                })
        }
        
    })
    .catch((err)=>{
        console.log(err)
        res.sendStatus(400)
    })
}

entry_delete = (req, res)=>{
    var entryId = req.params.entryId
    Entry.deleteOne({_id: entryId}).then((result)=>{
        res.status(200).send(true)
    })
    .catch((err)=>{
        console.log(err)
        res.status(304).send(false)
    })
}

entry_get = (req, res)=>{
    var entryId = req.params.entryId
    Entry.findById(entryId)
    .then((entry)=>{
        Topic.findById(entry.topicId)
        .then((topic)=>{
            
            res.redirect('/topic/'+ topic.topic + '#' + entry._id)
        })
    })
}




  



module.exports = {
    entry_add_get,
    entry_add_post,
    entry_like_get,
    entry_delete,
    entry_get
}