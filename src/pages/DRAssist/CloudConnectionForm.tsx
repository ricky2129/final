import React, { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";

interface CloudConnectionFormProps {
  onSuccess: (details: any) => void;
  existingConnection?: any;
}

export const CloudConnectionForm: React.FC<CloudConnectionFormProps> = ({
  onSuccess,
  existingConnection,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);

    try {
      // No validation - just pass the OpenAI key to next step
      message.success("Ready to analyze! Please proceed to upload files.");

      onSuccess({
        openai_api_key: values.openai_api_key,
      });
    } catch (error: any) {
      message.error("Failed to proceed");
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
        initialValues={existingConnection}
      >
        <Form.Item
          label="OpenAI API Key"
          name="openai_api_key"
          rules={[{ required: true, message: "Please enter OpenAI API key" }]}
        >
          <Input.Password size="large" placeholder="Enter OpenAI API key (sk-...)" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
          >
            Continue to Upload Files
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
