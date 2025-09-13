import { useEffect, useState } from "react";
import {
  useGetAWSIntegrationsByProjectId,
<<<<<<< HEAD
  useGetGithubIntegrationsByProjectId,
  useGetGremlinIntegrationsByProjectId,
  useGetSecretValues,
} from "react-query";

import { LinkOutlined } from "@ant-design/icons";
import { Flex, message } from "antd";
=======
  useGetSecretValues,
} from "react-query";
import { LinkOutlined } from "@ant-design/icons";
import { Flex, message, Form } from "antd";
>>>>>>> f0ce0ac (das)
import {
  CloudSignInFormField,
  GremlinSignInFormFields,
  RepositorySignInFormFields,
  SecretResponse,
} from "interfaces";
<<<<<<< HEAD

import { CloudConnection, CodeRepositories } from "assets";

import {
  CloudSignInDrawer,
=======
import { CloudConnection, CodeRepositories, SLOSLIIcon } from "assets";
import {
  CloudSignInDrawer,
  Drawer,
>>>>>>> f0ce0ac (das)
  GremlinSignInDrawer,
  IntegrationManager,
  RepositorySignInDrawer,
} from "components";
<<<<<<< HEAD

import { useCreateProject } from "context";

import { Metrics } from "themes";

import SloSliDrawer from "components/Integrations/SloSliDrawer/SloSliDrawer";
interface IntegrationProps {
  project_id: number;
  setShowSkipBtn: (value: boolean) => void;
  setDisabledNext: (boolean) => void;
}

const Integrations: React.FC<IntegrationProps> = ({
  setShowSkipBtn,
  setDisabledNext,
}) => {
  const [isOpenAwsDrawer, setIsOpenAwsDrawer] = useState<boolean>(false);
  const [isOpenGithubDrawer, setIsOpenGithubDrawer] = useState<boolean>(false);
  const [isOpenGremlinDrawer, setIsOpenGremlinDrawer] = useState<boolean>(false);
  const [isOpenSloSliDrawer, setIsOpenSloSliDrawer] = useState<boolean>(false);
  const [sloSliDrawerType, setSloSliDrawerType] = useState<"add" | "edit">("add");
 
 
  const [cloudDrawerType, setCloudDrawerType] = useState<"add" | "edit">("add");
  useState<CloudSignInFormField>(null);

  const [repoDrawerType, setRepoDrawerType] = useState<"add" | "edit">("add");
  const [gremlinDrawerType, setGremlinDrawerType] = useState<"add" | "edit">("add");
 
  const [initialCloudValues, setInitialCloudValues] = useState<CloudSignInFormField>(null);
  const [initialRepoValues, setInitialRepoValues] = useState<RepositorySignInFormFields>(null);
  const [initialGremlinValues, setInitialGremlinValues] = useState<GremlinSignInFormFields>(null);
 
  const { projectId } = useCreateProject();
 
  const awsIntegrationQuery = useGetAWSIntegrationsByProjectId(projectId);
  const githubIntegrationQuery = useGetGithubIntegrationsByProjectId(projectId);
  const gremlinIntegrationQuery = useGetGremlinIntegrationsByProjectId(projectId);
 
  const getSecretValues = useGetSecretValues();
 
  const [messageApi, contextHolder] = message.useMessage();
 
=======
import { useCreateProject } from "context";
import { Metrics } from "themes";
import SloSliDrawer from "components/Integrations/SloSliDrawer/SloSliDrawer";
import { ConfigureToilAssist } from "components/ConfigureToilAssist";
import ConfigureGrafanaIntegration from "components/Integrations/GrafanaIntegration/GrafanaIntegration";
import ConfigurePrometheusIntegration from "components/Integrations/PromethuesIntegration/PromethuesIntegration";

interface IntegrationProps {
  project_id?: number | string;
  setShowSkipBtn: (value: boolean) => void;
  setDisabledNext: (value: boolean) => void;
  onSubmit?: () => void;
}

const Integrations: React.FC<IntegrationProps> = ({
  project_id,
  setShowSkipBtn,
  setDisabledNext,
  onSubmit,
}) => {
  const { projectId: contextProjectId } = useCreateProject();
  const effectiveProjectId = project_id ?? contextProjectId;
  const numericProjectId =
    typeof effectiveProjectId === "number"
      ? effectiveProjectId
      : parseInt(effectiveProjectId as string, 10);

  // Integration queries (assuming type param: 1=AWS, 2=GitHub, 3=Gremlin)
  const awsIntegrationQuery = useGetAWSIntegrationsByProjectId(
    numericProjectId.toString(),
    1
  );
  const githubIntegrationQuery = useGetAWSIntegrationsByProjectId(
    numericProjectId.toString(),
    2
  );
  const gremlinIntegrationQuery = useGetAWSIntegrationsByProjectId(
    numericProjectId.toString(),
    3
  );

  const getSecretValues = useGetSecretValues();

  const [isOpenAwsDrawer, setIsOpenAwsDrawer] = useState(false);
  const [isOpenGithubDrawer, setIsOpenGithubDrawer] = useState(false);
  const [isOpenGremlinDrawer, setIsOpenGremlinDrawer] = useState(false);
  const [isOpenSloSliDrawer, setIsOpenSloSliDrawer] = useState(false);

  const [sloSliDrawerType, setSloSliDrawerType] = useState<"add" | "edit">("add");
  const [cloudDrawerType, setCloudDrawerType] = useState<"add" | "edit">("add");
  const [repoDrawerType, setRepoDrawerType] = useState<"add" | "edit">("add");
  const [gremlinDrawerType, setGremlinDrawerType] = useState<"add" | "edit">("add");

  const [initialCloudValues, setInitialCloudValues] = useState<CloudSignInFormField>(null);
  const [initialRepoValues, setInitialRepoValues] = useState<RepositorySignInFormFields>(null);
  const [initialGremlinValues, setInitialGremlinValues] = useState<GremlinSignInFormFields>(null);

  const [isOpenJiraDrawer, setIsOpenJiraDrawer] = useState(false);
  const [configureJiraForm] = Form.useForm();
  const [disabledJiraSave, setDisabledJiraSave] = useState(false);

  const [isOpenGrafanaDrawer, setIsOpenGrafanaDrawer] = useState(false);
  const [configureGrafanaForm] = Form.useForm();
  const [disabledGrafanaSave, setDisabledGrafanaSave] = useState(false);

  const [isOpenPrometheusDrawer, setIsOpenPrometheusDrawer] = useState(false);
  const [configurePrometheusForm] = Form.useForm();
  const [disabledPrometheusSave, setDisabledPrometheusSave] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

>>>>>>> f0ce0ac (das)
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Error: Something went wrong",
    });
  };
<<<<<<< HEAD
 
  useEffect(() => {
    setShowSkipBtn(
      !(
        awsIntegrationQuery?.data?.length > 0 ||
        githubIntegrationQuery?.data?.length > 0 ||
        gremlinIntegrationQuery?.data?.length > 0
      ),
    );
    setDisabledNext(
      !(
        awsIntegrationQuery?.data?.length > 0 ||
        githubIntegrationQuery?.data?.length > 0 ||
        gremlinIntegrationQuery?.data?.length > 0
      ),
    );
=======

  useEffect(() => {
    const hasAnyIntegration =
      (awsIntegrationQuery?.data?.length ?? 0) > 0 ||
      (githubIntegrationQuery?.data?.length ?? 0) > 0 ||
      (gremlinIntegrationQuery?.data?.length ?? 0) > 0;
    setShowSkipBtn(!hasAnyIntegration);
    setDisabledNext(!hasAnyIntegration);
>>>>>>> f0ce0ac (das)
  }, [
    awsIntegrationQuery?.data,
    githubIntegrationQuery?.data,
    gremlinIntegrationQuery?.data,
    setShowSkipBtn,
    setDisabledNext,
  ]);
<<<<<<< HEAD

=======
  
>>>>>>> f0ce0ac (das)
  /**
   * Handles cloud edit button click.
   * Fetches the secret values for the given integration id and
   * opens the cloud sign in drawer with the edit type and the
   * fetched values.
   * @param {number} id - The integration id to fetch the secret values for.
   * @param {SecretResponse} record - The cloud secret record to edit.
   */
  const handleCloudEdit = async (id: number, record: SecretResponse) => {
    try {
      const data = await getSecretValues.mutateAsync(id?.toString());
<<<<<<< HEAD
      
=======

>>>>>>> f0ce0ac (das)
      if (
        "AWS_SECRET_ACCESS_KEY" in data &&
        "AWS_ACCESS_KEY_ID" in data &&
        "AWS_DEFAULT_REGION" in data
      ) {
        setInitialCloudValues({
          integration_id: id,
          secret_name: record?.name,
          access: record?.access,
          user_access_key: data.AWS_ACCESS_KEY_ID,
          region: data.AWS_DEFAULT_REGION,
          user_secret_key: data.AWS_SECRET_ACCESS_KEY,
          tags: [],
        });
        setCloudDrawerType("edit");
        setIsOpenAwsDrawer(true);
      } else {
        error();
        console.error("Invalid response type");
      }
    } catch (err) {
      error();
      console.error(err);
    }
  };

  const handleRepoEdit = async (id: number, record: SecretResponse) => {
    try {
      const data = await getSecretValues.mutateAsync(id?.toString());
      if ("username" in data && "token" in data && "repo_url" in data) {
        setInitialRepoValues({
          integration_id: id.toString(),
          user_name: data?.username?.toString(),
          repository_url: data?.repo_url?.toString(),
          token: data?.token?.toString(),
          access: record.access,
          tags: [],
          secret_name: record.name,
        });
        setRepoDrawerType("edit");
        setIsOpenGithubDrawer(true);
      } else {
        error();
        console.error("Invalid response type");
      }
    } catch (err) {
<<<<<<< HEAD
      console.error(err);
      error();
    }
  };
 
=======
      error();
      console.error(err);
    }
  };

>>>>>>> f0ce0ac (das)
  const handleGremlinEdit = async (id: number, record: SecretResponse) => {
    try {
      const data = await getSecretValues.mutateAsync(id?.toString());
      if ("apikey" in data) {
        setInitialGremlinValues({
          integration_id: id,
          gremlin_access_key: data?.apikey?.toString(),
          access: record.access,
          tags: [],
          name: record.name,
        });
        setGremlinDrawerType("edit");
        setIsOpenGremlinDrawer(true);
      } else {
        error();
        console.error("Invalid response type");
      }
    } catch (err) {
<<<<<<< HEAD
      console.error(err);
      error();
    }
  };
 
=======
      error();
      console.error(err);
    }
  };

>>>>>>> f0ce0ac (das)
  const handleSloSliAddNew = () => {
    setSloSliDrawerType("add");
    setIsOpenSloSliDrawer(true);
  };
<<<<<<< HEAD
 
=======

>>>>>>> f0ce0ac (das)
  const handleSloSliEdit = async (id: number, record: SecretResponse) => {
    try {
      const data = await getSecretValues.mutateAsync(id?.toString());
      if (
        "grafana_url" in data &&
        "graf_pat" in data &&
        "release_namespace" in data &&
        "release_name" in data &&
        "name" in record
      ) {
        setSloSliDrawerType("edit");
        setIsOpenSloSliDrawer(true);
      } else {
        error();
        console.error("Invalid response type for SLO/SLI");
      }
    } catch (err) {
      error();
      console.error(err);
    }
  };
<<<<<<< HEAD
 
=======

>>>>>>> f0ce0ac (das)
  return (
    <Flex vertical gap={Metrics.SPACE_SM}>
      {contextHolder}
      <IntegrationManager
        name="Cloud Connections"
        icon={CloudConnection}
<<<<<<< HEAD
        integrations={awsIntegrationQuery?.data}
=======
        integrations={awsIntegrationQuery?.data ?? []}
>>>>>>> f0ce0ac (das)
        onClickAddNew={() => {
          setCloudDrawerType("add");
          setIsOpenAwsDrawer(true);
          setInitialCloudValues(null);
        }}
        addNewText="Connection"
        onEdit={handleCloudEdit}
        onDelete={() => {}}
        disableAction={getSecretValues?.isLoading}
        multipleConnect
      />
      <IntegrationManager
        name="Code Repositories"
        icon={CodeRepositories}
<<<<<<< HEAD
        integrations={githubIntegrationQuery?.data}
=======
        integrations={githubIntegrationQuery?.data ?? []}
>>>>>>> f0ce0ac (das)
        onClickAddNew={() => {
          setIsOpenGithubDrawer(true);
          setInitialRepoValues(null);
          setRepoDrawerType("add");
        }}
        multipleConnect
        disableAction={getSecretValues?.isLoading}
        onEdit={handleRepoEdit}
        onDelete={() => {}}
        addNewText="Repository"
      />
      <IntegrationManager
        name="Gremlin Connection"
        icon={LinkOutlined}
<<<<<<< HEAD
        integrations={gremlinIntegrationQuery?.data}
        onClickAddNew={() => setIsOpenGremlinDrawer(true)}
=======
        integrations={gremlinIntegrationQuery?.data ?? []}
        onClickAddNew={() => {
          setIsOpenGremlinDrawer(true);
          setInitialGremlinValues(null);
        }}
>>>>>>> f0ce0ac (das)
        multipleConnect
        onDelete={() => {}}
        onEdit={handleGremlinEdit}
        disableAction={getSecretValues?.isLoading}
        addNewText="Gremlin Account"
      />
      <IntegrationManager
        name="SLO/SLI Connection"
<<<<<<< HEAD
        icon={LinkOutlined}
=======
        icon={SLOSLIIcon}
>>>>>>> f0ce0ac (das)
        integrations={[]}
        onClickAddNew={handleSloSliAddNew}
        multipleConnect
        onDelete={() => {}}
        onEdit={handleSloSliEdit}
        disableAction={false}
        addNewText="SLO Connection"
      />
<<<<<<< HEAD
 
      <CloudSignInDrawer
        initalValues={initialCloudValues}
        projectId={parseInt(projectId)}
=======

      <IntegrationManager
        name="Jira Connection"
        icon={LinkOutlined}
        integrations={[]}
        onClickAddNew={() => {
          configureJiraForm.resetFields();
          setIsOpenJiraDrawer(true);
        }}
        addNewText="Jira Connection"
        onEdit={() => {
          configureJiraForm.resetFields();
          setIsOpenJiraDrawer(true);
        }}
        onDelete={() => {}}
        disableAction={false}
        multipleConnect
      />

      <IntegrationManager
        name="Grafana Connection"
        icon={LinkOutlined}
        integrations={[]}
        onClickAddNew={() => {
          configureGrafanaForm.resetFields();
          setIsOpenGrafanaDrawer(true);
        }}
        addNewText="Grafana Connection"
        onEdit={() => {
          configureGrafanaForm.resetFields();
          setIsOpenGrafanaDrawer(true);
        }}
        onDelete={() => {}}
        disableAction={false}
        multipleConnect
      />
      <IntegrationManager
        name="Prometheus Connection"
        icon={LinkOutlined}
        integrations={[]}
        onClickAddNew={() => {
          configurePrometheusForm.resetFields();
          setIsOpenPrometheusDrawer(true);
        }}
        addNewText="Prometheus Connection"
        onEdit={() => {
          configurePrometheusForm.resetFields();
          setIsOpenPrometheusDrawer(true);
        }}
        onDelete={() => {}}
        disableAction={false}
        multipleConnect
      />

      <CloudSignInDrawer
        initalValues={initialCloudValues}
        projectId={numericProjectId}
>>>>>>> f0ce0ac (das)
        onClose={() => setIsOpenAwsDrawer(false)}
        isOpen={isOpenAwsDrawer}
        onSuccess={async () => {
          await awsIntegrationQuery.refetch();
          setIsOpenAwsDrawer(false);
<<<<<<< HEAD
        }}
        type={cloudDrawerType}
      />
 
      <RepositorySignInDrawer
        projectId={parseInt(projectId)}
=======
          if (onSubmit) await onSubmit();
        }}
        type={cloudDrawerType}
      />

      <RepositorySignInDrawer
        projectId={numericProjectId}
>>>>>>> f0ce0ac (das)
        onClose={() => setIsOpenGithubDrawer(false)}
        isOpen={isOpenGithubDrawer}
        onSuccess={async () => {
          await githubIntegrationQuery.refetch();
          setIsOpenGithubDrawer(false);
<<<<<<< HEAD
        }}
        initalValues={initialRepoValues}
        type={repoDrawerType}
      />
 
      <GremlinSignInDrawer
        projectId={parseInt(projectId)}
=======
          if (onSubmit) await onSubmit();
        }}
                initalValues={initialRepoValues}
        type={repoDrawerType}
      />

      <GremlinSignInDrawer
        projectId={numericProjectId}
>>>>>>> f0ce0ac (das)
        onClose={() => setIsOpenGremlinDrawer(false)}
        isOpen={isOpenGremlinDrawer}
        onSuccess={async () => {
          await gremlinIntegrationQuery.refetch();
          setIsOpenGremlinDrawer(false);
<<<<<<< HEAD
=======
          if (onSubmit) await onSubmit();
>>>>>>> f0ce0ac (das)
        }}
        type={gremlinDrawerType}
        initalValues={initialGremlinValues}
      />
<<<<<<< HEAD
 
      <SloSliDrawer
        projectId={parseInt(projectId)}
        onClose={() => setIsOpenSloSliDrawer(false)}
        isOpen={isOpenSloSliDrawer}
        onSuccess={async () => {
        setIsOpenSloSliDrawer(false);
        }}
        type={sloSliDrawerType}
      />
    </Flex>
  );
};
 
=======

      <SloSliDrawer
        projectId={numericProjectId}
        onClose={() => setIsOpenSloSliDrawer(false)}
        isOpen={isOpenSloSliDrawer}
        onSuccess={async () => {
          setIsOpenSloSliDrawer(false);
          if (onSubmit) await onSubmit();
        }}
        type={sloSliDrawerType}
      /> 
      <Drawer
        title="Configure Jira Connection"
        open={isOpenJiraDrawer}
        onClose={() => setIsOpenJiraDrawer(false)}
        onSubmit={() => setIsOpenJiraDrawer(false)}
        onCancel={() => setIsOpenJiraDrawer(false)}
        disabled={disabledJiraSave}
        loading={false}
      >
        <ConfigureToilAssist
          setDisabledSave={setDisabledJiraSave}
          configureToilAssistForm={configureJiraForm}
        />
      </Drawer>

     
      <Drawer
        title="Configure Grafana Connection"
        open={isOpenGrafanaDrawer}
        onClose={() => setIsOpenGrafanaDrawer(false)}
        onSubmit={() => setIsOpenGrafanaDrawer(false)}
        onCancel={() => setIsOpenGrafanaDrawer(false)}
        disabled={disabledGrafanaSave}
        loading={false}
      >
        <ConfigureGrafanaIntegration
          setDisabledSave={setDisabledGrafanaSave}
          configureGrafanaForm={configureGrafanaForm}
        />
      </Drawer>

      <Drawer
        title="Configure Prometheus Connection"
        open={isOpenPrometheusDrawer}
        onClose={() => setIsOpenPrometheusDrawer(false)}
        onSubmit={() => setIsOpenPrometheusDrawer(false)}
        onCancel={() => setIsOpenPrometheusDrawer(false)}
        disabled={disabledPrometheusSave}
        loading={false}
      >
        <ConfigurePrometheusIntegration
          setDisabledSave={setDisabledPrometheusSave}
          configurePrometheusForm={configurePrometheusForm}
        />
      </Drawer>
    </Flex>
  );
};

>>>>>>> f0ce0ac (das)
export default Integrations;