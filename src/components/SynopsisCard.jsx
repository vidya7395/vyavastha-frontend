import { Card, Divider, Flex, Grid, Text, Loader } from '@mantine/core'; // Import Loader for better loading state
import { enFormatter } from '../utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionSummary } from '../store/transactionSlice';
import { useEffect } from 'react';
import MonthSelector from './MonthSelector';

const SynopsisCard = () => {
  const dispatch = useDispatch();
  const { summary, loading } = useSelector((state) => state.transaction);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        await dispatch(fetchTransactionSummary('2025-02')).unwrap();
      } catch (err) {
        console.error('Not able to fetch the summary:', err);
      }
    };

    if (!summary) {
      fetchSummary();
    }
  }, [dispatch, summary]); // Simplified dependency array

  const {
    balance,
    needs,
    needsPercentage,
    savings,
    savingsPercentage,
    totalExpense,
    totalIncome,
    wants,
    wantsPercentage
  } = summary || {}; // Handling case when summary is still null/undefined

  const handleMonthChange = async (month) => {
    await dispatch(fetchTransactionSummary(month)); // ✅ Fetch Data
  };

  const gradientBackground =
    balance > 0
      ? 'linear-gradient(135deg,rgb(1, 130, 108),rgb(1, 98, 103))' // ✅ Greenish-Teal (Positive)
      : 'linear-gradient(135deg, #ff4b1f, #9f0404)'; // ✅ Premium Red (Negative)

  return loading ? (
    <Card radius="md" padding="lg">
      <Flex justify={'space-between'}>
        <div>
          <Text size="xl" fw={700}>
            Your Financial Synopsis
          </Text>
          <Text size="md">
            Manage all your expenses and get a detailed view of reports
          </Text>
        </div>
        <MonthSelector onMonthChange={handleMonthChange} />
      </Flex>
      <Divider style={{ margin: '20px 0px' }} />
      <Grid>
        {/* Placeholder for loading */}
        <Grid.Col span={2}>
          <Loader size="lg" />
        </Grid.Col>
        <Grid.Col span={2}>
          <Loader size="lg" />
        </Grid.Col>
        <Grid.Col span={2}>
          <Loader size="lg" />
        </Grid.Col>
        {/* Add more placeholder columns for other sections */}
      </Grid>
    </Card>
  ) : (
    <Card radius="md" padding="lg">
      <Flex justify={'space-between'}>
        <div>
          <Text size="xl" fw={700}>
            Your Financial Synopsis
          </Text>
          <Text size="md">
            Manage your all expenses and get a detailed view of reports
          </Text>
        </div>
        <MonthSelector onMonthChange={handleMonthChange} />
      </Flex>
      <Divider style={{ margin: '20px 0px' }} />
      <Grid>
        <Grid.Col span={2}>
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Total Income
            </Text>
            <Text c="green" fw={700} size={'sm'}>
              {enFormatter.format(totalIncome)}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={2}>
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Total Expenses
            </Text>
            <Text c="red" fw={700} size={'sm'}>
              {enFormatter.format(totalExpense)}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={2}>
          <Card
            shadow="md"
            padding="md"
            radius="sm"
            style={{
              background: gradientBackground,
              color: '#fff', // White text for contrast
              textAlign: 'center'
            }}
          >
            <Text fw={700} size="xs" style={{ opacity: 0.9 }}>
              Balance
            </Text>
            <Text fw={700} size="sm">
              {enFormatter.format(balance)}
            </Text>
          </Card>
        </Grid.Col>

        {/* Needs, Wants, Savings */}

        <Grid.Col span={2}>
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Needs (50%)
            </Text>
            <Text
              c={needsPercentage >= 50 ? 'red' : 'blue'}
              fw={700}
              size={'sm'}
            >
              {enFormatter.format(needs)}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={2}>
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Wants (30%)
            </Text>
            <Text
              c={wantsPercentage >= 30 ? 'red' : 'orange'}
              fw={700}
              size={'sm'}
            >
              {enFormatter.format(wants)}
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={2}>
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Savings (20%)
            </Text>
            <Text
              c={savingsPercentage >= 20 ? 'green' : 'red'}
              fw={700}
              size={'sm'}
            >
              {enFormatter.format(savings)}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default SynopsisCard;
