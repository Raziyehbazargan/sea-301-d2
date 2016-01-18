(function(module) {
  var articlesController = {};
  // Also be sure to hide all the main section elements, and reveal the #articles section:
  articlesController.index = function() {
    $('#articles').show();
    $('#about').hide();
    Article.createTable();
    Article.fetchAll(articleView.initIndexPage);
  };

  module.articlesController = articlesController;
})(window);
