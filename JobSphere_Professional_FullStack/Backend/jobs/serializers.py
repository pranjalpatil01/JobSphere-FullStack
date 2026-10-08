from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile,Job,Application
class UserSerializer(serializers.ModelSerializer):
 class Meta:model=User;fields=["id","username","email"]
class RegisterSerializer(serializers.ModelSerializer):
 password=serializers.CharField(write_only=True,min_length=6);role=serializers.ChoiceField(choices=["candidate","recruiter"],write_only=True)
 class Meta:model=User;fields=["username","email","password","role"]
 def create(self,d):
  role=d.pop("role");u=User.objects.create_user(**d);Profile.objects.create(user=u,role=role);return u
class ProfileSerializer(serializers.ModelSerializer):
 username=serializers.CharField(source="user.username",read_only=True);email=serializers.EmailField(source="user.email",read_only=True)
 class Meta:model=Profile;fields="__all__";read_only_fields=["id","user","username","email","role"]
class JobSerializer(serializers.ModelSerializer):
 recruiter_name=serializers.CharField(source="recruiter.username",read_only=True)
 class Meta:model=Job;fields="__all__";read_only_fields=["id","recruiter","recruiter_name","created_at"]
class ApplicationSerializer(serializers.ModelSerializer):
 job_title=serializers.CharField(source="job.title",read_only=True);company=serializers.CharField(source="job.company",read_only=True);applicant_name=serializers.CharField(source="applicant.username",read_only=True);applicant_email=serializers.EmailField(source="applicant.email",read_only=True)
 class Meta:model=Application;fields=["id","job","job_title","company","applicant_name","applicant_email","cover_letter","status","applied_at"]
 read_only_fields=["id","job_title","company","applicant_name","applicant_email","status","applied_at"]
