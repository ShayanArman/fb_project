from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'login', views.login, name='login'),
	url(r'^$', views.page_list, name='page_list'),
    url(r'post_list/(\d+)', views.post_list, name='post_list'),
]
