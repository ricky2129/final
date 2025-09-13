import React, { useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
<<<<<<< HEAD

import { Flex, Space } from "antd";
import { RouteUrl } from "constant";
import { resolveUrlParams } from "helpers";

import { Button } from "components";

import { Metrics } from "themes";

=======
import { Flex, Space } from "antd";
import { RouteUrl } from "constant";
import { resolveUrlParams } from "helpers";
import { Button } from "components";
import { Metrics } from "themes";
>>>>>>> f0ce0ac (das)
import "./chaosExperiments.styles.scss";

interface Route {
  path: string;
  name: string;
}

const Routes: Route[] = [
  { path: RouteUrl.APPLICATIONS.AGENTS, name: "Agents" },
  { path: RouteUrl.APPLICATIONS.EXPERIMENT, name: "Experiments" },
  // { path: RouteUrl.APPLICATIONS.HEALTH_CHECKS, name: "Health Checks" },
];
<<<<<<< HEAD
=======

>>>>>>> f0ce0ac (das)
const ChaosExperiments: React.FC = () => {
  const { project, application } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

<<<<<<< HEAD
  useEffect(() => {
    if (
      location.pathname ===
      resolveUrlParams(RouteUrl.APPLICATIONS.CHAOS_EXPERIMENT, {
        project,
        application,
      })
    ) {
=======
  // Redirect to Agents if at the base chaos experiment route
  useEffect(() => {
    const basePath = resolveUrlParams(RouteUrl.APPLICATIONS.CHAOS_EXPERIMENT, {
      project,
      application,
    });
    if (location.pathname === basePath) {
>>>>>>> f0ce0ac (das)
      navigate(
        resolveUrlParams(RouteUrl.APPLICATIONS.AGENTS, {
          project,
          application,
        }),
<<<<<<< HEAD
      );
    }
  }, [location, application, project, navigate]);

  const checkcurrentRoute = (path: string): boolean => {
    return (
      resolveUrlParams(path, {
        project,
        application,
      }) === window.location.pathname
    );
  };

=======
        { replace: true }
      );
    }
  }, [location.pathname, project, application, navigate]);

  // Helper to check if the current route matches the button's route
  const isCurrentRoute = (path: string): boolean => {
    return (
      resolveUrlParams(path, { project, application }) === location.pathname
    );
  };

  // Render only the Outlet for the Agent Installation Guide route
>>>>>>> f0ce0ac (das)
  if (
    location.pathname ===
    resolveUrlParams(RouteUrl.APPLICATIONS.AGENT_INSTALATION_GUIDE, {
      project,
      application,
    })
  ) {
    return <Outlet />;
  }

  return (
    <Flex vertical className="chaos-experiments-container">
      <Flex align="center" justify="center" wrap gap={Metrics.SPACE_MD}>
        <Space.Compact>
<<<<<<< HEAD
          {Routes.map((route, index) => (
            <Link
              key={index}
              to={resolveUrlParams(route.path, {
                project,
                application,
              })}
            >
              <Button
                key={index}
                title={route.name}
                size="middle"
                type="default"
                customClass={`${checkcurrentRoute(route?.path) ? "chaos-active-link" : "chaos-link"} semibold`}
=======
          {Routes.map((route) => (
            <Link
              key={route.path}
              to={resolveUrlParams(route.path, { project, application })}
            >
              <Button
                title={route.name}
                size="middle"
                type="default"
                customClass={`${
                  isCurrentRoute(route.path)
                    ? "chaos-active-link"
                    : "chaos-link"
                } semibold`}
                // Disabled for Health Checks (if enabled in the future)
>>>>>>> f0ce0ac (das)
                disabled={route.path === RouteUrl.APPLICATIONS.HEALTH_CHECKS}
              />
            </Link>
          ))}
        </Space.Compact>
      </Flex>
<<<<<<< HEAD
=======
      {/* This Outlet will render the selected route's component (either Agents or Experiments) */}
>>>>>>> f0ce0ac (das)
      <Outlet />
    </Flex>
  );
};

export default ChaosExperiments;
