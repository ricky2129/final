import { Form, FormInstance } from "antd";
import { Flex } from "antd";
import { Input, Text } from "components";
import { Metrics } from "themes";
 
const FIELD_KEYS = [
  "GRAFANA_URL",
  "GRAFANA_API_TOKEN",
  "GRAFANA_ORG",
  "GRAFANA_EMAIL",
] as const;
 
type FieldKey = typeof FIELD_KEYS[number];
 
interface ConfigureGrafanaFormField {
  GRAFANA_URL: string;
  GRAFANA_API_TOKEN: string;
  GRAFANA_ORG: string;
  GRAFANA_EMAIL: string;
}
 
const FIELD_CONSTANTS: Record<
  FieldKey,
  {
    LABEL: string;
    PLACEHOLDER: string;
    ERROR: string;
    TYPE: "text" | "email" | "password";
  }
> = {
  GRAFANA_URL: {
    LABEL: "Grafana URL",
    PLACEHOLDER: "Enter your Grafana instance URL",
    ERROR: "Grafana URL is required",
    TYPE: "text",
  },
  GRAFANA_API_TOKEN: {
    LABEL: "Grafana API Token",
    PLACEHOLDER: "Enter your Grafana API token",
    ERROR: "API token is required",
    TYPE: "password",
  },
  GRAFANA_ORG: {
    LABEL: "Grafana Organization",
    PLACEHOLDER: "Enter your Grafana organization name",
    ERROR: "Organization is required",
    TYPE: "text",
  },
  GRAFANA_EMAIL: {
    LABEL: "Grafana Email",
    PLACEHOLDER: "Enter your Grafana email",
    ERROR: "Email is required",
    TYPE: "email",
  },
};
 
interface ConfigureGrafanaProps {
  configureGrafanaForm: FormInstance<ConfigureGrafanaFormField>;
  setDisabledSave: (boolean) => void;
}
 
const urlValidator = (_: any, value: string) => {
  if (!value) return Promise.resolve();
  try {
    new URL(value);
    return Promise.resolve();
  } catch {
    return Promise.reject("Please enter a valid URL");
  }
};
 
const ConfigureGrafanaIntegration: React.FC<ConfigureGrafanaProps> = ({
  configureGrafanaForm,
  setDisabledSave,
}) => {
  const handleFormChange = () => {
    const hasErrors =
      configureGrafanaForm
        ?.getFieldsError()
        .filter(({ errors }) => errors.length).length > 0;
    setDisabledSave(hasErrors);
  };
 
  return (
    <Flex vertical gap={Metrics.SPACE_LG}>
      <Form
        form={configureGrafanaForm}
        layout="vertical"
        onFieldsChange={handleFormChange}
      >
        {FIELD_KEYS.map((key) => (
          <Form.Item<ConfigureGrafanaFormField>
            key={key}
            label={<Text text={FIELD_CONSTANTS[key].LABEL} weight="semibold" />}
            name={key}
            rules={[
              {
                required: true,
                message: FIELD_CONSTANTS[key].ERROR,
              },
              ...(key === "GRAFANA_URL"
                ? [
                    {
                      validator: urlValidator,
                    },
                  ]
                : []),
            ]}
          >
            <Input
              placeholder={FIELD_CONSTANTS[key].PLACEHOLDER}
              type={FIELD_CONSTANTS[key].TYPE}
              autoComplete="off"
            />
          </Form.Item>
        ))}
      </Form>
    </Flex>
  );
};
 
export default ConfigureGrafanaIntegration;
 
 