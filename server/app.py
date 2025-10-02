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
        
        students = [student.to_dict() for student in Student.query.all()]
        response = make_response(students, 200)
        return response
    
    # post new student
    def post(self):

        data = request.get_json()

        new_student = Student(
            name=data['name']
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

        new_assignment = Assignment(
            title=data['title'],
            category=data['category'],
            total_points=data['total_points']
        )

        db.session.add(new_assignment)
        db.session.commit()

        response = make_response(new_assignment.to_dict(), 201)
        return response
    
class StudentGrades(Resource):

    # get student's existing grades
    def get(self, student_id):

        student = Student.query.filter_by(id=student_id).first()
        if not student:
            response = make_response({"error": "Student not found"}, 404)
            return response
        
        grades = [grade.to_dict() for grade in student.grades]
        response = make_response(grades, 200)
        return response
    
    # post new grade for student
    def post(self, student_id):

        student = Student.query.filter_by(id=student_id).first()
        if not student:
            response = make_response({"error": "Student not found"}, 404)
            return response

        data = request.get_json()
        
        assignment = Assignment.query.filter_by(id=data['assignment_id']).first()
        if not assignment:
            response = make_response({"error": "Assignment not found"})
            return response
        

        new_grade = Grade(
            score=data['score'],
            student_id=student_id,
            assignment_id=data['assignment_id']
        )

        db.session.add(new_grade)
        db.session.commit()

        response = make_response(new_grade.to_dict(), 201)

        return response
    
class StudentGradeByID(Resource):

    # get a single grade
    def get(self, student_id, grade_id):
        
        grade = Grade.query.filter_by(id=grade_id, student_id=student_id).first()
        if not grade:
            response = make_response({"error": "Grade not found"}, 404)
            return response
        
        response = make_response(grade.to_dict(), 200)
        return response

    # patch update single grade
    def patch(self, student_id, grade_id):

        data = request.get_json()

        grade = Grade.query.filter_by(id=grade_id, student_id=student_id).first()
        if not grade:
            response = make_response({"error": "Grade not found"}, 404)
            return response
        
        for attr in data:
            setattr(grade, attr, data[attr])

        db.session.add(grade)
        db.session.commit()

        response = make_response(grade.to_dict(), 200)
        return response

    # delete single grade
    def delete(self, student_id, grade_id):

        grade = Grade.query.filter_by(id=grade_id, student_id=student_id).first()
        if not grade:
            response = make_response({"error": "Grade not found"}, 404)
            return response

        db.session.delete(grade)
        db.session.commit()

        response = make_response('', 204)
        return response

api.add_resource(Students, '/students')
api.add_resource(Assignments, '/assignments')
api.add_resource(StudentGrades, '/students/<int:student_id>/grades')
api.add_resource(StudentGradeByID, '/students/<int:student_id>/grades/<int:grade_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

