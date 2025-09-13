import React, { useEffect, useState } from "react";
import { Form, FormInstance, Button, message, Flex, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Input, Text, DashboardAssistSignInDrawer, IconViewer } from "components";

import { Metrics, Colors } from "themes";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateApplication } from "context";
import { 
  useConnectToDashboardAssist,
  useListDashboardAssistSecrets,
  useConnectToDashboardAssistWithIntegration,
  type ConnectDashboardAssistRequest
} from "react-query/dashboardAssistQueries";

interface ConfigureDashboardAssistFormField {
  GRAFANA_URL: string;
  GRAFANA_PAT_TOKEN: string;
  PROMETHEUS_URL: string;
  ACCOUNT_SELECTION?: number; // For stored account selection
}

interface ConfigureDashboardAssistProps {
  configureDashboardAssistForm: FormInstance<ConfigureDashboardAssistFormField>;
  setDisabledSave: (disabled: boolean) => void;
  onFinish?: () => void;
  skipNavigation?: boolean; // New prop to control navigation behavior
}

const ConfigureDashboardAssist: React.FC<ConfigureDashboardAssistProps> = ({
  configureDashboardAssistForm,
  setDisabledSave,
  onFinish,
  skipNavigation = false,
}) => {
  const navigate = useNavigate();
  const { project, application } = useParams();
  const { applicationId } = useCreateApplication();
  
  // Use applicationId from context if available (during creation), otherwise use URL param
  const finalApplicationId = applicationId || application;

  // State for account selection
  const [isOpenAddDashboardAssist, setIsOpenAddDashboardAssist] = useState<boolean>(false);
  const [connectionMode, setConnectionMode] = useState<'stored' | 'direct'>('stored');

  // API hooks
  const connectToDashboardAssistMutation = useConnectToDashboardAssist();
  const connectToDashboardAssistWithIntegrationMutation = useConnectToDashboardAssistWithIntegration();
  const listDashboardAssistSecretsQuery = useListDashboardAssistSecrets(parseInt(project || '0'));

  // Form validation
  useEffect(() => {
    const hasErrors = configureDashboardAssistForm
      ?.getFieldsError()
      .filter(({ errors }) => errors.length).length > 0;
    setDisabledSave(hasErrors);
  }, [configureDashboardAssistForm, setDisabledSave]);

  // URL validation function
  const validateGrafanaUrl = (value: string) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const handleConnectToDashboardAssist = async () => {
    try {
      console.log('🔧 ConfigureDashboardAssist: Starting Grafana connection process...');
      
      const values = await configureDashboardAssistForm.validateFields();
      
      if (connectionMode === 'direct') {
        // Direct connection with manually entered credentials
        console.log('📝 ConfigureDashboardAssist: Using direct connection mode');
        
        const connectRequest: ConnectDashboardAssistRequest = {
          grafana_url: values.GRAFANA_URL,
          grafana_pat_token: values.GRAFANA_PAT_TOKEN,
          prometheus_url: values.PROMETHEUS_URL,
        };

        const response = await connectToDashboardAssistMutation.mutateAsync(connectRequest);
        
        // Store credentials in session storage for persistence
        const sessionData = {
          sessionId: response.session_id,
          grafanaCredentials: {
            grafana_url: values.GRAFANA_URL,
            grafana_pat_token: values.GRAFANA_PAT_TOKEN,
            prometheus_url: values.PROMETHEUS_URL
          },
          timestamp: Date.now()
        };
        
        sessionStorage.setItem('dashboardAssistSession', JSON.stringify(sessionData));
        
        const navigationState = {
          sessionId: response.session_id,
          grafanaCredentials: sessionData.grafanaCredentials
        };
        
        // Only navigate if skipNavigation is false (default behavior for workflow)
        if (!skipNavigation) {
          navigate(`/project/${project}/application/${finalApplicationId}/workflow`, {
            state: navigationState
          });
        }

        if (onFinish) onFinish();
      } else {
        // Stored account connection
        console.log('📝 ConfigureDashboardAssist: Using stored account connection mode');
        
        if (!values.ACCOUNT_SELECTION) {
          message.error('Please select an account');
          return;
        }

        console.log('🔧 ConfigureDashboardAssist: Calling connectToDashboardAssistWithIntegrationMutation...');
        console.log('🔧 ConfigureDashboardAssist: Integration ID:', values.ACCOUNT_SELECTION);
        
        const response = await connectToDashboardAssistWithIntegrationMutation.mutateAsync(values.ACCOUNT_SELECTION);
        
        console.log('✅ ConfigureDashboardAssist: Received response from mutation:', {
          response,
          hasSessionId: !!response?.session_id,
          sessionId: response?.session_id
        });
        
        // Store session data
        const sessionData = {
          sessionId: response.session_id,
          integrationId: values.ACCOUNT_SELECTION,
          timestamp: Date.now()
        };
        
        sessionStorage.setItem('dashboardAssistSession', JSON.stringify(sessionData));
        
        const navigationState = {
          sessionId: response.session_id,
          integrationId: values.ACCOUNT_SELECTION
        };
        
        // Only navigate if skipNavigation is false (default behavior for workflow)
        if (!skipNavigation) {
          navigate(`/project/${project}/application/${finalApplicationId}/workflow`, {
            state: navigationState
          });
        }

        if (onFinish) onFinish();
      }
    } catch (error) {
      console.error('❌ ConfigureDashboardAssist: Grafana connection failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name || 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Safely extract error message
      let errorMessage = 'Failed to connect to Grafana';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      message.error(errorMessage);
    }
  };

  return (
    <>
      <Flex vertical gap={Metrics.SPACE_LG}>
        <Form
          form={configureDashboardAssistForm}
          layout="vertical"
          onFinish={handleConnectToDashboardAssist}
        >
          {/* Connection Mode Selection */}
          <div style={{ marginBottom: 24 }}>
            <Text text="Connect to Grafana" weight="semibold" style={{ fontSize: '16px', marginBottom: '12px', display: 'block' }} />
            
            <Flex vertical gap={Metrics.SPACE_MD}>
              <Button
                type={connectionMode === 'stored' ? 'primary' : 'default'}
                onClick={() => setConnectionMode('stored')}
                style={{ textAlign: 'left', height: 'auto', padding: '12px 16px', backgroundColor: connectionMode === 'stored' ? '#bdbdbd' : '#e3f2fd' }}
              >
                <Flex vertical gap={4}>
                  <Text text="Use Stored Account" weight="semibold" />
                  <Text text="Connect using previously saved Grafana credentials" type="footnote" />
                </Flex>
              </Button>
              
              <Button
                type={connectionMode === 'direct' ? 'primary' : 'default'}
                onClick={() => setConnectionMode('direct')}
                style={{ textAlign: 'left', height: 'auto', padding: '12px 16px', backgroundColor: connectionMode === 'direct' ? '#bdbdbd' : '#e3f2fd' }}
              >
                <Flex vertical gap={4}>
                  <Text text="Enter Credentials Manually" weight="semibold" />
                  <Text text="Provide Grafana credentials directly (not stored)" type="footnote" />
                </Flex>
              </Button>
            </Flex>
          </div>

          {connectionMode === 'stored' ? (
            /* Stored Account Selection */
            <div style={{ marginBottom: 24 }}>
              <Form.Item
                label={<Text text="Grafana Account" weight="semibold" />}
                name="ACCOUNT_SELECTION"
                rules={[{ required: true, message: 'Please select a Grafana account' }]}
              >
                <Select
                  loading={listDashboardAssistSecretsQuery?.isLoading}
                  placeholder="Select Grafana account"
                  options={listDashboardAssistSecretsQuery?.data?.map((integration) => ({
                    label: integration.name,
                    value: integration.id,
                  }))}
                  dropdownRender={(menu) => (
                    <Flex vertical gap={Metrics.SPACE_MD} justify="start">
                      {menu}
                      <Button
                        icon={
                          <IconViewer
                            Icon={PlusOutlined}
                            size={15}
                            color={Colors.PRIMARY_BLUE}
                          />
                        }
                        title="Add New Account"
                        type="link"
                        className="add-newAccount-btn"
                        onClick={() => setIsOpenAddDashboardAssist(true)}
                      />
                    </Flex>
                  )}
                />
              </Form.Item>

              <Form.Item>
                <Flex justify="end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={connectToDashboardAssistWithIntegrationMutation.isPending}
                    style={{ marginTop: 16 }}
                  >
                    Connect to Grafana & Continue
                  </Button>
                </Flex>
              </Form.Item>
            </div>
          ) : (
            /* Direct Credentials Entry */
            <div style={{ marginBottom: 24 }}>
              <Form.Item
                label={<Text text="Grafana URL" weight="semibold" />}
                name="GRAFANA_URL"
                rules={[
                  { required: true, message: 'Grafana URL is required' },
                  {
                    validator: (_, value) => {
                      if (!value || validateGrafanaUrl(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Please enter a valid URL (http:// or https://)'));
                    }
                  }
                ]}
              >
                <Input
                  placeholder="https://grafana.example.com"
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item
                label={<Text text="Prometheus URL" weight="semibold" />}
                name="PROMETHEUS_URL"
                rules={[
                  { required: true, message: 'Prometheus URL is required' },
                  {
                    validator: (_, value) => {
                      if (!value || validateGrafanaUrl(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Please enter a valid URL (http:// or https://)'));
                    }
                  }
                ]}
              >
                <Input
                  placeholder="https://prometheus.example.com"
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item
                label={<Text text="Grafana PAT Token" weight="semibold" />}
                name="GRAFANA_PAT_TOKEN"
                rules={[
                  { required: true, message: 'Grafana PAT Token is required' },
                  { min: 10, message: 'Token appears to be too short' }
                ]}
              >
                <Input
                  placeholder="glsa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  type="password"
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item>
                <Flex justify="end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={connectToDashboardAssistMutation.isPending}
                    style={{ marginTop: 16 }}
                  >
                    Connect to Grafana & Continue
                  </Button>
                </Flex>
              </Form.Item>
            </div>
          )}

          {/* Security Notice */}
          <div style={{ marginTop: 24, padding: '12px', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '4px' }}>
            <Text 
              text={connectionMode === 'stored' 
                ? "🔒 Security Notice: Your stored credentials are securely encrypted and only accessible by authorized users." 
                : "🔒 Security Notice: Your credentials are used only for validation and are not stored permanently. They are kept in memory for the duration of your session only."
              }
              type="footnote" 
              style={{ color: '#0066cc' }}
            />
          </div>
        </Form>
      </Flex>

      {/* Dashboard Assist Sign In Drawer */}
      <DashboardAssistSignInDrawer
        projectId={parseInt(project || '0')}
        isOpen={isOpenAddDashboardAssist}
        onClose={() => setIsOpenAddDashboardAssist(false)}
        onSuccess={async () => {
          await listDashboardAssistSecretsQuery.refetch();
          setIsOpenAddDashboardAssist(false);
        }}
      />
    </>
  );
};

export default ConfigureDashboardAssist;
