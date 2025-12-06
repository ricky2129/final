import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { QUERY_KEY } from "constant";

const DR_ASSIST_BASE_URL = import.meta.env.VITE_DR_ASSIST_URL || "http://localhost:8000";

export const DRAssistUrl = {
  ANALYZE_FILES: `${DR_ASSIST_BASE_URL}/api/analyze-file-upload`,
  DOWNLOAD_REPORT: `${DR_ASSIST_BASE_URL}/api/download-report`,
};

// ============================================
// 1. Analyze Uploaded Files (Architecture + Inventory)
// ============================================
export interface AnalyzeFilesRequest {
  openai_api_key: string;
  architecture_diagram: File;
  aws_inventory_file: File;
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
}

export const useAnalyzeFiles = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_ANALYZE],
    mutationFn: async (data: AnalyzeFilesRequest): Promise<AnalysisResult> => {
      const formData = new FormData();

      // Add OpenAI API key
      formData.append("openai_api_key", data.openai_api_key);

      // Add architecture diagram
      formData.append("architecture_diagram", data.architecture_diagram);

      // Add AWS inventory file
      formData.append("aws_inventory_file", data.aws_inventory_file);

      // Add IaC files if provided
      if (data.iac_files && data.iac_files.length > 0) {
        data.iac_files.forEach((file) => {
          formData.append("iac_files", file);
        });
      }

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
// ============================================
export interface DownloadReportRequest {
  analysis_id: string;
  analysis_data: any;
  format: "json" | "text" | "pdf";
}

export const useDownloadReport = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.DR_ASSIST_DOWNLOAD_REPORT],
    mutationFn: async (data: DownloadReportRequest): Promise<Blob> => {
      const response = await axios.post(DRAssistUrl.DOWNLOAD_REPORT, data, {
        responseType: "blob",
      });
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
