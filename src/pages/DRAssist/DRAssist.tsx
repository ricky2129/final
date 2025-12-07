import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Flex, Row, Typography } from "antd";
import { CloudConnectionForm } from "./CloudConnectionForm";
import { ArchitectureAnalysisForm } from "./ArchitectureAnalysisForm";
import "./DRAssist.styles.scss";

const { Title, Text } = Typography;

interface DRAssistProps {
  onClose?: () => void;
}

const DRAssist: React.FC<DRAssistProps> = ({ onClose }) => {
  const params = useParams();

  // Extract project_id and application_id from URL parameters
  const projectId = params.project;
  const applicationId = params.application;

  const [activeView, setActiveView] = useState<"connect" | "analyze">("connect");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  const handleConnectionSuccess = (details: any) => {
    setIsConnected(true);
    setConnectionDetails(details);
    setActiveView("analyze");
  };

  const handleBackToConnection = () => {
    setActiveView("connect");
  };

  return (
    <div className="dr-assist-container">
      <Flex vertical gap={24} className="dr-assist-content">
        <Flex justify="space-between" align="center">
          <Title level={3} style={{ margin: 0 }}>
            DR Assist
          </Title>
          {onClose && (
            <Button type="text" onClick={onClose}>
              Close
            </Button>
          )}
        </Flex>

        <Text type="secondary">
          Disaster Recovery Assist helps you analyze your cloud architecture and
          provides comprehensive DR readiness scores and recommendations.
        </Text>

        {/* Navigation Tabs */}
        <Flex gap={16} className="dr-assist-tabs">
          <Button
            type={activeView === "connect" ? "primary" : "default"}
            onClick={() => setActiveView("connect")}
            disabled={!isConnected && activeView === "analyze"}
          >
            1. Cloud Connection
          </Button>
          <Button
            type={activeView === "analyze" ? "primary" : "default"}
            onClick={() => setActiveView("analyze")}
            disabled={!isConnected}
          >
            2. Upload & Analyze
          </Button>
        </Flex>

        {/* Content Area */}
        <div className="dr-assist-form-container">
          {activeView === "connect" && (
            <CloudConnectionForm
              onSuccess={handleConnectionSuccess}
              existingConnection={connectionDetails}
              projectId={projectId}
              applicationId={applicationId}
            />
          )}

          {activeView === "analyze" && (
            <ArchitectureAnalysisForm
              connectionDetails={connectionDetails}
              onBack={handleBackToConnection}
            />
          )}
        </div>
      </Flex>
    </div>
  );
};

export default DRAssist;
