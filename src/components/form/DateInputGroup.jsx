import { Controller } from 'react-hook-form';
import { Flex, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import PropTypes from 'prop-types';

const DateInputGroup = ({ control, name, label, error }) => {
  return (
    <Flex gap="xl" align="center">
      <Text size="md" style={{ width: 120 }}>
        {label}
      </Text>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePickerInput
            flex={1}
            variant="default"
            size="sm"
            defaultDate={new Date()}
            value={field.value}
            onChange={field.onChange}
            placeholder="Select date"
            error={error}
            highlightToday
          />
        )}
      />
    </Flex>
  );
};

DateInputGroup.propTypes = {
  control: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string
};

export default DateInputGroup;
