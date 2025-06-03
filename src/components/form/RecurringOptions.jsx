import { Controller } from 'react-hook-form';
import { Flex, Paper, Text, TextInput, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import PropTypes from 'prop-types';

const frequencyLabelMap = {
  daily: 'days',
  weekly: 'weeks',
  monthly: 'months',
  yearly: 'years'
};

const RecurringOptions = ({ control, watch }) => {
  const watchStartDate = watch('recurringStartDate');
  const watchFrequency = watch('recurringFrequency');
  const watchRepeatCount = watch('recurringRepeatCount');

  return (
    <Paper bg={'dark.8'} radius="lg" py="lg" px="lg">
      <Flex direction="column" gap="lg">
        {/* Start Date */}
        <Flex gap="xl" align="center">
          <Text size="sm" style={{ width: 120 }}>
            Start Date
          </Text>
          <Controller
            name="recurringStartDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                flex={1}
                variant="default"
                size="sm"
                value={field.value}
                onChange={(val) => field.onChange(val ?? null)}
                placeholder="Select start date"
              />
            )}
          />
        </Flex>

        {/* Frequency */}
        <Flex gap="xl" align="center">
          <Text size="sm" style={{ width: 120 }}>
            Frequency
          </Text>
          <Controller
            name="recurringFrequency"
            control={control}
            render={({ field }) => (
              <Select
                flex={1}
                variant="default"
                size="sm"
                value={field.value}
                onChange={field.onChange}
                data={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' }
                ]}
              />
            )}
          />
        </Flex>

        {/* Repeat Count */}
        <Flex gap="xl" align="center">
          <Text size="sm" style={{ width: 120 }}>
            Repeat
          </Text>
          <Controller
            name="recurringRepeatCount"
            control={control}
            render={({ field }) => (
              <Flex align="center" gap="xs" style={{ flex: 1 }}>
                <TextInput
                  flex={1}
                  variant="default"
                  size="sm"
                  placeholder="e.g. 10"
                  type="number"
                  min={1}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
                {watchFrequency && (
                  <Text size="xs" color="dimmed">
                    {frequencyLabelMap[watchFrequency] ?? ''}
                  </Text>
                )}
              </Flex>
            )}
          />
        </Flex>

        {/* End Date */}
        <Flex gap="xl" align="center">
          <Text size="sm" style={{ width: 120 }}>
            End Date
          </Text>
          <Controller
            name="recurringEndDate"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                flex={1}
                variant="default"
                size="sm"
                value={field.value}
                disabled={Boolean(watchRepeatCount)}
                minDate={watchStartDate || undefined}
                onChange={field.onChange}
                placeholder="Select end date (optional)"
              />
            )}
          />
        </Flex>
      </Flex>
    </Paper>
  );
};

RecurringOptions.propTypes = {
  control: PropTypes.any.isRequired,
  watch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default RecurringOptions;
