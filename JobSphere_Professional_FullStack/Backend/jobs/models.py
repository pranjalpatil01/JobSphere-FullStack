from django.db import models
from django.contrib.auth.models import User
class Profile(models.Model):
 ROLE=[("candidate","Candidate"),("recruiter","Recruiter")]
 user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="profile");role=models.CharField(max_length=20,choices=ROLE,default="candidate");phone=models.CharField(max_length=30,blank=True);location=models.CharField(max_length=150,blank=True);headline=models.CharField(max_length=200,blank=True);about=models.TextField(blank=True);skills=models.CharField(max_length=500,blank=True);education=models.CharField(max_length=300,blank=True);experience=models.CharField(max_length=200,blank=True);linkedin=models.URLField(blank=True);github=models.URLField(blank=True);profile_image=models.ImageField(upload_to="profiles/",blank=True,null=True);resume=models.FileField(upload_to="resumes/",blank=True,null=True)
class Job(models.Model):
 TYPES=[("Full Time","Full Time"),("Part Time","Part Time"),("Internship","Internship"),("Contract","Contract")]
 recruiter=models.ForeignKey(User,on_delete=models.CASCADE,related_name="jobs");title=models.CharField(max_length=200);company=models.CharField(max_length=200);location=models.CharField(max_length=150);job_type=models.CharField(max_length=30,choices=TYPES,default="Full Time");experience=models.CharField(max_length=100,default="Fresher");salary=models.CharField(max_length=100,blank=True);category=models.CharField(max_length=100,blank=True);skills=models.CharField(max_length=500,blank=True);vacancies=models.PositiveIntegerField(default=1);deadline=models.DateField(null=True,blank=True);description=models.TextField();created_at=models.DateTimeField(auto_now_add=True)
class SavedJob(models.Model):
 user=models.ForeignKey(User,on_delete=models.CASCADE);job=models.ForeignKey(Job,on_delete=models.CASCADE);created_at=models.DateTimeField(auto_now_add=True)
 class Meta: constraints=[models.UniqueConstraint(fields=["user","job"],name="unique_saved")]
class Application(models.Model):
 STATUS=[("Pending","Pending"),("Shortlisted","Shortlisted"),("Selected","Selected"),("Rejected","Rejected")]
 job=models.ForeignKey(Job,on_delete=models.CASCADE,related_name="applications");applicant=models.ForeignKey(User,on_delete=models.CASCADE,related_name="applications");cover_letter=models.TextField(blank=True);status=models.CharField(max_length=20,choices=STATUS,default="Pending");applied_at=models.DateTimeField(auto_now_add=True)
 class Meta: constraints=[models.UniqueConstraint(fields=["job","applicant"],name="unique_application")]
