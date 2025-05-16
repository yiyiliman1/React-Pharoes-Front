import React, { createContext } from 'react';
import useSchemaRequest from '../hooks/useSchemaRequest';

export const SchemaContext = createContext<any | undefined>(undefined)
export const SchemaConsumer = SchemaContext.Consumer;


type SchemaProviderProps = {
  children?: React.ReactChild
}

export const SchemaProvider = ({ children }: SchemaProviderProps) => {
  const { schema, getSchemaResponse } = useSchemaRequest()
  const value = {
    schema,
    isLoading: getSchemaResponse.isLoading,
  }

  return (
    <SchemaContext.Provider value={value}>
      {children}
    </SchemaContext.Provider>
  )
}
