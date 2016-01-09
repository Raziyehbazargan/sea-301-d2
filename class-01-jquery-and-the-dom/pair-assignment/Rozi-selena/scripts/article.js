
var articles = [];

function Article (opts) {
  this.title = opts.title;
  this.category = opts.category;
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.publishedOn = opts.publishedOn;
  this.body = opts.body;
}

Article.prototype.toHtml = function() {
  var $newArticle = $('article.template').clone();
  //
    $newArticle.removeClass('template');

  // $newArticle.data('category', this.category);
  // $newArticle.data('title',this.title);
  // $newArticle.data('author',this.author);
  // $newArticle.data('authorUrl',this.authorUrl);
  // $newArticle.data('publishedOn',this.publishedOn);
  // $newArticle.data('body',this.body);
     $newArticle.find('address a').html(this.author);
     $newArticle.find('address a').attr('href',this.authorUrl);
     $newArticle.find('h1').html(this.title);
     $newArticle.find('.article-body').html(this.body);

  // Include the publication date as a 'title' attribute to show on hover:
    $newArticle.find('time[pubdate]').attr('title', this.publishedOn);

  // Display the date as a relative number of "days ago":
    $newArticle.find('time').html('about ' + parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000) + ' days ago')
    $newArticle.append('<hr>');
    return $newArticle;
}

rawData.sort(function(a,b) {
  return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
});

rawData.forEach(function(ele) {
  articles.push(new Article(ele));
})

articles.forEach(function(a){
  $('#articles').append(a.toHtml())
});
