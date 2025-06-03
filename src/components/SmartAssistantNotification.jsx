import { Box, Text, Modal } from '@mantine/core';
import PropTypes from 'prop-types';

function SmartAssistantNotification({
  aiInsight,
  showInsight,
  setShowInsight
}) {
  if (!aiInsight || !showInsight) return null;

  return (
    <Modal
      opened={showInsight}
      onClose={() => setShowInsight(false)}
      withCloseButton
      overlayProps={{
        blur: 100, // background blur
        opacity: 0.5, // optional dim
        color: '#000'
      }}
      centered
      size="xl"
      title={
        <Text size="xs" fw={700} tt="uppercase">
          🤖 Your Smart Assistant
        </Text>
      }
    >
      <Box>
        <Text size="sm" lh={1.5}>
          {aiInsight}
        </Text>
      </Box>
    </Modal>
  );
}
SmartAssistantNotification.propTypes = {
  aiInsight: PropTypes.string,
  showInsight: PropTypes.bool.isRequired,
  setShowInsight: PropTypes.func.isRequired
};

export default SmartAssistantNotification;
