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
        
        students = Student.query.all()
        all_assignments = Assignment.query.all()

        serialized = []

        for student in students:
            assignments_list = []

            for assignment in all_assignments:
                grades_for_assignment = [
                    {"id": g.id, "score": g.score}
                    for g in student.grades
                    if g.assignment_id == assignment.id
                ]

                assignments_list.append({
                    "id": assignment.id,
                    "title": assignment.title,
                    "category": assignment.category,
                    "total_points": assignment.total_points,
                    "grades": grades_for_assignment
                })

            serialized.append({
                "id": student.id,
                "name": student.name,
                "assignments": assignments_list
            })

        return make_response(serialized, 200)
    
    # post new student
    def post(self):

        data = request.get_json()

        new_student = Student(
            name=data['name']
        )

        db.session.add(new_student)
        db.session.commit()

        all_assignments = Assignment.query.all()
        assignments_list = [
            {
                "id": a.id,
                "title": a.title,
                "category": a.category,
                "total_points": a.total_points,
                "grades": []
            }
            for a in all_assignments
        ]

        response = make_response({
            "id": new_student.id,
            "name": new_student.name,
            "assignments": assignments_list
        }, 201)

        return response

class Assignments(Resource):
    # get existing assignments
    def get(self):

        assignments = Assignment.query.all()
        serialized = [
            {
                "id": a.id,
                "title": a.title,
                "category": a.category,
                "total_points": a.total_points
            }
            for a in assignments
        ]
        return make_response(serialized, 200)
    
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

        response = {
            "id": new_assignment.id,
            "title": new_assignment.title,
            "category": new_assignment.category,
            "total_points": new_assignment.total_points
        }
        return make_response(response, 201)

class StudentAssignments(Resource):
    # get student's existing grades
    def get(self, student_id):

        student = Student.query.filter_by(id=student_id).first()
        if not student:
            response = make_response({"error": "Student not found"}, 404)
            return response
        
        assignments_dict = {}
        for assignment in Assignment.query.all():
            assignments_dict[assignment.id] = {
                "id": assignment.id,
                "title": assignment.title,
                "category": assignment.category,
                "total_points": assignment.total_points,
                "grades": []
            }
        
        for grade in student.grades:
            assignments_dict[grade.assignment_id]["grades"].append({
                "id": grade.id,
                "score": grade.score
            })

        response = make_response({
            "id": student.id,
            "name": student.name,
            "assignments": list(assignments_dict.values())
        }, 200)
        return response

class StudentAssignmentGrades(Resource):
    # get a single grade
    def get(self, student_id, assignment_id):
        
        grades = Grade.query.filter_by(student_id=student_id, assignment_id=assignment_id).all()
        if not grades:
            response = make_response({"grades": []}, 200)
            return response
        
        response = make_response({
            "grades": [{"id": g.id, "score": g.score} for g in grades]
            }, 200)
        return response
    
    # post new grade for student
    def post(self, student_id, assignment_id):

        data = request.get_json()

        new_grade = Grade(
            score=data['score'],
            student_id=student_id,
            assignment_id=assignment_id
        )

        db.session.add(new_grade)
        db.session.commit()

        response = make_response({
            "id": new_grade.id,
            "score": new_grade.score,
            "assignment_id": assignment_id
        }, 201)

        return response

class StudentGradeByID(Resource):
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
api.add_resource(StudentAssignments, '/students/<int:student_id>/assignments')
api.add_resource(StudentAssignmentGrades, '/students/<int:student_id>/assignments/<int:assignment_id>/grades')
api.add_resource(StudentGradeByID, '/students/<int:student_id>/grades/<int:grade_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

