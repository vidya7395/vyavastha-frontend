import { Flex, Text, TextInput, Tooltip } from '@mantine/core';
import PropTypes from 'prop-types';

const AmountInput = ({
  value,
  onChange,
  error,
  emoji,
  readableAmount,
  label
}) => {
  return (
    <Flex gap="xl" align="center">
      <Text size="md" style={{ width: 120 }}>
        Amount
      </Text>
      <TextInput
        flex={1}
        variant="default"
        size="sm"
        placeholder="Enter amount"
        value={value}
        onChange={onChange}
        error={error}
      />
      <Tooltip label={label} withArrow>
        <Text size="xs" color="dimmed" mt={-5} style={{ cursor: 'help' }}>
          {emoji} ~ ₹{readableAmount}
        </Text>
      </Tooltip>
    </Flex>
  );
};

AmountInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  emoji: PropTypes.string,
  readableAmount: PropTypes.string,
  label: PropTypes.string
};

export default AmountInput;
