import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Typography,
  Upload,
  message,
  Divider,
  Alert,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useAnalyzeFiles, useDownloadReport, useStartComprehensiveAnalysis, type AnalysisResult } from "react-query/drAssistQueries";

const { Title, Text, Paragraph } = Typography;

interface ArchitectureAnalysisFormProps {
  connectionDetails: any;
  onBack: () => void;
}

export const ArchitectureAnalysisForm: React.FC<ArchitectureAnalysisFormProps> = ({
  connectionDetails,
  onBack,
}) => {
  const [architectureDiagram, setArchitectureDiagram] = useState<UploadFile[]>([]);
  const [inventoryFile, setInventoryFile] = useState<UploadFile[]>([]);
  const [iacFile, setIacFile] = useState<UploadFile[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hasDownloadedZip, setHasDownloadedZip] = useState(false);

  const analyzeFilesMutation = useAnalyzeFiles();
  const downloadReportMutation = useDownloadReport();
  const startAnalysisMutation = useStartComprehensiveAnalysis();

  const handleDownloadZip = async () => {
    if (!connectionDetails?.inventory_id) {
      message.error("Inventory ID is missing. Please go back and connect again.");
      return;
    }

    try {
      await startAnalysisMutation.mutateAsync({
        inventory_id: connectionDetails.inventory_id,
      });
      message.success("ZIP file downloaded! Please extract and upload the files below.");
      setHasDownloadedZip(true);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail ||
                          error?.response?.data?.message ||
                          "Failed to download ZIP file";
      message.error(errorMessage);
    }
  };

  const handleUpload = async () => {
    if (!architectureDiagram.length || !inventoryFile.length) {
      message.error("Please upload required files (Architecture Diagram and Inventory File)");
      return;
    }

    try {
      const result = await analyzeFilesMutation.mutateAsync({
        // Files
        architecture_diagram: architectureDiagram[0].originFileObj as File,
        aws_inventory_file: inventoryFile[0].originFileObj as File,
        iac_files: iacFile.length > 0 ? iacFile.map(f => f.originFileObj as File) : undefined,
      });

      setAnalysisResult(result);
      message.success("Analysis completed successfully!");
    } catch (error: any) {
      message.error(error?.response?.data?.detail || "Failed to analyze architecture");
      console.error(error);
    }
  };

  const handleDownloadReport = async (format: "json" | "text" | "pdf") => {
    if (!analysisResult) return;

    try {
      await downloadReportMutation.mutateAsync({
        analysis_id: analysisResult.analysis_id,
        format,
      });
      message.success(`Downloading ${format.toUpperCase()} report...`);
    } catch (error: any) {
      message.error(error?.response?.data?.detail || "Failed to download report");
    }
  };

  const beforeUpload = (file: File) => {
    const isValidSize = file.size / 1024 / 1024 < 50; // 50MB
    if (!isValidSize) {
      message.error("File must be smaller than 50MB!");
    }
    return false; // Prevent automatic upload
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ff4d4f";
      case "high":
        return "#ff7a45";
      case "medium":
        return "#ffa940";
      case "low":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  return (
    <div className="architecture-analysis-container">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        style={{ marginBottom: 16 }}
      >
        Back to Connection
      </Button>

      {!analysisResult ? (
        <Card>
          <Title level={4}>Upload & Analyze Architecture</Title>
          <Paragraph type="secondary">
            First, download the ZIP file containing your architecture diagram and inventory file.
            Then upload them below to get your DR score.
          </Paragraph>

          {/* Step 1: Download ZIP */}
          <Alert
            message="Step 1: Download Inventory & Diagram"
            description="Click below to download a ZIP file containing your architecture diagram and AWS inventory file."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            loading={startAnalysisMutation.isPending}
            onClick={handleDownloadZip}
            block
            style={{ marginBottom: 24 }}
          >
            Download ZIP File
          </Button>

          {hasDownloadedZip && (
            <Alert
              message="Step 2: Upload Files for Analysis"
              description="Extract the downloaded ZIP file and upload the architecture diagram and inventory file below."
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Architecture Diagram */}
            <div>
              <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
                <FileTextOutlined style={{ fontSize: 18, color: "#1890ff" }} />
                <Text strong>
                  Architecture Diagram <span style={{ color: "red" }}>*</span>
                </Text>
              </Flex>
              <Upload
                fileList={architectureDiagram}
                onChange={({ fileList }) => setArchitectureDiagram(fileList)}
                beforeUpload={beforeUpload}
                maxCount={1}
                accept=".pdf,.png,.jpg,.jpeg,.svg"
              >
                <Button icon={<UploadOutlined />} block>
                  Choose a file...
                </Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Supported formats: PDF, PNG, JPG, SVG (Max 50MB)
              </Text>
            </div>

            {/* AWS Inventory File */}
            <div>
              <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
                <CloudUploadOutlined style={{ fontSize: 18, color: "#1890ff" }} />
                <Text strong>
                  AWS Inventory File <span style={{ color: "red" }}>*</span>
                </Text>
              </Flex>
              <Upload
                fileList={inventoryFile}
                onChange={({ fileList }) => setInventoryFile(fileList)}
                beforeUpload={beforeUpload}
                maxCount={1}
                accept=".json,.txt"
              >
                <Button icon={<UploadOutlined />} block>
                  Choose a file...
                </Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Supported formats: JSON, TXT (Max 50MB)
              </Text>
            </div>

            {/* IaC File (Optional) */}
            <div>
              <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
                <CodeOutlined style={{ fontSize: 18, color: "#1890ff" }} />
                <Text strong>IaC Files (Optional)</Text>
              </Flex>
              <Upload
                fileList={iacFile}
                onChange={({ fileList }) => setIacFile(fileList)}
                beforeUpload={beforeUpload}
                multiple
                accept=".tf,.yaml,.yml,.json"
              >
                <Button icon={<UploadOutlined />} block>
                  Choose file(s)...
                </Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Supported formats: Terraform (.tf), CloudFormation (.yaml, .json) (Max 50MB each)
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={analyzeFilesMutation.isPending}
              onClick={handleUpload}
              disabled={!architectureDiagram.length || !inventoryFile.length}
            >
              Analyze and Generate Score
            </Button>
          </Space>
        </Card>
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* DR Compliance Score */}
          <Card>
            <Title level={4}>DR Compliance Score</Title>
            <Flex justify="center" align="center" vertical style={{ padding: "24px 0" }}>
              <div style={{ fontSize: 72, fontWeight: "bold", color: analysisResult.dr_score >= 4 ? "#52c41a" : analysisResult.dr_score >= 3 ? "#ffa940" : "#ff4d4f" }}>
                {analysisResult.dr_score} / 5
              </div>
              <Text type="secondary" style={{ fontSize: 16, marginTop: 16 }}>
                {analysisResult.dr_score >= 4 ? "Excellent" : analysisResult.dr_score >= 3 ? "Good" : analysisResult.dr_score >= 2 ? "Fair" : "Poor"}
              </Text>
            </Flex>
            <Text type="secondary" style={{ display: "block", textAlign: "center", marginTop: 16 }}>
              Analysis ID: {analysisResult.analysis_id}
            </Text>
          </Card>

          {/* Breakdown by Category */}
          {analysisResult.breakdown && analysisResult.breakdown.length > 0 && (
            <Card>
              <Title level={4}>Score Breakdown</Title>
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {analysisResult.breakdown.map((item, index) => (
                  <div key={index}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: 8 }}>
                      <Text strong>{item.category}</Text>
                      <Text style={{ color: getSeverityColor(item.severity) }}>
                        {item.score}/{item.max_score}
                      </Text>
                    </Flex>
                    <Progress
                      percent={(item.score / item.max_score) * 100}
                      strokeColor={getSeverityColor(item.severity)}
                      showInfo={false}
                    />
                    {item.findings && item.findings.length > 0 && (
                      <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                        {item.findings.map((finding, idx) => (
                          <li key={idx}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {finding}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Space>
            </Card>
          )}

          {/* Generative Summary */}
          <Card>
            <Title level={4}>Generative Summary</Title>
            <Paragraph>{analysisResult.summary}</Paragraph>

            <Divider />

            <Space>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadReport("pdf")}
                loading={downloadReportMutation.isPending}
              >
                Download PDF
              </Button>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadReport("text")}
                loading={downloadReportMutation.isPending}
              >
                Download Text
              </Button>
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadReport("json")}
                loading={downloadReportMutation.isPending}
              >
                Download JSON
              </Button>
            </Space>
          </Card>

          {/* Recommendations */}
          {analysisResult.recommendations.length > 0 && (
            <Card>
              <Title level={4}>Recommendations</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                {analysisResult.recommendations.map((rec, index) => (
                  <Card key={index} size="small" style={{ backgroundColor: "#f9f9f9" }}>
                    <Flex gap={8}>
                      <Text strong style={{ color: "#1890ff" }}>
                        {index + 1}.
                      </Text>
                      <Text>{rec}</Text>
                    </Flex>
                  </Card>
                ))}
              </Space>
            </Card>
          )}

          <Button type="default" onClick={() => setAnalysisResult(null)} block>
            Analyze Another Architecture
          </Button>
        </Space>
      )}
    </div>
  );
};
