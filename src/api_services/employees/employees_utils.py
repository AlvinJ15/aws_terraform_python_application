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
