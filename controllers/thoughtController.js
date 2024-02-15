const { User, Thought } = require('../models');

module.exports = {

// Get All Thoughts 
// /api/thoughts
getThoughts(req, res) {
    Thought.find()
    .then((thoughts) => res.json(thoughts))
    .catch((err) => res.status(500).json(err));
},

// Get Single Thought
// /api/thoughts/thoughtId
getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .then((thoughtText) =>
        !thoughtText
        ? res.status(404).json({ message: "No thought with that id" })
        : res.json(thoughtText)
    )
    .catch((err) => res.status(500).json(err));
},

// Create Thought
// api/thoughts/userId 
// body expects thoughtText and username
createThought({ params, body }, res) {
    Thought.create(body)
    .then(dbThoughtData => {
        User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { thoughts: dbThoughtData._id }},
        { new: true }
        )
    .then(dbUserData => {
        if(!dbUserData) {
        res.status(404).json({ message: "No user found with this id" });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
},

// Update Thought
// /api/thoughts/thoughtId 
// body expects thoughtText and username
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    body,
    { new: true }
    )
    .then(dbThoughtData => {
    if(!dbThoughtData) {
        res.status(404).json({ message: "No thought with that id" });
        return;
    }
    res.json(dbThoughtData);
    })
    .catch(err => res.status(500).json(err));
},

//Delete Thought
// /api/thoughts/thoughtId 
deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
    .then(dbThoughtData => {
    if(!dbThoughtData) {
        res.status(404).json({ message: "No thought with that id"});
        return;
    }
    User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughtId }},
        )
    .then(() => {
        res.status(200).json({ message: `Successfully deleted the thought from user id ${params.userId}` });
    })
    .catch(err => res.status(500).json(err));
    })  
    .catch(err => res.status(500).json(err));
},

// Add Reaction
// use path /api/thoughts/thoughtId/reactions
// body of reactionBody and username
addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $addToSet: { reactions:  body }},
    { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
        if(!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id" });
        return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(500).json(err));
},

// Delete Reaction
// /api/thoughts/thoughtId/reactions/reactionId
deleteReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $pull: { reactions: { reactionId: params.reactionId }}},
    { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
    if(!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id" });
        return;
    }
    res.json({ message: "Successfully deleted the reaction" });
    })
    .catch(err => res.status(500).json(err));
},
};