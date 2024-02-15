const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    await Thought.deleteMany({});

    await User.deleteMany({});

    const users = [
        {
            username: "test",
            email: "test@test.com"
        },
        {
            username: "fake",
            email: "not@real.com"
        }
    ];

    const thoughts = [
        {
            thoughtText: "Totally real thought",
            username: "test"
        },
        {
            thoughtText: "Totally fake thought",
            username: "fake"
        }
    ]

    await User.collection.insertMany(users);

    await Thought.collection.insertMany(thoughts);

    console.table(users);
    console.table(thoughts);
    console.info('Seeding complete! 🌱');
    process.exit(0);
});