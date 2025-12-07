import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEY } from "constant";

// Port 8000 - ResSuite Backend (DR Assist APIs are on main backend)
const DR_ASSIST_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const DRAssistUrl = {
  // Step 1: Store & validate cloud credentials
  SUBMIT_INVENTORY: `${DR_ASSIST_BASE_URL}/dr/dr_inventory`,

  // Step 2: Connect to CSP, generate & download inventory/diagram ZIP
  START_COMPREHENSIVE_ANALYSIS: `${DR_ASSIST_BASE_URL}/dr/start-comprehensive-analysis/`,

  // Step 3: Upload files for DR score analysis
  ANALYZE_FILES: `${DR_ASSIST_BASE_URL}/dr/api/analyze-file-upload`,

  // Step 4: Download report
  DOWNLOAD_REPORT: (analysisId: string) => `${DR_ASSIST_BASE_URL}/dr/api/download-report/${analysisId}`,
};

// ============================================
// 1. Store & Validate Cloud Credentials
// API: POST /dr/dr_inventory
// ============================================
export interface SubmitInventoryRequest {
  name: string;
  project_id?: string;
  application_id?: string;
  aws_access_key: string;
  aws_secret_key: string;
  region: string;
  output_name: string;
  tags?: { key: string; value: string }[];
}

export interface SubmitInventoryResponse {
  success: boolean;
  message: string;
  inventory_id?: string;
}

export const useSubmitInventory = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_SUBMIT_INVENTORY],
    mutationFn: async (data: SubmitInventoryRequest): Promise<SubmitInventoryResponse> => {
      const response = await axios.post(DRAssistUrl.SUBMIT_INVENTORY, {
        name: data.name,
        project_id: data.project_id,
        application_id: data.application_id,
        aws_access_key: data.aws_access_key,
        aws_secret_key: data.aws_secret_key,
        region: data.region,
        output_name: data.output_name,
        tags: data.tags || [], // Can be empty
      });

      return response.data;
    },
    onError: (error: any) => {
      console.error("Failed to submit inventory:", error);
      // Will show error like "Invalid credentials" or "Unauthorized" if auth fails
    },
  });
};

// ============================================
// 2. Connect to CSP & Generate Inventory/Diagram ZIP
// API: POST /dr/start-comprehensive-analysis/
// ============================================
export interface StartComprehensiveAnalysisRequest {
  inventory_id: string;
}

export const useStartComprehensiveAnalysis = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_START_ANALYSIS],
    mutationFn: async (data: StartComprehensiveAnalysisRequest): Promise<Blob> => {
      const response = await axios.post(
        DRAssistUrl.START_COMPREHENSIVE_ANALYSIS,
        {
          inventory_id: data.inventory_id,
        },
        {
          responseType: "blob",
        }
      );
      return response.data;
    },
    onSuccess: (blob) => {
      // Auto-download the ZIP file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dr_inventory_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onError: (error: any) => {
      console.error("Failed to start comprehensive analysis:", error);
    },
  });
};

// ============================================
// 3. Upload Files for DR Score Analysis
// API: POST /dr/api/analyze-file-upload
// ============================================
export interface AnalyzeFilesRequest {
  // Reference to inventory job
  inventory_id?: string;

  // Cloud provider details (if not using inventory_id)
  cloud_provider?: string;
  region?: string;
  access_key?: string;
  secret_key?: string;
  tags?: { key: string; value: string }[];

  // Files
  architecture_diagram: File;
  aws_inventory_file?: File; // Optional if using inventory_id
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

      // Add inventory reference if available
      if (data.inventory_id) {
        formData.append("inventory_id", data.inventory_id);
      }

      // Add cloud provider details
      if (data.cloud_provider) formData.append("cloud_provider", data.cloud_provider);
      if (data.region) formData.append("region", data.region);
      if (data.access_key) formData.append("access_key", data.access_key);
      if (data.secret_key) formData.append("secret_key", data.secret_key);

      // Add tags
      if (data.tags && data.tags.length > 0) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      // Add context
      if (data.project_id) formData.append("project_id", data.project_id);
      if (data.application_id) formData.append("application_id", data.application_id);

      // Add files
      formData.append("architecture_diagram", data.architecture_diagram);
      if (data.aws_inventory_file) {
        formData.append("aws_inventory_file", data.aws_inventory_file);
      }

      // Add IaC files if provided
      if (data.iac_files && data.iac_files.length > 0) {
        data.iac_files.forEach((file) => {
          formData.append("iac_files", file);
        });
      }

      // Call ResSuite Backend
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
// 3. Download Report
// Flow: Frontend → ResSuite Backend → DR Score Backend
// ============================================
export interface DownloadReportRequest {
  analysis_id: string;
  format: "json" | "text" | "pdf";
}

export const useDownloadReport = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_DOWNLOAD_REPORT],
    mutationFn: async (data: DownloadReportRequest): Promise<Blob> => {
      const response = await axios.get(
        DRAssistUrl.DOWNLOAD_REPORT(data.analysis_id),
        {
          params: {
            format: data.format,
          },
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
