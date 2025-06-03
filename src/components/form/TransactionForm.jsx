import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useCombobox, Flex, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { showNotification } from '@mantine/notifications';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';

import { transactionSchema } from '../../utils/validation/transactionSchema';
import {
  formatIndianCurrency,
  getReadableAmountWithEmojiAndLabel
} from '../../utils/helper';
import { useCallback } from 'react';

import AmountInput from './AmountInput';
import DateInputGroup from './DateInputGroup';
import CategorySelector from './CategorySelector';
import SpendingTypeSelector from './SpendingTypeSelector';
import RecurringToggle from './RecurringToggle';
import RecurringOptions from './RecurringOptions';
import NotesInput from './NotesInput';
import FormFooter from './FormFooter';
import useRecurringLogic from '../../hooks/useRecurringLogic';

const TransactionForm = ({
  type,
  onSubmitTransaction,
  categories,
  onCreateCategory,
  isCreatingCategory,
  defaultValues = {},
  onSubmitOverride,
  setSubmitRef // ✅ NEW
}) => {
  const isExpense = type === 'expense';
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
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      amount: defaultValues.amount ?? '',
      categoryId: defaultValues.categoryId ?? '',
      description: defaultValues.description ?? '',
      date: defaultValues.date ?? new Date(),
      spendingType: defaultValues.spendingType ?? 'needs',
      recurring: defaultValues.recurring ?? false,
      recurringStartDate: defaultValues.recurringStartDate ?? null,
      recurringEndDate: defaultValues.recurringEndDate ?? null,
      recurringFrequency: defaultValues.recurringFrequency ?? ''
    }
  });

  const [categoryValue, setCategoryValue] = useState('');
  const [amountDisplay, setAmountDisplay] = useState('');
  const [readableAmount, setReadableAmount] = useState('');
  const [amountEmoji, setAmountEmoji] = useState('');
  const [amountLabel, setAmountLabel] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [total, setTotal] = useState(0);

  const combobox = useCombobox();
  const categoriesList = categories ?? [];

  useEffect(() => {
    if (defaultValues) {
      const rawAmount = String(defaultValues.amount ?? '');
      const formatted = formatIndianCurrency(rawAmount);
      const { text, emoji, label } =
        getReadableAmountWithEmojiAndLabel(formatted);

      setAmountDisplay(formatted);
      setReadableAmount(text);
      setAmountEmoji(emoji);
      setAmountLabel(label);
      setIsRecurring(defaultValues.recurring ?? false);
      if (defaultValues.categoryId) {
        setCategoryValue(defaultValues.categoryId ?? '');
        setValue('category', defaultValues.categoryId);
      }
    }
  }, [defaultValues, setValue]);

  useRecurringLogic({
    isRecurring,
    watch,
    setValue,
    isAddingExpense: isExpense,
    categoryValue
  });

  const handleAmountChange = (e) => {
    const raw = String(e.target.value ?? '');
    const input = raw.replace(/,/g, '');

    if (!/^[\d]*\.?[\d]*$/.test(input)) return;

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

  const handleSubmitForm = useCallback(
    async (data) => {
      try {
        const categoryInput = (categoryValue || data.category || '').trim();

        if (!categoryInput) {
          showNotification({
            title: 'Missing Category',
            message: 'Please enter or select a category',
            color: 'red'
          });
          return;
        }

        const existingCategory = categories.find(
          (cat) => cat.name.toLowerCase() === categoryInput.toLowerCase()
        );

        let finalCategoryId;
        if (!existingCategory) {
          const created = await onCreateCategory(categoryInput);
          if (!created || !created.id) {
            showNotification({
              title: 'Error',
              message: 'Failed to create new category',
              color: 'red'
            });
            return;
          }
          finalCategoryId = created.name;
        } else {
          finalCategoryId = existingCategory.name;
        }

        const transaction = {
          amount: data.amount,
          categoryId: finalCategoryId,
          description: data.description,
          date: format(data.date, 'yyyy-MM-dd'),
          type,
          spendingType: data.spendingType,
          recurring: isRecurring,
          recurringStartDate: isRecurring
            ? format(data.recurringStartDate, 'yyyy-MM-dd')
            : null,
          recurringEndDate:
            isRecurring && data.recurringEndDate
              ? format(data.recurringEndDate, 'yyyy-MM-dd')
              : null,
          recurringFrequency: isRecurring ? data.recurringFrequency : null
        };

        if (onSubmitOverride) {
          await onSubmitOverride(transaction);
        } else {
          await onSubmitTransaction(transaction);
        }

        showNotification({
          title: 'Success',
          message: `${type === 'expense' ? 'Expense' : 'Income'} submitted!`,
          color: 'teal'
        });

        reset();
        setCategoryValue('');
        setAmountDisplay('');
        setReadableAmount('');
        setAmountEmoji('');
        setAmountLabel('');
        setIsRecurring(false);
        setTotal((prev) => prev + (parseFloat(data.amount) || 0));
      } catch (error) {
        console.error('Submission error:', error);
        showNotification({
          title: 'Error',
          message: 'Failed to submit transaction',
          color: 'red'
        });
      }
    },
    [
      categoryValue,
      categories,
      onCreateCategory,
      onSubmitOverride,
      onSubmitTransaction,
      type,
      isRecurring,
      reset
    ]
  );

  useEffect(() => {
    if (setSubmitRef) {
      setSubmitRef(() => handleSubmit(handleSubmitForm));
    }
  }, [setSubmitRef, handleSubmit, handleSubmitForm]);

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <Flex direction="column" gap="lg" mt="xl" px="lg">
        <AmountInput
          value={amountDisplay}
          onChange={handleAmountChange}
          error={errors.amount?.message}
          emoji={amountEmoji}
          readableAmount={readableAmount}
          label={amountLabel}
        />

        <DateInputGroup
          control={control}
          name="date"
          label="Date"
          error={errors.date?.message}
        />

        <Flex gap="xl" align="center">
          <Text size="md" style={{ width: 120 }}>
            Category
          </Text>
          <CategorySelector
            value={categoryValue}
            onChange={setCategoryValue}
            options={categoriesList}
            combobox={combobox}
            isCreating={isCreatingCategory}
            onCreateCategory={onCreateCategory}
            error={errors.category?.message}
            clearErrors={clearErrors}
          />
        </Flex>

        {isExpense && (
          <SpendingTypeSelector
            control={control}
            error={errors.spendingType?.message}
          />
        )}

        <RecurringToggle isRecurring={isRecurring} onToggle={setIsRecurring} />

        {isRecurring && <RecurringOptions control={control} watch={watch} />}

        <NotesInput register={register} error={errors.description?.message} />

        <FormFooter
          isExpense={isExpense}
          onSubmitLabel={isExpense ? 'Add Expense' : 'Add Income'}
          totalAmount={total}
        />
      </Flex>
    </form>
  );
};

TransactionForm.propTypes = {
  type: PropTypes.oneOf(['expense', 'income']).isRequired,
  onSubmitTransaction: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onCreateCategory: PropTypes.func.isRequired,
  isCreatingCategory: PropTypes.bool,
  defaultValues: PropTypes.object,
  onSubmitOverride: PropTypes.func,
  setSubmitRef: PropTypes.func // ✅ NEW
};

export default TransactionForm;
