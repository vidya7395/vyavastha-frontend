import { Button, Flex, Stack, Text } from '@mantine/core';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import SectionHeading from './SectionHeading';
import TransactionItem from './TransactionItem';

const IncomeSection = ({ recentIncomeData }) => {
  const navigate = useNavigate();
  const incomeTrans = recentIncomeData?.recentIncome?.map((transaction) => {
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
      spendingType: transaction.spendingType, // Default spendingType (change if required),
      isRecurring: transaction.recurring
    };
  });

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
      >
        <SectionHeading
          title={'Recent Incomes'}
          description={`You have total ${recentIncomeData?.recentIncome?.length} income for this month`}
        ></SectionHeading>

        <Button
          variant="white"
          color="dark"
          size="compact-sm"
          onClick={(event) => {
            event.stopPropagation(); // ✅ Stop event from reaching Accordion.Control
            openAddIncomeModal();
            navigate('/finance');
          }}
        >
          <Text size="sm" fw={500}>
            View All
          </Text>
        </Button>
      </Flex>

      <Stack>
        {incomeTrans.map((income) => (
          <TransactionItem
            key={income.key}
            amount={income.amount}
            date={`${income.date} ${income.month}`}
            title={income.description}
            badges={[income.category]}
            type={income.type}
            spendingTypes={income.spendingType}
            isRecurring={income.isRecurring}
            category={income.category}
          />
        ))}
      </Stack>
    </>
  );
};
IncomeSection.propTypes = {
  recentIncomeData: PropTypes.array.isRequired,
  isRecurring: PropTypes.bool.isRequired
};
export default IncomeSection;
