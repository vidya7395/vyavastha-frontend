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
import { useState } from 'react';
import AddExpenseForm from './AddExpenseForm'; // make sure this is reusable for both income/expense

const TransactionReviewModal = ({ opened, onClose, parsedTransactions }) => {
  const [submitted, setSubmitted] = useState([]);

  const handleSubmitSingle = async (data, index) => {
    setSubmitted((prev) => [...prev, index]);
    // This assumes AddExpenseForm handles its own API call
  };

  const handleSubmitAll = async () => {
    for (let i = 0; i < parsedTransactions.length; i++) {
      if (!submitted.includes(i)) {
        await handleSubmitSingle(parsedTransactions[i], i);
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="🧠 Review Parsed Transactions"
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
            {parsedTransactions.map((txn, idx) => (
              <Paper
                key={idx}
                withBorder
                radius="md"
                p="md"
                mb="md"
                shadow="sm"
                bg={submitted.includes(idx) ? 'green.0' : 'dark.8'}
              >
                <AddExpenseForm
                  isExpense={txn.type === 'expense'}
                  defaultValues={txn}
                  onSubmitOverride={(data) => handleSubmitSingle(data, idx)}
                />
                {submitted.includes(idx) && (
                  <Text size="sm" color="teal">
                    ✅ Submitted
                  </Text>
                )}
              </Paper>
            ))}
          </Box>
        </ScrollArea>
      )}

      <Divider my="md" />
      <Group position="apart">
        <Button
          variant="default"
          onClick={onClose}
          disabled={submitted.length === parsedTransactions.length}
        >
          Close
        </Button>
        <Button
          onClick={handleSubmitAll}
          disabled={
            parsedTransactions.length === 0 ||
            submitted.length === parsedTransactions.length
          }
        >
          🚀 Submit All
        </Button>
      </Group>
    </Modal>
  );
};

TransactionReviewModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  parsedTransactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TransactionReviewModal;
