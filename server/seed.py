#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Student, Grade, Assignment

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        
        Student.query.delete()
        Grade.query.delete()
        Assignment.query.delete()

        print('Creating students...')

        jessica = Student(name='Jessica')
        katie = Student(name='Katie')
        marvin = Student(name='Marvin')

        students = [jessica, katie, marvin]

        print('Creating assignments...')

        bellringer = Assignment(title='Weekend Survey', category='bellringer', total_points=2)
        homework = Assignment(title='Exponents Review', category='homework', total_points=5)
        quiz = Assignment(title='Expressions and Equations Quiz', category='quiz', total_points=20)
        final = Assignment(title='Algebra Final', category='test', total_points=100)
        
        assignments = [bellringer, homework, quiz, final]

        print('Creating grades...')
        
        jb = Grade(student=jessica, assignment=bellringer, score=1)
        jh = Grade(student=jessica, assignment=homework, score=5)
        jq = Grade(student=jessica, assignment=quiz, score=20)
        jf = Grade(student=jessica, assignment=final, score=97)

        kb = Grade(student=katie, assignment=bellringer, score=1)
        kh = Grade(student=katie, assignment=homework, score=4)
        kq = Grade(student=katie, assignment=quiz, score=17)
        kf = Grade(student=katie, assignment=final, score=84)

        mb = Grade(student=marvin, assignment=bellringer, score=0)
        mh = Grade(student=marvin, assignment=homework, score=3)
        mq = Grade(student=marvin, assignment=quiz, score=14)
        mf = Grade(student=marvin, assignment=final, score=68)

        grades = [jb, jh, jq, jf, kb, kh, kq, kf, mb, mh, mq, mf]

        db.session.add_all(students)
        db.session.add_all(assignments)
        db.session.add_all(grades)
        db.session.commit()