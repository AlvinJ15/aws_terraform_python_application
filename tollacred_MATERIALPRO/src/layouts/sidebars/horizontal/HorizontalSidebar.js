import {Container, Nav} from 'reactstrap';
import {useSelector} from 'react-redux';
import {useLocation, useParams} from 'react-router-dom';
import SidebarDatax from '../sidebardata/HorizontalSidebarData';
import NavSubItem from './NavSubItem';
import NavSingleItem from './NavSingleItem';
import {useEffect, useState} from 'react';
import organizationService from '../../../views/organization/services/organization.service';
import _ from 'lodash';

const HorizontalSidebar = () => {
    const activeBg = useSelector((state) => state.customizer.sidebarBg);
    const location = useLocation();
    const params = useParams();
    const currentURL = location.pathname.split('/').slice(0, -1).join('/');
    const isFixed = useSelector((state) => state.customizer.isSidebarFixed);
    const isMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);


    const [sidebarData, setSidebarData] = useState(null)
    const [isFetching, setisFetching] = useState(false)
    const [perfil, setPerfil] = useState({
        id: '',
        name: "User Not Found"
    })

    function replaceParamsInHrefs(data, params) {
        return data.map((item) => {
            if (item.href) {
                let updatedHref = item.href;
                if (params.idOrganization && updatedHref.includes(':idOrganization')) {
                    updatedHref = updatedHref.replace(':idOrganization', params.idOrganization);
                }
                if (params.idEmployee && updatedHref.includes(':idEmployee')) {
                    updatedHref = updatedHref.replace(':idEmployee', params.idEmployee);
                }
                if (params.idEmployee && updatedHref.includes(':idUser')) {
                    updatedHref = updatedHref.replace(':idUser', params.idEmployee);
                }
                // Add more if statements for other expected variables
                item.href = updatedHref;
            }

            if (item.children) {
                item.children = replaceParamsInHrefs(item.children, params);
            }

            return item;
        });
    }

    useEffect(() => {
        const copiedData = _.cloneDeep(SidebarDatax);
        const updatedData = replaceParamsInHrefs(copiedData, params);
        setSidebarData(updatedData);
        if (params.idEmployee)
            getNameProfile();
        else
            setPerfil({
                id: '',
                name: "User Not Found"
            })

    }, [params])

    const getNameProfile = () => {
        setisFetching(true);
        organizationService.get(`${params.idOrganization}/employees/${params.idEmployee}`)
            .then(response => {
                setPerfil({
                    id: response.profile.employee_id,
                    name: `${response.profile.first_name} ${response.profile.last_name}`
                })
                setisFetching(false)
            })
        //return params.idEmployee ? params.idEmployee : params.idOrganization
    }

    return (
        sidebarData && !isFetching ?
            <div
                className={`horizontalNav shadow bg-${activeBg}  ${isFixed ? 'fixedSidebar' : ''} ${isMobileSidebar ? 'showSidebar' : ''
                }`}
            >
                <Container>
                    {

                        <Nav className={activeBg === 'white' ? '' : 'lightText'}>

                            <NavSingleItem
                                className={location.pathname === sidebarData[1].href ? 'activeLink' : ''}
                                to={sidebarData[1].href}
                                title={sidebarData[1].title}
                                suffix={sidebarData[1].suffix}
                                suffixColor={sidebarData[1].suffixColor}
                                icon={sidebarData[1].icon}
                            />

                            {sidebarData.map((navi, index) => {
                                if (index < 2) {
                                    return
                                }
                                if (!!params.idOrganization && (params.idOrganization !== ':idOrganization')) {

                                    if (navi.title === 'My Profile') {
                                        navi.title = perfil.name;
                                    }
                                    if (navi.caption) {
                                        return (
                                            <div
                                                className="navCaption fw-bold mt-4 d-none d-sm-block d-md-none"
                                                key={index}
                                            >
                                                {navi.caption}
                                            </div>
                                        );
                                    }
                                    if (navi.children) {
                                        return (
                                            <NavSubItem
                                                key={index}
                                                icon={navi.icon}
                                                title={navi.title}
                                                subMenu={navi.children}
                                                suffix={navi.suffix}
                                                ddType={navi.ddType}
                                                activeBck={activeBg}
                                                suffixColor={navi.suffixColor}
                                                isUrl={currentURL === navi.href}
                                            />
                                        );
                                    }
                                    return (
                                        <NavSingleItem
                                            key={index}
                                            //toggle={() => toggle(navi.id)}
                                            className={location.pathname === navi.href ? 'activeLink' : ''}
                                            to={navi.href}
                                            title={navi.title}
                                            suffix={navi.suffix}
                                            suffixColor={navi.suffixColor}
                                            icon={navi.icon}
                                        />
                                    );
                                }
                            })}
                        </Nav>
                    }
                </Container>
            </div> : ''
    );
};

export default HorizontalSidebar;
