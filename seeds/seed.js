const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

// Update imports to use .js files
const userData = require('./userData.js');
const postData = require('./postData.js');
const commentData = require('./commentData.js');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const post of postData) {
    await Post.create({
      ...post,
      user_id: users.find((user) => user.dataValues.username === post.user_id)
        .id,
    });
  }

  for (const comment of commentData) {
    await Comment.create({
      ...comment,
      user_id: users.find((user) => user.dataValues.id === comment.user_id).id,
      post_id: comment.post_id,
    });
  }

  process.exit(0);
};

seedDatabase();
