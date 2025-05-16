import { Rule } from 'async-validator';
import React, { ChangeEventHandler } from 'react';

export interface ApiError {
  message: string;
}

export interface NavMeta {
  divider: boolean;
  redirect: string;
}

export interface NavMenuItemConfig {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: NavMenuItemConfig[];
  meta?: Partial<NavMeta>;
}

export interface CreateInputConfig {
  type?: string
  defaultValue?: string
  rows?: number
  onChange?: ChangeEventHandler
  size?: 'small' | 'medium' | undefined
  required?: boolean
  disabled?: boolean
  validator?: Rule
}

export interface UseFormFactory {
  createInput: (name: string, config?: CreateInputConfig) => JSX.Element
}

export interface UseParserPath {
  parsePathWithCurrentProject: (path: string) => string
}

export interface DialogRef {
  show: () => void
  hide: () => void
}

export interface Cursor {
  amount: number;
  self: string;
  next: string | null;
  prev: string | null;
  has_next: boolean;
  has_prev: boolean;
}
