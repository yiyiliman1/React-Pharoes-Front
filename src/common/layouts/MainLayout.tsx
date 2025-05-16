import NavMenu from '../components/NavMenu/NavMenu'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import className from 'classnames'
import { Breadcrumb } from '../components/Breadcrumb'
import { SelectedProjectProvider } from '../../modules/Projects/context/SelectedProjectContext'
import { SchemaProvider } from '../../modules/Projects/context/SchemaContext'


type Props = {
  children?: | React.ReactChild | React.ReactChild[]
  withoutNavmenu?: boolean
  contextProviders?: any[]
};

const DEFAULT_PROVIDERS = [SelectedProjectProvider, SchemaProvider]

export function MainLayout (props: Props): JSX.Element {
  const withoutNavmenu = props.withoutNavmenu || false;
  const contextProviders = (props.contextProviders) ? [...DEFAULT_PROVIDERS, ...props.contextProviders] : DEFAULT_PROVIDERS
  
  const addContextProvider = (ContextProvider: any, children: JSX.Element): JSX.Element => <ContextProvider>{children}</ContextProvider>
  const addContexts = (children: JSX.Element): JSX.Element => contextProviders.reduceRight(
    (prev: any, Curr: any) => addContextProvider(Curr, prev),
    children
  )


  return addContexts((
    <main className='regular-view'>
      { !withoutNavmenu && (
        <div className='left-column'>
          <NavMenu/>
        </div>
      )}
      <div className='header'>
        <Header withoutProjectSelect={withoutNavmenu} />
      </div>
      <div className={className('right-column', { 'without-navmenu': withoutNavmenu })}>
        <div className='content'>
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
    </main>
  ))
}
