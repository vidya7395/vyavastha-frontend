import {
  useGetRecentIncomeQuery,
  useGetRecentExpenseQuery
} from '../services/transactionApi';
import SynopsisCard from '../components/SynopsisCard';
import IncomeSection from '../components/IncomeSection';
import ExpenseSection from '../components/ExpenseSection';
import LearnPersonalFinance from '../components/LearnPersonalFinance';
import { Flex, Grid, Loader, Text } from '@mantine/core';

const Dashboard = () => {
  const {
    data: recentIncome,
    isLoading: isIncomeLoading,
    isError: isIncomeError
  } = useGetRecentIncomeQuery();

  const {
    data: recentExpense,
    isLoading: isExpenseLoading,
    isError: isExpenseError
  } = useGetRecentExpenseQuery();

  const isLoading = isIncomeLoading || isExpenseLoading;

  if (isLoading) return <Loader mt="xl" />;
  if (isIncomeError || isExpenseError) {
    return <Text color="red">Failed to load dashboard data.</Text>;
  }

  return (
    <>
      <SynopsisCard />

      <Grid gutter="xl" mt="xl">
        <Grid.Col span={8}>
          <Flex direction="column">
            {recentIncome && <IncomeSection recentIncomeData={recentIncome} />}
            {recentExpense && (
              <ExpenseSection recentExpenseData={recentExpense} />
            )}
          </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <LearnPersonalFinance />
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Dashboard;
