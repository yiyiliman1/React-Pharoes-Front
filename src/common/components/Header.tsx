import { Link } from 'react-router-dom';
import ProjectSelect from './ProjectSelect'
import UserMenu from './UserMenu'

type Props = {
  withoutProjectSelect?: boolean;
};

export default ({ withoutProjectSelect }: Props) => {
  return (
    <div className='main-header'>
      <div className='left'>
        <Link className='no-link' to="/">
          { withoutProjectSelect && (<span>PHAROES</span>)}
        </Link>

      </div>
      <div className='right'>
        { !withoutProjectSelect && (<ProjectSelect />)}
        <UserMenu />
      </div>
    </div>
  )
}