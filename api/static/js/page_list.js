function statusChangeCallback(response) {
  if (response.status !== 'connected') {
    // Logged into your app and Facebook.
    goToView("/login");
  }

  getManagedPages();

}

// Makes mustache pages data
function createDataFromPages(pagesList) {
  var data = {pages: []};
  pagesList.forEach(function(pageObject) {
    if (pageObject.picture && pageObject.picture.data.url) {
      pictureUrl = pageObject.picture.data.url;
    } else {
      pictureUrl = null;
    }
    data.pages.push({page: pageObject, picture_url: pictureUrl})
  });
  return data;
}

function showManagedPages(pages) {
  if (pages && pages.length > 0) {
    // TODO: Add the posts to the main view
    var data = createDataFromPages(pages);
    console.log(data);
    var template = $('#postsScript').html();
    var pageHtml = Mustache.to_html(template, data);
    $('#feedColumn').html(pageHtml);
    $('.page_link').click(function() {
      url = '/post_list/' + $(this).attr('id');
      goToView(url);
    });
  } else {
    $("#no_pages").show();
  }
}

function getManagedPages() {
  FB.api('/me/accounts', {fields: 'picture,name,category,access_token'}, function(pages_response) {
    // TODO: Check edge cases, does response have data field?
    // handle 500 errors.
    showManagedPages(pages_response.data);
  });
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}