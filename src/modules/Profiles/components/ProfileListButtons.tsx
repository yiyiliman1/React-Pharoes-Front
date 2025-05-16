import { AddButton } from '../../../common/components/SectionMenu/buttons/AddButton'
import { DeleteButton } from '../../../common/components/SectionMenu/buttons/DeleteButton'
import { DownloadButton } from '../../../common/components/SectionMenu/buttons/DownloadButton'
import { EditButton } from '../../../common/components/SectionMenu/buttons/EditButton'
import { UploadButton } from '../../../common/components/SectionMenu/buttons/UploadButton'
import { DeleteDialog } from './DeleteDialog'
import { ProfileCreateFormDialog } from './ProfileCreateFormDialog'
import { ProfileEditorFormDialog } from './ProfileEditorFormDialog'
import { useProfiles } from '../hooks/useProfiles'
import { useProfilesContext } from '../context/ProfilesContext'

export const ProfileListButtons = () => {
  const { removeProfiles, editProfile, createProfile, downloadProfileFile, uploadProfileFiles } = useProfiles()
  const { selection } = useProfilesContext();

  let selectedIsFormula = true
  if (selection.hasSelection){
    selectedIsFormula = !selection.firstItem!.Sourcefile;
  }

  const downloadSelectedProfileFile = () => {
    const profile = selection.firstItem;
    if (!profile) return;
    downloadProfileFile(profile);
  }

  return (
    <>
      <ProfileCreateFormDialog onSave={createProfile}>
        <AddButton tooltip='Create formula' disabled={selection.hasSelection} />
      </ProfileCreateFormDialog>
      <UploadButton disabled={selection.hasSelection} resetAfterFire accept={'.csv'} onChange={uploadProfileFiles} tooltip='Upload file'/>
      <DownloadButton disabled={!selection.isSingleSelection || selectedIsFormula} onClick={downloadSelectedProfileFile} tooltip='Download profiles'/>
      <ProfileEditorFormDialog onSave={editProfile} defaultValues={selection.firstItem} disabled={!selection.isSingleSelection} title={"Edit Profile"} confirmButtonLabel={'Save'}>
        <EditButton tooltip='Edit profile' disabled={!selection.isSingleSelection}/>
      </ProfileEditorFormDialog>
      <DeleteDialog onDelete={removeProfiles}>
        <DeleteButton tooltip='Delete profile' disabled={!selection.hasSelection} />
      </DeleteDialog>
    </>
  );
};
