from django.shortcuts import render
from blog.models import Article
from projects.models import Project

def home(request):
    latest_articles = Article.objects.all().order_by('-date_posted')[:3]
    latest_projects = Project.objects.all().order_by('-date_posted')[:3]
    return render(request, 'home.html', {
        'latest_articles': latest_articles,
        'latest_projects': latest_projects
    })
