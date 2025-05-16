import { Button, styled, TextField } from '@mui/material'
import Schema from 'async-validator'
import { CreateInputConfig, UseFormFactory } from '../types'


export function useFormFactory(): UseFormFactory {

  const createInput = (name: string, config: CreateInputConfig = {}) => {
    const { defaultValue, onChange, size } = config
    const type = config.type || 'text'
    const rows = config?.rows || 0
    const multiline = rows > 0
    const defSize = size || 'small'
    const required = config?.required || false
    const disabled = config?.disabled || false
    const haveValidator = !!config?.validator
    const validator = config?.validator || {}
    const validatorSchema = new Schema({ [name]: validator });

    const validateTextField = async (value: any) => {
      return validatorSchema.validate({
        [name]: (type === 'number') ? parseInt(value) : value
      })
    }

    const onChangeTextField = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (haveValidator) {
        try {
          const result = await validateTextField(event.target.value)
          .catch(({ errors, fields }) => {
            return console.error(errors, fields);
          });
        } catch (error) {
          console.error('err', error)          
        }
      }

      onChange && onChange(event)
    }

    return (
      <TextField
        id={`input-${name}`}
        label={name}
        type={type}
        variant="outlined"
        onChange={onChangeTextField}
        defaultValue={defaultValue}
        multiline={multiline}
        minRows={rows}
        size={defSize}
        required={required}
        disabled={disabled}
        onKeyDown={(e) =>{ e.stopPropagation() }}
      />
    )
  }

  // const createInputFile = (name: string) => {
  //   const Input = styled('input')({
  //     display: 'none',
  //   });
    
  //   return (
  //     <>
  //       <Input accept=".csv" id="contained-button-file" type="file" />
  //       <Button variant="contained" component="span">
  //         Upload
  //       </Button>
  //     </>
  //   )
  // }

  return {
    createInput
  }
}