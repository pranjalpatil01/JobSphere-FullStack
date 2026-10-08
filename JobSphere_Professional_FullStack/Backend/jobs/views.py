from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import (
    Profile,
    Job,
    SavedJob,
    Application,
)


# =========================================================
# REGISTER
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):

    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    role = request.data.get("role", "candidate")

    # Validation
    if not username:
        return Response(
            {"username": "Username is required."},
            status=400
        )

    if not email:
        return Response(
            {"email": "Email is required."},
            status=400
        )

    if not password:
        return Response(
            {"password": "Password is required."},
            status=400
        )

    if len(password) < 6:
        return Response(
            {
                "password":
                "Password must contain at least 6 characters."
            },
            status=400
        )

    # Username check
    if User.objects.filter(username=username).exists():
        return Response(
            {"username": "Username already exists."},
            status=400
        )

    # Email check
    if User.objects.filter(email=email).exists():
        return Response(
            {"email": "Email already exists."},
            status=400
        )

    # Role validation
    if role not in ["candidate", "recruiter"]:
        role = "candidate"

    # Create User
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    # Create Profile
    Profile.objects.create(
        user=user,
        role=role
    )

    # Create token
    token, created = Token.objects.get_or_create(
        user=user
    )

    return Response(
        {
            "message": "Registration successful!",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": role
            }
        },
        status=201
    )


# =========================================================
# LOGIN
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):

    username = request.data.get("username")
    password = request.data.get("password")

    if not username:
        return Response(
            {"error": "Username is required."},
            status=400
        )

    if not password:
        return Response(
            {"error": "Password is required."},
            status=400
        )

    # Authenticate user
    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {"error": "Invalid username or password."},
            status=401
        )

    # Token
    token, created = Token.objects.get_or_create(
        user=user
    )

    # Get profile role
    role = "candidate"

    try:
        role = user.profile.role
    except Exception:
        pass

    return Response(
        {
            "message": "Login successful!",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": role
            }
        },
        status=200
    )


# =========================================================
# LOGOUT
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):

    try:
        request.user.auth_token.delete()
    except Exception:
        pass

    return Response(
        {
            "message": "Logout successful."
        },
        status=200
    )


# =========================================================
# PROFILE
# =========================================================

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile_view(request):

    profile = Profile.objects.get(
        user=request.user
    )

    if request.method == "GET":

        return Response(
            {
                "id": profile.id,
                "username": request.user.username,
                "email": request.user.email,
                "role": profile.role,
                "phone": profile.phone,
                "location": profile.location,
                "headline": profile.headline,
                "about": profile.about,
                "skills": profile.skills,
                "education": profile.education,
                "experience": profile.experience,
                "linkedin": profile.linkedin,
                "github": profile.github,
                "profile_image": (
                    request.build_absolute_uri(
                        profile.profile_image.url
                    )
                    if profile.profile_image
                    else None
                ),
                "resume": (
                    request.build_absolute_uri(
                        profile.resume.url
                    )
                    if profile.resume
                    else None
                ),
            }
        )

    # PUT
    profile.phone = request.data.get(
        "phone",
        profile.phone
    )

    profile.location = request.data.get(
        "location",
        profile.location
    )

    profile.headline = request.data.get(
        "headline",
        profile.headline
    )

    profile.about = request.data.get(
        "about",
        profile.about
    )

    profile.skills = request.data.get(
        "skills",
        profile.skills
    )

    profile.education = request.data.get(
        "education",
        profile.education
    )

    profile.experience = request.data.get(
        "experience",
        profile.experience
    )

    profile.linkedin = request.data.get(
        "linkedin",
        profile.linkedin
    )

    profile.github = request.data.get(
        "github",
        profile.github
    )

    if "profile_image" in request.FILES:
        profile.profile_image = request.FILES[
            "profile_image"
        ]

    if "resume" in request.FILES:
        profile.resume = request.FILES[
            "resume"
        ]

    profile.save()

    return Response(
        {
            "message": "Profile updated successfully."
        }
    )


# =========================================================
# JOB LIST
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def jobs_list(request):

    # GET
    if request.method == "GET":

        jobs = Job.objects.all().order_by(
            "-created_at"
        )

        # Search
        search = request.GET.get(
            "search",
            ""
        )

        if search:
            jobs = jobs.filter(
                title__icontains=search
            ) | jobs.filter(
                company__icontains=search
            ) | jobs.filter(
                skills__icontains=search
            )


        # Location
        location = request.GET.get(
            "location",
            ""
        )

        if location:
            jobs = jobs.filter(
                location__icontains=location
            )


        # Job type
        job_type = request.GET.get(
            "job_type",
            ""
        )

        if job_type:
            jobs = jobs.filter(
                job_type=job_type
            )


        # Experience
        experience = request.GET.get(
            "experience",
            ""
        )

        if experience:
            jobs = jobs.filter(
                experience__icontains=experience
            )


        result = []

        for job in jobs:

            result.append(
                {
                    "id": job.id,
                    "recruiter": job.recruiter.username,
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "job_type": job.job_type,
                    "experience": job.experience,
                    "salary": job.salary,
                    "category": job.category,
                    "skills": job.skills,
                    "vacancies": job.vacancies,
                    "deadline": job.deadline,
                    "description": job.description,
                    "created_at": job.created_at,
                }
            )

        return Response(result)


    # POST
    if request.method == "POST":

        if not request.user.is_authenticated:

            return Response(
                {
                    "error":
                    "Login required to post a job."
                },
                status=401
            )

        # Recruiter only
        try:
            role = request.user.profile.role
        except Exception:
            role = "candidate"

        if role != "recruiter":

            return Response(
                {
                    "error":
                    "Only recruiters can post jobs."
                },
                status=403
            )

        job = Job.objects.create(
            recruiter=request.user,

            title=request.data.get(
                "title",
                ""
            ),

            company=request.data.get(
                "company",
                ""
            ),

            location=request.data.get(
                "location",
                ""
            ),

            job_type=request.data.get(
                "job_type",
                "Full Time"
            ),

            experience=request.data.get(
                "experience",
                ""
            ),

            salary=request.data.get(
                "salary",
                ""
            ),

            category=request.data.get(
                "category",
                ""
            ),

            skills=request.data.get(
                "skills",
                ""
            ),

            vacancies=request.data.get(
                "vacancies",
                1
            ),

            deadline=request.data.get(
                "deadline"
            ),

            description=request.data.get(
                "description",
                ""
            ),
        )

        return Response(
            {
                "message": "Job created successfully.",
                "job_id": job.id
            },
            status=201
        )


# =========================================================
# JOB DETAIL
# =========================================================

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([AllowAny])
def job_detail(request, job_id):

    try:
        job = Job.objects.get(
            id=job_id
        )
    except Job.DoesNotExist:

        return Response(
            {
                "error": "Job not found."
            },
            status=404
        )


    # GET
    if request.method == "GET":

        return Response(
            {
                "id": job.id,
                "recruiter": job.recruiter.username,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "job_type": job.job_type,
                "experience": job.experience,
                "salary": job.salary,
                "category": job.category,
                "skills": job.skills,
                "vacancies": job.vacancies,
                "deadline": job.deadline,
                "description": job.description,
                "created_at": job.created_at,
            }
        )


    # Authentication for update/delete
    if not request.user.is_authenticated:

        return Response(
            {
                "error": "Login required."
            },
            status=401
        )


    # Owner check
    if job.recruiter != request.user:

        return Response(
            {
                "error":
                "You can only modify your own jobs."
            },
            status=403
        )


    # PUT
    if request.method == "PUT":

        job.title = request.data.get(
            "title",
            job.title
        )

        job.company = request.data.get(
            "company",
            job.company
        )

        job.location = request.data.get(
            "location",
            job.location
        )

        job.job_type = request.data.get(
            "job_type",
            job.job_type
        )

        job.experience = request.data.get(
            "experience",
            job.experience
        )

        job.salary = request.data.get(
            "salary",
            job.salary
        )

        job.category = request.data.get(
            "category",
            job.category
        )

        job.skills = request.data.get(
            "skills",
            job.skills
        )

        job.vacancies = request.data.get(
            "vacancies",
            job.vacancies
        )

        job.deadline = request.data.get(
            "deadline",
            job.deadline
        )

        job.description = request.data.get(
            "description",
            job.description
        )

        job.save()

        return Response(
            {
                "message":
                "Job updated successfully."
            }
        )


    # DELETE
    job.delete()

    return Response(
        {
            "message":
            "Job deleted successfully."
        }
    )


# =========================================================
# SAVE / UNSAVE JOB
# =========================================================

@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def save_job(request, job_id):

    try:
        job = Job.objects.get(
            id=job_id
        )
    except Job.DoesNotExist:

        return Response(
            {
                "error": "Job not found."
            },
            status=404
        )


    if request.method == "POST":

        saved, created = SavedJob.objects.get_or_create(
            user=request.user,
            job=job
        )

        return Response(
            {
                "message": "Job saved successfully."
            }
        )


    SavedJob.objects.filter(
        user=request.user,
        job=job
    ).delete()

    return Response(
        {
            "message":
            "Job removed from saved jobs."
        }
    )


# =========================================================
# SAVED JOBS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def saved_jobs(request):

    saved = SavedJob.objects.filter(
        user=request.user
    ).select_related("job")

    result = []

    for item in saved:

        job = item.job

        result.append(
            {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "job_type": job.job_type,
                "experience": job.experience,
                "salary": job.salary,
                "skills": job.skills,
                "description": job.description,
            }
        )

    return Response(result)


# =========================================================
# APPLY JOB
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def apply_job(request, job_id):

    try:
        job = Job.objects.get(
            id=job_id
        )
    except Job.DoesNotExist:

        return Response(
            {
                "error": "Job not found."
            },
            status=404
        )


    # Candidate only
    try:
        role = request.user.profile.role
    except Exception:
        role = "candidate"

    if role != "candidate":

        return Response(
            {
                "error":
                "Only candidates can apply for jobs."
            },
            status=403
        )


    # Already applied?
    if Application.objects.filter(
        job=job,
        applicant=request.user
    ).exists():

        return Response(
            {
                "error":
                "You have already applied for this job."
            },
            status=400
        )


    application = Application.objects.create(
        job=job,
        applicant=request.user,
        cover_letter=request.data.get(
            "cover_letter",
            ""
        ),
        status="pending"
    )


    return Response(
        {
            "message":
            "Application submitted successfully.",
            "application_id":
            application.id
        },
        status=201
    )


# =========================================================
# MY APPLICATIONS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def applications(request):

    apps = Application.objects.filter(
        applicant=request.user
    ).select_related("job")

    result = []

    for application in apps:

        job = application.job

        result.append(
            {
                "id": application.id,

                "job": {
                    "id": job.id,
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                },

                "cover_letter":
                    application.cover_letter,

                "status":
                    application.status,

                "applied_at":
                    application.applied_at,
            }
        )

    return Response(result)


# =========================================================
# RECRUITER APPLICATIONS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recruiter_applications(request):

    apps = Application.objects.filter(
        job__recruiter=request.user
    ).select_related(
        "job",
        "applicant"
    )

    result = []

    for application in apps:

        result.append(
            {
                "id": application.id,

                "job": {
                    "id":
                        application.job.id,

                    "title":
                        application.job.title,

                    "company":
                        application.job.company,
                },

                "applicant": {
                    "id":
                        application.applicant.id,

                    "username":
                        application.applicant.username,

                    "email":
                        application.applicant.email,
                },

                "cover_letter":
                    application.cover_letter,

                "status":
                    application.status,

                "applied_at":
                    application.applied_at,
            }
        )

    return Response(result)


# =========================================================
# APPLICATION STATUS
# =========================================================

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def application_status(
    request,
    application_id
):

    try:

        application = Application.objects.get(
            id=application_id
        )

    except Application.DoesNotExist:

        return Response(
            {
                "error":
                "Application not found."
            },
            status=404
        )


    # Only job recruiter can change status
    if application.job.recruiter != request.user:

        return Response(
            {
                "error":
                "You are not authorized to change this status."
            },
            status=403
        )


    status_value = request.data.get(
        "status"
    )


    allowed_statuses = [
        "pending",
        "shortlisted",
        "selected",
        "rejected",
    ]


    if status_value not in allowed_statuses:

        return Response(
            {
                "error":
                "Invalid application status."
            },
            status=400
        )


    application.status = status_value

    application.save()


    return Response(
        {
            "message":
            "Application status updated successfully.",
            "status":
            application.status
        }
    )