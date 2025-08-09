from django.db import models
from django.utils.text import slugify
# Create your models here.


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    cover_image = models.ImageField(upload_to='projects/', blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    live_demo = models.URLField(blank=True, null=True)
    date_posted = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
