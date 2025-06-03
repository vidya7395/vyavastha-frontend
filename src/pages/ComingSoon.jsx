import { Box, Text, Center, Title, Paper, Stack, Button } from '@mantine/core';
import { IconArrowLeft, IconHammer } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <Center style={{ height: '90vh' }}>
      <Paper
        radius="xl"
        shadow="xl"
        p="xl"
        withBorder
        style={{ maxWidth: 400, textAlign: 'center' }}
      >
        <Stack align="center" spacing="md">
          <Box
            bg="gray.8"
            style={{
              borderRadius: '50%',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconHammer size={48} c="gray.2" />
          </Box>

          <Title order={2} size="h2">
            Coming Soon
          </Title>

          <Text c="dimmed" size="xl">
            This page is under construction. We are working hard to bring it to
            life soon!
          </Text>

          <Button
            variant="light"
            color="gray"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
};

export default ComingSoon;
