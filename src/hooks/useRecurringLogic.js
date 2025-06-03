import { useEffect } from 'react';

const useRecurringLogic = ({
  isRecurring,
  watch,
  setValue,
  isAddingExpense,
  categoryValue
}) => {
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
      }

      setValue('recurringEndDate', next);
    }
  }, [isRecurring, watchStartDate, watchFrequency, watchRepeatCount]);

  useEffect(() => {
    setValue('spendingType', isAddingExpense ? 'needs' : 'savings');
  }, [isAddingExpense]);

  useEffect(() => {
    setValue('category', categoryValue);
  }, [categoryValue]);

  useEffect(() => {
    if (isRecurring && watchDate) {
      setValue('recurringStartDate', watchDate);
    }
  }, [watchDate, isRecurring]);

  useEffect(() => {
    if (
      isRecurring &&
      watchStartDate &&
      watchEndDate &&
      new Date(watchEndDate) < new Date(watchStartDate)
    ) {
      setValue('recurringEndDate', null);
    }
  }, [watchStartDate, watchEndDate, isRecurring]);
};

export default useRecurringLogic;
