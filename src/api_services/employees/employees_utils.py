from api_services.utils.ses_utils import SES
from data_models.model_administrator import Administrator
from data_models.model_employee import Employee
from data_models.model_employee_profile import EmployeeProfile


def get_employees_with_filter(db, organization_id, query_params: dict):
    query = db.query(Employee).filter(Employee.organization_id == organization_id)
    profile_filters = ['first_name', 'last_name', 'email']
    employee_filters = ['assignee_id', 'status']
    for attribute in employee_filters:
        if attribute in query_params:
            query = query.filter(getattr(Employee, attribute) == query_params.get(attribute))

    for attribute in profile_filters:
        if attribute in query_params:
            query = query.filter(
                Employee.profile.has(getattr(EmployeeProfile, attribute) == query_params.get(attribute))
            )

    return query


def notify_assignee(db, stage, employee, data):
    domain = 'app.tollaniscred.com'
    if stage != 'prod':
        domain = domain.replace('app', f'app-{stage}')
    administrator = db.query(Administrator).filter_by(admin_id=data['assignee_id']).first()
    email_body = (f'<BR>Dear {administrator.first_name} {administrator.last_name}:<BR><BR>'
                  f'You have a new candidate assigned:<BR><BR>'
                  f'\tCandidate Name:\t{employee.profile.get_name()}<BR>'
                  f'\tCandidate Email:\t{employee.profile.email}<BR>'
                  f'\tCandidate Profile:\t{domain}/organization/{employee.organization_id}/'
                  f'employee/{employee.employee_id}/profile<BR><BR>'
                  f'Thank you for using TollanisCred!')
    SES.send_notification_email(
        recipient=administrator.email,
        subject=f'New candidate assigned: {employee.profile.get_name()}',
        body=email_body,
    )
