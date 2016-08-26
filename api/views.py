from django.shortcuts import render

class Post:
    def __init__(self, title, published_date, num_likes):
        self.title = title
        self.published_date = published_date
        self.num_likes = num_likes
        self.text = 'I love everything about your store.'


# Create your views here.
def post_list(request):
    posts = [Post('Street Style', 'August 29', 30), Post('Road Style', 'Sept', 1)]
    return render(request, 'api/post_list.html', {'posts': posts})
