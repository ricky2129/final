import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEY } from "constant";

// TODO: Update these URLs once backend is ready
const DR_ASSIST_BASE_URL = import.meta.env.VITE_DR_ASSIST_URL || "http://localhost:5000";

export const DRAssistUrl = {
  CONNECT_CLOUD: `${DR_ASSIST_BASE_URL}/api/cloud/connect`,
  ANALYZE_ARCHITECTURE: `${DR_ASSIST_BASE_URL}/api/architecture/analyze`,
  GET_ANALYSIS_HISTORY: `${DR_ASSIST_BASE_URL}/api/analysis/history`,
  DOWNLOAD_REPORT: `${DR_ASSIST_BASE_URL}/api/reports/download`,
};

// Interface for cloud connection
export interface CloudConnectionRequest {
  cloud_provider: "aws" | "azure" | "gcp";
  region: string;
  access_key: string;
  secret_key: string;
  tags?: { key: string; value: string }[];
}

export interface CloudConnectionResponse {
  success: boolean;
  message: string;
  connection_id: string;
}

// Interface for architecture analysis
export interface AnalyzeArchitectureRequest {
  connection_id: string;
  architecture_diagram: File;
  inventory_file: File;
  iac_file?: File;
}

export interface AnalysisResult {
  dr_score: number;
  summary: string;
  recommendations: string[];
  report_url: string;
  analysis_id: string;
}

// Hook to connect cloud provider
export const useConnectCloudProvider = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_CONNECT_CLOUD],
    mutationFn: async (data: CloudConnectionRequest): Promise<CloudConnectionResponse> => {
      // TODO: Replace with actual API call
      const response = await axios.post(DRAssistUrl.CONNECT_CLOUD, data);
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to connect cloud provider:", error);
    },
  });
};

// Hook to analyze architecture
export const useAnalyzeArchitecture = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_ANALYZE],
    mutationFn: async (data: AnalyzeArchitectureRequest): Promise<AnalysisResult> => {
      // TODO: Replace with actual API call
      const formData = new FormData();
      formData.append("connection_id", data.connection_id);
      formData.append("architecture_diagram", data.architecture_diagram);
      formData.append("inventory_file", data.inventory_file);
      if (data.iac_file) {
        formData.append("iac_file", data.iac_file);
      }

      const response = await axios.post(DRAssistUrl.ANALYZE_ARCHITECTURE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to analyze architecture:", error);
    },
  });
};

// Hook to get analysis history
export const useGetAnalysisHistory = (applicationId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.DR_ASSIST_HISTORY, applicationId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      const response = await axios.get(
        `${DRAssistUrl.GET_ANALYSIS_HISTORY}/${applicationId}`
      );
      return response.data;
    },
    enabled: !!applicationId,
  });
};

// Hook to download report
export const useDownloadReport = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_DOWNLOAD_REPORT],
    mutationFn: async (analysisId: string): Promise<Blob> => {
      // TODO: Replace with actual API call
      const response = await axios.get(`${DRAssistUrl.DOWNLOAD_REPORT}/${analysisId}`, {
        responseType: "blob",
      });
      return response.data;
    },
    onError: (error) => {
      console.error("Failed to download report:", error);
    },
  });
};
