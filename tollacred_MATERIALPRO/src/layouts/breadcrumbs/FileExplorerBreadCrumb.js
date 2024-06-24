import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {useLocation, Link, useParams} from 'react-router-dom';
//import SidebarData from '../sidebars/sidebardata/SidebarData';

const FileBreadCrumb = ({name = ''}) => {
  const location = useLocation();
  const params = useParams();

  // Helper function to get the query parameters
  const getQueryParams = (search) => {
    return new URLSearchParams(search);
  };

  // Extract the 'path' query parameter
  const queryParams = getQueryParams(location.search);
  const path = queryParams.get('path') || '';

  // Split the 'path' into segments
  const pathSegments = path.split('/').filter(segment => segment);

  // Generate breadcrumb items for each segment
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = `${location.pathname}?path=${pathSegments.slice(0, index + 1).join('/')}/`;
    return (
      <BreadcrumbItem key={index} tag={Link} to={url} className="text-decoration-none">
        {segment}
      </BreadcrumbItem>
    );
  });
  return (
    <>
    <h4 className="text-capitalize">{`${name}`}</h4>
      <Breadcrumb>
        <BreadcrumbItem to="/" tag={Link} className="text-decoration-none">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem to={`/organization/${params.idOrganization}`} tag={Link} className="text-decoration-none">
          organization
        </BreadcrumbItem>
        <BreadcrumbItem to={`/organization/${params.idOrganization}/Files`} tag={Link} className="text-decoration-none">
          files
        </BreadcrumbItem>
      {breadcrumbItems}
      </Breadcrumb>
    </>
  );
};

export default FileBreadCrumb;
