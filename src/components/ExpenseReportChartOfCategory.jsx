import {
  Paper,
  Text,
  Loader,
  Center,
  Stack,
  useMantineTheme,
  Box,
  Flex,
  Card
} from '@mantine/core';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useGetReportsCategoryQuery } from '../services/reportsApi';
import MonthSelector from './MonthSelector';
import { useEffect, useState } from 'react';
import { getCurrentMonth } from '../utils/helper';
import SectionHeading from './SectionHeading';
import { useGetSpendingInsightMutation } from '../services/aiApi';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#a83279'
];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={15}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ExpenseReportChartOfCategory = () => {
  const theme = useMantineTheme();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [insight, setInsight] = useState('');
  const [getSpendingInsight, { isLoading: insightLoading }] =
    useGetSpendingInsightMutation();

  const {
    data: report,
    isLoading: reportLoading,
    isError
  } = useGetReportsCategoryQuery(selectedMonth);

  useEffect(() => {
    if (report?.report?.length) {
      const top6 = [...report.report]
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 6)
        .map((item) => ({
          category: item.category,
          totalAmount: item.totalAmount
        }));

      getSpendingInsight(top6)
        .unwrap()
        .then((res) => setInsight(res.summary))
        .catch((err) => {
          console.error('AI insight failed:', err);
          setInsight('Could not generate insight.');
        });
    }
  }, [report]);

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  if (reportLoading) {
    return (
      <Center h={300}>
        <Loader size="md" color="blue" />
      </Center>
    );
  }

  const data = report.report.map((item) => ({
    name: item.category,
    value: item.totalAmount
  }));

  // const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <>
      <Flex
        gap="md"
        justify="space-between"
        direction="row"
        wrap="nowrap"
        mb={10}
        mt={30}
      >
        <SectionHeading
          title="Expense Breakdown by Category"
          description="Where your money ran off to 💸"
        />
        <MonthSelector onMonthChange={handleMonthChange} />
      </Flex>

      <Paper
        withBorder
        shadow="md"
        radius="lg"
        p="md"
        bg={theme.colors.dark[9]}
        mb="lg"
      >
        <Stack spacing="sm" align="center">
          {isError ? (
            <Text color="red">Failed to load chart data.</Text>
          ) : !report?.report?.length ? (
            <Text color="dimmed">No data available for this month.</Text>
          ) : (
            <>
              <Card
                shadow="sm"
                padding="md"
                radius="md"
                withBorder
                w="100%"
                bg={theme.colors.dark[9]}
              >
                <Text
                  size="xs"
                  c="gray"
                  mb={4}
                  fw={700}
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #f36961 20%, #759beb 60%, #65beb3 80%, #70db96 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                  tt="uppercase"
                >
                  ✨ Here’s what your money buddy thinks:
                </Text>

                {insightLoading ? (
                  <Text size="sm">
                    <span className="dot-loader">Thinking</span>
                  </Text>
                ) : (
                  <Text
                    size="md"
                    fw={600}
                    style={{
                      lineHeight: 1.5
                    }}
                  >
                    {insight}
                  </Text>
                )}
              </Card>

              <Box w="100%" h={360}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={0}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      animationDuration={1000}
                      animationEasing="ease-in-out"
                      animationBegin={0}
                      animationId={selectedMonth}
                      isAnimationActive={true}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </>
          )}
        </Stack>
      </Paper>
    </>
  );
};

export default ExpenseReportChartOfCategory;
