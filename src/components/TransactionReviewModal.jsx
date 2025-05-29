import {
  Modal,
  Button,
  ScrollArea,
  Paper,
  Text,
  Divider,
  Group,
  Box,
  Badge,
  ThemeIcon,
  Stack
} from '@mantine/core';
import PropTypes from 'prop-types';
import { useState } from 'react';
import AddExpenseForm from './AddExpenseForm'; // make sure this is reusable for both income/expense
import { format } from 'date-fns';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCalendarEvent,
  IconCategory2,
  IconCheck
} from '@tabler/icons-react';
import { useAddTransactionMutation } from '../services/transactionApi';
import { showNotification } from '@mantine/notifications';

const TransactionReviewModal = ({ opened, onClose, parsedTransactions }) => {
  const [submitted, setSubmitted] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [addTransaction] = useAddTransactionMutation();

  const handleSubmitSingle = async (transaction, index) => {
    try {
      await addTransaction([transaction]).unwrap();
      setSubmitted((prev) => [...prev, index]);
      showNotification({
        title: 'Submitted',
        message: 'Transaction submitted',
        color: 'teal'
      });
    } catch (error) {
      console.error('Submit erroree:', error);
      showNotification({
        title: 'Error',
        message: 'Submission failed',
        color: 'red'
      });
    }
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
            {parsedTransactions.map((txn, idx) => {
              const isSubmitted = submitted.includes(idx);
              const isExpense = txn.type === 'expense';
              const displayDate =
                txn.date instanceof Date
                  ? format(txn.date, 'dd MMM yyyy')
                  : format(new Date(txn.date), 'dd MMM yyyy');

              return (
                <Paper
                  key={idx}
                  withBorder
                  radius="lg"
                  p="md"
                  mb="sm"
                  shadow="xs"
                  bg="dark.8"
                  sx={{
                    borderColor: isSubmitted ? '#2ecc71' : undefined,
                    opacity: isSubmitted ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
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
                        <AddExpenseForm
                          isExpense={isExpense}
                          defaultValues={txn}
                          onSubmitOverride={async (data) => {
                            await handleSubmitSingle(data, idx);
                            setEditingIndex(null);
                          }}
                        />
                      </Box>
                    </>
                  ) : (
                    <Group
                      align="start"
                      position="apart"
                      spacing="md"
                      wrap="nowrap"
                    >
                      {/* Amount + Type */}
                      <Stack spacing={4} align="center" w={100}>
                        <ThemeIcon
                          size="lg"
                          radius="xl"
                          color={isExpense ? 'red' : 'teal'}
                          variant="light"
                        >
                          {isExpense ? (
                            <IconArrowDownRight size={18} />
                          ) : (
                            <IconArrowUpRight size={18} />
                          )}
                        </ThemeIcon>
                        <Text
                          size="lg"
                          fw={700}
                          color={isExpense ? 'red' : 'teal'}
                        >
                          ₹{txn.amount}
                        </Text>
                        <Badge
                          variant="light"
                          color={isExpense ? 'red' : 'green'}
                        >
                          {txn.type.toUpperCase()}
                        </Badge>
                      </Stack>

                      {/* Info Section */}
                      <Stack spacing={6} style={{ flex: 1 }}>
                        {/* Description */}

                        <Text tt="uppercase">
                          {txn.description.toUpperCase() || 'No description'}
                        </Text>

                        <Stack spacing={4}>
                          {/* Category */}
                          <Group spacing="xs" align="center">
                            <IconCategory2
                              size={16}
                              style={{ color: '#888' }}
                            />
                            <Text
                              size="xs"
                              tt="uppercase"
                              style={{ minWidth: 60 }}
                            >
                              Category :
                            </Text>
                            <Text size="sm" tt="uppercase" fw={500}>
                              {txn.categoryId || 'Uncategorized'}
                            </Text>
                          </Group>

                          {/* Date */}
                          <Group spacing="xs" align="center">
                            <IconCalendarEvent
                              size={16}
                              style={{ color: '#888' }}
                            />
                            <Text
                              size="xs"
                              tt="uppercase"
                              style={{ minWidth: 60 }}
                            >
                              Date :
                            </Text>
                            <Text size="sm" color="gray.0" fw={500}>
                              {displayDate}
                            </Text>
                          </Group>
                        </Stack>
                      </Stack>

                      {/* Action Buttons */}
                      <Stack spacing={6} align="flex-end">
                        <Button
                          size="xs"
                          variant="outline"
                          color="blue"
                          onClick={() => setEditingIndex(idx)}
                        >
                          Edit
                        </Button>
                        {isSubmitted && (
                          <Badge
                            color="teal"
                            variant="light"
                            leftSection={<IconCheck size={12} />}
                          >
                            Submitted
                          </Badge>
                        )}
                      </Stack>
                    </Group>
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
            parsedTransactions.length === 0 ||
            submitted.length === parsedTransactions.length
          }
        >
          🚀 Submit All
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
  parsedTransactions: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default TransactionReviewModal;
