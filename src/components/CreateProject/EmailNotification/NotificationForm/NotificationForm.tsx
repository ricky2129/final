import { useRef, useState } from "react";
<<<<<<< HEAD

=======
>>>>>>> f0ce0ac (das)
import { CloseCircleFilled } from "@ant-design/icons";
import { Checkbox, Col, Flex, Form, FormInstance, Row, Tag } from "antd";
import { notificationForm } from "constant";
import { validateEmail } from "helpers";
import { EmailNotificationFormField } from "interfaces";
<<<<<<< HEAD

import { Button, IconViewer, Input, Text } from "components";

import { Colors, Metrics } from "themes";

=======
import { Button, IconViewer, Input, Text } from "components";
import { Colors, Metrics } from "themes";
>>>>>>> f0ce0ac (das)
import "../EmailNotification.styles.scss";
import "./notification.styles.scss";

interface NotificationFormType {
  initialValues?: EmailNotificationFormField;
  emailAddresses?: string[];
  setDisabledSave: (boolean) => void;
  form: FormInstance<EmailNotificationFormField>;
}

interface option {
  label: string;
  value: string;
}

const triggerOptions: Array<option> = [
<<<<<<< HEAD
  { label: "Create Portfolio", value: "createProject" },
  { label: "Delete Portfolio", value: "deleteProject" },
=======
  { label: "Create Application", value: "createApp" },
  { label: "Delete Application", value: "deleteApp" },
>>>>>>> f0ce0ac (das)
];

const NotificationForm: React.FC<NotificationFormType> = ({
  form,
  emailAddresses,
  setDisabledSave,
}) => {
  const { NOTIFICATION_NAME, EMAIL_ADDRESS, TRIGGERS } = notificationForm;
  const [inputFocus, setInputFocus] = useState(false);
  const inputRef = useRef(null);

  const [email, setEmail] = useState<string>("");
<<<<<<< HEAD
  const handleFormChange = () => {
    const hasErrors =
      form?.getFieldsError().filter(({ errors }) => errors.length).length > 0;

    setDisabledSave(hasErrors);
  };

=======

  const handleFormChange = () => {
    const hasErrors =
      form?.getFieldsError().filter(({ errors }) => errors.length).length > 0;
    setDisabledSave(hasErrors);
  };

  const addEmail = async () => {
    if (validateEmail(email)) {
      form.setFieldValue(EMAIL_ADDRESS.NAME, [...emailAddresses, email]);
      setEmail("");
      await form.validateFields([EMAIL_ADDRESS.NAME]);
    }
  };

>>>>>>> f0ce0ac (das)
  return (
    <Form form={form} layout="vertical" onFieldsChange={handleFormChange}>
      <Form.Item<EmailNotificationFormField>
        label={<Text weight="semibold" text={NOTIFICATION_NAME.LABEL} />}
        name={NOTIFICATION_NAME.NAME}
        rules={[{ required: true, message: NOTIFICATION_NAME.ERROR }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item<EmailNotificationFormField>
        label={<Text weight="semibold" text={EMAIL_ADDRESS.LABEL} />}
        name={EMAIL_ADDRESS.NAME}
        rules={[
          () => ({
            required: true,
            validator: () => {
              if (emailAddresses.length === 0) {
                return Promise.reject(EMAIL_ADDRESS.ERROR);
              }
              for (let i = 0; i < emailAddresses.length; i++) {
                if (!validateEmail(emailAddresses[i])) {
                  return Promise.reject(EMAIL_ADDRESS.INVALID_EMAIL_ERROR);
                }
              }
<<<<<<< HEAD

=======
>>>>>>> f0ce0ac (das)
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Flex
          gap={Metrics.SPACE_XXS}
          wrap
          align="end"
          className={`email-address-customInput ${inputFocus && "email-address-customInput-focus"} 
          ${form.getFieldError(EMAIL_ADDRESS.NAME).length > 0 && "email-address-customInput-error"}`}
          onClick={() => {
            inputRef?.current?.focus();
          }}
        >
<<<<<<< HEAD
          {
            <>
              {emailAddresses?.map((address, index) => (
                <Tag
                  closable={true}
                  key={index}
                  className="custom-email-tag"
                  onClose={async (e) => {
                    e.preventDefault();

                    form.setFieldValue(
                      EMAIL_ADDRESS.NAME,
                      emailAddresses?.filter((_, curIndex) => {
                        return curIndex !== index;
                      }),
                    );

                    await form.validateFields([EMAIL_ADDRESS.NAME]);
                  }}
                  closeIcon={
                    <IconViewer
                      Icon={CloseCircleFilled}
                      size={12}
                      customClass="custom-email-tag-closeIcon"
                      color={Colors.COOL_GRAY_CLOSE_ICON}
                    />
                  }
                >
                  {address}
                </Tag>
              ))}
            </>
          }
=======
          <>
            {emailAddresses?.map((address, index) => (
              <Tag
                closable={true}
                key={index}
                className="custom-email-tag"
                onClose={async (e) => {
                  e.preventDefault();
                  form.setFieldValue(
                    EMAIL_ADDRESS.NAME,
                    emailAddresses?.filter((_, curIndex) => {
                      return curIndex !== index;
                    }),
                  );
                  await form.validateFields([EMAIL_ADDRESS.NAME]);
                }}
                closeIcon={
                  <IconViewer
                    Icon={CloseCircleFilled}
                    size={12}
                    customClass="custom-email-tag-closeIcon"
                    color={Colors.COOL_GRAY_CLOSE_ICON}
                  />
                }
              >
                {address}
              </Tag>
            ))}
          </>
>>>>>>> f0ce0ac (das)
          <Input
            customRef={inputRef}
            onChange={(e) => setEmail(e.target.value?.trim())}
            onKeyDown={async (e) => {
<<<<<<< HEAD
              if (e.key === " ") {
                form.setFieldValue(EMAIL_ADDRESS.NAME, [
                  ...emailAddresses,
                  email,
                ]);
                setEmail("");
                await form.validateFields([EMAIL_ADDRESS.NAME]);
=======
              if (e.key === "Enter" || e.key === " ") {
                await addEmail();
>>>>>>> f0ce0ac (das)
              }
            }}
            value={email}
            variant="borderless"
            customClass="email-address-input"
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
          />
        </Flex>
        <Text
          type="footnote"
          weight="semibold"
          text=""
          color={Colors.COOL_GRAY_7}
        />
      </Form.Item>
      <Form.Item<EmailNotificationFormField>
        label={<Text weight="semibold" text={TRIGGERS.LABEL} />}
        name={TRIGGERS.NAME}
      >
        <Checkbox.Group className="trigger-checkbox">
          <Row>
            {triggerOptions?.map((option, index) => (
              <Col xs={24} key={index}>
                <Checkbox value={option.value}> {option.label} </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
      <Flex vertical gap={Metrics.SPACE_XS} justify="start">
        <Text weight="semibold" text="Publish" />
        {form.getFieldValue("isPublish") ? (
          <Flex gap={2} align="center">
            <Flex className="publish-text-container semibold">Published</Flex>
            <Button
              type="text"
              title="Unpublish"
              onClick={async () => {
                form.setFieldValue("isPublish", false);
                await form.validateFields(["isPublish"]);
              }}
              customClass="unpublish-button semibold"
            />
          </Flex>
        ) : (
          <Button
            type="primary"
            title="Publish"
            onClick={async () => {
              form.setFieldValue("isPublish", true);
              await form.validateFields(["isPublish"]);
            }}
            customClass="publish-btn"
          />
        )}
      </Flex>
    </Form>
  );
};

export default NotificationForm;
