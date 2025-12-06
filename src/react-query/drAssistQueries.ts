import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEY } from "constant";

// Port 9100 - ResSuite Backend (manages users, projects, DB, security)
const DR_ASSIST_BASE_URL = import.meta.env.VITE_DR_ASSIST_URL || "http://localhost:9100";

// Note: Port 9200 (DR Score Backend) is called by ResSuite Backend, not directly from frontend

export const DRAssistUrl = {
  // ResSuite Backend endpoints (Port 9100)
  ANALYZE_FILES: `${DR_ASSIST_BASE_URL}/api/dr-assist/analyze`,      // ResSuite → DR Score
  DOWNLOAD_REPORT: `${DR_ASSIST_BASE_URL}/api/dr-assist/download`,   // ResSuite → DR Score
};

// ============================================
// 1. Analyze Uploaded Files
// Flow: Frontend → ResSuite Backend (9100) → DR Score Backend (9200)
// ============================================
export interface AnalyzeFilesRequest {
  // Cloud provider details
  cloud_provider: string;
  region: string;
  access_key: string;
  secret_key: string;
  openai_api_key: string;
  tags?: { key: string; value: string }[];

  // Files
  architecture_diagram: File;
  aws_inventory_file: File;
  iac_files?: File[];

  // Context
  project_id?: string;
  application_id?: string;
}

export interface DRScoreBreakdown {
  category: string;
  score: number;
  max_score: number;
  findings: string[];
  severity: "critical" | "high" | "medium" | "low";
}

export interface AnalysisResult {
  analysis_id: string;
  dr_score: number; // Overall score (0-100)
  summary: string;
  breakdown: DRScoreBreakdown[];
  recommendations: string[];
  data_sources: {
    architecture_diagram: string | null;
    aws_inventory_file: string | null;
    aws_inventory_size: number;
    iac_files_count: number;
    iac_content_size: number;
  };
  // Added by ResSuite backend
  project_id?: string;
  application_id?: string;
  created_at?: string;
}

export const useAnalyzeFiles = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_ANALYZE],
    mutationFn: async (data: AnalyzeFilesRequest): Promise<AnalysisResult> => {
      const formData = new FormData();

      // Add cloud provider details
      formData.append("cloud_provider", data.cloud_provider);
      formData.append("region", data.region);
      formData.append("access_key", data.access_key);
      formData.append("secret_key", data.secret_key);
      formData.append("openai_api_key", data.openai_api_key);

      // Add tags
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      // Add context
      if (data.project_id) {
        formData.append("project_id", data.project_id);
      }
      if (data.application_id) {
        formData.append("application_id", data.application_id);
      }

      // Add files
      formData.append("architecture_diagram", data.architecture_diagram);
      formData.append("aws_inventory_file", data.aws_inventory_file);

      // Add IaC files if provided
      if (data.iac_files && data.iac_files.length > 0) {
        data.iac_files.forEach((file) => {
          formData.append("iac_files", file);
        });
      }

      // Call ResSuite Backend (Port 9100)
      // ResSuite will forward to DR Score Backend (Port 9200)
      const response = await axios.post(DRAssistUrl.ANALYZE_FILES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onError: (error) => {
      console.error("Failed to analyze files:", error);
    },
  });
};

// ============================================
// 2. Download Report
// Flow: Frontend → ResSuite Backend (9100) → DR Score Backend (9200)
// ============================================
export interface DownloadReportRequest {
  analysis_id: string;
  format: "json" | "text" | "pdf";
}

export const useDownloadReport = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_DOWNLOAD_REPORT],
    mutationFn: async (data: DownloadReportRequest): Promise<Blob> => {
      // Call ResSuite Backend (Port 9100)
      // ResSuite will proxy to DR Score Backend (Port 9200)
      const response = await axios.post(
        DRAssistUrl.DOWNLOAD_REPORT,
        {
          analysis_id: data.analysis_id,
          format: data.format,
        },
        {
          responseType: "blob",
        }
      );
      return response.data;
    },
    onSuccess: (blob, variables) => {
      // Auto-download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dr_analysis_${variables.analysis_id}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Failed to download report:", error);
    },
  });
};
