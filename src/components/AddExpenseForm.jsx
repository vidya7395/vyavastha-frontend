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
import { useDispatch, useSelector } from 'react-redux';
import { addCategories, fetchCategories } from '../store/categorySlice';

// Define validation schema using yup
const schema = yup.object().shape({
  amount: yup.number().positive().required('Amount is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Date is required'),
  spendingType: yup.string().required('Spending Type is required')
});

const AddExpenseForm = () => {
  // const [categories, setCategories] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [categoryValue, setCategoryValue] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const categoryFromStore = useSelector((state) => state.category.categories);
  const dispatch = useDispatch();
  // Initialize react-hook-form
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

  // Sync local categoryValue with the form's 'category' field
  useEffect(() => {
    setValue('category', categoryValue);
  }, [categoryValue, setValue]);

  // Fetch categories from API on mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        console.log('Getting categories');

        await dispatch(fetchCategories()).unwrap();
      } catch (error) {
        console.error('Error fetching categories:', error);
        showNotification({
          title: 'Error',
          message: 'Failed to load categories',
          color: 'red'
        });
      }
    };
    getCategories();
  }, []);

  // onSubmit handler
  const onSubmit = async (data) => {
    console.log('Form data on submit:', data);
    // Build expense object
    const newExpense = {
      amount: data.amount,
      categoryId: categoryValue, // from our combobox state
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
      // Reset the form and combobox field
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

  // Handle creating a new category from the combobox
  const handleCreateCategory = async () => {
    if (
      categoryValue &&
      !categoryFromStore.some(
        (cat) => cat.name.toLowerCase() === categoryValue.toLowerCase()
      )
    ) {
      setIsCreatingCategory(true);
      try {
        dispatch(addCategories({ categoryValue }));
        // Set form category field to the new value
        setValue('category', categoryValue);
        setIsCreatingCategory(false);
        showNotification({
          title: 'Success',
          message: 'Category added successfully!',
          color: 'teal'
        });
      } catch (error) {
        console.error('Error adding category:', error);
        setIsCreatingCategory(false);
        showNotification({
          title: 'Error',
          message: 'Failed to create category',
          color: 'red'
        });
      }
    }
  };

  // Combobox filtering logic
  const combobox = useCombobox();
  const shouldFilterOptions = !categoryFromStore.some(
    (item) => item.name === categoryValue
  );
  const filteredOptions = shouldFilterOptions
    ? categoryFromStore.filter((item) =>
        item.name.toLowerCase().includes(categoryValue.toLowerCase().trim())
      )
    : categoryFromStore;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.name} key={item._id}>
      {item.name}
    </Combobox.Option>
  ));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="lg" mt={'xl'} px={'lg'}>
        {/* Amount Input */}
        <Flex
          gap="xl"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="nowrap"
        >
          <Text size="lg" style={{ width: 120 }}>
            Amount
          </Text>
          <TextInput
            flex={1}
            variant="unstyled"
            size="sm"
            {...register('amount')}
            placeholder="Enter amount"
            error={errors.amount ? errors.amount.message : null}
          />
        </Flex>
        {/* Date Picker Input via Controller */}
        <Flex
          gap="xl"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="nowrap"
        >
          <Text style={{ width: 120 }} size="lg">
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
                error={errors.date ? errors.date.message : null}
              />
            )}
          />
        </Flex>
        {/* Combobox for Category */}
        <Flex
          gap="xl"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="nowrap"
        >
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
                onClick={() => combobox.openDropdown()}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
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

        {/* Spending Type Select via Controller */}
        <Flex
          gap="xl"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="nowrap"
        >
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
                checkIconPosition="right"
                value={field.value}
                onChange={field.onChange}
                data={[
                  { value: 'needs', label: 'Needs' },
                  { value: 'wants', label: 'Wants' },
                  { value: 'savings', label: 'Savings' }
                ]}
                error={errors.spendingType ? errors.spendingType.message : null}
              />
            )}
          />
        </Flex>
        {/* Description Input */}
        <Flex gap="sm" direction="column" wrap="nowrap">
          <Text size="lg" style={{ width: 120 }} mb={0}>
            Notes
          </Text>
          <Textarea
            variant="unstyled"
            size="sm"
            flex={1}
            mt={0}
            {...register('description')}
            placeholder="Add Notes"
            error={errors.description ? errors.description.message : null}
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
