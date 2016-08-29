from django.shortcuts import render

def login(request):
    return render(request, 'api/login.html', {})


def page_list(request):
    return render(request, 'api/page_list.html', {})


def post_list(request, page_id):
    return render(request, 'api/post_list.html', {'page_id': page_id})
