# Phase 4 Full-Stack Application Project - Teacher Gradebook

## Overview

Teacher Gradebook is a full-stack web application that allows teachers to create students and assignments, track scores, and update grades in real time.

The backend is built with Flask and provides a RESTful API, while the frontend is built with React and uses Formik for form handling and validation.

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

- One-to-many: `Student` > `Grades`, `Assignment` > `Grades`
- Many-to-many: `Students` <-> `Assignments` (through `Grades`)

---

## Routes

- `/students`
  - `GET`: list all students
  - `POST`: create a student
- `/assignments`
  - `GET`: list all assignments
  - `POST`: create an assignment
- `/students/<id>/grades`
  - `GET`: list all grades belonging to existing student
  - `POST`: create a new grade for existing student
- `/students/<id>/grades/<id>`
  - `PATCH`: update existing grade for student
  - `DELETE`: delete existing grade for student

  ---

  ## Frontend

  ### Routes (React Router)

  - `/students` - view all students and add a new student
  - `/assignemnts` - view all assignments and add a new assignment
  - `/` - Home page

  ### Components

  - `StudentList.js`
    - Displays all students
    - Uses Formik to add new students with validation
    - Allows selecting a student to view their grades
  - `AssignmentList.js`
    - Displays all assignments
    - Uses Formik to add new assignments with validation
  - `StudentGrades.js`
    - Shows all grades for a selected student
    - Add new grade using Formik
    - Edit grade using Formik
    - Delete grade
  - App.js
    - Parent component that is rendered in index.js
  - `NavBar.js`
    - Links that point to `Home.js`, `StudentList.js`, and `AssignmentList.js`
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

  3. Select a student and add a grade for a specific assignment.

  4. Update or delete an exisitng grade.