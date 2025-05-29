import * as yup from 'yup';

const safeDate = () =>
  yup
    .date()
    .nullable()
    .transform((curr, orig) =>
      orig === 'null' || orig === '' || Array.isArray(orig) ? null : curr
    );

export const transactionSchema = yup.object().shape({
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
