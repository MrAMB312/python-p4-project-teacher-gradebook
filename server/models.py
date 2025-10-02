from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates

from config import db

# Models go here!
class Student(db.Model, SerializerMixin):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    grades = db.relationship('Grade', back_populates='student', cascade='all, delete-orphan')

    assignments = association_proxy('grades', 'assignment',
                                    creator=lambda assignment_obj: Grade(assignment=assignment_obj))

    serialize_rules = ('-grades',)

    @validates('name')
    def validate_name(self, key, name):
        if name is None:
            raise ValueError('Invalid student name.')
        return name

    def __repr__(self):
        return f"<Student {self.id}, {self.name}>"

class Grade(db.Model, SerializerMixin):
    __tablename__ = "grades"

    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer)

    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    assignment_id = db.Column(db.Integer, db. ForeignKey('assignments.id'), nullable=False)

    student = db.relationship('Student', back_populates='grades')
    assignment = db.relationship('Assignment', back_populates='grades')

    serialize_rules = ('-student.grades', '-assignment.grades',)

    @validates('score')
    def validate_student_score(self, key, score):
        if score is None:
            raise ValueError('Invalid grade score.')
        if not isinstance(score, int) or score < 0:
            raise ValueError('Score must be integer greater than or equal to 0.')
        return score

    def __repr__(self):
        return f"<Grade {self.id}, Score: {self.score}, Student: {self.student.name}, Assignment: {self.assignment.title}>"

class Assignment(db.Model, SerializerMixin):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    total_points = db.Column(db.Integer, nullable=False)

    grades = db.relationship('Grade', back_populates='assignment', cascade='all, delete-orphan')

    students = association_proxy('grades', 'student',
                                 creator=lambda student_obj: Grade(student=student_obj))

    serialize_rules = ('-grades',)

    @validates('title')
    def validate_title(self, key, title):
        if title is None:
            raise ValueError('Invalid assignment title.')
        return title
    
    @validates('category')
    def validate_category(self, key, category):
        if category is None:
            raise ValueError('Invalid assignment category.')
        return category
    
    @validates('total_points')
    def validate_total_points(self, key, total_points):
        if total_points is None:
            raise ValueError('Invalid assignment points.')
        if not isinstance(total_points, int) or total_points <= 0:
            raise ValueError('Total points must be a positive integer.')
        return total_points
    
    def __repr__(self):
        return f"<Assignment {self.id}, {self.title}, Category: {self.category}, Total Points: {self.total_points}>"