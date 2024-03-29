const { Thought } = require('../models');
const User = require('../models/User');

module.exports = {
// Get All Users
getUsers(req, res) {
    User.find({})
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.status(500).json(err));
},

// Get Single User
getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
    .populate("thoughts")
    .populate("friends")
    .select("-__v")
    .then(dbUserData => {
        if(!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(500).json(err));
},

// Create User
// /api/users/ 
// body expects username and email
createUser(req, res) {
    User.create(req.body)
    .then((dbUserData) => res.json(dbUserData))
    .catch(err => res.status(500).json(err));
},

// Update User
// /api/users/userId
// body expects username and email 
updateSingleUser({ params, body }, res)  {
    User.findOneAndUpdate({ _id: params.userId }, body, { runValidators: true })
    .then((dbUserData) => {
    if(!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
    }
    res.json (dbUserData);
    })
    .catch(err => res.status(500).json(err));  
},

// Delete User
// /api/users/userId
deleteSingleUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
    .then(dbUserData => {
    if(!dbUserData) {
        res.status(404).json ({ message: "No user found with this id" });
        return;
    }
    User.updateMany({ _id: { $in: dbUserData.friends }},
        { $pull: { friends: params.id } }
    )
    .then(() => {
    Thought.deleteMany({ username: dbUserData.username }) 
    .then(() => {
    res.json({ message: "Successfully deleted user, associated friend(s) and associated thought(s)" });
    })
    .catch(err => res.status(500).json(err));
    }) 
    .catch(err => res.status(500).json(err));    
    })
    .catch(err => res.status(500).json(err));
},

// Add Friend
// /api/users/userId/friends/friendId
addFriend(req, res) {

    User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId }},
    { new: true, runValidators: true }
    ) 
    .then(dbUserData => {
    if(!dbUserData) {
        res.status(404).json({ message: "No user found with this Id" })
        return;
    }
    res.json(dbUserData);
    })
    .catch(err => res.status(500).json(err));
},

// Delete Friend
// /api/users/userId/friends/friendId
deleteFriend({ params}, res) {
    User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { friends: params.friendId }},
    { new: true, runValidators: true }
    )
    .then(dbUserData => {
        if(!dbUserData) {
        res.status(404).json({ message: "No user found with this Id" });
        return;
    }
    res.json(dbUserData);
    })
    .catch(err => res.status(500).json(err))
    },
};