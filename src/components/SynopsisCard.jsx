import {
  Card,
  Divider,
  Flex,
  Grid,
  Text,
  Loader,
  Group,
  Tooltip,
  ActionIcon,
  Box,
  useMantineTheme,
  Transition
} from '@mantine/core';
import { enFormatter, getCurrentMonth } from '../utils/helper';
import { useState } from 'react';
import MonthSelector from './MonthSelector';
import { useGetTransactionSummaryQuery } from '../services/transactionApi';
import { IconCancel, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useHover } from '@mantine/hooks';

const SynopsisCard = () => {
  const theme = useMantineTheme();

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth()); // default month
  const [incomeVisibility, setIncomeVisibility] = useState(false);
  const [balanceVisibility, setBalanceVisibility] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const { hovered, ref } = useHover();

  const {
    data: summary,
    isLoading,
    isError
  } = useGetTransactionSummaryQuery(selectedMonth);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  const { balance, totalExpense, totalIncome, breakdown, aiInsight } =
    summary || {};

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

          <Group
            ref={ref}
            onClick={() => setShowInsight(!showInsight)}
            spacing="xs"
            style={{
              cursor: 'pointer',
              borderRadius: 8
            }}
          >
            <Text
              size="sm"
              fw={500}
              style={{
                backgroundImage:
                  'linear-gradient(to right, #f36961 20%, #759beb 60%, #65beb3 80%, #70db96 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ✨ Click to see what your financial buddy says
            </Text>

            <Transition
              mounted={hovered}
              transition="slide-right"
              duration={300}
              timingFunction="ease"
            >
              {(styles) => (
                <Text size="sm" style={{ ...styles }}>
                  👈
                </Text>
              )}
            </Transition>
          </Group>

          {aiInsight && (
            <Card
              shadow="sm"
              radius="md"
              p="md"
              gap="sm"
              bg={theme.colors.dark[7]}
              style={{
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              {showInsight && (
                <Group p="md" style={{ borderRadius: '8px' }}>
                  <Flex
                    justify={'space-between'}
                    align="center"
                    gap="sm"
                    w={'100%'}
                  >
                    <Flex align="center" gap="sm">
                      <Box
                        w={32}
                        h={32}
                        bg="teal"
                        style={{
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center'
                        }}
                      >
                        <Text color="white" size="sm">
                          🤖
                        </Text>
                      </Box>
                      <Text size="xs" tt={'uppercase'} fw={700}>
                        Your smart assistant says:
                      </Text>
                    </Flex>
                    <ActionIcon
                      variant="light"
                      color="teal"
                      onClick={() => setShowInsight(!showInsight)}
                    >
                      <IconCancel size={18} />
                    </ActionIcon>
                  </Flex>
                  <Box>
                    <Text size="sm" style={{ lineHeight: 1.5 }}>
                      {aiInsight}
                    </Text>
                  </Box>
                </Group>
              )}
            </Card>
          )}
        </div>

        <MonthSelector onMonthChange={handleMonthChange} />
      </Flex>
      <Divider style={{ margin: '20px 0px' }} />

      <Group grow>
        <Card shadow="sm" style={{ backgroundColor: '#18201D' }}>
          <Text fw={700} size={'xs'}>
            Total Income
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text
              c="green"
              fw={700}
              size="sm"
              style={{
                transition: 'filter 0.3s, opacity 0.3s',
                filter: incomeVisibility ? 'none' : 'blur(5px)',
                opacity: incomeVisibility ? 1 : 0.6
              }}
            >
              {enFormatter.format(totalIncome)}
            </Text>

            <Tooltip label={incomeVisibility ? 'Hide' : 'Show'} withArrow>
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => setIncomeVisibility((v) => !v)}
                aria-label="Toggle income visibility"
              >
                {incomeVisibility ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </ActionIcon>
            </Tooltip>
          </div>
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

          <Group align="center" justify="center">
            <Text
              fw={700}
              size="sm"
              style={{
                transition: 'filter 0.3s, opacity 0.3s',
                filter: balanceVisibility ? 'none' : 'blur(5px)',
                opacity: balanceVisibility ? 1 : 0.6
              }}
            >
              {enFormatter.format(balance)}
            </Text>

            <Tooltip label={balanceVisibility ? 'Hide' : 'Show'} withArrow>
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => setBalanceVisibility((v) => !v)}
                aria-label="Toggle income visibility"
              >
                {balanceVisibility ? (
                  <IconEyeOff size={18} />
                ) : (
                  <IconEye size={18} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Card>
        <Tooltip
          label={needs.suggestion}
          withArrow
          position="top"
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
