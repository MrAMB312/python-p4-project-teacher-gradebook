# Phase 4 Full-Stack Application Project - Teacher Gradebook

## Overview

Teacher Gradebook is a full-stack web application that allows teachers to:
- Create and manage students
- Create and manage assignments
- Track student scores and update greades

The backend is built with Flask and provides a RESTful API, while the frontend is built with React and uses Formik and Yup for form handling and validation.

This project demonstrates full CRUD funcitonality, one-to-many and many-to-many relationships, form validation, and React Router for navigation.

---

## Running the Project

### Backend (Flask API)

```bash
cd server
flask db upgrade
flask run --port=5555
```

### Frontend (React)

```bash
cd client
npm install
npm start
```

---

## Backend

### Models

- `Student`
  - Represents a student with a name.
  - One student can have many grades.

- `Assignment`
  - Represents an assignment with title, category, and total points.
  - One assignment can have many grades.

- `Grade`
  - Join table representing the grade a student received for a particular assignment.
  - Holds a user-submittable attribute: `score`.

### Relationships

- One-to-many:
  - `Student` > `Grades`
  - `Assignment` > `Grades`
- Many-to-many:
  - `Students` <-> `Assignments` (through `Grades`)

---

## Routes

- Students
  - `GET /students`: list all students
  - `POST /students`: create a student
- Assignments
  - `GET /assignments`: list all assignments
  - `POST /assignments`: create an assignment
- Grades
  - `GET /students/<student_id>/assignments/<assignment_id>/grades`: list grades for a student for a specific assignment
  - `POST /students<student_id>/assignments/<assignment_id>/grades`: add a grade for a student for a specific assignment
- `/students/<id>/grades/<id>`
  - `PATCH /students/<student_id>/grades/<grade_id>`: update existing grade for student
  - `DELETE /students/<student_id>/grades/<grade_id>`: delete existing grade for student

  ---

  ## Frontend

  ### Routes (React Router)

  - `/` - Home page with instructions
  - `/students` - view all students, add a new student, and manage their grades
  - `/assignemnts` - view all assignments and add a new assignment

  ### Components

  - `StudentList.js`
    - Displays all students
    - Uses Formik to add new students with validation
    - Select a student to view and manage grades
  - `AssignmentList.js`
    - Displays all assignments
    - Uses Formik to add new assignments with validation
  - `StudentGrades.js`
    - Shows all grades for a selected student
    - Add, edit, and delete grades
  - `App.js`
    - Parent component that is rendered in index.js
  - `NavBar.js`
    - Links that point to `Home`, `Student List`, and `Assignment List`
  - `Home.js`
    - Home page for application that lists instructions

  ---

  ## Validation

  All forms use Formik + Yup for handling input and validation:

  - Student name: required string
  - Assignment title & category: required strings
  - Assignment total_points: positive integer required
  - Grade score: integer, positive, required

  ---

  ## Example User Flow

  1. Navigate to `/students` and add a new student.

  2. Navigate to `/assignments` and add a new assignment.

  3. Select a student to view their grades.

  4. Add a new grade for a specific assigment.

  5. Edit or delete an existing grade.