import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEY } from "constant";

// Port 8000 - ResSuite Backend (DR Assist APIs are on main backend)
const DR_ASSIST_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const DRAssistUrl = {
  // Step 1: Store & validate cloud credentials
  SUBMIT_INVENTORY: `${DR_ASSIST_BASE_URL}/dr/dr_inventory`,

  // Step 2: Store OpenAI API key
  SUBMIT_OPENAI_KEY: `${DR_ASSIST_BASE_URL}/dr/dr_openai_key`,

  // Step 3: Connect to CSP, generate & download inventory/diagram ZIP
  START_COMPREHENSIVE_ANALYSIS: `${DR_ASSIST_BASE_URL}/dr/start-comprehensive-analysis/`,

  // Step 4: Upload files for DR score analysis
  ANALYZE_FILES: `${DR_ASSIST_BASE_URL}/dr/api/analyze-file-upload`,

  // Step 5: Download report
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
// 2. Store OpenAI API Key
// API: POST /dr/dr_openai_key
// ============================================
export interface SubmitOpenAIKeyRequest {
  name: string;
  openai_key: string;
  project_id?: number;
}

export interface SubmitOpenAIKeyResponse {
  message: string;
  id: number; // OpenAI key ID to use in analysis
}

export const useSubmitOpenAIKey = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_SUBMIT_OPENAI_KEY],
    mutationFn: async (data: SubmitOpenAIKeyRequest): Promise<SubmitOpenAIKeyResponse> => {
      console.log('[DR Assist] Submitting OpenAI key:', { name: data.name, project_id: data.project_id });

      const response = await axios.post(DRAssistUrl.SUBMIT_OPENAI_KEY, {
        name: data.name,
        openai_key: data.openai_key,
        project_id: data.project_id,
      });

      console.log('[DR Assist] OpenAI key response:', response.data);
      return response.data;
    },
    onError: (error: any) => {
      console.error('[DR Assist] Failed to submit OpenAI key:', error);
    },
  });
};

// ============================================
// 3. Connect to CSP & Generate Inventory/Diagram ZIP
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
// 4. Upload Files for DR Score Analysis
// API: POST /dr/api/analyze-file-upload
// ============================================
export interface AnalyzeFilesRequest {
  name: string;
  dr_openai_key_id: number; // OpenAI key ID from step 2
  project_id?: number;
  application_id?: number;
  aws_inventory_file?: File;
  architecture_diagram?: File;
  iac_files?: File[];
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
  dr_score: number; // Overall score (0-5)
  summary: string;
  breakdown?: DRScoreBreakdown[];
  recommendations: string[];
  data_sources?: {
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
      console.log('[DR Assist] Analyzing files with data:', {
        name: data.name,
        dr_openai_key_id: data.dr_openai_key_id,
        project_id: data.project_id,
        application_id: data.application_id,
        has_inventory: !!data.aws_inventory_file,
        has_diagram: !!data.architecture_diagram,
        iac_count: data.iac_files?.length || 0
      });

      const formData = new FormData();

      // Add required fields
      formData.append("name", data.name);
      formData.append("dr_openai_key_id", data.dr_openai_key_id.toString());

      if (data.project_id) formData.append("project_id", data.project_id.toString());
      if (data.application_id) formData.append("application_id", data.application_id.toString());

      // Add files (optional)
      if (data.aws_inventory_file) {
        formData.append("aws_inventory_file", data.aws_inventory_file);
        console.log('[DR Assist] Added inventory file:', data.aws_inventory_file.name);
      }

      if (data.architecture_diagram) {
        formData.append("architecture_diagram", data.architecture_diagram);
        console.log('[DR Assist] Added architecture diagram:', data.architecture_diagram.name);
      }

      // Add IaC files if provided
      if (data.iac_files && data.iac_files.length > 0) {
        data.iac_files.forEach((file) => {
          formData.append("iac_files", file);
          console.log('[DR Assist] Added IaC file:', file.name);
        });
      }

      console.log('[DR Assist] Sending request to:', DRAssistUrl.ANALYZE_FILES);

      // Call ResSuite Backend
      const response = await axios.post(DRAssistUrl.ANALYZE_FILES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('[DR Assist] Analysis response:', response.data);
      return response.data;
    },
    onError: (error) => {
      console.error('[DR Assist] Failed to analyze files:', error);
      console.error('[DR Assist] Error details:', error.response?.data);
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
      const url = DRAssistUrl.DOWNLOAD_REPORT(data.analysis_id);
      console.log('[DR Assist] Downloading report:', { analysis_id: data.analysis_id, format: data.format, url });

      const response = await axios.get(url, {
        params: {
          format: data.format,
        },
        responseType: "blob",
      });

      console.log('[DR Assist] Report downloaded, size:', response.data.size, 'bytes');
      return response.data;
    },
    onSuccess: (blob, variables) => {
      console.log('[DR Assist] Starting file download for user');
      // Auto-download the file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dr_analysis_${variables.analysis_id}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('[DR Assist] File download triggered');
    },
    onError: (error: any) => {
      console.error('[DR Assist] Failed to download report:', error);
      console.error('[DR Assist] Error details:', error.response?.data);
    },
  });
};
