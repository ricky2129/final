import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAddServiceToApplication,
  useGetApplicationDetails,
  useGetServiceList,
} from "react-query";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Col, Flex, Row } from "antd";
import classNames from "classnames";
import { RouteUrl } from "constant";
import { resolveUrlParams } from "helpers";
import { AppServiceMap, AppServiceType } from "interfaces";
import {
  AddIcon,
  CodescanIcon,
  DiagnosticsIcon,
  ExperimentIcon,
  ToilAssistIcon,
  TraceAssistIcon,
  DashboardAssistIcon,
  DriftAssistIcon,
  SLOSLIIcon,
} from "assets";
import { ConfigureGremlin, IconViewer, Loading, Text } from "components";
import { useAppNavigation } from "context";
import { Colors, Metrics } from "themes";
import "./applicationWorkflow.styles.scss";
<<<<<<< HEAD
 
import { DriftAssistProvider } from "context";
import { DriftAssist } from "pages/DriftAssist";
import { TraceAssist } from "pages/TraceAssist";
import { ToilAssist } from "pages/ToilAssist";
import { DashboardAssist } from "pages/DashboardAssist";
import { ApplicationCodescan } from "pages/ApplicationCodescan"; 
import { ApplicationDiagnostics } from "pages/ApplicationDiagnostics";         
import { SloSliRouteWrapper } from "pages/SLO-SLI"; 
import { ChaosExperiments } from "pages/ChaosExperiments"; 
=======
>>>>>>> f0ce0ac (das)

const serviceMap: Record<string, string> = {
  resiliency_index: "Infrastructure",
  code_hygiene_standards: "Repositories",
  pipelines: "Pipelines",
  experiments: "Experiments",
  "health-checks": "Health Checks",
  agents: "Agents",
  "toil-assist": "ToilAssist",
  "dashboard-assist": "DashboardAssist",
  "trace-assist": "TraceAssist",
  "slo-sli": "SloSli",
  "drift-assist": "DriftAssist",
};
<<<<<<< HEAD
 
=======

>>>>>>> f0ce0ac (das)
const serviceMenuMap = {
  TraceAssist: {
    name: "Trace Assist",
    desc: "Auto Instrumentation",
    icon: TraceAssistIcon,
    route: RouteUrl.APPLICATIONS.TRACE_ASSIST,
  },
  DashboardAssist: {
    name: "Dashboard Assist",
    desc: "Custom Dashboard",
    icon: DashboardAssistIcon,
    route: RouteUrl.APPLICATIONS.DASHBOARD_ASSIST,
  },
  ToilAssist: {
    name: "Toil Assist",
    desc: "For SelfHealing",
    icon: ToilAssistIcon,
    route: RouteUrl.APPLICATIONS.TOIL_ASSIST,
  },
  Infrastructure: {
    name: "Resiliency Index",
    desc: "Continuous Resiliency",
    icon: DiagnosticsIcon,
    route: RouteUrl.APPLICATIONS.RESILIENCY_INDEX,
  },
  Repositories: {
    name: "Code Hygiene",
    desc: "Code level Resiliency posture",
    icon: CodescanIcon,
    route: RouteUrl.APPLICATIONS.CODE_HYGIENCE_STANDARDS,
  },
  Experiments: {
    name: "Chaos Experiments",
    desc: "Validate Resiliency",
    icon: ExperimentIcon,
    route: RouteUrl.APPLICATIONS.CHAOS_EXPERIMENT,
  },
  SloSli: {
    name: "SLO/SLI",
    desc: "Service Level Objectives and Indicators",
    icon: SLOSLIIcon,
    route: RouteUrl.APPLICATIONS.SLO_SLI,
  },
  DriftAssist: {
    name: "Drift Assist",
    desc: "Detecting and Analyzing infrastructure drift",
    icon: DriftAssistIcon,
<<<<<<< HEAD
    route: RouteUrl.APPLICATIONS.DRIFT_ASSIST,
  },
};
 const servicePriorityMap: Record<string, number> = {
=======
    route: RouteUrl.APPLICATIONS.DRIFT_ASSIST
  },
};

const servicePriorityMap: Record<string, number> = {
>>>>>>> f0ce0ac (das)
  1: 1,
  3: 2,
  2: 3,
};
<<<<<<< HEAD
const ApplicationWorkflow: React.FC = () => {
  const location = useLocation();
  const [activeTool, setActiveTool] = useState(""); // Controls which tool is shown
  const { refetchApplicationDetails } = useAppNavigation();
  const [showAddService, setShowAddService] = useState(false);

  const [isOpenConfigureGremlin, setIsOpenConfigureGremlin] = useState(false);
 
  const navigate = useNavigate();
  const params = useParams();
 
  // Always call hooks consistently - pass undefined if no application ID
  const applicationData = useGetApplicationDetails(params?.application || undefined);
  const addServiceToApplicationQuery = useAddServiceToApplication();
  const serviceList = useGetServiceList();
 
  const navmenu = useMemo(() => {
    return applicationData?.data?.services?.map((s) => s.service) || [];
  }, [applicationData]);
 
  // Detect if navigation state includes DriftAssist session
  const driftAssistState = location.state?.sessionId ? location.state : null;
 
  // When user arrives from Drift Assist session, auto-activate DriftAssist tab
  useEffect(() => {
    if (driftAssistState?.sessionId) {
      setActiveTool("DriftAssist");
    }
  }, [driftAssistState]);
 
  // Set initial tool based on URL
  useEffect(() => {
    if (activeTool === "") {
      const service = location.pathname.split("/")?.pop()?.split("?")?.[0];
      setActiveTool(serviceMap[service] || "");
    }
  }, [location.pathname, activeTool, navmenu]);
 
  if (applicationData?.isLoading) return <Loading type="spinner" />;
 
  if (
    location.pathname ===
    resolveUrlParams(RouteUrl.APPLICATIONS.AGENT_INSTALATION_GUIDE, {
      project: params.project,
      application: params.application,
    })
  ) {
    return <Outlet />;
  }
 
  // Helper to add service to application if not present
=======

const ApplicationWorkflow: React.FC = () => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("");
  const { refetchApplicationDetails } = useAppNavigation();
  const [showAddService, setShowAddService] = useState(false);
  const [isOpenConfigureGremlin, setIsOpenConfigureGremlin] = useState<boolean>(false);

  const navigate = useNavigate();
  const params = useParams();

  const applicationData = useGetApplicationDetails(params?.application);
  const addServiceToApplicationQuery = useAddServiceToApplication();
  const serviceList = useGetServiceList();

  const navmenu = useMemo(() => {
    return applicationData?.data?.services?.map((s) => s.service) || [];
  }, [applicationData]);

>>>>>>> f0ce0ac (das)
  const getServiceId = useCallback(
    async (service: AppServiceType) => {
      const application = applicationData.data;
      const existingService = application?.services?.find(
        (s) => s.service == service,
      );
      if (application && existingService) {
        return existingService.id;
      }
      const res = await addServiceToApplicationQuery.mutateAsync({
        application_id: application.id,
        service_id: AppServiceMap[service],
      });
      await applicationData.refetch();
      return res.app_service_id;
    },
    [addServiceToApplicationQuery, applicationData],
  );
<<<<<<< HEAD
 
  // Navigation handler for sidebar menu
  const onNavigate = useCallback(
    async (toolName) => {
      setActiveTool(toolName);
 
      // If tool requires service to be added
      if (!navmenu.includes(toolName)) {
        if (toolName === "Experiments") {
          setIsOpenConfigureGremlin(true);
          return;
        }
        await getServiceId(toolName);
      }
 
      // Optionally update route for deep linking
      if (serviceMenuMap[toolName]?.route) {
        navigate(
          resolveUrlParams(serviceMenuMap[toolName].route, {
            project: params.project,
            application: params.application,
          }),
        );
      }
    },
    [navmenu, getServiceId, navigate, params.project, params.application],
  );
 
  return (
    <DriftAssistProvider>
      <Row className="application-workflow-container">
        <Col sm={24} md={7} className="application-workflow-nav">
          <Flex
            align="center"
            justify="center"
            vertical
            className="nav-menu-container"
          >
            {/* Render all tool menu items */}
            {Object.keys(serviceMenuMap).map((toolName, idx) => {
              const isAdded = navmenu.includes(toolName);
              return (
                <Flex
                  key={toolName}
                  vertical
                  align="center"
                  className={classNames("nav-item-container", {
                    active: activeTool === toolName,
                  })}
                  style={{
                    opacity: isAdded ? "1" : "0.6",
=======

  const onNavigate = useCallback(
    (key: string) => {
      if (key && key !== activeKey) {
        setActiveKey(
          key === "Agents" || key === "Health Checks" ? "Experiments" : key,
        );
        if (key === "DriftAssist") {
          navigate("drift-assist");
          return;
        }
        if (
          key === "TraceAssist" ||
          key === "ToilAssist" ||
          key === "DashboardAssist"
        ) {
          navigate(
            resolveUrlParams(serviceMenuMap[key].route, {
              project: params.project,
              application: params.application,
            }),
          );
          return;
        } else if (key === "SloSli") {
          navigate(
            resolveUrlParams(serviceMenuMap[key].route, {
              project: params.project,
              application: params.application,
            }),
          );
          return;
        }
        navigate(
          resolveUrlParams(
            key === "Agents"
              ? RouteUrl.APPLICATIONS.AGENTS
              : key === "Health Checks"
              ? RouteUrl.APPLICATIONS.HEALTH_CHECKS
              : serviceMenuMap[key].route,
            {
              project: params.project,
              application: params.application,
            },
          ),
        );
      }
    },
    [activeKey, params.project, params.application, navigate],
  );

  useEffect(() => {
    if (activeKey === "") {
      const service = location.pathname.split("/")?.pop()?.split("?")?.[0];
      onNavigate(
        service === "workflow" ? "TraceAssist" : serviceMap[service] || "",
      );
    }
  }, [location.pathname, activeKey, navmenu, onNavigate]);

  if (applicationData?.isLoading) return <Loading type="spinner" />;

  if (
    location.pathname ===
    resolveUrlParams(RouteUrl.APPLICATIONS.AGENT_INSTALATION_GUIDE, {
      project: params.project,
      application: params.application,
    })
  ) {
    return <Outlet />;
  }

  return (
    <Row className="application-workflow-container">
      <Col sm={24} md={7} className="application-workflow-nav">
        <Flex
          align="center"
          justify="center"
          vertical
          className="nav-menu-container"
        >
          {/* === CATEGORY 1: TraceAssist, DashboardAssist, SloSli === */}
          <div className="service-category">
            {["TraceAssist", "DashboardAssist", "SloSli"].map((serviceName, index) => {
              const isAdded = navmenu.includes(serviceName);
              return (
                <Flex
                  key={serviceName}
                  vertical
                  align="center"
                  className={classNames("nav-item-container", {
                    active: activeKey === serviceName,
                  })}
                  style={{
                    opacity: "1",
>>>>>>> f0ce0ac (das)
                    cursor: "pointer",
                  }}
                >
                  <Flex
                    align="center"
                    justify="center"
<<<<<<< HEAD
                    onClick={() => onNavigate(toolName)}
                    className={classNames("nav-item", {
                      active: activeTool === toolName,
                    })}
=======
                    onClick={async () => {
                      if (
                        serviceName === "TraceAssist" ||
                        serviceName === "DashboardAssist"
                      ) {
                        onNavigate(serviceName);
                        setActiveKey(serviceName);
                        return;
                      }
                      if (serviceName === "SloSli") {
                        onNavigate(serviceName);
                        setActiveKey(serviceName);
                        return;
                      }
                      if (!isAdded) {
                        if (serviceName === "Experiments") {
                          setIsOpenConfigureGremlin(true);
                          return;
                        }
                        await getServiceId(serviceName as AppServiceType);
                      }
                      onNavigate(serviceName);
                      setActiveKey(serviceName);
                    }}
                    className={classNames("nav-item", {
                      active: activeKey === serviceName,
                    })}
                    onMouseEnter={() => setShowAddService(true)}
                    onMouseLeave={() => setShowAddService(false)}
>>>>>>> f0ce0ac (das)
                  >
                    <Flex
                      align="center"
                      gap={Metrics.SPACE_SM}
                      className="nav-item-content"
                    >
                      <Flex className="nav-item-icon">
                        <IconViewer
<<<<<<< HEAD
                          Icon={serviceMenuMap[toolName]?.icon}
=======
                          Icon={serviceMenuMap[serviceName]?.icon}
>>>>>>> f0ce0ac (das)
                          size={Metrics.SPACE_XL}
                        />
                      </Flex>
                      <Flex vertical>
                        <Text
<<<<<<< HEAD
                          text={serviceMenuMap[toolName].name}
=======
                          text={serviceMenuMap[serviceName].name}
>>>>>>> f0ce0ac (das)
                          type="cardtitle"
                          weight="semibold"
                        />
                        <Text
<<<<<<< HEAD
                          text={serviceMenuMap[toolName].desc}
=======
                          text={serviceMenuMap[serviceName].desc}
>>>>>>> f0ce0ac (das)
                          type="footnote"
                        />
                      </Flex>
                    </Flex>
                  </Flex>
<<<<<<< HEAD
                  {idx !== Object.keys(serviceMenuMap).length - 1 && (
=======
                  {index !== 2 && (
>>>>>>> f0ce0ac (das)
                    <Flex className="connector"> </Flex>
                  )}
                </Flex>
              );
            })}
<<<<<<< HEAD
          </Flex>
          <ConfigureGremlin
            isOpen={isOpenConfigureGremlin}
            onSuccess={async () => {
              await refetchApplicationDetails();
              setIsOpenConfigureGremlin(false);
              await refetchApplicationDetails();
              navigate(
                resolveUrlParams(RouteUrl.APPLICATIONS.EXPERIMENT, {
                  project: params.project,
                  application: params?.applicationData,
                }),
              );
            }}
            onClose={() => setIsOpenConfigureGremlin(false)}
            applicationId={params?.application}
          />
        </Col>
        <Col sm={24} md={17} className="application-workflow-content">
          {/* Only the selected tool is rendered! */}
          {activeTool === "DriftAssist" && (
            <DriftAssist
              onClose={() => setActiveTool("")}
              onNavigateToWorkflow={() => setActiveTool("DriftAssist")}
              initialSessionId={driftAssistState?.sessionId}
              initialAwsCredentials={driftAssistState?.awsCredentials}
            />
          )}
          {activeTool === "TraceAssist" && <TraceAssist />}
          {activeTool === "ToilAssist" && <ToilAssist />}
          {activeTool === "DashboardAssist" && <DashboardAssist />}
          {activeTool === "SloSli" && <SloSliRouteWrapper />}
          {activeTool === "Infrastructure" && <ApplicationDiagnostics />}
          {activeTool === "Repositories" && <ApplicationCodescan />}
          {activeTool === "Experiments" && <ChaosExperiments />}

          {/* Add other tools as needed, following the same pattern */}
          {/* Fallback: show Outlet if no tool is selected */}
          {activeTool === "" && <Outlet />}
        </Col>
      </Row>
    </DriftAssistProvider>
  );
};
 
=======
          </div>

          {/* === CATEGORY 2: ToilAssist === */}
          <div className="service-category">
            {["ToilAssist"].map((serviceName) => {
              const isAdded = navmenu.includes(serviceName);
              return (
                <Flex
                  key={serviceName}
                  vertical
                  align="center"
                  className={classNames("nav-item-container", {
                    active: activeKey === serviceName,
                  })}
                  style={{
                    opacity: "1",
                    cursor: "pointer",
                  }}
                >
                  <Flex
                    align="center"
                    justify="center"
                    onClick={async () => {
                      onNavigate(serviceName);
                      setActiveKey(serviceName);
                    }}
                    className={classNames("nav-item", {
                      active: activeKey === serviceName,
                    })}
                    onMouseEnter={() => setShowAddService(true)}
                    onMouseLeave={() => setShowAddService(false)}
                  >
                    <Flex
                      align="center"
                      gap={Metrics.SPACE_SM}
                      className="nav-item-content"
                    >
                      <Flex className="nav-item-icon">
                        <IconViewer
                          Icon={serviceMenuMap[serviceName]?.icon}
                          size={Metrics.SPACE_XL}
                        />
                      </Flex>
                      <Flex vertical>
                        <Text
                          text={serviceMenuMap[serviceName].name}
                          type="cardtitle"
                          weight="semibold"
                        />
                        <Text
                          text={serviceMenuMap[serviceName].desc}
                          type="footnote"
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </div>

          {/* === CATEGORY 3: Infrastructure, Repositories, Experiments, DriftAssist === */}
          <div className="service-category">
            {["Infrastructure", "Repositories", "Experiments", "DriftAssist"].map((serviceName, index) => {
              const isAdded = navmenu.includes(serviceName);
              return (
                <Flex
                  key={serviceName}
                  vertical
                  align="center"
                  className={classNames("nav-item-container", {
                    active: activeKey === serviceName,
                  })}
                  style={{
                    opacity: "1",
                    cursor: "pointer",
                  }}
                >
                    <Flex
                      align="center"
                      justify="center"
                      onClick={async () => {
                        if (serviceName === "DriftAssist") {
                          onNavigate(serviceName);
                          setActiveKey(serviceName);
                          return;
                        }
                        if (!isAdded) {
                          if (serviceName === "Experiments") {
                            setIsOpenConfigureGremlin(true);
                            return;
                          }
                          await getServiceId(serviceName as AppServiceType);
                        }
                        onNavigate(serviceName);
                        setActiveKey(serviceName);
                      }}
                      className={classNames("nav-item", {
                        active: activeKey === serviceName,
                      })}
                      onMouseEnter={() => setShowAddService(true)}
                      onMouseLeave={() => setShowAddService(false)}
                    >
                      <Flex
                        align="center"
                        gap={Metrics.SPACE_SM}
                        className="nav-item-content"
                      >
                        <Flex className="nav-item-icon">
                          <IconViewer
                            Icon={serviceMenuMap[serviceName]?.icon}
                            size={Metrics.SPACE_XL}
                          />
                        </Flex>
                        <Flex vertical>
                          <Text
                            text={serviceMenuMap[serviceName].name}
                            type="cardtitle"
                            weight="semibold"
                          />
                          <Text
                            text={serviceMenuMap[serviceName].desc}
                            type="footnote"
                          />
                        </Flex>
                      </Flex>
                    </Flex>
                    {index !== 3 && (
                      <Flex className="connector"> </Flex>
                    )}
                  </Flex>
                );
              })}
          </div>
        </Flex>

        <ConfigureGremlin
          isOpen={isOpenConfigureGremlin}
          onSuccess={async () => {
            await refetchApplicationDetails();
            setIsOpenConfigureGremlin(false);
            await refetchApplicationDetails();
            navigate(
              resolveUrlParams(RouteUrl.APPLICATIONS.EXPERIMENT, {
                project: params.project,
                application: params?.applicationData,
              }),
            );
          }}
          onClose={() => setIsOpenConfigureGremlin(false)}
          applicationId={params?.application}
        />
      </Col>

      <Col sm={24} md={17} className="application-workflow-content">
        <Outlet />
      </Col>
    </Row>
  );
};

>>>>>>> f0ce0ac (das)
export default ApplicationWorkflow;
