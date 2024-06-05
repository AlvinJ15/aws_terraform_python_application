import React, {useEffect, useState} from 'react';
//import { Link } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Container,
  ButtonGroup
} from 'reactstrap';
// import * as Icon from 'react-feather';
// import { Bell, MessageSquare } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
// import SimpleBar from 'simplebar-react';
// import MessageDD from './MessageDD';
// import NotificationDD from './NotificationDD';
// import MegaDD from './MegaDD';
import user4 from '../../assets/images/users/user4.jpg';

import { ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import ProfileDD from './ProfileDD';
import { ToggleHorizontal, } from '../../store/customizer/CustomizerSlice';
import HorizontalLogo from '../logo/HorizontalLogo';
import { deleteCookie } from '../../config/AuthManager';
import {useNavigate, useParams} from 'react-router-dom';
import ApiManager from "@/config/ApiManager.js";
import AuthManager from "@/config/AuthManager.js";


const HorizontalHeader = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);
  const isMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const dispatch = useDispatch();
  const LayoutHorizontal = useSelector((state) => state.customizer.isLayoutHorizontal);

  const navigate = useNavigate()
  const params = useParams()
  const [currentUser, setCurrentUser] = useState(null);
  async function getCurrentUser() {
      const loggedUser = await ApiManager.get(`organizations/${params.idOrganization}/administrators/current`);
      if (loggedUser.profile){
        setCurrentUser(loggedUser);
        AuthManager.setUserId(loggedUser);
      }
  }
  useEffect(() => {
    if (params.idOrganization)
      getCurrentUser();
  }, []);

  const  logout = async () => {
    await deleteCookie('API_TOKEN')
    .then(res => {
      navigate('/');
      window.location.reload();
    })
  }

  return (
    <Navbar
      color={topbarColor}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="shadow HorizontalTopbar p-0"
    >
      <Container className="d-flex align-items-center">
        {/******************************/}
        {/**********Logo**********/}
        {/******************************/}
        <div className="pe-4 py-3 ">
          <HorizontalLogo />
        </div>
        {/******************************/}
        {/**********Toggle Buttons**********/}
        {/******************************/}

        <Nav className="me-auto flex-row" navbar>
          <Button
            color={topbarColor}
            className="d-sm-block d-lg-none"
            onClick={() => dispatch(ToggleMobileSidebar())}
          >
            <i className={`bi ${isMobileSidebar ? 'bi-x' : 'bi-list'}`} />
          </Button>

          {/******************************/}
          {/**********Mega DD**********/}
          {/******************************/}
          {/* <UncontrolledDropdown className="mega-dropdown mx-1">
            <DropdownToggle className="bg-transparent border-0" color={topbarColor}>
              <Icon.Grid size={18} />
            </DropdownToggle>
            <DropdownMenu>
              <MegaDD />
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem className="d-none d-md-block">
            <Link to="/about" className={`nav-link ${topbarColor === 'white' ? 'text-dark' : ''}`}>
              About
            </Link>
          </NavItem> */}
        </Nav>
        <div className="d-flex align-items-center">
          {/******************************/}
          {/**********Notification DD**********/}
          {/******************************/}
          {/*<Button
              outline
              color="light"
              size="sm"
              onClick={() => dispatch(ToggleHorizontal(false))}
          >
            Change Sidebar
          </Button>*/}
          {/* <UncontrolledDropdown>
            <DropdownToggle className="bg-transparent border-0" color={topbarColor}>
              <Bell size={18} />
            </DropdownToggle>
            <DropdownMenu className="ddWidth" end>
              <DropdownItem header>
                <span className="mb-0 fs-5">Notifications</span>
              </DropdownItem>
              <DropdownItem divider />
              <SimpleBar style={{ maxHeight: '350px' }}>
                <NotificationDD />
              </SimpleBar>
              <DropdownItem divider />
              <div className="p-2 px-3">
                <Button color="primary" size="sm" block>
                  Check All
                </Button>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          {/******************************/}
          {/**********Message DD**********/}
          {/******************************/}
          {/* <UncontrolledDropdown className="mx-1">
            <DropdownToggle className="bg-transparent border-0" color={topbarColor}>
              <MessageSquare size={18} />
            </DropdownToggle>
            <DropdownMenu className="ddWidth" end>
              <DropdownItem header>
                <span className="mb-0 fs-5">Messages</span>
              </DropdownItem>
              <DropdownItem divider />
              <SimpleBar style={{ maxHeight: '350px' }}>
                <MessageDD />
              </SimpleBar>
              <DropdownItem divider />
              <div className="p-2 px-3">
                <Button color="primary" size="sm" block>
                  Check All
                </Button>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          {/******************************/}
          {/**********Profile DD**********/}
          {/******************************/}
          <UncontrolledDropdown>
            <DropdownToggle tag="span" className="p-2 cursor-pointer ">
              <img src={user4} alt="profile" className="rounded-circle" width="30" />
            </DropdownToggle>
            <DropdownMenu className="ddWidth">
              {
                currentUser ? <ProfileDD loggedUser={currentUser} /> : ''
              }


              <div className="p-2 px-3">
                <Button color="danger" size="sm" onClick={logout}>
                  Logout 
                </Button>
              </div>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default HorizontalHeader;
