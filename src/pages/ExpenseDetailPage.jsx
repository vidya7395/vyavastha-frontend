import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Group, Loader, Stack } from '@mantine/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import ExpenseTransactionDetailCard from '../components/ExpenseTransactionDetailCard';
import SectionHeading from '../components/SectionHeading';
import { useDispatch } from 'react-redux';
import { openDrawer } from '../store/drawerSlice';
import { useGetTransactionsExpenseQuery } from '../services/transactionApi';

const ExpenseDetailPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [allTransactions, setAllTransactions] = useState([]);

  const { data, isFetching } = useGetTransactionsExpenseQuery({
    page,
    limit: 10
  });

  const transactions = useMemo(() => data?.transactions || [], [data]);
  const hasMore = transactions.length >= 10;

  // Append new transactions to state
  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Update combined transactions list when new page is fetched
  useEffect(() => {
    if (transactions.length > 0) {
      setAllTransactions((prev) => [...prev, ...transactions]);
    }
  }, [transactions]);

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
          title="Expenses"
          description="Income Transactions of July"
        />
        <Button
          variant="light"
          size="xs"
          onClick={() => handleOpenExpenseDrawer('expenseDrawer')}
        >
          Add Expense
        </Button>
      </Group>

      <InfiniteScroll
        dataLength={allTransactions.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<Loader size="sm" />}
        scrollThreshold={0.9}
      >
        <Stack>
          {allTransactions.map((transaction) => (
            <ExpenseTransactionDetailCard
              key={transaction._id}
              data={transaction}
            />
          ))}
        </Stack>
      </InfiniteScroll>
    </Box>
  );
};

export default ExpenseDetailPage;
