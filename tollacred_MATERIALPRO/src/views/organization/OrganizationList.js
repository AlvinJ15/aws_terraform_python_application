import {
    Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardGroup, Button, Row, Col, CardLink, CardHeader, CardFooter,
    CardImgOverlay,
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';

import Blog from '../../components/dashboard/Blog';
import elite from '../../assets/images/logos/elitebutton.png';
import genevive from '../../assets/images/logos/genevivebutton.png';
import tollanis from '../../assets/images/logos/tollanisbutton.png';
import care from '../../assets/images/logos/truecarebutton.png';
import pulse from '../../assets/images/logos/pulsebutton.png';
import payor from '../../assets/images/logos/payorbutton.png';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const BlogData = [
    {
        id: '9cf728c0-288a-4d92-9524-04d58b2ab32d',
        image: elite,
        title: 'Elite 365',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        id: '2c8d5c83-eac7-4ec2-bb57-ca2631d5f0ae',
        image: elite,
        title: 'Elite 365 - Locums',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        id: '5d552a6c-1bef-412f-a913-36c2326975a3',
        image: genevive,
        title: 'Genevive',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        id: '4c6e19a0-0a58-43f0-a12e-9d66eabe2265',
        image: care,
        title: 'True Care',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        id: 'aed47a1f-0ab4-44be-a903-2fb3ca783980',
        image: pulse,
        title: 'Pulse ',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        id: 'e5a88912-a95b-47a8-9a2f-f0f0594c7a3b',
        image: tollanis,
        title: 'Tollanis Training',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        id: '0c53f3f8-5088-444a-a9e2-2c773a20fe6f',
        image: payor,
        title: 'Credentialing Payor',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
];
const OrganizationList = () => {
    const params = useParams()
    const navigate = useNavigate()
    const redirect = (e, link) => {
        //console.log("ire a esste sitio", link, params.idOrganization)
        params.idOrganization = link
        navigate(`/organization/${params.idOrganization}/details`)
        //navigate(`/organization/${params.idOrganization}/questionnaires`)
        //console.log("params", params)
    }
    return (
        <div>
            {/* <BreadCrumbs /> */}
            <h5 className="mb-3">Basic Card</h5>
            <Row>
                <Col sm="6" lg="6" xl="3" key={BlogData.image}>
                    <h2>Welcome to Total Tollanis Credentialing</h2>
                    <p>
                        A comprehensive onboarding and compliance solution tailored to meet the requirements of cross-state travel nursing professionals and the organizations that engage their services.
                        Choose which instance you want to work today!
                    </p>
                </Col>
                <Col sm="6" lg="6" xl="9" key={BlogData.image}>
                    <Row>
                        {BlogData.map((blg, index) => (
                            <Col sm="6" lg="6" xl="3" key={index}>
                                {/* <Link to={`/organization/${blg.id}/details`} className='text-decoration-none'> */}
                                <div className='text-decoration-none' onClick={(e) => { redirect(e, blg.id) }}>
                                    <Card>
                                        <CardImg alt="Card image cap" src={blg.image} top width="100%"
                                        //style={{ height: "333px" }}
                                        />
                                        <CardBody>
                                            <CardTitle tag="h4" className='fw-bold'>
                                                {blg.title}
                                            </CardTitle>
                                            <CardText tag="p">
                                                {blg.description}
                                            </CardText>
                                            <CardText>
                                                <small className="text-muted">
                                                    small text
                                                </small>
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </div>
                                {/* </Link> */}
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div >
    );
};

export default OrganizationList;