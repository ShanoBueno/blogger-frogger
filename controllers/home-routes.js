const router = require('express').Router();

const sequelize = require('../config/connection');
const { Blog, User} = require('../models');

router.get('/', (req, res) => {
  Blog.findAll({
    attributes: [
      'id',
      'movie',
      'title',
      'created_at',
      
    ],
    include: [
      
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbBlogData => {
      // pass a single post object into the homepage template
      const blogs = dbBlogData.map(blog => blog.get({ plain: true }));


      res.render('homepage', { blogs });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;