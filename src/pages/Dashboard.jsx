import { useEffect, useState } from 'react';
import SynopsisCard from '../components/SynopsisCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRecentExpense,
  fetchRecentIncome
} from '../store/transactionSlice';
import IncomeSection from '../components/IncomeSection';
// import ExpenseSection from "../components/ExpenseSection";
import { Flex } from '@mantine/core';
import ExpenseSection from '../components/ExpenseSection';

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
      {/* Income section */}
      <Flex mt={20} direction={'column'}>
        {recentIncome && (
          <IncomeSection recentIncomeData={recentIncome}></IncomeSection>
        )}
        {recentExpense && (
          <ExpenseSection recentExpenseData={recentExpense}></ExpenseSection>
        )}
      </Flex>

      {/* Expense section */}
    </>
  );
};

export default Dashboard;
