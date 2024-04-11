import React, { useEffect, useState } from 'react';
import { FetchData } from '../../assets/js/funcionesGenerales'
import StaffList from './StaffList';
const StaffApproval = () => {
    const [staffApproval, setStaffApproval] = useState({
        type: "approval",
        body: []
    })
    const getStaffList = () => {
        /*setSpinnerLoading(true)
        FetchData('organizations/9cf728c0-288a-4d92-9524-04d58b2ab32d/employees?page=1', "GET").then(response => {
            setStaffApproval({
                type: "archived",
                body:reposne
            })
            //setSpinnerLoading(false)
        })*/
    }
    useEffect(() => {
        getStaffList()
    }, [])
    return (

        <StaffList dataFetch={staffApproval} />

    )

}
export default StaffApproval;