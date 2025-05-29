import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import {
  useAddCategoryMutation,
  useGetCategoriesQuery
} from '../services/categoryApi';
import { useAddTransactionMutation } from '../services/transactionApi';
import TransactionForm from './form/TransactionForm';
import { showNotification } from '@mantine/notifications';

const AddExpenseForm = forwardRef(
  ({ isExpense, defaultValues, onSubmitOverride }, ref) => {
    const { data: categories = [] } = useGetCategoriesQuery();
    const [addCategory] = useAddCategoryMutation();
    const [addTransaction] = useAddTransactionMutation();
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    let submitFormExternally = null;

    const handleCreateCategory = async (name) => {
      const existingCategory = categories?.categories?.find(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      );

      if (existingCategory) {
        showNotification({
          title: 'Info',
          message: 'Category already exists',
          color: 'blue'
        });
        return existingCategory;
      }

      try {
        setIsCreatingCategory(true);
        const newCategory = await addCategory(name).unwrap();
        return newCategory;
      } catch (error) {
        console.error('Error creating category:', error);
        return null;
      } finally {
        setIsCreatingCategory(false);
      }
    };

    const handleSubmitTransaction = async (transaction) => {
      await addTransaction([transaction]);
    };

    // 👇 Expose the submit method via ref
    useImperativeHandle(ref, () => ({
      async submit() {
        if (submitFormExternally) {
          await submitFormExternally();
        }
      }
    }));

    return (
      <TransactionForm
        type={isExpense ? 'expense' : 'income'}
        categories={categories.categories ?? []}
        onCreateCategory={handleCreateCategory}
        onSubmitTransaction={handleSubmitTransaction}
        isCreatingCategory={isCreatingCategory}
        defaultValues={defaultValues}
        onSubmitOverride={(txn) => {
          onSubmitOverride?.(txn); // optional external override
        }}
        setSubmitRef={(submitFn) => {
          submitFormExternally = submitFn;
        }}
      />
    );
  }
);

AddExpenseForm.displayName = 'AddExpenseForm';

AddExpenseForm.propTypes = {
  isExpense: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
  onSubmitOverride: PropTypes.func
};

export default AddExpenseForm;
