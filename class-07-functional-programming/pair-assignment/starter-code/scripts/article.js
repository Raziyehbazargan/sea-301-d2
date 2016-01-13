// did: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module) {
function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  // this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: Refactor this forEach code, by using a `.map` call instead, since want we are trying to accomplish
  // is the transformation of one colleciton into another.
  // rawData.forEach(function(ele) {
  //   Article.all.push(new Article(ele));
  // })
  Article.all = rawData.map(function(ele) {
    return new Article(ele);
  });
};

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.
// did: Refactor this function, so it accepts an argument of a callback function (likely a view function)
// to execute once the loading of articles is done.
Article.fetchAll = function(next) {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    next();
  } else {
    $.getJSON('/data/hackerIpsum.json', function(rawData) {
      Article.loadAll(rawData);
      localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
      next();
    });
  }
};

// did: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
Article.numWordsAll = function() {
  return Article.all.map(function(article) {
    var words = article.body.split(' '); // split using the space char as a delimiter
    return words.length;
  }) // return a array then we use , .reduce
  .reduce(function(prev, currentEle) {
    return (prev + currentEle)   // Sum up all the values in the collection
  })
};


// did: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Article.allAuthors = function() {
   return Article.all.map(function(article){
    var authorsNames = article.author;
    return authorsNames;
  })
  .filter(function(item , index , inputArray) {
    return inputArray.indexOf(item)==index;  //** read more about it
  })
  //another solution instead of .filter
  // .reduce(function(uniqueName,name){
  //   if(uniqueName.indexOf(name)<0){
  //     uniqueName.push(name);
  //   }
  //   return uniqueName;
  // },[]);
// })
};

  // TODO: Transform each author string into an object with 2 properties: One for
  // the author's name, and one for the total number of words across all articles written by the specified author.
Article.numWordsByAuthor = function() {
  return Article.allAuthors().map(function(author) {
    return{
      name: author,
      numWords:
        Article.all
        .filter(function(article){
          return article.author === author;
        })
        .map(function(article){
        var words = article.body.split(' ');
          return words.lenght;
      })
        .reduce(function(prev, currentEle) {
          return (prev + currentEle)   // Sum up all the values in the collection
      })
    }
  })
};
module.Article = Article;
})(window)
