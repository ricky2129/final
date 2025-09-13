<<<<<<< HEAD
import { DashboardAssistUrl } from "constant";
import { get, post } from "../network/query";

type GenerateDashboardPayload = {
  prompt: string;
  preview: boolean;
  pod_name: string | null;
};

type UploadDashboardPayload = {
  prompt: string;
  dashboard: any;
  project_id: string;
  application_id: string;
};

type DashboardHistoryPayload = {
  project_id: string;
  application_id: string;
};

type GetDeploymentsPayload = {
  project_id: string;
  application_id: string;
};

const useDashboardService = () => {
  const generateDashboard = async (payload: GenerateDashboardPayload): Promise<any> => {
    return await post(DashboardAssistUrl.GENERATE_DASHBOARD, payload, "json", {});
  };

  const uploadDashboard = async (payload: UploadDashboardPayload): Promise<any> => {
    return await post(DashboardAssistUrl.UPLOAD_DASHBOARD, payload, "json", {});
  };

  const getHistory = async (payload: DashboardHistoryPayload): Promise<any[]> => {
    return await post(DashboardAssistUrl.HISTORY, payload, "json", {});
  };

  const getDeployments = async (payload: GetDeploymentsPayload): Promise<any[]> => {
    return await get(DashboardAssistUrl.DISCOVER_DEPLOYMENTS, payload, {}, null, "json");
  };

  return {
    generateDashboard,
    uploadDashboard,
    getHistory,
    getDeployments,
  };
};

export default useDashboardService;
=======
import axios from "axios";
import { CreateDashboardAssistSecretRequest, DashboardAssistSecret, ConnectDashboardAssistRequest, ConnectDashboardAssistResponse } from "react-query/dashboardAssistQueries";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create a new Dashboard Assist secret
export const createDashboardAssistSecret = async (
  data: CreateDashboardAssistSecretRequest
): Promise<DashboardAssistSecret> => {
  const response = await axios.post(`${API_BASE_URL}/integration`, {
    name: data.name,
    project_id: data.project_id,
    infrastructure_id: 5, // Dashboard Assist infrastructure ID
    secret: data.secret,
    access: data.access,
  });
  return response.data;
};

// Get Dashboard Assist secrets by project ID
export const getDashboardAssistSecretsByProjectId = async (
  infrastructureId: number,
  projectId: string
): Promise<DashboardAssistSecret[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/integration/secrets/${infrastructureId}/${projectId}`
  );
  return response.data;
};

// Connect to Dashboard Assist directly with credentials
export const connectToDashboardAssist = async (
  data: ConnectDashboardAssistRequest
): Promise<ConnectDashboardAssistResponse> => {
  const response = await axios.post(`${API_BASE_URL}/dashboard-assist/connect`, {
    grafana_url: data.grafana_url,
    grafana_pat_token: data.grafana_pat_token,
    prometheus_url: data.prometheus_url,
  });
  return response.data;
};

// Connect to Dashboard Assist using stored integration
export const connectToDashboardAssistWithIntegration = async (
  integrationId: number
): Promise<ConnectDashboardAssistResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/dashboard-assist/connect-with-integration/${integrationId}`
  );
  return response.data;
};
>>>>>>> f0ce0ac (das)
