const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(thoughts => res.json(thoughts))
      .catch(err => res.status(500).json(err));
  },
  // Get a single thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought with this ID!' }))
      .catch(err => res.status(500).json(err));
  },
  // Create a thought and push it to the associated user's thoughts array
  createThought(req, res) {
    Thought.create(req.body)
      .then(thought => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
      })
      .then(user => user ? res.json(user) : res.status(404).json({ message: 'No user with this ID!' }))
      .catch(err => res.status(500).json(err));
  },
  // Update a thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought with this ID!' }))
      .catch(err => res.status(500).json(err));
  },
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought with this ID!' }))
      .catch(err => res.status(500).json(err));
  },
  // Create a reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    )
      .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought with this ID!' }))
      .catch(err => res.status(500).json(err));
  },
  // Delete a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then(thought => thought ? res.json(thought) : res.status(404).json({ message: 'No thought with this ID!' }))
      .catch(err => res.status(500).json(err));
  }
};
