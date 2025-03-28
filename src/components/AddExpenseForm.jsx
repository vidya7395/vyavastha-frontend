import { useState, useEffect } from 'react';
import {
  Button,
  TextInput,
  Group,
  Select,
  useCombobox,
  Combobox,
  ScrollArea,
  Flex,
  Text,
  Textarea,
  Tooltip,
  Switch,
  Paper
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, Controller } from 'react-hook-form';
import { showNotification } from '@mantine/notifications';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useAddCategoryMutation,
  useGetCategoriesQuery
} from '../services/categoryApi';
import { useAddTransactionMutation } from '../services/transactionApi';
import {
  formatIndianCurrency,
  getReadableAmountWithEmojiAndLabel
} from '../utils/helper';
import { frequencyLabelMap } from '../utils/spendingTypes';
const safeDate = () =>
  yup
    .date()
    .nullable()
    .transform((curr, orig) =>
      orig === 'null' || orig === '' || Array.isArray(orig) ? null : curr
    );

const schema = yup.object().shape({
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be positive')
    .required('Amount is required'),

  category: yup.string().required('Category is required'),

  description: yup.string().required('Description is required'),

  date: safeDate().required('Date is required'),

  spendingType: yup.string().required('Spending Type is required'),

  recurring: yup.boolean(),

  recurringFrequency: yup
    .string()
    .nullable()
    .when('recurring', {
      is: true,
      then: (schema) =>
        schema
          .required('Frequency is required')
          .oneOf(['daily', 'weekly', 'monthly', 'yearly']),
      otherwise: (schema) => schema.nullable()
    }),

  recurringStartDate: safeDate(),

  recurringEndDate: safeDate().when(
    'recurringStartDate',
    (startDate, schema) => {
      if (startDate instanceof Date && !isNaN(startDate.getTime())) {
        return schema.min(startDate, 'End date must be after start date');
      }
      return schema;
    }
  )
});

const AddExpenseForm = ({ isExpense }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: '',
      category: '',
      description: '',
      date: null,
      spendingType: 'needs',
      recurring: false,
      recurringStartDate: null,
      recurringEndDate: null,
      recurringFrequency: ''
    }
  });
  const isAddingExpense = isExpense;

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [categoryValue, setCategoryValue] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [addTransaction] = useAddTransactionMutation();
  const [amountDisplay, setAmountDisplay] = useState('');
  const [readableAmount, setReadableAmount] = useState('');
  const [amountEmoji, setAmountEmoji] = useState('');
  const [amountLabel, setAmountLabel] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const watchDate = watch('date');
  const watchStartDate = watch('recurringStartDate');
  const watchEndDate = watch('recurringEndDate');
  const watchFrequency = watch('recurringFrequency');
  const watchRepeatCount = watch('recurringRepeatCount');
  useEffect(() => {
    if (
      isRecurring &&
      watchStartDate &&
      watchFrequency &&
      watchRepeatCount > 0
    ) {
      const next = new Date(watchStartDate);

      switch (watchFrequency) {
        case 'daily':
          next.setDate(next.getDate() + (watchRepeatCount - 1));
          break;
        case 'weekly':
          next.setDate(next.getDate() + 7 * (watchRepeatCount - 1));
          break;
        case 'monthly':
          next.setMonth(next.getMonth() + (watchRepeatCount - 1));
          break;
        case 'yearly':
          next.setFullYear(next.getFullYear() + (watchRepeatCount - 1));
          break;
        default:
          break;
      }

      setValue('recurringEndDate', next);
    }
  }, [isRecurring, watchStartDate, watchFrequency, watchRepeatCount, setValue]);
  useEffect(() => {
    setValue('spendingType', isAddingExpense ? 'needs' : 'savings');
  }, [isAddingExpense, setValue]);

  useEffect(() => {
    setValue('category', categoryValue);
  }, [categoryValue, setValue]);

  useEffect(() => {
    if (isRecurring && watchDate) {
      setValue('recurringStartDate', watchDate);
    }
  }, [watchDate, isRecurring, setValue]);
  useEffect(() => {
    if (
      isRecurring &&
      watchStartDate &&
      watchEndDate &&
      new Date(watchEndDate) < new Date(watchStartDate)
    ) {
      setValue('recurringEndDate', null); // reset if invalid
    }
  }, [watchStartDate, watchEndDate, isRecurring, setValue]);

  const onSubmit = async (data) => {
    const newExpense = {
      amount: data.amount,
      categoryId: categoryValue,
      description: data.description,
      date: data.date.toISOString().split('T')[0],
      type: isAddingExpense ? 'expense' : 'income',
      spendingType: data.spendingType,
      recurring: isRecurring
    };
    if (isRecurring) {
      newExpense.recurringStartDate = data.recurringStartDate
        ?.toISOString()
        .split('T')[0];
      newExpense.recurringEndDate = data.recurringEndDate
        ? data.recurringEndDate.toISOString().split('T')[0]
        : undefined;
      newExpense.recurringFrequency = data.recurringFrequency;
    } else {
      // If not recurring, explicitly set them to null or undefined to avoid partial payloads
      newExpense.recurringStartDate = null;
      newExpense.recurringEndDate = null;
      newExpense.recurringFrequency = null;
    }
    console.log('Final payload:', newExpense);

    try {
      await addTransaction([newExpense]);

      if (isAddingExpense) {
        setTotalExpenses((prev) => prev + parseFloat(data.amount));
      } else {
        setTotalIncome((prev) => prev + parseFloat(data.amount));
      }

      showNotification({
        title: 'Success',
        message: `${
          isAddingExpense ? 'Expense' : 'Income'
        } added successfully!`,
        color: 'teal'
      });

      reset();
      setCategoryValue('');
      setCategoryValue('');
      setAmountDisplay('');
      setReadableAmount('');
      setAmountEmoji('');
      setAmountLabel('');
      setIsRecurring(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
      showNotification({
        title: 'Error',
        message: `Failed to add ${isAddingExpense ? 'expense' : 'income'}`,
        color: 'red'
      });
    }
  };

  const handleCreateCategory = async () => {
    if (
      categoryValue &&
      !categories.categories.some(
        (cat) => cat.name.toLowerCase() === categoryValue.toLowerCase()
      )
    ) {
      setIsCreatingCategory(true);
      try {
        await addCategory(categoryValue).unwrap();
        setValue('category', categoryValue);
        showNotification({
          title: 'Success',
          message: 'Category added successfully!',
          color: 'teal'
        });
      } catch (error) {
        console.error('Error adding category:', error);
        showNotification({
          title: 'Error',
          message: 'Failed to create category',
          color: 'red'
        });
      } finally {
        setIsCreatingCategory(false);
      }
    }
  };

  const combobox = useCombobox();
  const categoriesList = categories.categories ?? [];
  const filteredOptions = categoriesList.filter((item) =>
    item.name.toLowerCase().includes(categoryValue.toLowerCase().trim())
  );
  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.name} key={item._id}>
      {item.name}
    </Combobox.Option>
  ));

  const handleAmountChange = (e) => {
    const input = e.target.value.replace(/,/g, '');
    if (!/^\d*\.?\d*$/.test(input)) return;

    const formatted = formatIndianCurrency(input);
    setAmountDisplay(formatted);
    setValue('amount', input);
    clearErrors('amount');

    const { text, emoji, label } =
      getReadableAmountWithEmojiAndLabel(formatted);
    setReadableAmount(text);
    setAmountEmoji(emoji);
    setAmountLabel(label);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="lg" mt="xl" px="lg">
        {/* Amount Input */}
        <Flex gap="xl" align="center">
          <Text size="md" style={{ width: 120 }}>
            Amount
          </Text>
          <TextInput
            flex={1}
            variant="default"
            size="sm"
            placeholder="Enter amount"
            value={amountDisplay}
            onChange={handleAmountChange}
            error={errors.amount?.message}
          />
          <Tooltip label={amountLabel} withArrow>
            <Text size="xs" color="dimmed" mt={-5} style={{ cursor: 'help' }}>
              {amountEmoji} ~ ₹{readableAmount}
            </Text>
          </Tooltip>
        </Flex>

        {/* Date Picker */}
        <Flex gap="xl" align="center">
          <Text size="md" style={{ width: 120 }}>
            Date
          </Text>
          <Controller
            name="date"
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
                error={errors.date?.message}
                highlightToday
              />
            )}
          />
        </Flex>

        {/* Category Combobox */}
        <Flex gap="xl" align="center">
          <Text size="md" style={{ width: 120 }}>
            Category
          </Text>
          <Combobox
            flex={1}
            value={categoryValue}
            onChange={setCategoryValue}
            onOptionSubmit={(optionValue) => {
              setCategoryValue(optionValue);
              combobox.closeDropdown();
            }}
            store={combobox}
          >
            <Combobox.Target>
              <TextInput
                variant="default"
                size="sm"
                placeholder="Choose or create"
                value={categoryValue}
                onChange={(e) => {
                  setCategoryValue(e.target.value);
                  clearErrors('category');
                }}
                onClick={combobox.openDropdown}
                onFocus={combobox.openDropdown}
                onBlur={combobox.closeDropdown}
              />
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                <ScrollArea.Autosize type="scroll" mah={200}>
                  {options.length === 0 ? (
                    <Combobox.Empty>
                      No categories found.{' '}
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={handleCreateCategory}
                        loading={isCreatingCategory}
                      >
                        {`Create "${categoryValue}"`}
                      </Button>
                    </Combobox.Empty>
                  ) : (
                    options
                  )}
                </ScrollArea.Autosize>
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>
        </Flex>

        {/* Spending Type Select */}
        {isAddingExpense && (
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
                  error={errors.spendingType?.message}
                />
              )}
            />
          </Flex>
        )}
        <Flex gap="xl" align="center">
          <Text size="md" style={{ width: 120 }}>
            Recurring
          </Text>
          <Switch
            size="md"
            onLabel="YES"
            offLabel="NO"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.currentTarget.checked)}
          />
        </Flex>
        {isRecurring && (
          <Paper bg={'dark.8'} radius={'lg'} py={'lg'} px={'lg'}>
            <Flex direction={'column'} gap={'lg'}>
              {/* Recurring Start Date */}
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

              {/* Recurring End Date (optional) */}
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
                      disabled={Boolean(watchRepeatCount)} // 👈 disable if repeat count used
                      minDate={watch('recurringStartDate') || undefined}
                      onChange={field.onChange}
                      placeholder="Select end date (optional)"
                    />
                  )}
                />
              </Flex>
            </Flex>
          </Paper>
        )}

        {/* Description Input */}
        <Flex gap="sm" direction="column">
          <Text size="md" mb={0}>
            Notes
          </Text>
          <Textarea
            variant="default"
            size="sm"
            {...register('description')}
            placeholder="Add Notes"
            error={errors.description?.message}
          />
        </Flex>

        {/* Submit Button */}
        <Group position="right" mt={30}>
          <Button type="submit">
            {isAddingExpense ? 'Add Expense' : 'Add Income'}
          </Button>
        </Group>

        {/* Total Summary */}
        {(isAddingExpense ? totalExpenses : totalIncome) > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3>
              Total {isAddingExpense ? 'Expenses' : 'Income'} Added:{' '}
              {(isAddingExpense ? totalExpenses : totalIncome).toFixed(2)}
            </h3>
          </div>
        )}
      </Flex>
    </form>
  );
};

AddExpenseForm.propTypes = {
  isExpense: PropTypes.bool.isRequired
};

export default AddExpenseForm;
