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
  Tooltip
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

// Validation schema
const schema = yup.object().shape({
  amount: yup.number().positive().required('Amount is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  spendingType: yup.string().required('Spending Type is required')
});

const AddExpenseForm = ({ isExpense }) => {
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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: '',
      category: '',
      description: '',
      date: null,
      spendingType: 'needs'
    }
  });

  useEffect(() => {
    setValue('spendingType', isAddingExpense ? 'needs' : 'savings');
  }, [isAddingExpense, setValue]);

  useEffect(() => {
    setValue('category', categoryValue);
  }, [categoryValue, setValue]);

  const onSubmit = async (data) => {
    const newExpense = {
      amount: data.amount,
      categoryId: categoryValue,
      description: data.description,
      date: data.date.toISOString().split('T')[0],
      type: isAddingExpense ? 'expense' : 'income',
      spendingType: data.spendingType
    };

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
          <Text size="lg" style={{ width: 120 }}>
            Amount
          </Text>
          <TextInput
            flex={1}
            variant="unstyled"
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
          <Text size="lg" style={{ width: 120 }}>
            Date
          </Text>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePickerInput
                flex={1}
                variant="unstyled"
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
          <Text size="lg" style={{ width: 120 }}>
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
                variant="unstyled"
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
            <Text size="lg" style={{ width: 120 }}>
              50-30-20 Rule
            </Text>
            <Controller
              name="spendingType"
              control={control}
              render={({ field }) => (
                <Select
                  flex={1}
                  variant="unstyled"
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

        {/* Description Input */}
        <Flex gap="sm" direction="column">
          <Text size="lg" mb={0}>
            Notes
          </Text>
          <Textarea
            variant="unstyled"
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
