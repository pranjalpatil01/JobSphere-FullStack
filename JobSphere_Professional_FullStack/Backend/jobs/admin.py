from django.contrib import admin
from .models import Profile,Job,SavedJob,Application
admin.site.register([Profile,Job,SavedJob,Application])
