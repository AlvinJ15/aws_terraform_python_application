import React, { useEffect, useState } from 'react';
import StaffList from './StaffList';
const StaffArchived = () => {
    const [staffArchived, setstaffArchived] = useState({
        type: "archived",
        body: []
    })
    const getStaffList = () => {
        /*setSpinnerLoading(true)
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/employees?page=1', "GET").then(response => {
            setstaffArchived({
                type: "archived",
                body:reposne
            })
            //setSpinnerLoading(false)
        })*/
    }
    // useEffect(() => {
    //     getStaffList()
    // }, [])
    return (

        <StaffList/>

    )

}
export default StaffArchived;