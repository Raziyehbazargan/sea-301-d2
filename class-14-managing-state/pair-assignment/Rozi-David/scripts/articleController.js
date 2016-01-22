(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // TODO: Middleware for grabbing one article by ID:
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };


  // TODO: Middleware for loading up articles by a certain author:
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };
    //
    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // TODO: Middleware for grabbing all articles with a certain category:
  //comment:
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next(); // cooment: run the articlesController.index
    };
    //comment: findWhere is a method with a function that has 3 parameters(field,value and callback function)
    //in this part Article.findWhere() return data base on category filed from database and then if
    //category = ctx.params.categoryName ( that is value of category and give it from part of url like '/category/:categoryName' )
    //and return return the callback function (categoryData) that this function set the ctx(context).allArticles
    //property  = articlesInCategory
    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // TODO: Middleware for grabbing ALL articles:
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
