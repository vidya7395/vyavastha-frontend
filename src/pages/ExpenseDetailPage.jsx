import { useEffect } from 'react';
import {
  Card,
  Text,
  useMantineTheme,
  Loader,
  Button,
  Stack,
  Box,
  Group
} from '@mantine/core';
import ExpenseTransactionDetailCard from '../components/ExpenseTransactionDetailCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsExpense } from '../store/transactionSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { openDrawer } from '../store/drawerSlice';
import SectionHeading from '../components/SectionHeading';

const ExpenseDetailPage = () => {
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const { transactionsExpense, loading, page, hasMore } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    // Reset transactions and page when needed
    // dispatch(resetTransactionsExpense());

    // Fetch transactions if the page is 1
    if (page === 1) {
      dispatch(fetchTransactionsExpense({ page: 1, limit: 10 }));
    }
  }, [dispatch, page]);

  const loadMore = () => {
    if (!hasMore || loading) return;

    // Fetch the next page of transactions
    dispatch(fetchTransactionsExpense({ page, limit: 10 }));
  };
  const handleOpenExpenseDrawer = (drawerId) => {
    dispatch(
      openDrawer({
        id: drawerId,
        contentType: 'AddTransaction'
      })
    );
  };
  return (
    <Box>
      <Group justify="space-between">
        <SectionHeading
          title={'Expenses'}
          description={'Income Transactions of July'}
        />
        <Button
          variant="light"
          size="xs"
          onClick={() => handleOpenExpenseDrawer('expenseDrawer')}
        >
          Add Expense
        </Button>
      </Group>

      {/* Transaction List with Infin ite Scroll */}
      <InfiniteScroll
        dataLength={transactionsExpense.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<Loader size="sm" />}
        scrollThreshold={0.9} // Trigger loading when scrolled to 90% of the list
      >
        <Stack>
          {transactionsExpense.map((transaction) => (
            <ExpenseTransactionDetailCard
              key={transaction._id} // Ensure each key is unique
              data={transaction}
            />
          ))}
        </Stack>
      </InfiniteScroll>
    </Box>
  );
};

export default ExpenseDetailPage;
