import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useLocation, Link } from 'react-router-dom';
//import SidebarData from '../sidebars/sidebardata/SidebarData';

const BreadCrumbs = ({name = ''}) => {
  const location = useLocation();
  const firstUrl = location.pathname.split('/')[1];
  const secondUrl = location.pathname.split('/')[2];
  console.log(firstUrl, secondUrl);
  return (
    <>
      <h4 className="text-capitalize">{secondUrl ? `${name}` : `${firstUrl}`}</h4>
      <Breadcrumb>
        <BreadcrumbItem to="/" tag={Link} className="text-decoration-none">
          Home
        </BreadcrumbItem>
        {firstUrl ? <BreadcrumbItem active>{firstUrl}</BreadcrumbItem> : ''}
        {secondUrl ? <BreadcrumbItem active>{name}</BreadcrumbItem> : ''}
      </Breadcrumb>
    </>
  );
};

export default BreadCrumbs;
