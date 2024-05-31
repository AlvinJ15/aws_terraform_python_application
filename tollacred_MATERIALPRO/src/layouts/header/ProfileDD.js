import React from 'react';
import user1 from '../../assets/images/users/user4.jpg';
import PropTypes from "prop-types";
import ChatListItem from "@/views/staff/chat/ChatListItem.js";

const ProfileDD = ({ loggedUser }) => {
  return (
    <div>
      <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
        <img src={user1} alt="user" className="rounded-circle" width="60"/>
        <span>
        <h5 className="mb-0">{`${loggedUser.profile.first_name} ${loggedUser.profile.last_name}`}</h5>
        <small className='fs-6 text-muted'>{loggedUser.profile.email}</small>
      </span>
      </div>
      {/* <DropdownItem className="px-4 py-3">
      <User size={20} />
      &nbsp; My Profile
    </DropdownItem> */}
    </div>

  );
};
ProfileDD.propTypes = {
  loggedUser: PropTypes.any.isRequired,
};
export default ProfileDD;
