import { Flex, Text, Select } from '@mantine/core';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

const SpendingTypeSelector = ({ control, error }) => {
  return (
    <Flex gap="xl" align="center">
      <Text size="md" style={{ width: 120 }}>
        50-30-20 Rule
      </Text>
      <Controller
        name="spendingType"
        control={control}
        render={({ field }) => (
          <Select
            flex={1}
            variant="default"
            size="sm"
            value={field.value}
            onChange={field.onChange}
            data={[
              { value: 'needs', label: 'Needs' },
              { value: 'wants', label: 'Wants' },
              { value: 'savings', label: 'Savings' }
            ]}
            error={error}
          />
        )}
      />
    </Flex>
  );
};

SpendingTypeSelector.propTypes = {
  control: PropTypes.any.isRequired,
  error: PropTypes.string
};

export default SpendingTypeSelector;
