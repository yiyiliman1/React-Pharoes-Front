import { Breadcrumbs, Tooltip, Typography } from '@mui/material'
import { compact, lowerCase, reverse, upperFirst } from 'lodash'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import useSelectedProject from '../../modules/Projects/hooks/useSelectedProject'
import { useRunsContext } from '../../modules/Runs/context/RunsContext'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

type BreadcrumbConfig = { 
  href: string, 
  label: string,
  tooltip?: string,
  abstract?: boolean
}


const FIST_BREADCRUMB = {
  label: 'All Projects',
  href: `/app`
}

const abstractRoutes = ["data"];

const formatLabel = (label: string) => upperFirst(lowerCase(label))
const hasUid = (string: string) => string?.search(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) >= 0

export const Breadcrumb = () => {
  const runsCtx = useRunsContext();
  const { selectedProject } = useSelectedProject()
  const path = window.location.pathname

  function computeBreadcrumbs(): BreadcrumbConfig[] {
    const pathArray = compact(path.split('/'))
    const reversePathArray = reverse([...pathArray])
    const newBreadcrumbs: BreadcrumbConfig[] = []

    reversePathArray.forEach((pathPortion, reverseIndex) => {
      const isLast = reverseIndex === reversePathArray.length - 1
      const isUid = hasUid(pathPortion)
      const isProject = pathPortion === 'project'
      
      if (isUid) {
        const nextPathPortion = reversePathArray[reverseIndex + 1]
        if (nextPathPortion === 'project') {
          newBreadcrumbs.push({
            label: !!selectedProject ? upperFirst(selectedProject.name) : pathPortion,
            href: `/app/project/${pathPortion}`,
            tooltip: !!selectedProject ? `Project ID: ${pathPortion}` : undefined
          })
        } else if (nextPathPortion === 'runs') {
          newBreadcrumbs.push({
            label: !!runsCtx.currentRun ? upperFirst(runsCtx.currentRun!.name!) : pathPortion,
            href: `/app/project/${selectedProject?.projectid}/${nextPathPortion}/${pathPortion}`,
            tooltip: !!runsCtx.currentRun ? `Run ID: ${pathPortion}` : undefined
          })
        } else {
          newBreadcrumbs.push({
            label: pathPortion,
            href: `/app/project/${selectedProject?.projectid}/${nextPathPortion}/${pathPortion}`
          })
        }
      } else if (isLast) {
        newBreadcrumbs.push(FIST_BREADCRUMB)
      } else if (!isProject) {
        const label = formatLabel(pathPortion)
        const realIndex = pathArray.findIndex(pathPortion2 => pathPortion2 === pathPortion)
        const href = `/${pathArray.slice(0, realIndex + 1).join('/')}`
        const abstract = abstractRoutes.includes(label);
        newBreadcrumbs.push({ label, href, abstract })
      }
    });
    return reverse(newBreadcrumbs);
  }

  const crumbs = useMemo(computeBreadcrumbs, [path, selectedProject, runsCtx.currentRun]);

  const LinksComponent = crumbs.map(({ label, href, tooltip, abstract }, index, breadcrumbs) => {
    const isLast = index === breadcrumbs.length - 1
    const haveOnlyOne = breadcrumbs.length === 1

    const crumb = (isLast && !haveOnlyOne || abstract)
      ? (<Typography key={index} color={ abstract ? "inherit" : "#4d4d4d" } className='breadcrumb-last-element'>{label}</Typography>)
      : (<Link key={index} className='under-link' color="inherit" to={href}>{label}</Link>)

    return !tooltip ? crumb : <Tooltip key={index} title={tooltip!} placement="top" arrow>{ crumb }</Tooltip>
  });

  return (
    <div className='breadcrumb'>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb" >
        {LinksComponent}
      </Breadcrumbs>
    </div>
  )
}