import { useEffect, useState, useCallback } from 'react';
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

import AmountInput from './AmountInput';
import DateInputGroup from './DateInputGroup';
import CategorySelector from './CategorySelector';
import SpendingTypeSelector from './SpendingTypeSelector';
import RecurringToggle from './RecurringToggle';
import RecurringOptions from './RecurringOptions';
import NotesInput from './NotesInput';
import FormFooter from './FormFooter';
import useRecurringLogic from '../../hooks/useRecurringLogic';

const getCategoryDisplayValue = (categoryId) => {
  if (!categoryId) return '';
  if (typeof categoryId === 'object' && categoryId.name) return categoryId.name;
  return String(categoryId);
};

const TransactionForm = ({
  type,
  onSubmitTransaction,
  categories,
  onCreateCategory,
  isCreatingCategory,
  defaultValues = {},
  onSubmitOverride,
  setSubmitRef,
  isEdit
}) => {
  const isExpense = type === 'expense';

  // ✅ Main form
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
      category: getCategoryDisplayValue(defaultValues.categoryId),
      description: defaultValues.description ?? '',
      date: defaultValues.date ?? new Date(),
      spendingType: defaultValues.spendingType ?? 'needs',
      recurring: defaultValues.recurring ?? false,
      recurringStartDate: defaultValues.recurringStartDate ?? null,
      recurringEndDate: defaultValues.recurringEndDate ?? null,
      recurringFrequency: defaultValues.recurringFrequency ?? ''
    }
  });

  const [categoryValue, setCategoryValue] = useState(
    getCategoryDisplayValue(defaultValues.categoryId)
  );
  const [amountDisplay, setAmountDisplay] = useState(
    defaultValues.amount
      ? formatIndianCurrency(String(defaultValues.amount))
      : ''
  );
  const [isRecurring, setIsRecurring] = useState(
    defaultValues.recurring ?? false
  );
  const [total, setTotal] = useState(0);

  const combobox = useCombobox();
  const categoriesList = categories ?? [];

  // Fancy amount display
  const {
    text: readableAmount,
    emoji: amountEmoji,
    label: amountLabel
  } = getReadableAmountWithEmojiAndLabel(amountDisplay);

  // Spending type watch
  const spendingTypeValue = watch('spendingType');

  // Recurring logic
  useRecurringLogic({
    isRecurring,
    watch,
    setValue,
    isAddingExpense: isExpense,
    categoryValue,
    spendingTypeValue
  });

  // Amount change
  const handleAmountChange = (e) => {
    const raw = e.target.value ?? '';
    const numeric = raw.replace(/,/g, '');
    if (!/^\d*$/.test(numeric)) return;

    const formatted = formatIndianCurrency(numeric);
    setAmountDisplay(formatted);
    setValue('amount', numeric);
    clearErrors('amount');
  };

  // Submit logic
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

        let finalCategoryId;
        const existingCategory = categories.find(
          (cat) => cat.name.toLowerCase() === categoryInput.toLowerCase()
        );
        if (!existingCategory) {
          const created = await onCreateCategory(categoryInput);
          if (!created?.id) {
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
          ...(isEdit && { id: defaultValues._id }), // 👈 adds id only if isEdit is true
          amount: data.amount,
          category: finalCategoryId,
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

        if (isEdit) {
          await onSubmitOverride(transaction);
        } else {
          await onSubmitTransaction(transaction);
          reset();
          setCategoryValue('');
          setAmountDisplay('');
          setIsRecurring(false);
          setTotal((prev) => prev + (parseFloat(data.amount) || 0));
        }

        // Reset form
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
      isEdit,
      reset
    ]
  );

  // Expose submitRef if provided
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
            onChange={(val) => {
              setCategoryValue(val);
              setValue('category', val);
              clearErrors('category');
            }}
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
            value={spendingTypeValue}
            control={control}
            error={errors.spendingType?.message}
          />
        )}

        <RecurringToggle isRecurring={isRecurring} onToggle={setIsRecurring} />

        {isRecurring && <RecurringOptions control={control} watch={watch} />}

        <NotesInput register={register} error={errors.description?.message} />

        <FormFooter
          isExpense={isExpense}
          onSubmitLabel={
            isEdit
              ? isExpense
                ? 'Update Expense'
                : 'Update Income'
              : isExpense
              ? 'Add Expense'
              : 'Add Income'
          }
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
  setSubmitRef: PropTypes.func,
  isEdit: PropTypes.bool
};

export default TransactionForm;
