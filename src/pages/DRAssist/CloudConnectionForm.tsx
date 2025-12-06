import React, { useState } from "react";
import { Button, Card, Form, Input, Select, Space, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

interface CloudConnectionFormProps {
  onSuccess: (details: any) => void;
  existingConnection?: any;
}

interface CloudTag {
  key: string;
  value: string;
}

export const CloudConnectionForm: React.FC<CloudConnectionFormProps> = ({
  onSuccess,
  existingConnection,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<CloudTag[]>(existingConnection?.tags || []);

  const cloudProviders = [
    { value: "aws", label: "Amazon Web Services (AWS)" },
    { value: "azure", label: "Microsoft Azure" },
    { value: "gcp", label: "Google Cloud Platform (GCP)" },
  ];

  const awsRegions = [
    { value: "us-east-1", label: "US East (N. Virginia) - us-east-1" },
    { value: "us-east-2", label: "US East (Ohio) - us-east-2" },
    { value: "us-west-1", label: "US West (N. California) - us-west-1" },
    { value: "us-west-2", label: "US West (Oregon) - us-west-2" },
    { value: "eu-west-1", label: "Europe (Ireland) - eu-west-1" },
    { value: "eu-central-1", label: "Europe (Frankfurt) - eu-central-1" },
    { value: "ap-south-1", label: "Asia Pacific (Mumbai) - ap-south-1" },
    { value: "ap-southeast-1", label: "Asia Pacific (Singapore) - ap-southeast-1" },
  ];

  const handleAddTag = () => {
    setTags([...tags, { key: "", value: "" }]);
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, field: "key" | "value", value: string) => {
    const newTags = [...tags];
    newTags[index][field] = value;
    setTags(newTags);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      const validTags = tags.filter(t => t.key && t.value);

      // Save connection details and move to next step
      message.success("Cloud provider details saved! Please proceed to upload files.");

      onSuccess({
        cloud_provider: values.cloud_provider,
        region: values.region,
        access_key: values.access_key,
        secret_key: values.secret_key,
        openai_api_key: values.openai_api_key,
        tags: validTags,
      });
    } catch (error: any) {
      message.error("Failed to save connection details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="cloud-connection-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={existingConnection || { cloud_provider: "aws", region: "us-east-1" }}
      >
        <Form.Item
          label="OpenAI API Key"
          name="openai_api_key"
          rules={[{ required: true, message: "Please enter OpenAI API key" }]}
        >
          <Input.Password size="large" placeholder="Enter OpenAI API key (sk-...)" />
        </Form.Item>

        <Form.Item
          label="Cloud Provider"
          name="cloud_provider"
          rules={[{ required: true, message: "Please select a cloud provider" }]}
        >
          <Select size="large" placeholder="Select cloud provider">
            {cloudProviders.map((provider) => (
              <Option key={provider.value} value={provider.value}>
                {provider.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Region"
          name="region"
          rules={[{ required: true, message: "Please select a region" }]}
        >
          <Select size="large" placeholder="Select region">
            {awsRegions.map((region) => (
              <Option key={region.value} value={region.value}>
                {region.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="AWS Access Key"
          name="access_key"
          rules={[{ required: true, message: "Please enter AWS access key" }]}
        >
          <Input size="large" placeholder="Enter AWS access key" />
        </Form.Item>

        <Form.Item
          label="AWS Secret Key"
          name="secret_key"
          rules={[{ required: true, message: "Please enter AWS secret key" }]}
        >
          <Input.Password size="large" placeholder="Enter AWS secret key" />
        </Form.Item>

        <Form.Item label="Tags (Optional)">
          <Space direction="vertical" style={{ width: "100%" }}>
            {tags.map((tag, index) => (
              <Space key={index} style={{ width: "100%", marginBottom: 8 }}>
                <Input
                  placeholder="Key"
                  value={tag.key}
                  onChange={(e) => handleTagChange(index, "key", e.target.value)}
                  style={{ width: 200 }}
                />
                <Input
                  placeholder="Value"
                  value={tag.value}
                  onChange={(e) => handleTagChange(index, "value", e.target.value)}
                  style={{ width: 200 }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveTag(index)}
                />
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={handleAddTag}
              icon={<PlusOutlined />}
              style={{ width: "100%" }}
            >
              Add Tag
            </Button>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
          >
            Connect & Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
