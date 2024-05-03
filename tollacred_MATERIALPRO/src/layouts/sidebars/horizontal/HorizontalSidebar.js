import { Container, Nav } from 'reactstrap';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import SidebarDatax from '../sidebardata/HorizontalSidebarData';
import NavSubItem from './NavSubItem';
import NavSingleItem from './NavSingleItem';
import { useEffect, useState } from 'react';
import organizationService from '../../../views/organization/services/organization.service';

const HorizontalSidebar = () => {
  const activeBg = useSelector((state) => state.customizer.sidebarBg);
  const location = useLocation();
  const params = useParams();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');
  const isFixed = useSelector((state) => state.customizer.isSidebarFixed);
  const isMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);


  const [SidebarData, setSidebarData] = useState(SidebarDatax)
  const [perfil, setPerfil] = useState({
    id: '',
    name: "User Not Found"
  })
  const getNameProfile = () => {
    if (params.idEmployee != perfil.id)
      organizationService.get(`${params.idOrganization}/employees/${params.idEmployee}`)
        .then(response => {
          setPerfil({
            id: response.profile.employee_id,
            name: `${response.profile.first_name} ${response.profile.last_name}`
          })
        })
    //return params.idEmployee ? params.idEmployee : params.idOrganization
  }
  return (
    <div
      className={`horizontalNav shadow bg-${activeBg}  ${isFixed ? 'fixedSidebar' : ''} ${isMobileSidebar ? 'showSidebar' : ''
        }`}
    >
      <Container>
        {
          !!SidebarData &&
          <Nav className={activeBg === 'white' ? '' : 'lightText'}>

            <NavSingleItem
              className={location.pathname === SidebarData[1].href ? 'activeLink' : ''}
              to={SidebarData[1].href}
              title={SidebarData[1].title}
              suffix={SidebarData[1].suffix}
              suffixColor={SidebarData[1].suffixColor}
              icon={SidebarData[1].icon}
            />

            {SidebarData.map((navi, index) => {
              if (index < 2) {
                return
              }
              if (!!params.idOrganization && !!(params.idOrganization !== ':idOrganization')) {

                if (navi.title == 'My Profile' && !!!params.idEmployee) {
                  return;
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
                  navi.children.map((item, index) => { //organization is 2nd
                    if (!!params.idEmployee && (params.idEmployee !== ':idEmployee')) {
                      item.href = item.href.replace(':idOrganization', params.idOrganization)
                      item.href = item.href.replace(':idEmployee', params.idEmployee)
                      /*** ad hoc change*/
                      let new_url = item.href.toString().split("/")
                      if (new_url.length >= 4 && new_url[3] == "employee") {
                        new_url[4] = params.idEmployee
                        item.href = new_url.join("/")
                      }
                      /*byee*/
                      if (typeof params.idEmployee != "undefined" && navi.id == 2.9) {
                        getNameProfile()
                        navi.title = perfil.name
                      } 
                    }
                    let final_url = item.href.toString().split("/")[2]
                    //item.href = item.href.replace(':idOrganization', params.idOrganization)
                    item.href = item.href.replace(final_url, params.idOrganization)
                    return { ...item, href: item.href }
                  })

                  return (
                    <NavSubItem
                      key={index}
                      icon={navi.icon}
                      title={navi.title}
                      items={navi.children}
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
    </div>
  );
};

export default HorizontalSidebar;
