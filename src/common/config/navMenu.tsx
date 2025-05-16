import { NavMenuItemConfig } from "../types";
import projectsNavMenu from "../../modules/Projects/config/navMenu";
import { profilesNavmenu } from "../../modules/Profiles/config/navMenu";

export const navMenuConfig: NavMenuItemConfig[] = [...profilesNavmenu, ...projectsNavMenu];
