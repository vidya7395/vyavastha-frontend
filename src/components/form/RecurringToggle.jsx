import { Flex, Text, Switch } from '@mantine/core';
import PropTypes from 'prop-types';

const RecurringToggle = ({ isRecurring, onToggle }) => {
  return (
    <Flex gap="xl" align="center">
      <Text size="md" style={{ width: 120 }}>
        Recurring
      </Text>
      <Switch
        size="md"
        onLabel="YES"
        offLabel="NO"
        checked={isRecurring}
        onChange={(e) => onToggle(e.currentTarget.checked)}
      />
    </Flex>
  );
};

RecurringToggle.propTypes = {
  isRecurring: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default RecurringToggle;
