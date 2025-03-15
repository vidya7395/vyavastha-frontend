import { Button, Flex, Stack, Text } from '@mantine/core';
import PropTypes from 'prop-types';

import SectionHeading from './SectionHeading';
import TransactionItem from './TransactionItem';

const ExpenseSection = ({ recentExpenseData }) => {
  const expenseTrans = recentExpenseData?.recentExpenses?.map((transaction) => {
    const transactionDate = new Date(transaction.date);
    return {
      key: transaction._id,
      date: transactionDate.getDate(), // Extract day (e.g., 12)
      month: transactionDate.toLocaleString('en-US', { month: 'short' }), // Extract the day from date
      description: transaction.description,
      transaction: transaction.category.name, // Use category name as transaction name
      category: transaction.category.name, // Same as above
      type: transaction.type, // 'income' in this case
      amount: transaction.amount,
      spendingType: transaction.spendingType // Default spendingType (change if required)
    };
  });
  console.log('element new');

  const openAddIncomeModal = () => {};
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
          title={'Recent Expenses'}
          description={`You have total ${recentExpenseData?.recentExpenses?.length} expense(s) for this month`}
        ></SectionHeading>

        <Button
          variant="white"
          color="dark"
          size="compact-sm"
          onClick={(event) => {
            event.stopPropagation(); // ✅ Stop event from reaching Accordion.Control
            openAddIncomeModal();
          }}
        >
          <Text size="sm" fw={500}>
            View All
          </Text>
        </Button>
      </Flex>
      <Stack>
        {expenseTrans.map((expense) => (
          <TransactionItem
            key={expense.key}
            amount={expense.amount}
            date={`${expense.date} ${expense.month}`}
            title={expense.description}
            badges={[expense.category, expense.spendingType]}
            type={expense.type}
            isRecurring={true}
          />
        ))}
      </Stack>
    </>
  );
};
ExpenseSection.propTypes = {
  recentExpenseData: PropTypes.array.isRequired
};
export default ExpenseSection;
