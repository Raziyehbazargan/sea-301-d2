// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('address a').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      $('#author-filter').append(optionTag);

      val = $(this).attr('data-category');
      optionTag = '<option value="' + val + '">' + val + '</option>';
        if ($('#category-filter option[value="' + val + '"]').length === 0) {
          $('#category-filter').append(optionTag);
        }
      }
    });
  };

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {  //its refer to select element of author name and check if it select tag has a
      //value in option tag
      $('article').hide();
      $('[data-author="'+ $(this).val() +'"]').show();
    } else {
      $('article:not(.template)').show();
    }
    $('#category-filter').val('');
    $('.template').hide();
  });
};

articleView.handleCategoryFilter = function() {
  $('#category-filter').on('change',function() {
    if ($(this).val()) {
      $('artcile').hide();
      $('[data-category="'+ $(this).val() +'"]').show(); //in article.js we add a attr to category part
    }else{
      $('artcile:not(.template)').show();
    }
    $('#author-filter').val('');
    $('.template').hide();
  });
};

articleView.handleMainNav = function() {
  // TODO: Add an event handler to .main-nav element that will power the Tabs feature.
  //       Clicking any .tab element should hide all the .tab-content sections, and then reveal the
  //       single .tab-content section that is associated with the clicked .tab element.
  //       So: You need to dynamically build a selector string with the correct ID, based on the
  //       data available to you on the .tab element that was clicked.
  $('.main-nav').on(/* CODE GOES HERE */);

  $('.main-nav .tab:first').click(); // Let's now trigger a click on the first .tab element, to set up the page.
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide(); // Hide elements beyond the first 2 in any artcile body.

  // TODO: Add an event handler to reveal all the hidden elements,
  //       when the .read-on link is clicked. You can go ahead and hide the
  //       "Read On" link once it has been clicked. Be sure to prevent the default link-click action!
  //       Ideally, we'd attach this as just 1 event handler on the #articles section, and let it
  //       process any .read-on clicks that happen within child nodes.

};

// TODO: Call all of the above functions, once we are sure the DOM is ready.
$(document).ready(function(){
  articleView.populateFilters();
  articleView.handleAuthorFilter();
  articleView.handleAuthorFilter();
});
