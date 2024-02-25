from sqlalchemy import Column, String, ForeignKey, JSON, Enum, DateTime
from sqlalchemy.orm import relationship

from data_models.model_employee import Employee
from data_models.model_questionnaire import Questionnaire
from data_models.models import Base, get_collation_ids, set_fields_from_dict

STATUS = ['Completed', 'Not Completed', 'Draft']


class EmployeeQuestionnaireResponse(Base):
    __tablename__ = 'employee_questionnaire_responses'
    __table_args__ = {'extend_existing': True}

    response_id = Column(
        String(36, collation=get_collation_ids()),
        primary_key=True
    )
    employee_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Employee.employee_id)
    )
    questionnaire_id = Column(
        String(36, collation=get_collation_ids()),
        ForeignKey(Questionnaire.questionnaire_id)
    )
    response = Column(JSON, nullable=False)
    status = Column(Enum(*STATUS), nullable=False)
    completed = Column(DateTime)

    questionnaire = relationship(Questionnaire, backref='employees')

    def __init__(self, **kwargs):
        date_fields = ['completed']
        set_fields_from_dict(self, kwargs, date_fields)

    def to_dict(self):
        return {
            'response_id': self.response_id,
            'employee_id': self.employee_id,
            'questionnaire_id': self.questionnaire_id,
            'answers': self.build_answer_response(),
            'status': self.status,
            'completed': self.completed.strftime('%Y-%m-%d %H:%M:%S') if self.completed else None
        }

    def build_answer_response(self):
        question_json = self.questionnaire.definition
        answer_question_list = []
        for question in question_json.get('questions', []):
            for answer in self.response.get('answers', []):
                if answer.get('question_id') == question.get('id'):
                    answer_question_list.append({
                        'answer': answer.get('answer'),
                        'question': question.get('question')
                    })
                    break
        return answer_question_list
