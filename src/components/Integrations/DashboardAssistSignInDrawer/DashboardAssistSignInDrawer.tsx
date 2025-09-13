import { useState } from "react";
import { useCreateDashboardAssistSecret } from "react-query/dashboardAssistQueries";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Flex, Form, Tooltip, message } from "antd";

import { Drawer, Input, Text } from "components";

import { Colors, Metrics } from "themes";

interface DashboardAssistSignInFormFields {
  name: string;
  grafana_url: string;
  grafana_pat_token: string;
  prometheus_url: string;
}

interface DashboardAssistSignInDrawerProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type?: "add" | "edit";
  initialValues?: DashboardAssistSignInFormFields;
}

/**
 * A Drawer component for configuring Dashboard Assist Grafana connection into an application.
 */
const DashboardAssistSignInDrawer: React.FC<DashboardAssistSignInDrawerProps> = ({
  projectId,
  isOpen,
  type = "add",
  initialValues = {},
  onClose,
  onSuccess,
}) => {
  const [disabledSave, setDisabledSave] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboardAssistForm] = Form.useForm<DashboardAssistSignInFormFields>();

  const createDashboardAssistSecretMutation = useCreateDashboardAssistSecret();

  const [messageApi, contextHolder] = message.useMessage();

  const error = (message?: string) => {
    messageApi.open({
      type: "error",
      content: message ? message : "Error: Something went wrong",
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await dashboardAssistForm.validateFields();

      if (type === "add") {
        const req = {
          name: dashboardAssistForm.getFieldValue("name"),
          project_id: projectId,
          secret: {
            grafana_url: dashboardAssistForm.getFieldValue("grafana_url"),
            grafana_pat_token: dashboardAssistForm.getFieldValue("grafana_pat_token"),
            prometheus_url: dashboardAssistForm.getFieldValue("prometheus_url"),
          },
          access: "Internal", // Default access level for Dashboard Assist connections
        };

        await createDashboardAssistSecretMutation.mutateAsync(req);
      }

      onSuccess();
    } catch (err) {
      console.error("DashboardAssistSignInDrawer: Error creating secret:", err);
      
      // Safely extract error message
      let errorMessage = "Failed to create Dashboard Assist connection";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object') {
        if ('response' in err && err.response && typeof err.response === 'object' && 
            'data' in err.response && err.response.data && typeof err.response.data === 'object' &&
            'detail' in err.response.data) {
          errorMessage = String(err.response.data.detail);
        } else if ('message' in err) {
          errorMessage = String(err.message);
        }
      }
      
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = () => {
    const hasErrors =
      dashboardAssistForm?.getFieldsError().filter(({ errors }) => errors.length)
        .length > 0;

    setDisabledSave(hasErrors);
  };

  // URL validation function
  const validateUrl = (fieldName: string) => (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(`${fieldName} is required`));
    }
    
    try {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return Promise.reject(new Error('URL must use HTTP or HTTPS protocol'));
      }
      return Promise.resolve();
    } catch {
      return Promise.reject(new Error('Please enter a valid URL'));
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={isOpen}
        onClose={onClose}
        title={`${type === "edit" ? "Edit" : "Add New"} Grafana Connection`}
        onCancel={onClose}
        onSubmit={handleSubmit}
        disabled={disabledSave || isLoading}
        loading={isLoading}
      >
        <Form
          layout="vertical"
          onFieldsChange={handleFormChange}
          form={dashboardAssistForm}
          initialValues={{
            ...initialValues,
          }}
        >
          <Form.Item<DashboardAssistSignInFormFields>
            name="name"
            label={<Text weight="semibold" text="Account Name" />}
            rules={[
              { required: true, message: "Account name is required" },
              { min: 3, message: "Account name must be at least 3 characters" },
              { max: 50, message: "Account name must be less than 50 characters" }
            ]}
          >
            <Input placeholder="Enter account name (e.g., Production Grafana)" type="text" />
          </Form.Item>

          <Form.Item<DashboardAssistSignInFormFields>
            name="grafana_url"
            label={
              <Flex align="center" gap={Metrics.SPACE_XS}>
                <Text weight="semibold" text="Grafana URL" />
                <Tooltip
                  overlayStyle={{ maxWidth: "400px" }}
                  showArrow
                  title={
                    <>
                      The base URL of your Grafana instance. This should include the protocol (http:// or https://) and domain. <br />
                      Example: https://grafana.example.com or http://localhost:3000
                    </>
                  }
                  trigger="hover"
                  placement="bottom"
                >
                  <InfoCircleOutlined
                    className="cursor-pointer"
                    style={{ color: Colors.COOL_GRAY_7 }}
                  />
                </Tooltip>
              </Flex>
            }
            rules={[
              { validator: validateUrl('Grafana URL') }
            ]}
          >
            <Input
              placeholder="https://grafana.example.com"
              type="text"
              autoComplete="url"
            />
          </Form.Item>

          <Form.Item<DashboardAssistSignInFormFields>
            name="prometheus_url"
            label={
              <Flex align="center" gap={Metrics.SPACE_XS}>
                <Text weight="semibold" text="Prometheus URL" />
                <Tooltip
                  overlayStyle={{ maxWidth: "400px" }}
                  showArrow
                  title={
                    <>
                      The base URL of your Prometheus instance. This should include the protocol (http:// or https://) and domain. <br />
                      Example: https://prometheus.example.com or http://localhost:9090
                    </>
                  }
                  trigger="hover"
                  placement="bottom"
                >
                  <InfoCircleOutlined
                    className="cursor-pointer"
                    style={{ color: Colors.COOL_GRAY_7 }}
                  />
                </Tooltip>
              </Flex>
            }
            rules={[
              { validator: validateUrl('Prometheus URL') }
            ]}
          >
            <Input
              placeholder="https://prometheus.example.com"
              type="text"
              autoComplete="url"
            />
          </Form.Item>

          <Form.Item<DashboardAssistSignInFormFields>
            name="grafana_pat_token"
            label={
              <Flex align="center" gap={Metrics.SPACE_XS}>
                <Text weight="semibold" text="Grafana PAT Token" />
                <Tooltip
                  overlayStyle={{ maxWidth: "400px" }}
                  showArrow
                  title={
                    <>
                      Personal Access Token (PAT) for Grafana API access. This token should have appropriate permissions to read dashboards and data sources. <br />
                      <a
                        href="https://grafana.com/docs/grafana/latest/administration/service-accounts/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more about Grafana Service Accounts and Tokens
                      </a>
                    </>
                  }
                  trigger="hover"
                  placement="bottom"
                >
                  <InfoCircleOutlined
                    className="cursor-pointer"
                    style={{ color: Colors.COOL_GRAY_7 }}
                  />
                </Tooltip>
              </Flex>
            }
            rules={[
              { required: true, message: "Grafana PAT Token is required" },
              { min: 10, message: "Token appears to be too short" },
              { pattern: /^[A-Za-z0-9_-]+$/, message: "Token contains invalid characters" }
            ]}
          >
            <Input
              placeholder="glsa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>

        </Form>

        {/* Security Notice */}
        <div style={{ marginTop: 24, padding: '12px', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '4px' }}>
          <Text 
            text="🔒 Security Notice: Your Grafana credentials will be securely stored and encrypted. They are only accessible by authorized users within your project and will be used to generate intelligent dashboard recommendations." 
            type="footnote" 
            style={{ color: '#0066cc' }}
          />
        </div>

        {/* Usage Information */}
        <div style={{ marginTop: 12, padding: '12px', background: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '4px' }}>
          <Text 
            text="ℹ️ Dashboard Assist will use this connection to analyze your existing Grafana dashboards and provide intelligent recommendations for new dashboards based on your application metrics and SLOs." 
            type="footnote" 
            style={{ color: '#1e40af' }}
          />
        </div>
      </Drawer>
    </>
  );
};

export default DashboardAssistSignInDrawer;
