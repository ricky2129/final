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

const { Title, Text, Paragraph } = Typography;

interface ArchitectureAnalysisFormProps {
  connectionDetails: any;
  onBack: () => void;
}

interface AnalysisResult {
  drScore: number;
  summary: string;
  recommendations: string[];
  reportUrl?: string;
}

export const ArchitectureAnalysisForm: React.FC<ArchitectureAnalysisFormProps> = ({
  connectionDetails,
  onBack,
}) => {
  const [architectureDiagram, setArchitectureDiagram] = useState<UploadFile[]>([]);
  const [inventoryFile, setInventoryFile] = useState<UploadFile[]>([]);
  const [iacFile, setIacFile] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async () => {
    if (!architectureDiagram.length || !inventoryFile.length) {
      message.error("Please upload required files (Architecture Diagram and Inventory File)");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append("architecture_diagram", architectureDiagram[0].originFileObj as File);
      // formData.append("inventory_file", inventoryFile[0].originFileObj as File);
      // if (iacFile.length) {
      //   formData.append("iac_file", iacFile[0].originFileObj as File);
      // }
      // formData.append("connection_details", JSON.stringify(connectionDetails));
      //
      // const response = await analyzeDRArchitecture(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));

      const mockResult: AnalysisResult = {
        drScore: 75,
        summary:
          "Your infrastructure shows good DR readiness with some areas for improvement. The architecture follows best practices for redundancy across multiple availability zones.",
        recommendations: [
          "Implement automated failover mechanisms for critical databases",
          "Add cross-region replication for S3 buckets containing critical data",
          "Configure automated backup schedules for RDS instances",
          "Implement Infrastructure as Code for faster disaster recovery",
          "Set up monitoring and alerting for replication lag",
        ],
        reportUrl: "/mock-dr-report.pdf",
      };

      setAnalysisResult(mockResult);
      message.success("Analysis completed successfully!");
    } catch (error) {
      message.error("Failed to analyze architecture");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (analysisResult?.reportUrl) {
      // TODO: Implement actual download
      message.success("Downloading DR Summary Report...");
      // window.open(analysisResult.reportUrl, "_blank");
    }
  };

  const beforeUpload = (file: File) => {
    const isValidSize = file.size / 1024 / 1024 < 50; // 50MB
    if (!isValidSize) {
      message.error("File must be smaller than 50MB!");
    }
    return false; // Prevent automatic upload
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
          <Title level={4}>Analyze Architecture</Title>
          <Paragraph type="secondary">
            Upload your files to get a comprehensive Disaster Recovery readiness score.
          </Paragraph>

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
                accept=".json,.csv,.xlsx"
              >
                <Button icon={<UploadOutlined />} block>
                  Choose a file...
                </Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Supported formats: JSON, CSV, XLSX (Max 50MB)
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
                maxCount={1}
                accept=".tf,.yaml,.yml,.json"
              >
                <Button icon={<UploadOutlined />} block>
                  Choose file(s)...
                </Button>
              </Upload>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Supported formats: Terraform (.tf), CloudFormation (.yaml, .json) (Max 50MB)
              </Text>
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={loading}
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
            <Flex justify="center" align="center" style={{ padding: "24px 0" }}>
              <Progress
                type="dashboard"
                percent={analysisResult.drScore}
                size={200}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
              />
            </Flex>
          </Card>

          {/* Generative Summary */}
          <Card>
            <Title level={4}>Generative Summary</Title>
            {analysisResult.summary ? (
              <Paragraph>{analysisResult.summary}</Paragraph>
            ) : (
              <Paragraph type="secondary">
                Upload your architecture to see a summary here.
              </Paragraph>
            )}

            {analysisResult.reportUrl && (
              <Button
                type="default"
                icon={<DownloadOutlined />}
                onClick={handleDownloadReport}
                style={{ marginTop: 16 }}
              >
                Download Summary
              </Button>
            )}
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
