from django.urls import path

from .views import (
    register,
    login_view,
    logout_view,
    profile_view,
    jobs_list,
    job_detail,
    save_job,
    saved_jobs,
    apply_job,
    applications,
    recruiter_applications,
    application_status,
)


urlpatterns = [

    # Authentication
    path(
        "register/",
        register,
        name="register"
    ),

    path(
        "login/",
        login_view,
        name="login"
    ),

    path(
        "logout/",
        logout_view,
        name="logout"
    ),


    # Profile
    path(
        "profile/",
        profile_view,
        name="profile"
    ),


    # Jobs
    path(
        "jobs/",
        jobs_list,
        name="jobs"
    ),

    path(
        "jobs/<int:job_id>/",
        job_detail,
        name="job-detail"
    ),


    # Save Job
    path(
        "jobs/<int:job_id>/save/",
        save_job,
        name="save-job"
    ),

    path(
        "saved-jobs/",
        saved_jobs,
        name="saved-jobs"
    ),


    # Apply
    path(
        "jobs/<int:job_id>/apply/",
        apply_job,
        name="apply-job"
    ),

    path(
        "applications/",
        applications,
        name="applications"
    ),


    # Recruiter
    path(
        "recruiter/applications/",
        recruiter_applications,
        name="recruiter-applications"
    ),

    path(
        "applications/<int:application_id>/status/",
        application_status,
        name="application-status"
    ),
]