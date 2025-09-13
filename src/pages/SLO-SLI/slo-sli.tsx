import React, { useState, useEffect, useMemo } from "react";
<<<<<<< HEAD
import { Button, Drawer, Tabs, message, Spin } from "antd";
import { DownloadOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetApplicationSLO, useGeneratePrometheusRules } from "react-query/sloQueries";
import { Empty } from "components";
import ConfigureSloSli from "components/ConfigureSloSli/ConfigureSloSli";
import "./SloSli.styles.scss";
import { ApplicationSlo } from "interfaces/slo";

=======


import { Button, Drawer, Tabs, message, Spin, Select } from "antd";

import { PlusOutlined, CloseOutlined } from "@ant-design/icons";

import { useGetApplicationSLO, useGeneratePrometheusRules } from "react-query/sloQueries";

import { Empty } from "components";

import ConfigureSloSli from "components/ConfigureSloSli/ConfigureSloSli";

import "./SloSli.styles.scss";

import { ApplicationSlo } from "interfaces/slo";

const { Option } = Select;

>>>>>>> f0ce0ac (das)
interface SloSliComponentProps {
  onClose: () => void;
  applicationId: number;
  projectSloId: number;
}

const PANEL_CONFIG = [
  { panelId: 3, label: "Objective" },
  { panelId: 4, label: "SLI Left" },
  { panelId: 1, label: "SLI Graph" },
];

<<<<<<< HEAD
=======
const TIME_RANGES = [
  { label: "Last 5 minutes", value: "5m" },
  { label: "Last 10 minutes", value: "10m" },
  { label: "Last 30 minutes", value: "30m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 3 hours", value: "3h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 12 hours", value: "12h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 2 days", value: "2d" },
];

>>>>>>> f0ce0ac (das)
const SloSliComponent: React.FC<SloSliComponentProps> = ({
  onClose,
  applicationId,
  projectSloId,
}) => {
  const [showConfigure, setShowConfigure] = useState(false);
  const [selectedSloId, setSelectedSloId] = useState<number | null>(null);
<<<<<<< HEAD
=======
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");
>>>>>>> f0ce0ac (das)

  const { data: sloData, isLoading: isLoadingSlos, refetch: refetchSlos } = useGetApplicationSLO(
    projectSloId,
    applicationId
  );
<<<<<<< HEAD
=======

>>>>>>> f0ce0ac (das)
  const { mutateAsync: downloadSloAsync, isLoading: isDownloading } = useGeneratePrometheusRules();

  const isSloArray = (data: any): data is ApplicationSlo[] => Array.isArray(data);
  const slos: ApplicationSlo[] = isSloArray(sloData) ? sloData : [];

  useEffect(() => {
    if (slos.length > 0 && !selectedSloId) {
      setSelectedSloId(slos[0].id);
    }
    if (slos.length === 0) {
      setSelectedSloId(null);
    }
  }, [slos, selectedSloId]);

<<<<<<< HEAD
=======
  // Reset "applied" state when changing SLO (no longer needed, but kept for clarity)
  useEffect(() => {
    // No local applied state
  }, [selectedSloId]);

>>>>>>> f0ce0ac (das)
  const selectedSlo = useMemo(() => slos.find((slo) => slo.id === selectedSloId), [
    slos,
    selectedSloId,
  ]);

<<<<<<< HEAD
  const handleDownloadSlo = async () => {
=======
  const handleApplySlo = async () => {
>>>>>>> f0ce0ac (das)
    if (!selectedSlo) return;
    try {
      const result = await downloadSloAsync(selectedSlo.id);
      if (!result || !(result as any).blob) {
        throw new Error("No file received");
      }
      const { blob, filename } = result as { blob: Blob; filename: string };
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "slo_rules.yaml";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
<<<<<<< HEAD
      message.success("SLO downloaded successfully!");
    } catch (error) {
      message.error("Failed to download SLO.");
=======
      message.success("SLO applied successfully!");
      await refetchSlos(); // Refetch to get updated isapplied value
    } catch (error) {
      message.error("Failed to apply SLO.");
>>>>>>> f0ce0ac (das)
    }
  };

  const handleConfigureSuccess = async () => {
    setShowConfigure(false);
    await refetchSlos();
    if (slos.length > 0) {
      setSelectedSloId(slos[0].id);
    } else {
      setSelectedSloId(null);
    }
  };

  const panelUrl = selectedSlo?.panelurl;

<<<<<<< HEAD
=======
  // Helper to append the correct time range to the panel URL
  const getPanelUrl = (panelId: number) => {
    if (!panelUrl) return "";
    let url = panelUrl.replace(/&panelId=\d+/, "") + `&panelId=${panelId}`;
    if (panelId === 1) {
      // SLI Graph: force theme=light
      url = url.replace(/([&?])theme=[^&]*/, "");
      url += (url.includes("?") ? "&" : "?") + "theme=light";
    }
    // Add time range params (Grafana-style)
    url += `&from=now-${selectedTimeRange}&to=now`;
    return url;
  };

>>>>>>> f0ce0ac (das)
  if (!isSloArray(sloData) || slos.length === 0) {
    return (
      <div className="slo-sli-container">
        <div className="header">
          <div className="tabs-scroll-wrapper" />
          <Button
            type="primary"
            onClick={() => setShowConfigure(true)}
            className="add-button"
            icon={<PlusOutlined />}
          >
            Add SLO
          </Button>
        </div>
        <Empty
          title="You have not added any SLOs yet."
          subtitle='Please click “Add SLO” button to get started.'
        />
        <Drawer
          title="Add SLO"
          placement="right"
          onClose={() => setShowConfigure(false)}
          open={showConfigure}
          width={400}
          closeIcon={<CloseOutlined />}
          destroyOnClose
        >
          {applicationId && projectSloId ? (
            <ConfigureSloSli
              application_id={applicationId}
              project_slo_id={projectSloId}
              onSuccess={handleConfigureSuccess}
            />
          ) : (
            <div style={{ padding: 24 }}>Loading SLO prerequisites...</div>
          )}
        </Drawer>
      </div>
    );
  }

<<<<<<< HEAD
  const getPanelUrl = (panelId: number) => {
    if (!panelUrl) return "";
    let url = panelUrl.replace(/&panelId=\d+/, "") + `&panelId=${panelId}`;
    if (panelId === 1) {
      // SLI Graph: force theme=light
      url = url.replace(/([&?])theme=[^&]*/, ""); 
      url += (url.includes("?") ? "&" : "?") + "theme=light";
    }
    return url;
  };

  return (
    <div className="slo-sli-container">

=======
  return (
    <div className="slo-sli-container">
>>>>>>> f0ce0ac (das)
      <div className="header">
        <div className="tabs-scroll-wrapper">
          <Tabs
            activeKey={selectedSloId?.toString() || ""}
            onChange={(key) => setSelectedSloId(Number(key))}
            className="tabs"
            tabBarGutter={8}
            tabBarStyle={{ marginBottom: 0 }}
          >
            {slos.map((slo) => (
              <Tabs.TabPane tab={slo.name} key={slo.id.toString()} />
            ))}
          </Tabs>
        </div>
        <Button
          type="primary"
          onClick={() => setShowConfigure(true)}
          className="add-button"
          icon={<PlusOutlined />}
        >
          Add SLO
        </Button>
      </div>

      <Spin spinning={isLoadingSlos || isDownloading}>
        <div className="data-box">
          <div className="data-row">
            <div className="data-label">Name</div>
            <div className="data-value">{selectedSlo?.name || "N/A"}</div>
          </div>
          <div className="data-row">
            <div className="data-label">Type</div>
            <div className="data-value">{selectedSlo?.slo_type || "N/A"}</div>
          </div>
          <div className="data-row">
            <div className="data-label">Target</div>
            <div className="data-value">{selectedSlo?.target_value || "N/A"}</div>
          </div>
          <div className="data-row">
            <div className="data-label">SLI</div>
            <div className="data-value">{selectedSlo?.sli || "N/A"}</div>
          </div>
          <div className="data-row" style={{ gridColumn: "1 / -1" }}>
            <Button
<<<<<<< HEAD
              icon={<DownloadOutlined />}
              onClick={handleDownloadSlo}
              className="download-button"
              style={{ marginTop: 12 }}
              loading={isDownloading}
            >
              Download SLO
=======
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleApplySlo}
              className="apply-button"
              style={{ marginTop: 12 }}
              loading={isDownloading}
              disabled={selectedSlo?.isapplied}
            >
              {selectedSlo?.isapplied ? "SLO Applied" : "Apply SLO"}
>>>>>>> f0ce0ac (das)
            </Button>
          </div>
        </div>

        <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
<<<<<<< HEAD
=======
          {/* Time Range Dropdown */}
          <Select
            value={selectedTimeRange}
            onChange={setSelectedTimeRange}
            style={{ width: 200, marginBottom: 12 }}
            placeholder="Select Time Range"
          >
            {TIME_RANGES.map((range) => (
              <Option key={range.value} value={range.value}>
                {range.label}
              </Option>
            ))}
          </Select>

>>>>>>> f0ce0ac (das)
          {panelUrl ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                {PANEL_CONFIG.slice(0, 2).map(({ panelId, label }) => (
                  <div className="dashboard-item" key={panelId}>
                    <div className="dashboard-label">{label}</div>
                    <iframe
                      src={getPanelUrl(panelId)}
                      title={label}
                      frameBorder="0"
                      className="dashboard-iframe"
                      allowFullScreen
                      style={{
                        width: "100%",
<<<<<<< HEAD
                        height: "80px", 
=======
                        height: "80px",
>>>>>>> f0ce0ac (das)
                        pointerEvents: "none",
                        background: "#fafbfc",
                        borderRadius: "4px",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div>
<<<<<<< HEAD
                <div>
=======
>>>>>>> f0ce0ac (das)
                <div className="dashboard-item">
                  <div className="dashboard-label">{PANEL_CONFIG[2].label}</div>
                  <iframe
                    src={getPanelUrl(PANEL_CONFIG[2].panelId)}
                    title={PANEL_CONFIG[2].label}
                    frameBorder="0"
                    className="dashboard-iframe"
                    allowFullScreen
                    style={{
                      width: "100%",
<<<<<<< HEAD
                      height: "180px", 
=======
                      height: "320px",
>>>>>>> f0ce0ac (das)
                      pointerEvents: "none",
                      background: "#fafbfc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
<<<<<<< HEAD
              </div>
=======
>>>>>>> f0ce0ac (das)
            </>
          ) : (
            <div className="dashboard-placeholder">No dashboards available.</div>
          )}
        </div>
      </Spin>

      <Drawer
        title="Add SLO"
        placement="right"
        onClose={() => setShowConfigure(false)}
        open={showConfigure}
        width={400}
        closeIcon={<CloseOutlined />}
        destroyOnClose
      >
        {applicationId && projectSloId ? (
          <ConfigureSloSli
            application_id={applicationId}
            project_slo_id={projectSloId}
            onSuccess={handleConfigureSuccess}
          />
        ) : (
          <div style={{ padding: 24 }}>Loading SLO prerequisites...</div>
        )}
      </Drawer>
    </div>
  );
};

export default SloSliComponent;
