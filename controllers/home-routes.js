const router = require('express').Router();

const sequelize = require('../config/connection');
const { Blog, User} = require('../models');

router.get('/', (req, res) => {
  Blog.findAll({
    attributes: [
      'id',
      'movie',
      'title',
      'text',
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


      res.render('homepage', { blogs,
      loggedIn: req.session.loggedIn });

    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/', (req, res) => {
  console.log(req.session);

  // other logic...
});

router.get('/blog/:id', (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'movie',
      'title',
      'text',
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
      if (!dbBlogData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const blog = dbBlogData.get({ plain: true });

      // pass data to template
      res.render('single-blog', { blog });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;