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
  Textarea
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm, Controller } from 'react-hook-form';
import { showNotification } from '@mantine/notifications';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import api from '../api/axiosInstance';
import {
  useAddCategoryMutation,
  useGetCategoriesQuery
} from '../services/categoryApi';

// Validation schema
const schema = yup.object().shape({
  amount: yup.number().positive().required('Amount is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  spendingType: yup.string().required('Spending Type is required')
});

const AddExpenseForm = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryValue, setCategoryValue] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();

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
    setValue('category', categoryValue);
  }, [categoryValue, setValue]);

  const onSubmit = async (data) => {
    const newExpense = {
      amount: data.amount,
      categoryId: categoryValue,
      description: data.description,
      date: data.date.toISOString().split('T')[0],
      type: 'expense',
      spendingType: data.spendingType
    };

    try {
      await api.post('http://localhost:3000/api/transaction', [newExpense], {
        withCredentials: true
      });
      setTotalExpenses((prev) => prev + parseFloat(data.amount));
      showNotification({
        title: 'Success',
        message: 'Expense added successfully!',
        color: 'teal'
      });
      reset();
      setCategoryValue('');
    } catch (error) {
      console.error('Error adding expense:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to add expense',
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
            {...register('amount')}
            placeholder="Enter amount"
            error={errors.amount?.message}
          />
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
                value={field.value}
                onChange={field.onChange}
                placeholder="Select date"
                error={errors.date?.message}
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

        <Group position="right" mt={30}>
          <Button type="submit">Add Expense</Button>
        </Group>

        {totalExpenses > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Total Expenses Added: {totalExpenses.toFixed(2)}</h3>
          </div>
        )}
      </Flex>
    </form>
  );
};

export default AddExpenseForm;
