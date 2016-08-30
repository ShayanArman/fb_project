page_access_token = null;
// scheduled_time = 147249333148;
should_publish = true;

function addPublishListener() {
  $('.post_buttons .tag').click(function(e) {
    if (!$(this).hasClass('selected')) {
      $(this).addClass('selected');
      should_publish = true;
      $('.post_buttons .tag > p').text('Published');
    } else {
      should_publish = false;
      $(this).removeClass('selected');
      $('.post_buttons .tag > p').text('Unpublished');
    }
  });
}

function postInformation() {
  // TODO: Clean this code, abstract away methods.
  if (!page_access_token) {
    updatePageAccessToken();
    return;
  }

  message = $("#post_message_area").val();
  
  if (!message) {
    $("#post_message_area").val('Must have a message.');
  } else {
    parameters = {'message': message, 'published': should_publish, 'access_token': page_access_token};
    publish_post(parameters);
  }

}

function publishPost(parameters) {
  FB.api(page_id.toString() + '/feed', 'POST', parameters, function(response) {
    if (response.error) {
      $("#post_message_area").val(re.error.message);
    } else {
      FB.api(response.id, {fields: 'message,id,is_published,link,insights.metric(post_impressions)'}, function(post) {
          if (!post.error) {
            // Add the new post to the feed.
            showPagePosts([post]);
          } else {
            // Reload the page.
            goToView('/post_list/' + page_id.toString());
          }
      });
    }
  });
}

// This is called with the results from FB.getLoginStatus().
function statusChangeCallback(login_response, user_response) {
  if (login_response.status !== 'connected') {
    // Logged into your app and Facebook.
    goToView('/login');
  }
  if (!user_response.error) {

    $('#admin_picture').prepend('<img class="person_picture user_picture" src=' + user_response.picture.data.url + ' />');
    updatePageAccessToken();
    getPagePosts('/feed', true);
  }
  // TODO: Handle case where the user_response is not available.
}

function updatePageAccessToken() {
  endpoint = page_id.toString();
  FB.api(endpoint, {fields: 'access_token'}, function(response) {
    if (!response.error) {
      page_access_token = response.access_token;
      getPagePosts('/promotable_posts', false);
    }
  });
}

function createDataFromPosts(pagePosts) {
  var data = {posts: []};
  pagePosts.forEach(function(postObject) {
    var published_string = postObject.is_published ? 'Published' : 'Unpublished';

    if (postObject.insights && postObject.insights.data[0].name === 'post_impressions') {
      numViews = postObject.insights.data[0].values[0].value;
    } else {
      numViews = 0;
    }
    data.posts.push({post: postObject, views: numViews, is_published: published_string})
  });
  return data;
}

function showPagePosts(pagePosts) {
  if (pagePosts && pagePosts.length > 0) {
    var data = createDataFromPosts(pagePosts);
    var template = $('#postsScript').html();
    var postHtml = Mustache.to_html(template, data);
    $('#feedColumn').prepend(postHtml);
  } else {
    // TODO: Have a placeholder, with a message, no posts in page.
    $("#no_pages").show();
  }
}

function getPagePosts(postTypeEndpoint, published) {
  // TODO: do a check for the integrity of page_id
  // TODO: Batch API request for both published and unpublished.
  endpoint = page_id.toString() + postTypeEndpoint;
  default_fields = 'message,id,link,is_published,insights.metric(post_impressions)';
  FB.api(endpoint, {is_published: published, fields: default_fields}, function(response) {
    // TODO: check response object has data field
    showPagePosts(response.data);
  });
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  addPublishListener();
  FB.getLoginStatus(function(login_response) {
    FB.api('/me', {fields: 'picture,first_name,last_name'}, function(user_response) {
      statusChangeCallback(login_response, user_response);
    });
  });
}
