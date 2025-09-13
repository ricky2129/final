import { TraceAssistUrl } from "constant";
<<<<<<< HEAD
import { resolveUrlParams } from "helpers";
import { get, post, delete_ } from "../network/query";
import {
  CreateDeploymentRequest,
  DeploymentResponse,
  InstrumentResponse,
  Deployment,
  AnalyzeRepoRequest,
  AnalyzeRepoResponse,
} from "../interfaces/traceAssist";

const useTraceAssistService = () => {
  const createDeployment = async (
    req: CreateDeploymentRequest
  ): Promise<DeploymentResponse> => {
    const response = await post(TraceAssistUrl.CREATE_DEPLOYMENT, req);
    return response || {};
  };

  const getDeploymentDetails = async (
    deploymentName: string
  ): Promise<DeploymentResponse> => {
    const url = resolveUrlParams(TraceAssistUrl.GET_DEPLOYMENT_DETAILS, { deployment_name: deploymentName });
    const response = await get(url);
    return response || {};
  };

  const instrumentDeployment = async (
    deploymentName: string
  ): Promise<InstrumentResponse> => {
    const url = resolveUrlParams(TraceAssistUrl.INSTRUMENT_DEPLOYMENT, { deployment_name: deploymentName });
    const response = await post(url, {});
    return response || {};
  };

=======
import { get, post } from "../network/query";
import { Deployment } from "../interfaces/traceAssist";

const useTraceAssistService = () => {
  // Fetch all deployments
>>>>>>> f0ce0ac (das)
  const getAllDeployments = async (
    project_id: string,
    application_id: string
  ): Promise<Deployment[]> => {
<<<<<<< HEAD
    const url = resolveUrlParams(
      TraceAssistUrl.GET_ALL_DEPLOYMENTS,
      {},
      { project_id, application_id }
    );
    const response = await get(url);
    return response || [];
  };

  const analyzeRepo = async (
    req: AnalyzeRepoRequest
  ): Promise<AnalyzeRepoResponse> => {
    const response = await post(TraceAssistUrl.ANALYZE_REPO, req);
    return response || {};
  };

  const deleteDeployment = async (
    deploymentName: string
  ): Promise<any> => {
    const url = resolveUrlParams(TraceAssistUrl.DELETE_DEPLOYMENT, { deployment_name: deploymentName });
    const response = await delete_(url);
    return response || {};
  };

  return {
    createDeployment,
    getDeploymentDetails,
    instrumentDeployment,
    getAllDeployments,
    analyzeRepo,
    deleteDeployment, 
=======
    const url = `${TraceAssistUrl.GET_ALL_DEPLOYMENTS}?project_id=${project_id}&application_id=${application_id}`;
    const response = await get(url);
    return response || [];
  };
  const instrumentDeployment = async (
  deployment_name: string,
  namespace: string
): Promise<any> => {
  const url = TraceAssistUrl.INSTRUMENT_DEPLOYMENT;
  const payload = {
    deployment_name,
    namespace,
  };
  const response = await post(url, payload);
  return response;
};
 const setupOtelComponents = async (): Promise<any> => {
    const url = TraceAssistUrl.SETUP_OTEL_COMPONETS
    const response = await post(url, {});
    return response;
  };
  return {
    getAllDeployments,
    instrumentDeployment,
    setupOtelComponents,
>>>>>>> f0ce0ac (das)
  };
};

export default useTraceAssistService;
