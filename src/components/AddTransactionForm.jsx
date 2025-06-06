import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import {
  useAddCategoryMutation,
  useGetCategoriesQuery
} from '../services/categoryApi';
import {
  useAddTransactionMutation,
  useUpdateTransactionMutation
} from '../services/transactionApi';
import TransactionForm from './form/TransactionForm';
import { showNotification } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { closeEditTransaction } from '../store/uiSlice';

const AddTransactionForm = forwardRef(
  ({ isExpense, defaultValues, isEdit }, ref) => {
    const { data: categories = [] } = useGetCategoriesQuery();
    const [addCategory] = useAddCategoryMutation();
    const [addTransaction] = useAddTransactionMutation();
    const [updateTransaction] = useUpdateTransactionMutation();
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const dispatch = useDispatch();
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
    const handleUpdateTransaction = async (txn) => {
      try {
        await updateTransaction({ id: txn._id, ...txn }).unwrap();
        showNotification({
          title: 'Success',
          message: 'Transaction updated!',
          color: 'teal'
        });
        dispatch(closeEditTransaction());
      } catch (error) {
        console.error(error);
        showNotification({
          title: 'Error',
          message: 'Failed to update transaction',
          color: 'red'
        });
      }
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
        isEdit={isEdit}
        onSubmitTransaction={handleSubmitTransaction}
        isCreatingCategory={isCreatingCategory}
        defaultValues={defaultValues}
        onSubmitOverride={(txn) => handleUpdateTransaction(txn)}
        setSubmitRef={(submitFn) => {
          submitFormExternally = submitFn;
        }}
      />
    );
  }
);

AddTransactionForm.displayName = 'AddTransactionForm';

AddTransactionForm.propTypes = {
  isExpense: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object,
  onSubmitOverride: PropTypes.func,
  isEdit: PropTypes.bool.optional
};

export default AddTransactionForm;
