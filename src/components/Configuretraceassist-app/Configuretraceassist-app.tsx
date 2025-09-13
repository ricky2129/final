import React from "react";
import { Button, Input, Typography, Flex } from "antd";
 
const { Title } = Typography;
 
const ConfigureTraceAssist: React.FC = () => {
  const handleSubmit = () => {
    // Add submit logic here if needed
  };
 
  return (
<Flex vertical align="center" justify="center" style={{ minHeight: "200px" }}>
<Title level={4}>Name</Title>
<Input
        placeholder="Open the sample link to get full details"
        style={{ width: 300, marginBottom: 24 }}
      />
<Button type="primary" onClick={handleSubmit}>
        Submit
</Button>
</Flex>
  );
};
 
export default ConfigureTraceAssist;