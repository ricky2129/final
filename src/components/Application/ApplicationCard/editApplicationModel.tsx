import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Radio, Button, message } from "antd";
import useApplicationService from "services/application.service";

const EditApplicationModal = ({ visible, onCancel, onSuccess, application }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const { updateApplication } = useApplicationService();

  useEffect(() => {
    if (visible && application) {
      form.setFieldsValue({
        name: application.name || "", // Ensure name is set
        description: application.description || "", // Ensure description is set
        visibility:
          application.visibility?.toLowerCase() === "internal"
            ? "internal"
            : "private",
      });
    }
  }, [visible, application, form]);

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      await updateApplication(application.id.toString(), {
        name: values.name,
        description: values.description,
        visibility: values.visibility,
      });
      setSubmitting(false);
      message.success("Application updated successfully");

      // Compose the updated application object for immediate UI update
      const updatedApplication = {
        ...application,
        name: values.name,
        description: values.description,
        visibility: values.visibility,
      };

      if (onSuccess) onSuccess(updatedApplication);
    } catch (error) {
      setSubmitting(false);
      message.error("Failed to update application");
    }
  };

  return (
    <Modal
      title="Edit Application"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter application name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter application description" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Visibility"
          name="visibility"
          rules={[{ required: true, message: "Please select visibility" }]}
        >
          <Radio.Group>
            <Radio value="internal">Internal</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting} block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditApplicationModal;
