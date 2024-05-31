import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardGroup,
  Button,
  Row,
  Col,
  CardLink,
  CardHeader,
  CardFooter,
  CardImgOverlay,
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';


import {Link, useNavigate, useParams} from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import {BlogData} from '../../data/organization.data';
import ApiManager from "@/config/ApiManager.js";

const OrganizationList = () => {
  const params = useParams()
  const navigate = useNavigate()

  const redirect = async (e, link) => {
    params.idOrganization = link
    navigate(`/organization/${params.idOrganization}/staff`);
    //navigate(`/organization/${params.idOrganization}/details`)
  }
  return (
    <div>
      {/* <BreadCrumbs /> */}
      <h5 className="mb-3">Home</h5>
      <Row>
        <Col sm="6" lg="6" xl="3" key={BlogData.image}>
          <h2>Welcome to Tollaniscred</h2>
          <p>
            A comprehensive onboarding and compliance solution tailored to meet the requirements of
            cross-state travel nursing professionals and the organizations that engage their services.
            Choose which instance you want to work today!
          </p>
        </Col>
        <Col sm="6" lg="6" xl="9" key={BlogData.image}>
          <Row>
            {BlogData.map((blg, index) => (
              <Col sm="6" lg="6" xl="3" key={index}>
                {/* <Link to={`/organization/${blg.id}/details`} className='text-decoration-none'> */}
                <div className='text-decoration-none' onClick={(e) => {
                  redirect(e, blg.id)
                }}>
                  <Card>
                    <CardImg alt="Card image cap" src={blg.image} top width="100%"
                      //style={{ height: "333px" }}
                    />
                    <CardBody>
                      <CardTitle tag="h4" className='fw-bold'>
                        {blg.title}
                      </CardTitle>

                    </CardBody>
                  </Card>
                </div>
                {/* </Link> */}
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default OrganizationList;