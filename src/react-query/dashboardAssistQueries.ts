import { useMutation, useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import useDashboardService from "services/dashboardassist.service";

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

export function useGenerateDashboard() {
  const { generateDashboard } = useDashboardService();

  const mutation = useMutation({
    mutationFn: (payload: GenerateDashboardPayload) => generateDashboard(payload),
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isError: mutation.isError,
    error: mutation.error,
    isLoading: mutation.isPending,
  };
}

export function useUploadDashboard() {
  const { uploadDashboard } = useDashboardService();

  const mutation = useMutation({
    mutationFn: (payload: UploadDashboardPayload) => uploadDashboard(payload),
  });

  return {
    mutateAsync: mutation.mutateAsync,
    isError: mutation.isError,
    error: mutation.error,
    isLoading: mutation.isPending,
  };
}

export function useGetDashboardHistory(payload: DashboardHistoryPayload) {
  const { getHistory } = useDashboardService();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard-history", payload],
    queryFn: () => getHistory(payload),
    enabled: !!payload.project_id && !!payload.application_id,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useGetDeployments(payload: GetDeploymentsPayload) {
  const { getDeployments } = useDashboardService();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey:["deployments", payload],
    queryFn: () => getDeployments(payload),
    enabled: !!payload.project_id && !!payload.application_id,
  });

  return {
    data, 
    isLoading,
    isError,
    error,
    refetch,
  };
}
=======
import {
  createDashboardAssistSecret,
  getDashboardAssistSecretsByProjectId,
  connectToDashboardAssist,
  connectToDashboardAssistWithIntegration,
} from "services/dashboardAssist.service";

// Types for Dashboard Assist
export interface CreateDashboardAssistSecretRequest {
  name: string;
  project_id: number;
  secret: {
    grafana_url: string;
    grafana_pat_token: string;
    prometheus_url: string;
  };
  access: "Internal" | "Specific";
}

export interface DashboardAssistSecret {
  id: number;
  name: string;
  project_id: number;
  infrastructure_id: number;
  secret_manager_key: string;
  access: "Internal" | "Specific";
  created_at: string;
  updated_at: string;
}

export interface ConnectDashboardAssistRequest {
  grafana_url: string;
  grafana_pat_token: string;
  prometheus_url: string;
}

export interface ConnectDashboardAssistResponse {
  session_id: string;
  message: string;
}

// Hook to create a new Dashboard Assist secret
export const useCreateDashboardAssistSecret = () => {
  return useMutation({
    mutationFn: (data: CreateDashboardAssistSecretRequest) =>
      createDashboardAssistSecret(data),
    onSuccess: () => {
      console.log("✅ Dashboard Assist secret created successfully");
    },
    onError: (error) => {
      console.error("❌ Failed to create Dashboard Assist secret:", error);
    },
  });
};

// Hook to list Dashboard Assist secrets for a project
export const useListDashboardAssistSecrets = (projectId: number) => {
  console.log('🔍 DASHBOARD ASSIST DEBUG: useListDashboardAssistSecrets called:', {
    projectId,
  });

  return useQuery({
    queryKey: ["dashboardAssistSecrets", projectId],
    queryFn: async () => {
      console.log('🔍 DASHBOARD ASSIST DEBUG: Executing getDashboardAssistSecretsByProjectId with:', {
        infrastructureId: 5, // Dashboard Assist infrastructure ID
        projectId: projectId.toString(),
      });

      try {
        const result = await getDashboardAssistSecretsByProjectId(5, projectId.toString());
        console.log('🔍 DASHBOARD ASSIST DEBUG: getDashboardAssistSecretsByProjectId result:', {
          success: true,
          resultCount: result?.length || 0,
          result,
        });
        return result;
      } catch (error) {
        console.error('🔍 DASHBOARD ASSIST DEBUG: getDashboardAssistSecretsByProjectId failed:', {
          error: error instanceof Error ? error.message : 'Unknown error',
          projectId,
        });
        throw error;
      }
    },
    enabled: !!projectId && projectId > 0,
  });
};

// Hook to connect to Dashboard Assist directly
export const useConnectToDashboardAssist = () => {
  return useMutation({
    mutationFn: (data: ConnectDashboardAssistRequest) =>
      connectToDashboardAssist(data),
    onSuccess: (data) => {
      console.log("✅ Connected to Dashboard Assist successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Failed to connect to Dashboard Assist:", error);
    },
  });
};

// Hook to connect to Dashboard Assist using stored integration
export const useConnectToDashboardAssistWithIntegration = () => {
  const connectToGrafanaWithIntegration = async (integrationId: number): Promise<ConnectDashboardAssistResponse> => {
    console.log('🔐 DASHBOARD ASSIST DEBUG: connectToGrafanaWithIntegration called');
    console.log('📍 Integration ID:', integrationId);

    try {
      const result = await connectToDashboardAssistWithIntegration(integrationId);
      console.log('✅ DASHBOARD ASSIST DEBUG: Connection successful:', result);
      return result;
    } catch (error) {
      console.error('❌ DASHBOARD ASSIST DEBUG: Connection failed:', error);
      throw error;
    }
  };

  return useMutation({
    mutationFn: connectToGrafanaWithIntegration,
    onSuccess: (data) => {
      console.log("✅ Connected to Dashboard Assist with integration successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Failed to connect to Dashboard Assist with integration:", error);
    },
  });
};
>>>>>>> f0ce0ac (das)
