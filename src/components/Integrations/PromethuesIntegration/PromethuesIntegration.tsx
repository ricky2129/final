import { Form, FormInstance } from "antd";
import { Flex } from "antd";
import { Input, Text } from "components";
import { Metrics } from "themes";
 
const FIELD_KEYS = [
  "PROMETHEUS_URL",
  "PROMETHEUS_API_TOKEN",
  "PROMETHEUS_EMAIL",
] as const;
 
type FieldKey = typeof FIELD_KEYS[number];
 
interface ConfigurePrometheusFormField {
  PROMETHEUS_URL: string;
  PROMETHEUS_API_TOKEN: string;
  PROMETHEUS_EMAIL: string;
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
  PROMETHEUS_URL: {
    LABEL: "Prometheus URL",
    PLACEHOLDER: "Enter your Prometheus instance URL",
    ERROR: "Prometheus URL is required",
    TYPE: "text",
  },
  PROMETHEUS_API_TOKEN: {
    LABEL: "Prometheus API Token",
    PLACEHOLDER: "Enter your Prometheus API token",
    ERROR: "API token is required",
    TYPE: "password",
  },
  PROMETHEUS_EMAIL: {
    LABEL: "Prometheus Email",
    PLACEHOLDER: "Enter your Prometheus email",
    ERROR: "Email is required",
    TYPE: "email",
  },
};
 
interface ConfigurePrometheusProps {
  configurePrometheusForm: FormInstance<ConfigurePrometheusFormField>;
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
 
const ConfigurePrometheusIntegration: React.FC<ConfigurePrometheusProps> = ({
  configurePrometheusForm,
  setDisabledSave,
}) => {
  const handleFormChange = () => {
    const hasErrors =
      configurePrometheusForm
        ?.getFieldsError()
        .filter(({ errors }) => errors.length).length > 0;
    setDisabledSave(hasErrors);
  };
 
  return (
    <Flex vertical gap={Metrics.SPACE_LG}>
      <Form
        form={configurePrometheusForm}
        layout="vertical"
        onFieldsChange={handleFormChange}
      >
        {FIELD_KEYS.map((key) => (
          <Form.Item<ConfigurePrometheusFormField>
            key={key}
            label={<Text text={FIELD_CONSTANTS[key].LABEL} weight="semibold" />}
            name={key}
            rules={[
              {
                required: true,
                message: FIELD_CONSTANTS[key].ERROR,
              },
              ...(key === "PROMETHEUS_URL"
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
 
export default ConfigurePrometheusIntegration;
 
 