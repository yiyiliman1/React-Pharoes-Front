import PageTitle from '../../../common/components/PageTitle'
import { ProfileListButtons } from '../components/ProfileListButtons'
import { ProfilesDataGrid } from '../components/ProfilesDataGrid'


export const ProfilesMain = () => {
  return (
    <div>
      <PageTitle title='Profiles' buttonsSection={<ProfileListButtons/>} />
      <ProfilesDataGrid />
    </div>
  )
}