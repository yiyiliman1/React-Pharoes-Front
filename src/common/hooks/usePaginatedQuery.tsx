import useSelectedProject from "../../modules/Projects/hooks/useSelectedProject";
import { QueryObserverResult, useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import { Project } from "../../modules/Projects/types";
import { useEffect, useRef, useState } from "react";

export function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export class QueryError extends Error {
  public readonly cause?: Error;

  private constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    Object.setPrototypeOf(this, QueryError.prototype);
  }

  public static fromError(error: any): QueryError  {
    const responseErrorMessage = error.response?.data?.message;
    const defaultErrorMessage = "An error occurred performing query.";
    return new QueryError(responseErrorMessage || defaultErrorMessage, error);
  }

  public static create(message: string, cause?: Error): QueryError {
    return new QueryError(message, cause);
  }
}

export interface DataPage<T> {
  Cursor: Cursor;
  Data: T;
}

export interface Cursor {
  amount: number;
  self: string;
  next: string | null;
  prev: string | null;
  has_next: boolean;
  has_prev: boolean;
}

interface CursorTokens {
  current: string;
  previous: string;
  next: string;
}

export interface Pagination<TData> {
  page: number;
  total: number;
  tokens: Partial<CursorTokens>;
  previous: VoidFunction;
  next: VoidFunction;
  reset: VoidFunction;
}

export interface Query<TData, TError = unknown> {
  data?: TData;
  refetch: () => Promise<QueryObserverResult<TData>>;
  fetching: boolean;
  loading: boolean;
  error?: TError;
}

export namespace Query {
  export function create<TData, TError>(query: UseQueryResult<TData, TError>): Query<TData, TError> {
    return {
      data: query.data,
      fetching: query.isFetching,
      loading: query.isLoading,
      refetch: query.refetch,
      error: query.error ?? undefined,
    }
  }
}

export interface PaginatedQuery<TData> {
  pagination: Pagination<TData>;
  query: Query<TData>;
}

interface PaginationState {
  page: number;
  cursor?: Cursor;
  tokens?: Partial<CursorTokens>;
}

export interface PaginatedQueryOptions<TData> extends UseQueryOptions<TData, QueryError> {
  extendCacheKey: any[];
}

export type QueryFn<TData> = (project: Project, token?: string) => Promise<DataPage<TData>>

export function usePaginatedQuery<TData>(
  id: string,
  queryFn: QueryFn<TData>,
  options?: Partial<PaginatedQueryOptions<TData>>
): PaginatedQuery<TData> {

  const { selectedProject } = useSelectedProject();

  const [state, setState] = useState<PaginationState>({ page: 0 });

  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; }
  }, []);

  const ensureMount = (exec: VoidFunction) => {
    if (!mounted.current) return;
    exec();
  }

  const cacheKeyExtension = options?.extendCacheKey || [];
  const queryEnabled = options?.enabled ?? true;

  const cacheKey = [id, selectedProject?.projectid, state.page, ...cacheKeyExtension];

  const query = useQuery<TData, QueryError>(cacheKey, performQuery, {
    ...options,
    enabled: !!selectedProject && queryEnabled
  });

  async function performQuery() {
    try {
      const page = await queryFn(selectedProject!, state.tokens?.current);
      ensureMount(() => updateState(page));
      return page.Data;
    } catch (error: any) {
      if (error instanceof QueryError) throw error;
      throw QueryError.fromError(error);
    }
  }

  function getCursorToken(url?: string | null): string | undefined {
    if (!url) return undefined;
    const queryString = url.substring(url.indexOf("?"));
    const queryParams = new URLSearchParams(queryString);
    return queryParams.get("cursor") ?? undefined;
  }

  function updateState(page: DataPage<TData>) {
    setState(prevState => ({
      ...prevState,
      cursor: page.Cursor,
      tokens: {
        current: getCursorToken(page?.Cursor.self),
        previous: getCursorToken(page?.Cursor.prev),
        next: getCursorToken(page?.Cursor.next)
      }
    }));
  }

  function previous() {
    if (!!state.tokens?.previous) {
      setState(prevState => ({
        ...prevState,
        page: prevState.page - 1,
        tokens: {
          next: prevState.tokens?.current,
          current: prevState.tokens?.previous,
          previous: undefined,
        }
      }));
    }
  }

  function next() {
    if (!!state.tokens?.next) {
      setState(prevState => ({
        ...prevState,
        page: prevState.page + 1,
        tokens: {
          previous: prevState.tokens?.current,
          current: prevState.tokens?.next,
          next: undefined,
        }
      }));
    }
  }

  function reset() {
    setState({ page: 0 });
  }

  const total = state.cursor?.amount ?? 0;

  return {
    pagination: {
      page: state.page,
      total,
      tokens: state.tokens || {},
      previous,
      next,
      reset
    },
    query: Query.create(query)
  }
}