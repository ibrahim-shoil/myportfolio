from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'date_posted', 'date_updated')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
