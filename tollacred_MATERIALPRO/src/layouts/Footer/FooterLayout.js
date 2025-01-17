import {Link, useParams} from 'react-router-dom';
import {BlogData} from '../../data/organization.data';
import HorizontalLogo from '../logo/HorizontalLogo';

const FooterLayout = ({className}) => {
  const params = useParams()

  return (
    <footer className={`${className} bg-primary`}>
      <div className='container-lg'>
        <div className="py-4">
          <div className='d-flex justify-content-between'>
            <HorizontalLogo></HorizontalLogo>
            <div className='d-flex gap-5'>
              {
                params.idOrganization !== 'e5a88912-a95b-47a8-9a2f-f0f0594c7a3b' ?
                  BlogData.flatMap((item, index) =>
                    <Link className='text-decoration-none text-white' to={`/organization/${item.id}/details`}
                          key={index}>
                      <h6 className='text-white fw-normal'>{item.title}</h6>
                    </Link>
                  )
                  :
                  BlogData.flatMap((item, index) => {
                      if (item.id === 'e5a88912-a95b-47a8-9a2f-f0f0594c7a3b')
                        return (
                          <Link className='text-decoration-none text-white' to={`/organization/${item.id}/details`}
                                key={index}>
                            <h6 className='text-white fw-normal'>{item.title}</h6>
                          </Link>
                        )
                      else {
                        return []
                      }
                    }
                  )
              }
            </div>
          </div>
        </div>
        <hr></hr>
        <div className='pb-3 text-center'>
          <span>Copyright © 2024 Tollanis Solutions, Inc. – All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default FooterLayout;