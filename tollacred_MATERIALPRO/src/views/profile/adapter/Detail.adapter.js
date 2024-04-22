const DetailAdapter = ({address, city, country, date_of_birth, email, employee_id, first_name, gender, grade, last_name, medical_category, profile_id, role, specialty, state, title, zip}) => {
  return {
    address : address ?? '------',
    city : city ?? '------',
    country : country ?? '------',
    date_of_birth : date_of_birth ?? '------',
    email : email ?? '------',
    employee_id : employee_id ?? '------',
    first_name : first_name ?? '------',
    gender : gender ?? '------',
    grade : grade ?? '------',
    last_name : last_name ?? '------',
    medical_category : medical_category ?? '------',
    profile_id : profile_id ?? '------',
    role : role ?? '------',
    specialty : specialty ?? '------',
    state : state ?? '------',
    title : title ?? '------',
    zip: zip ?? '------',
  }
}

export default DetailAdapter