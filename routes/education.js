// const express = require('express');
// const { query, validationResult } = require('express-validator');
// const { optionalAuth } = require('../middleware/auth');

// const router = express.Router();

// // Educational content data (in a real app, this would be in a database)
// const educationalContent = {
//   articles: [
//     {
//       id: 1,
//       title: 'Understanding Thalassemia: A Comprehensive Guide',
//       category: 'overview',
//       content: 'Thalassemia is an inherited blood disorder that affects the body\'s ability to produce hemoglobin and red blood cells...',
//       author: 'Dr. Sarah Johnson',
//       publishedDate: '2024-01-15',
//       readTime: 8,
//       tags: ['thalassemia', 'basics', 'overview'],
//       views: 1250
//     },
//     {
//       id: 2,
//       title: 'Types of Thalassemia and Their Symptoms',
//       category: 'types',
//       content: 'There are two main types of thalassemia: Alpha and Beta thalassemia...',
//       author: 'Dr. Rajesh Patel',
//       publishedDate: '2024-01-20',
//       readTime: 6,
//       tags: ['types', 'symptoms', 'diagnosis'],
//       views: 980
//     },
//     {
//       id: 3,
//       title: 'Treatment Options for Thalassemia Patients',
//       category: 'treatment',
//       content: 'Treatment for thalassemia varies depending on the type and severity...',
//       author: 'Dr. Priya Sharma',
//       publishedDate: '2024-01-25',
//       readTime: 10,
//       tags: ['treatment', 'transfusion', 'chelation'],
//       views: 1450
//     },
//     {
//       id: 4,
//       title: 'Living with Thalassemia: Support and Care',
//       category: 'support',
//       content: 'Living with thalassemia requires comprehensive care and support...',
//       author: 'Dr. Amit Kumar',
//       publishedDate: '2024-02-01',
//       readTime: 7,
//       tags: ['support', 'lifestyle', 'care'],
//       views: 890
//     },
//     {
//       id: 5,
//       title: 'Nutrition Guidelines for Thalassemia Patients',
//       category: 'nutrition',
//       content: 'Proper nutrition plays a crucial role in managing thalassemia...',
//       author: 'Dr. Meera Singh',
//       publishedDate: '2024-02-05',
//       readTime: 5,
//       tags: ['nutrition', 'diet', 'health'],
//       views: 720
//     }
//   ],
//   videos: [
//     {
//       id: 1,
//       title: 'What is Thalassemia? - Animated Explanation',
//       category: 'overview',
//       duration: 480, // seconds
//       thumbnail: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=400',
//       description: 'An easy-to-understand animated video explaining thalassemia',
//       views: 5200,
//       publishedDate: '2024-01-10'
//     },
//     {
//       id: 2,
//       title: 'Blood Transfusion Process for Thalassemia',
//       category: 'treatment',
//       duration: 720,
//       thumbnail: 'https://images.pexels.com/photos/6823567/pexels-photo-6823567.jpeg?auto=compress&cs=tinysrgb&w=400',
//       description: 'Step-by-step guide to blood transfusion procedure',
//       views: 3800,
//       publishedDate: '2024-01-18'
//     },
//     {
//       id: 3,
//       title: 'Iron Chelation Therapy Explained',
//       category: 'treatment',
//       duration: 600,
//       thumbnail: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=400',
//       description: 'Understanding iron chelation therapy and its importance',
//       views: 2900,
//       publishedDate: '2024-01-25'
//     }
//   ],
//   resources: [
//     {
//       id: 1,
//       title: 'Thalassemia Patient Handbook',
//       type: 'PDF',
//       category: 'overview',
//       description: 'Comprehensive guide for patients and families',
//       downloadUrl: '/resources/thalassemia-handbook.pdf',
//       fileSize: '2.5 MB',
//       downloads: 2340,
//       publishedDate: '2024-01-01'
//     },
//     {
//       id: 2,
//       title: 'Diet Plan for Thalassemia Patients',
//       type: 'PDF',
//       category: 'nutrition',
//       description: 'Specialized diet recommendations and meal planning',
//       downloadUrl: '/resources/diet-plan.pdf',
//       fileSize: '1.8 MB',
//       downloads: 1890,
//       publishedDate: '2024-01-15'
//     },
//     {
//       id: 3,
//       title: 'Emergency Care Guidelines',
//       type: 'PDF',
//       category: 'support',
//       description: 'What to do in emergency situations',
//       downloadUrl: '/resources/emergency-guidelines.pdf',
//       fileSize: '1.2 MB',
//       downloads: 1560,
//       publishedDate: '2024-02-01'
//     }
//   ],
//   faqs: [
//     {
//       id: 1,
//       question: 'What is the difference between thalassemia minor and major?',
//       answer: 'Thalassemia minor (trait) occurs when you inherit one defective gene, causing mild anemia. Thalassemia major occurs when you inherit defective genes from both parents, causing severe anemia requiring regular treatment.',
//       category: 'overview',
//       helpful: 45,
//       notHelpful: 3
//     },
//     {
//       id: 2,
//       question: 'How often do thalassemia major patients need blood transfusions?',
//       answer: 'Patients with thalassemia major typically need blood transfusions every 2-4 weeks, depending on their hemoglobin levels and overall health condition.',
//       category: 'treatment',
//       helpful: 38,
//       notHelpful: 2
//     },
//     {
//       id: 3,
//       question: 'Can people with thalassemia live normal lives?',
//       answer: 'Yes, with proper treatment including regular transfusions and iron chelation therapy, people with thalassemia can live relatively normal, productive lives.',
//       category: 'support',
//       helpful: 52,
//       notHelpful: 1
//     },
//     {
//       id: 4,
//       question: 'Is thalassemia contagious?',
//       answer: 'No, thalassemia is not contagious. It is an inherited genetic disorder passed from parents to children through genes.',
//       category: 'overview',
//       helpful: 41,
//       notHelpful: 0
//     },
//     {
//       id: 5,
//       question: 'What foods should thalassemia patients avoid?',
//       answer: 'Patients should limit iron-rich foods like red meat, liver, and iron-fortified cereals, as they already have iron overload from transfusions. Vitamin C supplements should also be avoided as they increase iron absorption.',
//       category: 'nutrition',
//       helpful: 29,
//       notHelpful: 4
//     }
//   ]
// };

// // @desc    Get educational articles
// // @route   GET /api/education/articles
// // @access  Public
// router.get('/articles', optionalAuth, [
//   query('category').optional().isString(),
//   query('page').optional().isInt({ min: 1 }),
//   query('limit').optional().isInt({ min: 1, max: 50 }),
//   query('search').optional().isString()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     let articles = [...educationalContent.articles];

//     // Filter by category
//     if (req.query.category) {
//       articles = articles.filter(article => article.category === req.query.category);
//     }

//     // Search functionality
//     if (req.query.search) {
//       const searchTerm = req.query.search.toLowerCase();
//       articles = articles.filter(article => 
//         article.title.toLowerCase().includes(searchTerm) ||
//         article.content.toLowerCase().includes(searchTerm) ||
//         article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
//       );
//     }

//     // Sort by views (most popular first)
//     articles.sort((a, b) => b.views - a.views);

//     // Pagination
//     const paginatedArticles = articles.slice(skip, skip + limit);

//     res.json({
//       success: true,
//       data: {
//         articles: paginatedArticles,
//         pagination: {
//           page,
//           limit,
//           total: articles.length,
//           pages: Math.ceil(articles.length / limit)
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Get articles error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching articles',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // @desc    Get single article
// // @route   GET /api/education/articles/:id
// // @access  Public
// router.get('/articles/:id', optionalAuth, async (req, res) => {
//   try {
//     const articleId = parseInt(req.params.id);
//     const article = educationalContent.articles.find(a => a.id === articleId);

//     if (!article) {
//       return res.status(404).json({
//         success: false,
//         message: 'Article not found'
//       });
//     }

//     // Increment view count (in a real app, this would be in database)
//     article.views += 1;

//     // Get related articles
//     const relatedArticles = educationalContent.articles
//       .filter(a => a.id !== articleId && a.category === article.category)
//       .slice(0, 3);

//     res.json({
//       success: true,
//       data: {
//         article,
//         relatedArticles
//       }
//     });

//   } catch (error) {
//     console.error('Get article error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching article',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // @desc    Get educational videos
// // @route   GET /api/education/videos
// // @access  Public
// router.get('/videos', optionalAuth, [
//   query('category').optional().isString(),
//   query('page').optional().isInt({ min: 1 }),
//   query('limit').optional().isInt({ min: 1, max: 50 })
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     let videos = [...educationalContent.videos];

//     // Filter by category
//     if (req.query.category) {
//       videos = videos.filter(video => video.category === req.query.category);
//     }

//     // Sort by views
//     videos.sort((a, b) => b.views - a.views);

//     // Pagination
//     const paginatedVideos = videos.slice(skip, skip + limit);

//     res.json({
//       success: true,
//       data: {
//         videos: paginatedVideos,
//         pagination: {
//           page,
//           limit,
//           total: videos.length,
//           pages: Math.ceil(videos.length / limit)
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Get videos error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching videos',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // @desc    Get educational resources
// // @route   GET /api/education/resources
// // @access  Public
// router.get('/resources', optionalAuth, [
//   query('category').optional().isString(),
//   query('type').optional().isString()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     let resources = [...educationalContent.resources];

//     // Filter by category
//     if (req.query.category) {
//       resources = resources.filter(resource => resource.category === req.query.category);
//     }

//     // Filter by type
//     if (req.query.type) {
//       resources = resources.filter(resource => resource.type === req.query.type);
//     }

//     // Sort by downloads
//     resources.sort((a, b) => b.downloads - a.downloads);

//     res.json({
//       success: true,
//       data: { resources }
//     });

//   } catch (error) {
//     console.error('Get resources error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching resources',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // @desc    Get FAQs
// // @route   GET /api/education/faqs
// // @access  Public
// router.get('/faqs', optionalAuth, [
//   query('category').optional().isString(),
//   query('search').optional().isString()
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     let faqs = [...educationalContent.faqs];

//     // Filter by category
//     if (req.query.category) {
//       faqs = faqs.filter(faq => faq.category === req.query.category);
//     }

//     // Search functionality
//     if (req.query.search) {
//       const searchTerm = req.query.search.toLowerCase();
//       faqs = faqs.filter(faq => 
//         faq.question.toLowerCase().includes(searchTerm) ||
//         faq.answer.toLowerCase().includes(searchTerm)
//       );
//     }

//     // Sort by helpfulness
//     faqs.sort((a, b) => b.helpful - a.helpful);

//     res.json({
//       success: true,
//       data: { faqs }
//     });

//   } catch (error) {
//     console.error('Get FAQs error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching FAQs',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // @desc    Get education statistics
// // @route   GET /api/education/stats
// // @access  Public
// router.get('/stats', optionalAuth, async (req, res) => {
//   try {
//     const stats = {
//       totalArticles: educationalContent.articles.length,
//       totalVideos: educationalContent.videos.length,
//       totalResources: educationalContent.resources.length,
//       totalFAQs: educationalContent.faqs.length,
//       totalViews: educationalContent.articles.reduce((sum, article) => sum + article.views, 0) +
//                   educationalContent.videos.reduce((sum, video) => sum + video.views, 0),
//       totalDownloads: educationalContent.resources.reduce((sum, resource) => sum + resource.downloads, 0),
//       categories: {
//         overview: {
//           articles: educationalContent.articles.filter(a => a.category === 'overview').length,
//           videos: educationalContent.videos.filter(v => v.category === 'overview').length
//         },
//         treatment: {
//           articles: educationalContent.articles.filter(a => a.category === 'treatment').length,
//           videos: educationalContent.videos.filter(v => v.category === 'treatment').length
//         },
//         support: {
//           articles: educationalContent.articles.filter(a => a.category === 'support').length,
//           videos: educationalContent.videos.filter(v => v.category === 'support').length
//         },
//         nutrition: {
//           articles: educationalContent.articles.filter(a => a.category === 'nutrition').length,
//           videos: educationalContent.videos.filter(v => v.category === 'nutrition').length
//         }
//       }
//     };

//     res.json({
//       success: true,
//       data: stats
//     });

//   } catch (error) {
//     console.error('Get education stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error fetching education statistics',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });


// module.exports = router;
const express = require('express');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// In a real app, this data would come from a database.
const educationalContent = {
  // This array dynamically builds the sidebar on the frontend
  categories: [
    { id: 'overview', label: 'About Thalassemia' },
    { id: 'treatment', label: 'Treatment Options' },
    { id: 'support', label: 'Support & Care' },
  ],
  articles: [
    {
      id: 'overview',
      title: 'What is Thalassemia?',
      content: "Thalassemia is an inherited blood disorder that affects the body's ability to produce hemoglobin and red blood cells. People with thalassemia have fewer healthy red blood cells and less hemoglobin than normal, which can cause mild to severe anemia. It is one of the most common genetic disorders worldwide, but with proper treatment and care, people with thalassemia can lead normal, productive lives."
    },
    {
      id: 'treatment',
      title: 'Primary Treatment Options',
      content: "The main treatments for thalassemia major are regular blood transfusions and iron chelation therapy. Transfusions provide the body with healthy red blood cells, while chelation therapy is crucial for removing the excess iron that builds up from transfusions, which can otherwise damage organs. In some cases, a bone marrow transplant may be a potential cure."
    },
    {
      id: 'support',
      title: 'Living a Healthy Life with Thalassemia',
      content: "Comprehensive care involves more than just medical treatment. Strong family and community support, mental health counseling, proper nutrition, and regular medical follow-ups are all essential. Patients should also maintain up-to-date vaccinations and practice good hygiene to prevent infections."
    }
  ],
  resources: [
    {
      id: 1,
      title: 'Living with Thalassemia: A Complete Guide',
      type: 'PDF Guide',
      description: 'Comprehensive guide covering daily life management, diet, and care tips.',
      downloads: 2340
    },
    {
      id: 2,
      title: 'Thalassemia Awareness Video Series',
      type: 'Video Course',
      description: 'Expert-led video series explaining Thalassemia in simple terms.',
      downloads: 1560
    },
    {
      id: 3,
      title: 'Nutrition Guidelines for Patients',
      type: 'Diet Plan',
      description: 'Specialized diet recommendations and meal planning guide.',
      downloads: 1890
    }
  ],
};


// @desc    Get all educational content for the main page in a single call
// @route   GET /api/education/content
// @access  Public
router.get('/content', optionalAuth, (req, res) => {
    res.json({
        success: true,
        data: educationalContent
    });
});

module.exports = router;