import {
  Paper,
  Group,
  Box,
  Text,
  Title,
  Badge,
  useMantineTheme,
  ThemeIcon,
  Tooltip,
  ActionIcon,
  Modal,
  Button,
  Menu,
  Stack
} from '@mantine/core';
import { TransactionType } from '../utils/transactionTypes';
import { SpendingType } from '../utils/spendingTypes';
import PropTypes from 'prop-types';
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconInfoCircle,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconX
} from '@tabler/icons-react';
import { useState } from 'react';
import { format } from 'date-fns';
import AddTransactionForm from './AddTransactionForm';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { closeEditTransaction, openEditTransaction } from '../store/uiSlice';

const TransactionItem = ({ transaction, onRemove, onSubmitEdit }) => {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const editingTransactionId = useSelector(
    (state) => state.ui.editingTransactionId
  );
  const isEditing = editingTransactionId === transaction._id;
  console.log('isEditing', isEditing);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  function getBadgeColor(spendingType) {
    switch (spendingType) {
      case TransactionType.Expense:
        return theme.colors.orange[9];
      case TransactionType.Income:
        return theme.colors.green[9];
      case SpendingType.Needs:
        return theme.colors.blue[9];
      case SpendingType.Savings:
        return theme.colors.green[9];
      case SpendingType.Wants:
        return theme.colors.yellow[9];
      default:
        return theme.colors.gray[9];
    }
  }

  const displayDate = (() => {
    let parsed = new Date(transaction.date);
    if (!transaction.date || isNaN(parsed)) {
      parsed = new Date();
    }
    return format(parsed, 'dd MMM yyyy');
  })();

  const handleEditSubmit = async (updatedTransaction) => {
    if (onSubmitEdit) {
      await onSubmitEdit(updatedTransaction);
    }
    dispatch(closeEditTransaction());
  };

  const handleDeleteConfirm = () => {
    if (onRemove) {
      onRemove();
    }
    setConfirmDeleteOpen(false);
  };

  const categoryName =
    (typeof transaction.categoryId === 'object' &&
      transaction.categoryId.name) ||
    (typeof transaction.category === 'object' && transaction.category.name) ||
    transaction.categoryId ||
    transaction.category ||
    'N/A';

  return (
    <>
      {/* Delete confirmation modal */}
      <Modal
        opened={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        title="Are you sure you want to delete?"
        centered
      >
        <Text size="sm" mb="md">
          This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button
            variant="outline"
            color="gray"
            onClick={() => setConfirmDeleteOpen(false)}
          >
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Paper radius="md" bg={theme.colors.dark[9]} p="lg" pos="relative">
        {isEditing ? (
          <Box>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Editing transaction
              </Text>
              <ActionIcon
                variant="outline"
                color="gray"
                onClick={() => dispatch(closeEditTransaction())}
                title="Cancel"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
            <AddTransactionForm
              isExpense={transaction.type === 'expense'}
              defaultValues={{
                ...transaction,
                date: transaction.date
                  ? new Date(transaction.date)
                  : new Date(),
                categoryId:
                  transaction.categoryId || transaction.category.name || ''
              }}
              onSubmitOverride={handleEditSubmit}
              isEdit={true}
            />
          </Box>
        ) : (
          <Group justify="space-between" align="flex-start">
            <Box flex="1">
              <Text fz="sm">{displayDate}</Text>

              <Group>
                <Title c="white" order={3}>
                  {transaction.description}
                </Title>
                {transaction.type === TransactionType.Expense && (
                  <Badge
                    variant="filled"
                    color={getBadgeColor(transaction.spendingType)}
                    radius="xs"
                  >
                    {transaction.spendingType}
                  </Badge>
                )}
              </Group>

              <Group gap={4} align="center" mt="xs">
                <Text>{categoryName}</Text>
                <Tooltip label="This is category" withArrow>
                  <IconInfoCircle size={16} stroke={1.5} />
                </Tooltip>
              </Group>
            </Box>

            <Box ta="right">
              {/* Kebab menu */}
              <Menu withinPortal position="bottom-end" shadow="md">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconEdit size={16} />}
                    onClick={() =>
                      dispatch(openEditTransaction(transaction._id))
                    }
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconTrash size={16} />}
                    color="red"
                    onClick={() => setConfirmDeleteOpen(true)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              {/* Amount & Type */}
              <Stack>
                <Group justify="flex-end" align="center" mt="sm">
                  <Text
                    c={transaction.type === 'expense' ? 'red' : 'teal'}
                    fw="bold"
                  >
                    ₹ {transaction.amount}
                  </Text>
                </Group>
                <Group justify="flex-end" align="center" mt="0">
                  <ThemeIcon
                    radius={'sm'}
                    bg={transaction.type === 'expense' ? 'red' : 'teal'}
                  >
                    {transaction.type === 'expense' ? (
                      <IconArrowDownRight size={18} />
                    ) : (
                      <IconArrowUpRight size={18} />
                    )}
                  </ThemeIcon>
                  <Text
                    tt="uppercase"
                    size="xs"
                    fw={'bold'}
                    c={transaction.type === 'expense' ? 'red' : 'teal'}
                  >
                    {transaction.type === 'expense' ? 'expense' : 'income'}
                  </Text>
                </Group>
              </Stack>

              {transaction.isRecurring && (
                <Paper
                  p="xs"
                  bg={theme.colors.dark[8]}
                  radius="md"
                  my="xs"
                  w="max-content"
                >
                  <Text size="xs" fs="italic">
                    Recurring
                  </Text>
                  {transaction.recurringDetails && (
                    <Text size="xs" fs="italic">
                      {`(${transaction.recurringDetails.remaining}/${transaction.recurringDetails.totalOccurrences} remaining)`}
                    </Text>
                  )}
                </Paper>
              )}
            </Box>
          </Group>
        )}
      </Paper>
    </>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string,
    date: PropTypes.string,
    description: PropTypes.string,
    amount: PropTypes.number,
    type: PropTypes.string,
    categoryId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string
      })
    ]),
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string
      })
    ]),
    spendingType: PropTypes.string,
    isRecurring: PropTypes.bool,
    recurringDetails: PropTypes.shape({
      totalOccurrences: PropTypes.number,
      completedOccurrences: PropTypes.number,
      remaining: PropTypes.number
    })
  }).isRequired,
  onRemove: PropTypes.func,
  onSubmitEdit: PropTypes.func
};

export default TransactionItem;
