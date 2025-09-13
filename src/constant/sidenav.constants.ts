import { SidenavList, SidenavType } from "interfaces";

import {
  ApplicationIcon,
  DashboardIcon,
  HomeIcon,
  InsightIcon,
  MembersIcon,
  PartitionIcon,
  PieChartIcon,
  TeamsIcon,
  WorkflowIcon,
} from "assets";

import { RouteUrl } from "./url.constant";

export const SidenavMenu = {
  HOME_PORTFOLIO: { menu: SidenavType.HOME, key: "home_portfolio" },
<<<<<<< HEAD
  HOME_INSIGHTS: { menu: SidenavType.HOME, key: "home_insights" },
=======
>>>>>>> f0ce0ac (das)
  PORTFOLIO_DASHBOARD: {
    menu: SidenavType.PORTFOLIO,
    key: "portfolio_dashboard",
  },
  PORTFOLIO_APPLICATIONS: {
    menu: SidenavType.PORTFOLIO,
    key: "portfolio_applications",
  },
  PORTFOLIO_MEMBERS: { menu: SidenavType.PORTFOLIO, key: "portfolio_members" },
  PORTFOLIO_TEAMS: { menu: SidenavType.PORTFOLIO, key: "portfolio_teams" },
<<<<<<< HEAD
  PORTFOLIO_INSIGHTS: {
    menu: SidenavType.PORTFOLIO,
    key: "portfolio_insights",
  },
=======
>>>>>>> f0ce0ac (das)
  APPLICATIONS_DASHBOARD: {
    menu: SidenavType.APPLICATIONS,
    key: "applications_dashboard",
  },
  APPLICATIONS_WORKFLOW: {
    menu: SidenavType.APPLICATIONS,
    key: "applications_workflow",
  },
<<<<<<< HEAD
  APPLICATIONS_KPI_TARGET: {
    menu: SidenavType.APPLICATIONS,
    key: "applications_kpi_target",
  },
=======
>>>>>>> f0ce0ac (das)
  APPLICATIONS_MEMBERS: {
    menu: SidenavType.APPLICATIONS,
    key: "applications_members",
  },
<<<<<<< HEAD
  APPLICATIONS_TEAMS: {
    menu: SidenavType.APPLICATIONS,
    key: "applications_teams",
  },
  APPLICATIONS_INSIGHTS: {
    menu: SidenavType.APPLICATIONS,
    key: "applications_insights",
  },
  APPLICATIONS_INTEGRATIONS: {
    menu: SidenavType.APPLICATIONS,
    key: "applications_integrations",
=======
  PORTFOLIO_INTEGRATIONS: {
    menu: SidenavType.PORTFOLIO,
    key: "Portfolio_integrations",
>>>>>>> f0ce0ac (das)
  },
};

export const HomeMenu: SidenavList = {
  title: "Home",
  menu: [
    {
      key: SidenavMenu.HOME_PORTFOLIO.key,
      label: "Portfolio",
      icon: HomeIcon,
      route: RouteUrl.HOME.DASHBOARD,
    },
<<<<<<< HEAD
    {
      key: SidenavMenu.HOME_INSIGHTS.key,
      label: "Insights",
      icon: InsightIcon,
      route: RouteUrl.HOME.INSIGHTS,
    },
=======
>>>>>>> f0ce0ac (das)
  ],
};

export const PortfolioMenu: SidenavList = {
  title: "Portfolio",
  menu: [
    {
      key: SidenavMenu.PORTFOLIO_DASHBOARD.key,
      label: "Dashboard",
      icon: DashboardIcon,
      route: RouteUrl.PROJECTS.DASHBOARD,
    },
    {
      key: SidenavMenu.PORTFOLIO_APPLICATIONS.key,
      label: "Applications",
      icon: ApplicationIcon,
      route: RouteUrl.PROJECTS.APPLICATIONS,
    },
    {
      key: SidenavMenu.PORTFOLIO_MEMBERS.key,
      label: "Members",
      icon: MembersIcon,
      route: RouteUrl.PROJECTS.MEMBERS,
    },
    {
<<<<<<< HEAD
      key: SidenavMenu.PORTFOLIO_TEAMS.key,
      label: "Teams",
      icon: TeamsIcon,
      route: RouteUrl.PROJECTS.TEAMS,
    },
    {
      key: SidenavMenu.PORTFOLIO_INSIGHTS.key,
      label: "Insights",
      icon: InsightIcon,
      route: RouteUrl.PROJECTS.INSIGHTS,
    },
=======
      key: SidenavMenu.PORTFOLIO_INTEGRATIONS.key,
      label: "Integrations",
      icon: PartitionIcon,
      route: RouteUrl.PROJECTS.INTEGRATIONS,
    },
 
>>>>>>> f0ce0ac (das)
  ],
};

export const ApplicationMenu: SidenavList = {
  title: "Application",
  menu: [
    {
      key: SidenavMenu.APPLICATIONS_DASHBOARD.key,
      label: "Dashboard",
      icon: DashboardIcon,
      route: RouteUrl.APPLICATIONS.DASHBOARD,
    },
    {
      key: SidenavMenu.APPLICATIONS_WORKFLOW.key,
      label: "Workflow",
      icon: WorkflowIcon,
      route: RouteUrl.APPLICATIONS.WORKFLOW,
    },
    {
<<<<<<< HEAD
      key: SidenavMenu.APPLICATIONS_KPI_TARGET.key,
      label: "KPI Targets",
      icon: PieChartIcon,
    },
    {
=======
>>>>>>> f0ce0ac (das)
      key: SidenavMenu.APPLICATIONS_MEMBERS.key,
      label: "Members",
      icon: MembersIcon,
    },
<<<<<<< HEAD
    {
      key: SidenavMenu.APPLICATIONS_TEAMS.key,
      label: "Teams",
      icon: TeamsIcon,
    },
    {
      key: SidenavMenu.APPLICATIONS_INSIGHTS.key,
      label: "Insights",
      icon: InsightIcon,
    },
    {
      key: SidenavMenu.APPLICATIONS_INTEGRATIONS.key,
      label: "Integrations",
      icon: PartitionIcon,
    },
=======
>>>>>>> f0ce0ac (das)
  ],
};

export const SidenavMenuMap: Record<string, SidenavList> = {
  home: HomeMenu,
  portfolio: PortfolioMenu,
  applications: ApplicationMenu,
};
