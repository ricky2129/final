import React from "react";

import {
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { Flex, Tooltip } from "antd";
import { GenericIconType } from "interfaces";

import { DeleteIcon } from "assets";

<<<<<<< HEAD
import { Button, IconViewer, Text } from "components";
=======
import { IconViewer, Text } from "components";
>>>>>>> f0ce0ac (das)

import { Colors, Metrics } from "themes";

import "./integrationManager.style.scss";
<<<<<<< HEAD

=======
 
>>>>>>> f0ce0ac (das)
interface Integration {
  id: number;
  name: string;
}
interface IntegrationManagerProps {
  name: string;
  description?: string;
  addNewText?: string;
  icon: GenericIconType;
  multipleConnect?: boolean;
  integrations: Integration[];
  disableAction?: boolean;
  info?: string | React.ReactElement;
  onClickAddNew: () => void;
  onEdit: (id: number, record?: Integration, index?: number) => void;
  onDelete?: (id: number, record?: Integration, index?: number) => void;
  onDeleteAll?: () => void;
}
<<<<<<< HEAD

=======
 
>>>>>>> f0ce0ac (das)
const IntegrationManager: React.FC<IntegrationManagerProps> = ({
  name,
  description,
  icon,
  integrations,
<<<<<<< HEAD
  multipleConnect,
  addNewText = "",
  disableAction,
  info = "",
=======
 multipleConnect,
  addNewText = "",
  disableAction,
    info = "",
>>>>>>> f0ce0ac (das)
  onClickAddNew,
  onEdit,
  onDelete,
}) => {
  return (
    <Flex
      className="integration-manager-container"
      vertical
      gap={Metrics.SPACE_MD}
<<<<<<< HEAD
      onClick={() => {
        if (integrations?.length > 0) return;
        onClickAddNew();
      }}
      style={{
        cursor: integrations?.length > 0 ? "default" : "pointer",
      }}
    >
      <Flex justify="space-between" align="center">
        <Flex gap={Metrics.SPACE_SM} style={{ height: "100%" }}>
          <Flex
            className="integration-icon"
            align="center"
            gap={Metrics.SPACE_MD}
          >
=======
    >

      <Flex
        justify="space-between"
        align="center"
        style={{ cursor: "pointer" }}
        onClick={onClickAddNew}
      >
        <Flex gap={Metrics.SPACE_SM} style={{ height: "100%" }}>
          <Flex className="integration-icon" align="center" gap={Metrics.SPACE_MD}>
>>>>>>> f0ce0ac (das)
            <IconViewer
              Icon={icon}
              width={24}
              height={24}
              color={Colors.COOL_GRAY_12}
            />
          </Flex>
<<<<<<< HEAD

=======
 
>>>>>>> f0ce0ac (das)
          <Flex vertical justify={description ? "space-between" : "center"}>
            <Flex align="center" gap={Metrics.SPACE_SM}>
              <Text
                type="cardtitle"
                weight="semibold"
                color={Colors.COOL_GRAY_12}
                text={name}
              />
              <Tooltip title={info} placement="topRight">
                <IconViewer
                  color={Colors.COOL_GRAY_7}
                  width={16}
                  height={16}
                  Icon={InfoCircleOutlined}
                />
              </Tooltip>
            </Flex>
            {description && (
              <Text
                type="footnote"
                text={description}
                color={Colors.COOL_GRAY_6}
              />
            )}
          </Flex>
        </Flex>
<<<<<<< HEAD

        {((multipleConnect && integrations?.length === 0) ||
          (!multipleConnect && integrations?.length === undefined)) && (
          <IconViewer Icon={PlusSquareOutlined} color={Colors.COOL_GRAY_11} size={20} />
        )}
=======
 
        <PlusSquareOutlined style={{ fontSize: 20, color: Colors.COOL_GRAY_7 }} />
>>>>>>> f0ce0ac (das)
      </Flex>
      <Flex vertical gap={Metrics.SPACE_XS}>
        {integrations?.map((integration, index) => (
          <Flex
            className="integration-item"
            align="center"
            justify="space-between"
<<<<<<< HEAD
=======
            key={integration.id}
>>>>>>> f0ce0ac (das)
          >
            <Flex vertical justify="space-between">
              <Text
                type="cardtitle"
                weight="semibold"
                text={integration.name}
              />
              <Text
                type="footnote"
                weight="semibold"
                color={Colors.COOL_GRAY_6}
                text={integration.id}
              />
            </Flex>
            <Flex gap={Metrics.SPACE_SM} align="center">
              <IconViewer
                Icon={EditOutlined}
                size={20}
                color={Colors.COOL_GRAY_12}
                customClass="cursor-pointer"
<<<<<<< HEAD
                disabled={disableAction}
=======
>>>>>>> f0ce0ac (das)
                onClick={() => onEdit(integration.id, integration, index)}
              />
              <IconViewer
                Icon={DeleteIcon}
                width={20}
                height={20}
                color={Colors.COOL_GRAY_12}
                customClass="cursor-pointer"
<<<<<<< HEAD
                disabled={disableAction}
                onClick={() => onDelete(integration.id, integration, index)}
=======
                onClick={() => onDelete?.(integration.id, integration, index)}
>>>>>>> f0ce0ac (das)
              />
            </Flex>
          </Flex>
        ))}
      </Flex>
<<<<<<< HEAD
      {integrations?.length > 0 && multipleConnect && (
        <Button
          type="link"
          title={`Add New ${addNewText}`}
          icon={<IconViewer Icon={PlusOutlined} color={Colors.PRIMARY_BLUE} />}
          customClass="add-new-btn semibold"
          onClick={onClickAddNew}
        />
      )}
    </Flex>
  );
};

export default IntegrationManager;
=======
    </Flex>
  );
};
 
export default IntegrationManager;
 
>>>>>>> f0ce0ac (das)
