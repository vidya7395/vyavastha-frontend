import {
  Modal,
  Button,
  ScrollArea,
  Paper,
  Text,
  Divider,
  Group,
  Box
} from '@mantine/core';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import AddTransactionForm from './AddTransactionForm'; // make sure this is reusable for both income/expense
import { format } from 'date-fns';

import { useAddTransactionMutation } from '../services/transactionApi';
import { showNotification } from '@mantine/notifications';
import TransactionItem from './TransactionItem';

const TransactionReviewModal = ({
  opened,
  onClose,
  parsedTransactions,
  setParsedTransactions
}) => {
  const [submitted, setSubmitted] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addTransaction] = useAddTransactionMutation();
  const [submittingAll, setSubmittingAll] = useState(false);

  const handleSubmitSingle = async (transaction, index) => {
    const safeDate =
      transaction.date && !isNaN(new Date(transaction.date))
        ? transaction.date
        : new Date().toISOString();

    const safeTransaction = {
      ...transaction,
      date: safeDate
    };

    try {
      await addTransaction([safeTransaction]).unwrap();
      showNotification({
        title: 'Submitted',
        message: 'Transaction submitted!',
        color: 'teal'
      });

      setSubmitted((prev) => [...prev, index]);

      setTimeout(() => {
        setParsedTransactions((prev) => prev.filter((_, i) => i !== index));
      }, 1000);
    } catch (error) {
      console.error('Submit error:', error);
      showNotification({
        title: 'Error',
        message: 'Submission failed!',
        color: 'red'
      });
    }
  };

  const handleSubmitAll = async () => {
    if (parsedTransactions.length === 0) return;
    setSubmittingAll(true);

    showNotification({
      id: 'submit-all',
      title: 'Submitting...',
      message: 'Submitting all transactions, please wait!',
      color: 'blue',
      loading: true
    });

    try {
      for (let i = 0; i < parsedTransactions.length; i++) {
        if (!submitted.includes(i)) {
          // Validate and fix date
          const txn = parsedTransactions[i];
          const safeDate =
            txn.date && !isNaN(new Date(txn.date))
              ? txn.date
              : new Date().toISOString();

          const safeTxn = { ...txn, date: safeDate };

          await addTransaction([safeTxn]).unwrap();
          setSubmitted((prev) => [...prev, i]);

          // Remove after a small delay for feedback
          await new Promise((res) => setTimeout(res, 300)); // smoother UX
          setParsedTransactions((prev) => prev.filter((_, idx) => idx !== i));
        }
      }

      showNotification({
        id: 'submit-all',
        title: 'All Done!',
        message: 'All transactions submitted successfully 🎉',
        color: 'teal',
        autoClose: 3000
      });

      onClose(); // Close modal after all done
      setSubmittingAll(false);
    } catch (error) {
      console.error('Submit All error:', error);
      showNotification({
        id: 'submit-all',
        title: 'Error',
        message: 'Some transactions failed to submit.',
        color: 'red',
        autoClose: 3000
      });
    }
  };

  useEffect(() => {
    if (parsedTransactions.length === 0) {
      onClose(); // Close the modal automatically
    }
  }, [parsedTransactions, onClose]);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Review Parsed Transactions"
      size="xl"
      centered
      padding="md"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {parsedTransactions.length === 0 ? (
        <Text>No transactions to review</Text>
      ) : (
        <ScrollArea h={500} type="always">
          <Box>
            {parsedTransactions.map((txn, idx) => {
              const isSubmitted = submitted.includes(idx);
              const isExpense = txn.type === 'expense';
              const displayDate = (() => {
                let parsed = new Date(txn.date);
                if (!txn.date || isNaN(parsed)) {
                  parsed = new Date(); // fallback to today’s date
                }
                return format(parsed, 'dd MMM yyyy');
              })();

              return (
                <Paper key={idx} mb="sm">
                  {editingIndex === idx ? (
                    <>
                      <Box pos="relative">
                        <Group
                          px="sm"
                          position="right"
                          mt="sm"
                          justify="space-between"
                        >
                          <Text size="md" c="dimmed">
                            Editing Transaction #{idx + 1}
                          </Text>
                          <Button
                            size="xs"
                            variant="outline"
                            color="gray.6"
                            onClick={() => setEditingIndex(null)}
                          >
                            Cancel
                          </Button>
                        </Group>
                        <AddTransactionForm
                          isExpense={isExpense}
                          defaultValues={{
                            ...txn,
                            date:
                              txn.date && !isNaN(new Date(txn.date))
                                ? new Date(txn.date)
                                : new Date() // fallback to today as real Date object
                          }}
                          onSubmitOverride={async (data) => {
                            await handleSubmitSingle(data, idx);
                            setEditingIndex(null);
                          }}
                          isEdit={false}
                        />
                      </Box>
                    </>
                  ) : (
                    <TransactionItem
                      transaction={txn}
                      onSubmitEdit={async (updatedTxn) => {
                        await handleSubmitSingle(updatedTxn, idx);
                      }}
                      onRemove={() =>
                        setParsedTransactions((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                    />
                  )}
                </Paper>
              );
            })}
          </Box>
        </ScrollArea>
      )}

      <Divider my="md" />
      <Group justify="space-between" mt="md">
        <Button
          onClick={handleSubmitAll}
          disabled={
            submittingAll ||
            parsedTransactions.length === 0 ||
            submitted.length === parsedTransactions.length
          }
        >
          Submit All
        </Button>
        <Button
          variant="default"
          onClick={onClose}
          disabled={submitted.length === parsedTransactions.length}
        >
          Close
        </Button>
      </Group>
    </Modal>
  );
};

TransactionReviewModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  parsedTransactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setParsedTransactions: PropTypes.func.isRequired // NEW
};

export default TransactionReviewModal;
