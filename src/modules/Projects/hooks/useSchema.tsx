import { useContext } from 'react';
import { SchemaContext } from '../context/SchemaContext';


type UseSchema = {
  schema: any,
  loading: boolean
}


export default function useSchema(): UseSchema {
  const { schema, isLoading } = useContext(SchemaContext)
  return { schema, loading: isLoading }
}