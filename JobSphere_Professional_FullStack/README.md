# JobSphere Professional Full Stack

Naukri/LinkedIn-style job portal. Candidate + Recruiter roles, profile, resume upload, search/filter, save jobs, applications, recruiter dashboard and applicant status.

## Backend
```powershell
cd Backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```
Backend: http://127.0.0.1:8000/

## Frontend
Open another terminal:
```powershell
cd Frontend
npm install
npm run dev
```
Frontend: http://localhost:5173/

SQLite is used initially; MySQL is not required.
