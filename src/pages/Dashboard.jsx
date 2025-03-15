import { useEffect, useState } from 'react';
import SynopsisCard from '../components/SynopsisCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRecentExpense,
  fetchRecentIncome
} from '../store/transactionSlice';
import IncomeSection from '../components/IncomeSection';
// import ExpenseSection from "../components/ExpenseSection";
import { Flex, Grid } from '@mantine/core';
import ExpenseSection from '../components/ExpenseSection';
import LearnPersonalFinance from '../components/LearnPersonalFinance';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { recentIncome } = useSelector((state) => state.transaction);
  const { recentExpense } = useSelector((state) => state.transaction);
  useEffect(() => {
    const fetchRecentIncomes = async () => {
      try {
        await dispatch(fetchRecentIncome())
          .unwrap()
          .finally(() => setLoading(false));
      } catch (err) {
        console.error('Not able to fetched the recent income:', err);
      }
    };
    if (!recentIncome) {
      fetchRecentIncomes();
    }
    console.log('Recent Income', recentIncome);
  }, [dispatch, recentIncome]);
  useEffect(() => {
    const fetchRecentExpenses = async () => {
      try {
        await dispatch(fetchRecentExpense())
          .unwrap()
          .finally(() => setLoading(false));
      } catch (err) {
        console.error('Not able to fetched the recent expenses:', err);
      }
    };
    if (!recentExpense) {
      fetchRecentExpenses();
    }
    console.log('Recent Expense', recentExpense);
  }, [dispatch, recentExpense]);

  return loading ? (
    <h1>Loading</h1>
  ) : (
    <>
      <SynopsisCard></SynopsisCard>

      <Grid gutter={'xl'} mt={'xl'}>
        <Grid.Col span={8}>
          {/* Income section */}
          <Flex direction={'column'}>
            {recentIncome && (
              <IncomeSection recentIncomeData={recentIncome}></IncomeSection>
            )}
            {recentExpense && (
              <ExpenseSection
                recentExpenseData={recentExpense}
              ></ExpenseSection>
            )}
          </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <LearnPersonalFinance />
        </Grid.Col>
      </Grid>

      {/* Expense section */}
    </>
  );
};

export default Dashboard;
