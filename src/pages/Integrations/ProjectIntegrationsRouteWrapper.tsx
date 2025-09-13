import React from "react";
import { useParams } from "react-router-dom";
import ProjectIntegrations from "./ProjectIntegrations";

const ProjectIntegrationsRouteWrapper: React.FC = () => {
  const { project } = useParams<{ project: string }>();
  const projectIdNumber = Number(project);
  if (!project || isNaN(projectIdNumber)) {
    return <div>Invalid or missing project ID</div>;
  }
  return <ProjectIntegrations projectId={projectIdNumber} />;
};
export default ProjectIntegrationsRouteWrapper;