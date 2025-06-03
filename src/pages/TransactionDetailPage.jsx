import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Group, Loader, Stack, Text } from '@mantine/core';
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
import { groupTransactionsByMonth } from '../utils/helper';

const TransactionDetailPage = ({ isShowExpense }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [allTransactions, setAllTransactions] = useState([]);
  const title = isShowExpense ? 'Expenses' : 'Income';

  const [dynamicDescription, setDynamicDescription] = useState(
    `${title} Transactions`
  );

  const monthRefs = useRef({});
  const limit = 10;

  // Get query data
  const expenseQuery = useGetTransactionsExpenseQuery({ page, limit });
  const incomeQuery = useGetTransactionsIncomeQuery({ page, limit });

  const { data, isFetching, isLoading } = isShowExpense
    ? expenseQuery
    : incomeQuery;

  const transactions = useMemo(() => data?.transactions || [], [data]);
  const hasMore = transactions.length === limit;
  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Reset on tab change
  useEffect(() => {
    setAllTransactions([]);
    setPage(1);
  }, [isShowExpense]);

  // Merge new transactions
  useEffect(() => {
    if (page === 1) {
      setAllTransactions(transactions);
    } else if (transactions.length > 0) {
      setAllTransactions((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const newOnes = transactions.filter((t) => !existingIds.has(t._id));
        return [...prev, ...newOnes];
      });
    }
  }, [page, transactions]);

  // Group transactions by month
  const groupedTransactions = useMemo(
    () => groupTransactionsByMonth(allTransactions),
    [allTransactions]
  );

  // Intersection observer for month headers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const month = Object.entries(monthRefs.current).find(
            ([, el]) => el === visibleEntry.target
          )?.[0];
          if (month) {
            setDynamicDescription(`${title} Transactions of ${month}`);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    const monthElements = Object.values(monthRefs.current);
    monthElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    // Immediately set first month as visible if needed
    const firstMonth = Object.keys(monthRefs.current)[0];
    if (firstMonth) {
      setDynamicDescription(`${title} Transactions of ${firstMonth}`);
    }

    return () => observer.disconnect();
  }, [groupedTransactions, title]);

  const handleOpenDrawer = () => {
    dispatch(
      openDrawer({
        id: isShowExpense ? 'expenseDrawer' : 'incomeDrawer',
        contentType: 'AddTransaction'
      })
    );
  };

  return (
    <Box>
      {/* Sticky Header */}
      <Group
        justify="space-between"
        mb="md"
        pos="sticky"
        top="60px"
        bg="dark.7"
        style={{ zIndex: 8 }}
      >
        {/* <SectionHeading title={title} description={dynamicDescription} /> */}
        <SectionHeading
          title={title}
          description={'Expenses Transactions by Month'}
        />
        <Button variant="light" size="xs" onClick={handleOpenDrawer}>
          {`Add ${title}`}
        </Button>
      </Group>

      {/* Loader or Scrollable Transactions */}
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
            {Object.entries(groupedTransactions).map(([month, txns]) => (
              <Box key={month}>
                {/* Month Sticky Label */}
                <Box
                  className="month-label"
                  pb="xs"
                  ref={(el) => {
                    if (el) {
                      monthRefs.current[month] = el;
                    }
                  }}
                >
                  <Text size="sm" tt="uppercase" ta="center" fw={800}>
                    {month}
                  </Text>
                </Box>

                {txns.map((transaction) => (
                  <Box
                    mb="md"
                    key={`${isShowExpense ? 'expense' : 'income'}-${
                      transaction._id
                    }`}
                  >
                    <ExpenseTransactionDetailCard data={transaction} />
                  </Box>
                ))}
              </Box>
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
