 import React, { useState, useMemo } from 'react';
import { Button, Table, Flex, Modal, Alert, Spin, Popconfirm, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAWSIntegrationsByProjectId } from 'react-query/integrationQueries';
import { useGetProjectSLO } from 'react-query/sloQueries';
import { useDeleteIntegration } from 'react-query/integrationQueries';
import './integrations.styles.scss';
import Integrations from '../../components/CreateProject/Integrations/Integrations';
 
const INTEGRATION_TYPES = [
  { id: 1, label: 'Cloud Connections', infraId: 1 },
  { id: 2, label: 'Code Repositories', infraId: 2 },
  { id: 3, label: 'Gremlin', infraId: 3 },
  { id: 4, label: 'SLO/SLI', infraId: 4 },
];
 
interface SecretResponse {
  name: string;
  infrastructure_id: number;
  id: number | string;
  project_id: number;
  deleted_at: string | null;
  secret_manager_key: string;
  org_id: number;
  access: string;
  created_at: string;
  updated_at: string;
}
 
interface SLOResponse {
  name: string;
  id: number;
  project_id: number;
  created_at: string;
  updated_at: string;
}
 
interface ProjectIntegrationsProps {
  projectId: number;
}
 
export const ProjectIntegrations: React.FC<ProjectIntegrationsProps> = ({ projectId }) => {
  const awsIntegrations = useGetAWSIntegrationsByProjectId(String(projectId), 1);
  const repoIntegrations = useGetAWSIntegrationsByProjectId(String(projectId), 2);
  const gremlinIntegrations = useGetAWSIntegrationsByProjectId(String(projectId), 3);
  const { data: sloData, isLoading: sloLoading, isError: sloError, refetch: refetchSLO } = useGetProjectSLO(projectId);
  const { mutateAsync: deleteIntegration, isLoading: isDeleteLoading } = useDeleteIntegration();
 
  const allIntegrations = useMemo(() => {
    const combine = (data: SecretResponse[] | undefined, typeId: number) =>
      (data || []).map(integration => ({
        ...integration,
        type_id: typeId,
      }));
 
    const integrations = [
      ...combine(awsIntegrations.data, 1),
      ...combine(repoIntegrations.data, 2),
      ...combine(gremlinIntegrations.data, 3),
    ];
 
    if (sloData && typeof sloData === 'object' && 'id' in sloData && 'name' in sloData) {
      integrations.push({
        id: sloData.id,
        name: sloData.name ?? 'N/A',
        infrastructure_id: 4,
        type_id: 4,
        project_id: sloData.project_id ?? projectId,
        deleted_at: null,
        secret_manager_key: '',
        org_id: 0,
        access: '-',
        created_at: sloData.created_at ?? '',
        updated_at: sloData.updated_at ?? '',
      });
    }
 
    return integrations;
  }, [
    awsIntegrations.data,
    repoIntegrations.data,
    gremlinIntegrations.data,
    sloData,
    projectId,
  ]);

  const isLoading =
    awsIntegrations.isLoading ||
    repoIntegrations.isLoading ||
    gremlinIntegrations.isLoading ||
    sloLoading ||
    isDeleteLoading;
 
  const isError =
    awsIntegrations.isError ||
    repoIntegrations.isError ||
    gremlinIntegrations.isError ||
    sloError;
 
  const refetchAll = async () => {
    await awsIntegrations.refetch();
    await repoIntegrations.refetch();
    await gremlinIntegrations.refetch();
    await refetchSLO();
  };
 
  const [isAddModalOpen, setAddModalOpen] = useState(false);
 
  const handleOpenAddIntegration = () => {
    setAddModalOpen(true);
  };
 
  const handleCloseAddIntegration = () => {
    setAddModalOpen(false);
  };
 
  const setShowSkipBtn = (_: boolean) => {};
  const setDisabledNext = (_: boolean) => {};
 
  const handleSubmitIntegration = async () => {
    await refetchAll();
    setAddModalOpen(false);
  };
 

  const handleDeleteIntegration = async (integrationId: number | string) => {
    try {
      await deleteIntegration(String(integrationId));
      message.success('Integration deleted successfully');
      await refetchAll();
    } catch (error) {
      message.error('Failed to delete integration');
    }
  };
 
  const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (_: any, integration: any) => integration.name,
  },
  {
    title: 'Connection Type',
    dataIndex: 'type_id',
    key: 'type_id',
    render: (_: any, integration: any) =>
      INTEGRATION_TYPES.find(t => t.id === integration.type_id)?.label || 'Unknown',
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (date: string, integration: any) =>
      integration.created_at ? new Date(integration.created_at).toLocaleString() : '-',
  },
  {
    title: 'Access',
    dataIndex: 'access',
    key: 'access',
    render: (_: any, integration: any) => integration.access || '-',
  },
  {
    title: 'Delete',
    key: 'delete',
    align: 'center',
    render: (_: any, integration: any) => (
      <Popconfirm
        title="Are you sure to delete this integration?"
        onConfirm={() => handleDeleteIntegration(integration.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="text"
          icon={
            <DeleteOutlined
              style={{
                color: '#222', 
                fontSize: 18,
              }}
            />
          }
          loading={isDeleteLoading}
          disabled={isDeleteLoading}
        />
      </Popconfirm>
    ),
  },
];
 
  return (
    <div className="project-integrations">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="project-integrations__title">Project Integrations</h2>
        <Flex className="landing-add-integrations-controls" align="center">
          <Flex style={{ marginLeft: "auto" }} align="center" gap={16}>
            <Button
              size="middle"
              title="Add Integration"
              type="primary"
              icon={<PlusOutlined />}
              className="add-integrations-btn"
              onClick={handleOpenAddIntegration}
            >
              Add Integration
            </Button>
          </Flex>
        </Flex>
      </div>
 
      {sloLoading && <Spin style={{ marginTop: 16 }} />}
      {sloError && (
        <Alert
          type="error"
          message="Error loading SLO details."
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {isLoading && <Spin style={{ marginTop: 16 }} />}
      {isError && (
        <div className="project-integrations__error">
          <Alert type="error" message="Error loading integrations or SLO." showIcon />
          <Button danger size="small" onClick={() => refetchAll()} style={{ marginLeft: 10 }}>
            Retry
          </Button>
        </div>
      )}
 
      <Table
        className="project-integrations__table"
        columns={columns}
        dataSource={allIntegrations}
        rowKey="id"
        pagination={false}
        loading={isLoading}
        locale={{
          emptyText: <div className="project-integrations__empty">No integrations found.</div>,
        }}
        style={{ marginTop: 16 }}
      />
 
      <Modal
        open={isAddModalOpen}
        onCancel={handleCloseAddIntegration}
        footer={null}
        title="Add Integration"
        destroyOnClose
        width={900}
      >
        <Integrations
          project_id={projectId}
          setShowSkipBtn={setShowSkipBtn}
          setDisabledNext={setDisabledNext}
          onSubmit={handleSubmitIntegration}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <Button onClick={handleCloseAddIntegration}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};
 
export default ProjectIntegrations;
 
 