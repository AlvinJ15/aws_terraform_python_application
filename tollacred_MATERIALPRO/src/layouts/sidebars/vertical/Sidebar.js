import React, { useState } from 'react';
import { Nav } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import SidebarData from '../sidebardata/HorizontalSidebarData';
import NavItemContainer from './NavItemContainer';
import NavSubMenu from './NavSubMenu';
import user1 from '../../../assets/images/users/user4.jpg';
import probg from '../../../assets/images/bg/download.jpg';
import { useParams } from 'react-router-dom';
import OrganizationService from '../../../views/organization/services/organization.service.js';

const Sidebar = () => {
  const location = useLocation();
  const params = useParams();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');

  //const [collapsed, setCollapsed] = useState(null);
  // const toggle = (index) => {
  //   setCollapsed(collapsed === index ? null : index);
  // };

  const [perfil, setPerfil] = useState({
    id: '',
    name: "User Not Found"
  })

  const getNameProfile = () => {
    if (params.idEmployee != perfil.id)
      OrganizationService.get(`${params.idOrganization}/employees/${params.idEmployee}`)
        .then(response => {
          setPerfil({
            id: response.profile.employee_id,
            name: `${response.profile.first_name} ${response.profile.last_name}`
          })
        })
    //return params.idEmployee ? params.idEmployee : params.idOrganization
  }

  const activeBg = useSelector((state) => state.customizer.sidebarBg);
  const isFixed = useSelector((state) => state.customizer.isSidebarFixed);
  // const dispatch = useDispatch();

  return (
    <div className={`sidebarBox shadow bg-${activeBg} ${isFixed ? 'fixedSidebar' : ''}`}>
      <SimpleBar style={{ height: '100%' }}>
        <div className="profilebg" style={{ background: `url(${probg}) no-repeat center/cover` }}>
          <div className="p-3 d-flex">
            <img src={user1} alt="user" width="50" className="rounded-circle" />
          </div>
          <div className="bg-dark text-dark-white p-2 opacity-75 text-truncate">Steave Rojer</div>
        </div>
        {/********Sidebar Content*******/}
        <div className="p-3 pt-1 mt-2">
          <Nav vertical className={activeBg === 'white' ? '' : 'lightText'}>
          <NavItemContainer
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
              if (!!params.idOrganization && !!(params.idOrganization !== ':idOrganization'))
              {
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
                    <NavSubMenu
                      key={index}
                      icon={navi.icon}
                      title={navi.title}
                      items={navi.children}
                      suffix={navi.suffix}
                      suffixColor={navi.suffixColor}
                      // toggle={() => toggle(navi.id)}
                      // collapsed={collapsed === navi.id}
                      isUrl={currentURL === navi.href}
                    />
                  );
                }
                return (
                  <NavItemContainer
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
        </div>
      </SimpleBar>
    </div>
  );
};

export default Sidebar;
