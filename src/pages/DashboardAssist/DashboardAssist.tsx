import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
<<<<<<< HEAD
=======
import { Spin } from "antd";
>>>>>>> f0ce0ac (das)
import {
  useGenerateDashboard,
  useUploadDashboard,
  useGetDashboardHistory,
<<<<<<< HEAD
  useGetDeployments,
} from "react-query/dashboardAssistQueries";

=======
  useDeleteDashboard,
} from "react-query/dashboardAssistQueries";
import { useGetAllDeployments } from "react-query/dashboardQueries";
>>>>>>> f0ce0ac (das)
import "./DashboardAssist.styles.scss";
import { HistoryItem } from "interfaces/dashboardAssist";
import {
  CloseOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  LinkOutlined,
  DownOutlined,
  InfoCircleOutlined,
<<<<<<< HEAD
=======
  DeleteOutlined,
>>>>>>> f0ce0ac (das)
} from "@ant-design/icons";

interface DashboardAssistProps {
  onClose?: () => void;
}

<<<<<<< HEAD
const Loader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="dashboard-loader">
    <span className="loader-spinner" />
    {message && <span style={{ marginLeft: 12 }}>{message}</span>}
  </div>
);

=======
>>>>>>> f0ce0ac (das)
const GrowingTextarea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}> = ({ value, onChange, placeholder, disabled, onKeyDown }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className="dashboard-textarea"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onKeyDown={onKeyDown}
      rows={1}
      style={{ resize: "none", overflow: "hidden" }}
    />
  );
};

const getPanelGridStyle = (count: number) => {
  if (count === 1) {
    return { display: "flex", justifyContent: "center" };
  }
  if (count === 2) {
    return { display: "flex", gap: 16, justifyContent: "center" };
  }
  if (count === 3 || count === 4) {
    return {
      display: "grid",
      gridTemplateColumns: "repeat(2, 400px)",
      gridAutoRows: "300px",
      gap: 16,
      justifyContent: "center",
      alignItems: "center",
    };
  }
  return {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
  };
};

const PanelIframes: React.FC<{ panelLinks: string[] }> = ({ panelLinks }) => (
  <div style={getPanelGridStyle(panelLinks.length)}>
    {panelLinks.map(
      (panelUrl, idx) =>
        panelUrl && (
          <div
            key={idx}
            className="panel-iframe-container"
            onClick={() => window.open(panelUrl, "_blank", "noopener,noreferrer")}
            tabIndex={0}
            role="button"
            aria-label={`Open panel ${idx + 1} in new tab`}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") window.open(panelUrl, "_blank", "noopener,noreferrer");
            }}
          >
            <iframe
              src={panelUrl}
              title={`Panel-${idx + 1}`}
              width="100%"
              height="100%"
            />
            <div className="panel-overlay" />
          </div>
        )
    )}
  </div>
);

const DashboardView: React.FC<{
  item: HistoryItem;
  onBack: () => void;
<<<<<<< HEAD
}> = ({ item, onBack }) => (
=======
  onDelete: () => void;
}> = ({ item, onBack, onDelete }) => (
>>>>>>> f0ce0ac (das)
  <div className="dashboard-view-container">
    <button className="dashboard-view-back-btn" onClick={onBack}>
      <ArrowLeftOutlined style={{ fontSize: 18, marginRight: 8 }} />
      Back to History
    </button>
<<<<<<< HEAD
=======
    <button
      className="dashboard-view-delete-btn"
      title="Delete Dashboard"
      onClick={onDelete}
      aria-label="Delete dashboard"
    >
      <DeleteOutlined style={{ fontSize: 18 }} />
      <span className="dashboard-view-delete-label">Delete</span>
    </button>
>>>>>>> f0ce0ac (das)
    <div className="dashboard-view-prompt">
      <span className="dashboard-view-label">Prompt:</span>
      <span className="dashboard-view-prompt-text">{item.prompt}</span>
    </div>
    <div className="dashboard-view-iframe-wrapper">
      <div className="dashboard-view-iframe-header-row">
        <div className="dashboard-view-iframe-header-label">
          Dashboard generated:
        </div>
        <button
          className="dashboard-grafana-btn"
          onClick={() =>
            window.open(item.dashboard_url || item.grafana_url, "_blank", "noopener,noreferrer")
          }
        >
          <LinkOutlined />
          Open in Grafana
        </button>
      </div>
    </div>
    {item.panel_links && item.panel_links.length > 0 && (
      <div>
        <div className="dashboard-view-panels-label">Panels:</div>
        <PanelIframes panelLinks={item.panel_links} />
      </div>
    )}
  </div>
);

const DashboardAssist: React.FC<DashboardAssistProps> = ({ onClose }) => {
  const { project, application } = useParams<{ project: string; application: string }>();

  const [prompt, setPrompt] = useState("");
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [grafanaUrl, setGrafanaUrl] = useState<string | null>(null);
  const [panelLinks, setPanelLinks] = useState<string[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

<<<<<<< HEAD
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
=======
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);
>>>>>>> f0ce0ac (das)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
  React.useEffect(() => {
=======
  useEffect(() => {
>>>>>>> f0ce0ac (das)
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const {
    data: deployments,
    isLoading: isDeploymentsLoading,
    isError: isDeploymentsError,
    error: deploymentsError,
    refetch: refetchDeployments,
<<<<<<< HEAD
  } = useGetDeployments({
    project_id: project ?? "",
    application_id: application ?? ""
  });
=======
  } = useGetAllDeployments();
>>>>>>> f0ce0ac (das)

  const {
    mutateAsync: generateDashboard,
    isLoading: isGenerating,
    isError: isGenError,
    error: genError,
  } = useGenerateDashboard();

  const {
    mutateAsync: uploadDashboard,
    isLoading: isUploading,
    isError: isUploadError,
    error: uploadError,
  } = useUploadDashboard();

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
    refetch: refetchHistory,
  } = useGetDashboardHistory({
    project_id: project ?? "",
    application_id: application ?? "",
  });

<<<<<<< HEAD
=======
  const {
    mutateAsync: deleteDashboard,
    isLoading: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteDashboard();

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteDashboard = async (
    grafana_url: string | undefined,
    id: number
  ) => {
    if (!grafana_url) return;
    setDeletingId(id);
    try {
      await deleteDashboard({ grafana_url });
      refetchHistory();
      if (selectedHistory && selectedHistory.id === id) {
        setSelectedHistory(null);
      }
    } catch (e) {
      console.log(e)
    } finally {
      setDeletingId(null);
    }
  };

>>>>>>> f0ce0ac (das)
  const handlePromptSent = async () => {
    if (!prompt.trim()) return;
    setDashboardUrl(null);
    setGrafanaUrl(null);
    setPanelLinks([]);
    try {
      const genResponse = await generateDashboard({
        prompt,
        preview: false,
<<<<<<< HEAD
        pod_name: selectedPod || null,
=======
        pod_name: selectedDeployment || null, // <-- Use deployment name
>>>>>>> f0ce0ac (das)
      });
      const uploadResponse = await uploadDashboard({
        prompt,
        dashboard: genResponse.dashboard,
        project_id: project ?? "",
        application_id: application ?? "",
      });
      setDashboardUrl(uploadResponse.dashboard_url || null);
      setGrafanaUrl(uploadResponse.grafana_url || uploadResponse.dashboard_url || null);
      setPanelLinks(Array.isArray(uploadResponse.panel_links) ? uploadResponse.panel_links : []);
      setPrompt("");
<<<<<<< HEAD
      setSelectedPod(null);
=======
      setSelectedDeployment(null);
>>>>>>> f0ce0ac (das)
      refetchHistory();
    } catch (e) {}
  };

<<<<<<< HEAD
  const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => (
    <div className="history-card">
      <div className="history-card-header">
        <span className="history-card-id">#{item.id}</span>
=======
  const HistoryCard: React.FC<{ item: HistoryItem; displayId: number }> = ({ item, displayId }) => (
    <div className="history-card">
      <div className="history-card-header">
        <span className="history-card-id">#{displayId}</span>
>>>>>>> f0ce0ac (das)
        <span className="history-card-date">
          {new Date(item.created_at).toLocaleString()}
        </span>
      </div>
      <div className="history-card-prompt">{item.prompt}</div>
<<<<<<< HEAD
      <button
        className="history-card-view-btn"
        title="View Dashboard"
        onClick={() => setSelectedHistory(item)}
      >
        <EyeOutlined style={{ fontSize: 18 }} />
        <span style={{ marginLeft: 8 }}>View</span>
      </button>
    </div>
  );

  const dropdownLabel = selectedPod
    ? selectedPod
    : "Select application";
=======
      <div className="history-card-actions">
        <button
          className="history-card-view-btn"
          title="View Dashboard"
          onClick={() => setSelectedHistory(item)}
        >
          <EyeOutlined style={{ fontSize: 18 }} />
          <span style={{ marginLeft: 8 }}>View</span>
        </button>
        <button
          className="history-card-delete-btn"
          title="Delete Dashboard"
          onClick={() => handleDeleteDashboard(item.grafana_url || item.dashboard_url, item.id)}
          disabled={isDeleting && deletingId === item.id}
          aria-label="Delete dashboard"
        >
          <DeleteOutlined style={{ fontSize: 18 }} />
          {isDeleting && deletingId === item.id ? (
            <span className="history-card-delete-label">Deleting...</span>
          ) : (
            <span className="history-card-delete-label">Delete</span>
          )}
        </button>
      </div>
      {isDeleteError && deletingId === item.id && (
        <div className="dashboard-error" style={{ marginTop: 8 }}>
          {typeof deleteError === "string"
            ? deleteError
            : "Failed to delete dashboard."}
        </div>
      )}
    </div>
  );

  const dropdownLabel = selectedDeployment
    ? selectedDeployment
    : "Select deployment";
>>>>>>> f0ce0ac (das)

  return (
    <div
      className="dashboard-assist-container"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      {onClose && (
        <button
          className="dashboard-assist-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseOutlined style={{ fontSize: 20 }} />
        </button>
      )}

      {selectedHistory ? (
        <DashboardView
          item={selectedHistory}
          onBack={() => setSelectedHistory(null)}
<<<<<<< HEAD
=======
          onDelete={() => handleDeleteDashboard(selectedHistory.grafana_url || selectedHistory.dashboard_url, selectedHistory.id)}
>>>>>>> f0ce0ac (das)
        />
      ) : (
        <>
          <div className="dashboard-input-row">
            <div className="growing-textarea-wrapper">
              <GrowingTextarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Enter your prompt"
                disabled={isGenerating || isUploading}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePromptSent();
                  }
                }}
              />
            </div>
            <div className="dropdown-info-group">
              <div
                className="dashboard-deployment-dropdown-wrapper"
                ref={dropdownRef}
                tabIndex={0}
              >
                <button
                  type="button"
                  className={`dashboard-deployment-dropdown-label${dropdownOpen ? " open" : ""}`}
                  disabled={isGenerating || isUploading}
                  onClick={() => {
                    setDropdownOpen((open) => {
                      if (!open) refetchDeployments();
                      return !open;
                    });
                  }}
                >
                  <span className="dashboard-deployment-dropdown-label-text">
                    {dropdownLabel}
                  </span>
                  <DownOutlined style={{ fontSize: 14, marginLeft: 8 }} />
                </button>
                {dropdownOpen && (
                  <div className="dashboard-deployment-dropdown-list">
                    {isDeploymentsLoading ? (
                      <div className="dashboard-deployment-dropdown-list-loader">
<<<<<<< HEAD
                        <Loader />
                      </div>
                    ) : isDeploymentsError ? (
                      <div className="dashboard-deployment-dropdown-list-error">
                        Error loading applications
                      </div>
                    ) : deployments && Array.isArray(deployments.pods) && deployments.pods.length > 0 ? (
                      <div className="dashboard-deployment-dropdown-list-scroll">
                        {deployments.pods.map((pod: string) => (
                          <div
                            key={pod}
                            className={`dashboard-deployment-dropdown-list-item${selectedPod === pod ? " selected" : ""}`}
                            onClick={() => {
                              setSelectedPod(pod);
=======
                        <Spin
                          tip="Loading..."
                          size="small"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        />
                      </div>
                    ) : isDeploymentsError ? (
                      <div className="dashboard-deployment-dropdown-list-error">
                        Error loading deployments
                      </div>
                    ) : Array.isArray(deployments) && deployments.length > 0 ? (
                      <div className="dashboard-deployment-dropdown-list-scroll">
                        {deployments.map((deployment: any) => (
                          <div
                            key={deployment.name}
                            className={`dashboard-deployment-dropdown-list-item${selectedDeployment === deployment.name ? " selected" : ""}`}
                            onClick={() => {
                              setSelectedDeployment(deployment.name);
>>>>>>> f0ce0ac (das)
                              setDropdownOpen(false);
                            }}
                            tabIndex={0}
                            role="button"
<<<<<<< HEAD
                            aria-label={`Select application ${pod}`}
                            onKeyDown={e => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedPod(pod);
=======
                            aria-label={`Select deployment ${deployment.name}`}
                            onKeyDown={e => {
                              if (e.key === "Enter" || e.key === " ") {
                                setSelectedDeployment(deployment.name);
>>>>>>> f0ce0ac (das)
                                setDropdownOpen(false);
                              }
                            }}
                          >
<<<<<<< HEAD
                            {pod}
=======
                            {deployment.name}
>>>>>>> f0ce0ac (das)
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="dashboard-deployment-dropdown-list-empty">
<<<<<<< HEAD
                        No applications found
=======
                        No deployments found
>>>>>>> f0ce0ac (das)
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span
                className="dashboard-dropdown-info-icon"
                tabIndex={0}
                onMouseEnter={() => setShowInfo(true)}
                onMouseLeave={() => setShowInfo(false)}
                onFocus={() => setShowInfo(true)}
                onBlur={() => setShowInfo(false)}
                aria-label="Info"
              >
                <InfoCircleOutlined style={{ color: "#1976d2", fontSize: 16 }} />
                {showInfo && (
                  <div className="dashboard-dropdown-info-tooltip">
<<<<<<< HEAD
                    If you don’t select any application, graphs will be generated for all applications by default.
=======
                    If you don’t select any deployment, graphs will be generated for all deployments by default.
>>>>>>> f0ce0ac (das)
                  </div>
                )}
              </span>
            </div>
            <button
              className="send-btn"
              onClick={handlePromptSent}
              disabled={isGenerating || isUploading || !prompt.trim()}
            >
<<<<<<< HEAD
              {isGenerating || isUploading ? <Loader /> : "Send Prompt"}
=======
              {isGenerating || isUploading ? <Spin size="small" /> : "Send Prompt"}
>>>>>>> f0ce0ac (das)
            </button>
          </div>

          {isDeploymentsError && (
            <div className="dashboard-error">
              {typeof deploymentsError === "string"
                ? deploymentsError
<<<<<<< HEAD
                : "Failed to load applications."}
=======
                : "Failed to load deployments."}
>>>>>>> f0ce0ac (das)
            </div>
          )}

          {isGenError && (
            <div className="dashboard-error">
              {typeof genError === "string"
                ? genError
                : "Failed to generate dashboard."}
            </div>
          )}
          {isUploadError && (
            <div className="dashboard-error">
              {typeof uploadError === "string"
                ? uploadError
                : "Failed to upload dashboard."}
            </div>
          )}

          {(isGenerating || isUploading) && (
<<<<<<< HEAD
            <Loader
              message={
                isGenerating
                  ? "Generating dashboard..."
                  : "Uploading dashboard..."
              }
            />
=======
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
              <Spin tip={isGenerating ? "Generating dashboard..." : "Uploading dashboard..."} size="large" />
            </div>
>>>>>>> f0ce0ac (das)
          )}

          {grafanaUrl && (
            <div style={{ marginTop: 32 }}>
              <div className="dashboard-view-iframe-header-row">
                <div className="dashboard-view-iframe-header-label">
                  Dashboard generated:
                </div>
                <button
                  className="dashboard-grafana-btn"
                  onClick={() =>
                    window.open(grafanaUrl, "_blank", "noopener,noreferrer")
                  }
                >
                  <LinkOutlined />
                  Open in Grafana
                </button>
              </div>
              {panelLinks.length > 0 && (
                <div style={{ marginTop: 24 }}>
<<<<<<< HEAD
                  <div className="dashboard-view-panels-label">
=======
                   <div className="dashboard-view-panels-label">
>>>>>>> f0ce0ac (das)
                    Panels:
                  </div>
                  <PanelIframes panelLinks={panelLinks} />
                </div>
              )}
            </div>
          )}

          <div className="history-section" style={{ marginTop: 40 }}>
            <h3 style={{ textAlign: "center" }}>Dashboard History</h3>
<<<<<<< HEAD
            {isHistoryLoading && <Loader message="Loading history..." />}
=======
            {isHistoryLoading && (
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px"
              }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, fontSize: 16, color: "#555" }}>Loading history...</div>
              </div>
            )}
>>>>>>> f0ce0ac (das)
            {isHistoryError && (
              <div className="dashboard-error">
                {typeof historyError === "string"
                  ? historyError
                  : "Failed to load history."}
              </div>
            )}
            {Array.isArray(historyData) && historyData.length > 0 ? (
              <div className="history-card-list">
<<<<<<< HEAD
                {historyData.map((item: HistoryItem) => (
                  <HistoryCard key={item.id} item={item} />
=======
                {historyData.map((item, idx) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    displayId={historyData.length - idx}
                  />
>>>>>>> f0ce0ac (das)
                ))}
              </div>
            ) : (
              !isHistoryLoading && (
                <div
                  className="dashboard-empty"
                  style={{ textAlign: "center" }}
                >
                  No history found.
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardAssist;
