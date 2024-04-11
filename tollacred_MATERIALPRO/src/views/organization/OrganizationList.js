import {
    Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, CardGroup, Button, Row, Col, CardLink, CardHeader, CardFooter,
    CardImgOverlay,
} from 'reactstrap';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';

import Blog from '../../components/dashboard/Blog';
import elite from '../../assets/images/logos/elitebutton.png';
import elite365 from '../../assets/images/logos/genevivebutton.png';
import bg3 from '../../assets/images/logos/payorbutton.png';
import bg4 from '../../assets/images/logos/pulsebutton.png';

const BlogData = [
    {
        image: elite,
        title: 'Elite 365',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        image: elite365,
        title: 'Elite 365 - Locums',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        image: bg3,
        title: 'Genevive',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
    {
        image: bg4,
        title: 'Simple is beautiful',
        subtitle: '2 comments, 1 Like',
        description:
            'This is a wider card with supporting text below as a natural lead-in to additional content.',
        btnbg: 'primary',
    },
];

const OrganizationList = () => {
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
                        {BlogData.map((blg) => (
                            <Col sm="6" lg="6" xl="3" key={blg.image}>
                                <Card>
                                    <CardImg alt="Card image cap" src={blg.image} top width="100%"
                                    //style={{ height: "333px" }}
                                    />
                                    <CardBody>
                                        <CardTitle tag="h5">
                                            {blg.title}
                                        </CardTitle>
                                        <CardText>
                                            {blg.description}
                                        </CardText>
                                        <CardText>
                                            <small className="text-muted">
                                                small text
                                            </small>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </div >
    );
};

export default OrganizationList;