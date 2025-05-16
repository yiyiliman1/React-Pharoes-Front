import "./NavMenu.scss";

import List from "@mui/material/List";
import NavMenuHeader from "./NavMenuHeader";
import NavMenuItem from "./NavMenuItem";
import NavMenuItemWithChildren from "./NavMenuItemWithChildren";
import { Storage as StorageIcon, ForkRight, Terminal } from "@mui/icons-material";
import { keys } from "lodash";
import { navMenuConfig } from "../../config/navMenu";
import useSchema from "../../../modules/Projects/hooks/useSchema";
import useSelectedProject from "../../../modules/Projects/hooks/useSelectedProject";
import { useRuns } from "../../../modules/Runs/hooks/useRuns";

const DATA_GOING_OUT = [
  { name: "Variant", icon: <ForkRight sx={{ color: "#c3c3c3" }} /> },
  { name: "Execution", icon: <Terminal sx={{ color: "#c3c3c3" }} /> },
];

export default function NavMenu() {
  const { schema } = useSchema();
  const { selectedProject } = useSelectedProject();
  const { runsNavMenu } = useRuns();

  const dataConfig = [
    {
      label: "Data",
      icon: <StorageIcon sx={{ color: "#c3c3c3" }} />,
      children: keys(schema)
        .filter((key) => !DATA_GOING_OUT.find((item) => item.name === key))
        .map((key: string) => ({
          label: key,
          path: `/app/project/${selectedProject?.projectid}/data/${key}`,
          children: [],
        })),
    },
    ...DATA_GOING_OUT.map((key: any) => ({
      label: key.name,
      icon: key.icon,
      path: `/app/project/${selectedProject?.projectid}/data/${key.name}`,
      children: [],
    })),
  ];

  const elementsComponents = [...dataConfig, ...navMenuConfig, ...runsNavMenu].map((item, index) => {
    const haveChildren = item.children && item.children.length > 0;
    if (haveChildren) return <NavMenuItemWithChildren key={index} item={item} />;
    else return <NavMenuItem key={index} item={item} />;
  });

  return (
    <div className="nav-menu-wrap">
      <NavMenuHeader />
      <List component="nav" aria-labelledby="nested-list-subheader" className="nav-menu">
        {elementsComponents}
      </List>
    </div>
  );
}
