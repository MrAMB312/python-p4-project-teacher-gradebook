#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Student, Grade, Assignment

# Views go here!
class Students(Resource):
    # get existing students
    def get(self):
        
        students = [student.to_nested_dict() for student in Student.query.all()]
        response = make_response(students, 200)
        return response
    
    # post new student
    def post(self):

        data = request.get_json()

        name = data['name']

        if not name:
            return { 'errors': ['validation errors'] }, 400

        new_student = Student(
            name=name
        )

        db.session.add(new_student)
        db.session.commit()

        response = make_response(new_student.to_dict(), 201)
        return response

class Assignments(Resource):
    # get existing assignments
    def get(self):

        assignments = [assignment.to_dict() for assignment in Assignment.query.all()]
        response = make_response(assignments, 200)
        return response
    
    # post new assignment
    def post(self):
        
        data = request.get_json()

        title = data['title']
        category = data['category']
        total_points = data['total_points']

        if not title or not category or total_points is None:
            return { 'errors': ['validation errors'] }, 400

        new_assignment = Assignment(
            title=title,
            category=category,
            total_points=total_points
        )

        db.session.add(new_assignment)
        db.session.commit()

        response = make_response(new_assignment.to_dict(), 201)
        return response
    
class Grades(Resource):
    def get(self, student_id, assignment_id):
        
        grades = [grade.to_dict() for grade in Grade.query.filter_by(student_id=student_id, assignment_id=assignment_id).all()]
        response = make_response(grades, 200)
        return response

    def post(self):

        data = request.get_json()

        score = data['score']
        student_id = data['student_id']
        assignment_id = data['assignment_id']

        if score is None or student_id is None or assignment_id is None:
            return { 'errors': ['validation errors'] }, 400

        new_grade = Grade(
            score=score,
            student_id=student_id,
            assignment_id=assignment_id
        )

        db.session.add(new_grade)
        db.session.commit()

        response = make_response(new_grade.to_dict(), 201)
        return response

    def patch(self, grade_id):

        data = request.get_json()
        grade = Grade.query.filter_by(id=grade_id).first()

        if not grade:
            return { 'error': ['Grade not found.'] }, 404
        
        score = data['score']

        if score is None:
            return { 'errors': ['validation errors'] }, 400

        for attr in request.json:
            setattr(grade, attr, data[attr])

        db.session.add(grade)
        db.session.commit()

        response = make_response(grade.to_dict(), 202)
        return response

    def delete(self, grade_id):
        
        grade = Grade.query.filter_by(id=grade_id).first()

        if not grade:
            return { 'error': 'Grade not found.' }, 404
        
        db.session.delete(grade)
        db.session.commit()

        response = make_response('', 204)
        return response

api.add_resource(Students, '/students')
api.add_resource(Assignments, '/assignments')
api.add_resource(Grades, '/grades/<int:student_id>/<int:assignment_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

