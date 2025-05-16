import { Link } from 'react-router-dom'


export default () => {
  return (
    <div className='nav-menu-header'>
      <Link className='no-link' to="/">
        <span>PHAROES</span>
      </Link>
    </div>
  )
}