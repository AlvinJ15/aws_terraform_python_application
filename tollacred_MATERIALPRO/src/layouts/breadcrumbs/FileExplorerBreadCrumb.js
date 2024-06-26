import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import {useLocation, Link, useParams} from 'react-router-dom';

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

  const forbiddenSegments = ["app_data", "orgs"];
  // Split the 'path' into segments
  const pathSegments = path.split('/').filter(segment => segment);

  const allSegments = pathSegments.map((segment, index) => {
    return `${pathSegments.slice(0, index + 1).join('/')}/`;
  });
  const allUrls = allSegments.filter(allSegments => {
    const folders = allSegments.split('/');
    return !forbiddenSegments.includes(folders[folders.length - 2])
  });
  // Generate breadcrumb items for each segment
  const breadcrumbItems = allUrls.map((url, index) => {
    const folders = url.split('/');
    const segment = folders[folders.length - 2];
    url = `${location.pathname}?path=${url}`;
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
