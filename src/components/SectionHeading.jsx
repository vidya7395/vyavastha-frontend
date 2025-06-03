import { Group, Title, Text, Box } from '@mantine/core';

const SectionHeading = ({ title, description, children }) => {
  return (
    <Group position="apart" align="center" mb="lg">
      <Box>
        <Text fw={700}>{title}</Text>
        <Text size="sm">{description}</Text>
      </Box>
      <Box>{children}</Box>
    </Group>
  );
};

export default SectionHeading;
