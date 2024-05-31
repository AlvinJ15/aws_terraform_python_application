import React, { useEffect, useState } from 'react';
import { NavItem, NavLink, Nav } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link, useLocation, useParams } from 'react-router-dom';

const NavSubItem = ({ to, icon, title, subMenu, suffix, activeBck, suffixColor, ddType }) => {
  const [isOpen, setIsOpen] = useState(false);
  //const [subMenu, setSubMenu] = useState(items);
  const [isloading, setIsLoading] = useState(false)

  const params = useParams()
  const location = useLocation();

  const Handletoggle = () => {
    setIsOpen(!isOpen);

  }
  return (
      title !== 'User Not Found' ?
    <NavItem className={`collapsed && getActive ? 'activeParent' : '' ${ddType}`}>
      <NavLink to={to} className="gap-3 cursor-pointer" onClick={Handletoggle}>
        <span className="sidebarIcon d-flex align-items-center">{icon}</span>
        <div className="d-flex flex-grow-1 align-items-center gap-2">
          <span className="me-auto">{title}</span>
          {suffix ? <span className={`badge  ${suffixColor}`}>{suffix}</span> : ''}
          <i className="bi bi-chevron-down" />
        </div>
      </NavLink>
      <Nav vertical className={`firstDD bg-${activeBck} ${isOpen ? 'showfirstDD' : ''}`}>
        { 
          (!!subMenu && !isloading) &&
          subMenu.map((item) => (
            <NavItem
              key={item.title}
              className={`${location.pathname === item.href ? 'activeLink' : ''}`}
            >
              <NavLink tag={Link} to={item.href} className="gap-3">
                <span className="sidebarIcon">{item.icon}</span>
                <span className="">
                  <span>{item.title}</span>
                </span>
              </NavLink>
            </NavItem>
          ))
        }
      </Nav>
    </NavItem> : ''
  );
};

NavSubItem.propTypes = {
  title: PropTypes.string,
  to: PropTypes.string,
  icon: PropTypes.node,
  subMenu: PropTypes.array,
  suffix: PropTypes.any,
  activeBck: PropTypes.string,
  suffixColor: PropTypes.string,
  ddType: PropTypes.string,
};
export default NavSubItem;
