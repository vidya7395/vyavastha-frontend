import { Button, Flex, Stack, Text } from '@mantine/core';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import SectionHeading from './SectionHeading';
import TransactionItem from './TransactionItem';
const ExpenseSection = ({ recentExpenseData }) => {
  const navigate = useNavigate();
  const expenseTrans =
    recentExpenseData?.recentExpenses?.map((transaction) => {
      const transactionDate = transaction.date
        ? new Date(transaction.date)
        : new Date();

      return {
        ...transaction, // Spread any other existing fields
        key: transaction._id || transaction.id || Math.random(), // fallback to random key if no id
        date: transactionDate.toISOString(),
        categoryId: {
          _id: transaction.category?._id || transaction.category?.id || '',
          name: transaction.category?.name || 'N/A'
        },
        isRecurring: transaction.recurring ?? false,
        recurringDetails: transaction.recurringDetails ?? null
      };
    }) ?? [];

  console.log('expenseTrans', expenseTrans);

  const openAddIncomeModal = () => {
    // TODO: Implement opening of add expense modal
  };

  return (
    <>
      <Flex
        gap="md"
        justify="space-between"
        align="center"
        direction="row"
        wrap="nowrap"
        mb={10}
        mt={30}
      >
        <SectionHeading
          title="Recent Expenses"
          description={`You have total ${
            recentExpenseData?.recentExpenses?.length || 0
          } expense(s) for this month`}
        />

        <Button
          variant="white"
          color="dark"
          size="compact-sm"
          onClick={(event) => {
            event.stopPropagation();

            navigate('/finance');
          }}
        >
          <Text size="sm" fw={500}>
            View All
          </Text>
        </Button>
      </Flex>

      <Stack>
        {expenseTrans.map((expense) => (
          <TransactionItem key={expense.key} transaction={expense} />
        ))}
      </Stack>
    </>
  );
};

ExpenseSection.propTypes = {
  recentExpenseData: PropTypes.shape({
    recentExpenses: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.string,
        amount: PropTypes.number,
        type: PropTypes.string,
        category: PropTypes.shape({
          _id: PropTypes.string,
          name: PropTypes.string
        }),
        spendingType: PropTypes.string,
        recurring: PropTypes.bool,
        recurringDetails: PropTypes.object
      })
    )
  }).isRequired
};

export default ExpenseSection;
