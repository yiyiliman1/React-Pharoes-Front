import { useState } from 'react'
import { useFormFactory } from '../../../common/hooks/useFormFactory'
import { Profile } from '../types'

type Props = {
  defaultValues?: Partial<Profile>,
  formulaDisabled?: boolean
  isEditor?: boolean
}

type UseProfileForm = {
  profile: Profile
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
  NameInput: JSX.Element
  FormulaInput: JSX.Element
}

enum FormFields {
  name = 'Name',
  sourceFile = 'Sourcefile',
  formula = 'Formula',
}

export const useProfileForm = ({ defaultValues, formulaDisabled, isEditor }: Props): UseProfileForm => {
  const { createInput } = useFormFactory()
  const [profile, setProfile] = useState<Profile>({
    Id: '',
    Comments: '',
    Formula: '',
    Name: '',
    Rule: '',
    Sourcefile: '',
    Date: '',
    ...defaultValues
  })

  const getOnChangeInputEvent = (formField: FormFields) => (event: React.ChangeEvent<HTMLInputElement>) => setProfile({
    ...profile,
    [formField]: event.target.value
  })

  const NameInput = createInput(FormFields.name, {
    onChange: getOnChangeInputEvent(FormFields.name),
    defaultValue: defaultValues?.Name,
    disabled: isEditor
  })
  const FormulaInput = createInput(FormFields.formula, {
    onChange: getOnChangeInputEvent(FormFields.formula),
    defaultValue: defaultValues?.Formula,
    disabled: formulaDisabled
  })

  return { profile, setProfile, NameInput, FormulaInput }
}