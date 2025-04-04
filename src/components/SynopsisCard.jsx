import {
  Card,
  Divider,
  Flex,
  Grid,
  Text,
  Loader,
  Group,
  Tooltip
} from '@mantine/core';
import { enFormatter, getCurrentMonth } from '../utils/helper';
import { useState } from 'react';
import MonthSelector from './MonthSelector';
import { useGetTransactionSummaryQuery } from '../services/transactionApi';

const SynopsisCard = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth()); // default month

  const {
    data: summary,
    isLoading,
    isError
  } = useGetTransactionSummaryQuery(selectedMonth);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const {
    balance,
    needsPercentage,
    savingsPercentage,
    totalExpense,
    totalIncome,
    wantsPercentage,
    breakdown
  } = summary || {};
  const { needs, savings, wants } = breakdown || {};

  const gradientBackground =
    balance > 0
      ? 'linear-gradient(135deg,rgb(1, 130, 108),rgb(1, 98, 103))'
      : 'linear-gradient(135deg, #ff4b1f, #9f0404)';

  if (isLoading) {
    return (
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
          {[...Array(6)].map((_, i) => (
            <Grid.Col span={2} key={i}>
              <Loader size="lg" />
            </Grid.Col>
          ))}
        </Grid>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card radius="md" padding="lg">
        <Text color="red">Failed to load financial summary.</Text>
      </Card>
    );
  }

  return (
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

      <Group grow>
        <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
          <Text fw={700} size={'xs'}>
            Total Income
          </Text>
          <Text c="green" fw={700} size={'sm'}>
            {enFormatter.format(totalIncome)}
          </Text>
        </Card>

        <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
          <Text fw={700} size={'xs'}>
            Total Expenses
          </Text>
          <Text c="red" fw={700} size={'sm'}>
            {enFormatter.format(totalExpense)}
          </Text>
        </Card>

        <Card
          shadow="md"
          padding="md"
          radius="sm"
          style={{
            background: gradientBackground,
            color: '#fff',
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
        <Tooltip
          label={needs.suggestion}
          withArrow
          position="top"
          transitionDuration={200}
          transition="pop-top-right"
        >
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Needs (50%)
            </Text>
            <Text
              c={needs.percentage >= 50 ? 'red' : 'blue'}
              fw={700}
              size={'sm'}
            >
              {enFormatter.format(needs.actual)}/
              {enFormatter.format(needs.ideal)}
            </Text>
          </Card>
        </Tooltip>
        <Tooltip
          label={wants.suggestion}
          withArrow
          position="top"
          transitionDuration={200}
          transition="pop-top-right"
        >
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Wants (30%)
            </Text>
            <Text
              c={wants.percentage >= 30 ? 'red' : 'orange'}
              fw={700}
              size={'sm'}
            >
              {enFormatter.format(wants.actual)}/
              {enFormatter.format(wants.ideal)}
            </Text>
          </Card>
        </Tooltip>

        <Tooltip
          label={savings.suggestion}
          withArrow
          position="top"
          transitionDuration={200}
          transition="pop-top-right"
        >
          <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
            <Text fw={700} size={'xs'}>
              Savings (20%)
            </Text>
            <Text
              c={savings.percentage >= 20 ? 'green' : 'red'}
              fw={700}
              size={'sm'}
            >
              {enFormatter.format(savings.actual)}/
              {enFormatter.format(savings.ideal)}
            </Text>
          </Card>
        </Tooltip>
      </Group>
    </Card>
  );
};

export default SynopsisCard;
