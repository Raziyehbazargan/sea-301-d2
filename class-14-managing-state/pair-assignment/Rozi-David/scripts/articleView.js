(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // TODO: Stretch goal: Refactor to push this unique-check logic into the database.
  // Move any HTML into a template, in the HTML file where it belongs.

    //comment : define two variables named options and template
    //that using handlebars to store template <script id="option-template"      type="text/x-handlebars-templage"> template part in index.html
    //and options  variable is equall with the Article.allAuthors() method that return name of authors that aren't duplicate
    //and using .map method put the author names on template ( option tag)  if the combo box of author filter doesnt have any item (mean just one item  --filter by author--then append the options in  select (combo box)  with id '#author-filter'
      <option value="{{val}}">{{val}}</option>
    </script>
  articleView.populateFilters = function() {
    var options,
      template = Handlebars.compile($('#option-template').text());

    // Example of using model method with FP, synchronous approach:
    // NB: This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    options = Article.allAuthors()
    .map(function(author) {
       return template({val: author});
     });
    if ($('#author-filter option').length < 2) { // Prevent duplication
      $('#author-filter').append(options);
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    //comment : allCategories() is a method with a callback function that return all categories name from table with no duplicate and then check if the combo Box( select options) of category doesn't have any item then add category names to #category-filter select (combo box)
    Article.allCategories(function(rows) {
      if ($('#category-filter option').length < 2) {
        $('#category-filter').append(
          rows
          .map(function(row) {
            return template({val: row.category});
          })
        );
      };
    });
  };

  // TODO: Combine both filter functions to a single event handler,
  // which simply redirects to a url like: /category/skateboarding or /author/Kevin+Bacon
  //comment: define a event listener on a part of page with id #filters
  //on each change on select tag run a function that in that function define a variable named resource. with any change on option in select tag  get the option id and replace the id from (-filter to empty string) and store in resource variable.
  //and then call page()  and in page() if there is any space in val of that option replace that with a +: example: page(/author/xxxx+yy+yy) 
  articleView.handleFilters = function() {
    $('#filters').on('change', 'select', function() {
      resource = this.id.replace('-filter', '');
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    });
  };
  // articleView.handleAuthorFilter = function() {
  //   $('#author-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-author="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#category-filter').val('');
  //   });
  // };
  //
  // articleView.handleCategoryFilter = function() {
  //   $('#category-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-category="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#author-filter').val('');
  //   });
  // };

  // TODO: Remove the setTeasers method, and replace with a plain ole link in the article template.
  // articleView.setTeasers = function() {
  //   $('.article-body *:nth-of-type(n+2)').hide();
  //
  //   $('#articles').on('click', 'a.read-on', function(e) {
  //     e.preventDefault();
  //     $(this).parent().find('*').fadeIn();
  //     $(this).hide();
  //   });
  // };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(render(article));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  // TODO: Refactor this method so it works with any number of articles.
  // Also, it should be idempotent, so it can be run multiple times with identical results.
  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
    // TODO: Call the new unified filter handler function
    articleView.handleFilters();
    // articleView.handleCategoryFilter();
    // articleView.handleAuthorFilter();
    // articleView.setTeasers();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
