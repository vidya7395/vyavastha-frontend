import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Group, Loader, Stack } from '@mantine/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import ExpenseTransactionDetailCard from '../components/ExpenseTransactionDetailCard';
import SectionHeading from '../components/SectionHeading';
import { useDispatch } from 'react-redux';
import { openDrawer } from '../store/drawerSlice';
import {
  useGetTransactionsExpenseQuery,
  useGetTransactionsIncomeQuery
} from '../services/transactionApi';
import PropTypes from 'prop-types';

const TransactionDetailPage = ({ isShowExpense }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [allTransactions, setAllTransactions] = useState([]);

  const limit = 10;

  const expenseQuery = useGetTransactionsExpenseQuery({ page, limit });
  const incomeQuery = useGetTransactionsIncomeQuery({ page, limit });

  const { data, isFetching, isLoading, refetch } = isShowExpense
    ? expenseQuery
    : incomeQuery;

  const transactions = useMemo(() => data?.transactions || [], [data]);

  const hasMore = data?.transactions?.length === limit;

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (page === 1) {
      setAllTransactions([]);
    } else {
      setAllTransactions((prev) => [...prev, ...transactions]);
    }
  }, [page]);

  useEffect(() => {
    if (page === 1 && transactions.length > 0) {
      setAllTransactions(transactions);
    }
  }, [transactions]);

  const handleOpenDrawer = () => {
    dispatch(
      openDrawer({
        id: isShowExpense ? 'expenseDrawer' : 'incomeDrawer',
        contentType: 'AddTransaction'
      })
    );
  };

  const title = isShowExpense ? 'Expenses' : 'Income';
  const description = `${title} Transactions of March`;

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <SectionHeading title={title} description={description} />
        <Button variant="light" size="xs" onClick={handleOpenDrawer}>
          {`Add ${title}`}
        </Button>
      </Group>

      {isLoading && page === 1 ? (
        <Loader size="sm" />
      ) : (
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
      )}
    </Box>
  );
};
TransactionDetailPage.propTypes = {
  isShowExpense: PropTypes.bool.isRequired
};

export default TransactionDetailPage;
