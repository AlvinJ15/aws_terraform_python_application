const OrganizationDetailAdapter = ({address1, address2, city, country, id, legal_name, name, state, type, zip}) => {
  return {
    address1 : address1 ?? '',
    address2 : address2 ?? '',
    city : city ?? '',
    country : country ?? '',
    id : id ?? '',
    legal_name : legal_name ?? '',
    name : name ?? '',
    state : state ?? '',
    type : type ?? '',
    zip: zip ?? '',
  }
}

export default OrganizationDetailAdapter