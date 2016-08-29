function fbLogin() {
FB.login(function(response) {
  if (response.status === 'connected') {
  	goToView('/');
  }
}, {scope: 'publish_pages, manage_pages, pages_show_list, read_insights, read_audience_network_insights'});
}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    goToView('/');
  } else {
  	console.log('not connected.');
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}