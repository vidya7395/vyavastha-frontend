import {
  Paper,
  Title,
  Text,
  Loader,
  Center,
  Stack,
  useMantineTheme,
  Box,
  Flex
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
import { useState } from 'react';
import { getCurrentMonth } from '../utils/helper';
import SectionHeading from './SectionHeading';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#a83279'
];

const RADIAN = Math.PI / 180;

// 🧠 Custom label component (inside pie)
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
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ExpenseReportChartOfCategory = () => {
  const theme = useMantineTheme();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth()); // default month

  const {
    data: report,
    isLoading,
    isError
  } = useGetReportsCategoryQuery(selectedMonth); // Replace with dynamic month if needed

  if (isLoading) {
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

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };
  return (
    <>
      <Flex
        gap="md"
        justify="space-between"
        align="center"
        direction="row"
        wrap="nowrap"
        mb={10}
        mt={30}
      >
        <SectionHeading
          title={' Expense Breakdown by Category'}
          description={'Where your money ran off to 💸'}
        ></SectionHeading>
        <MonthSelector onMonthChange={handleMonthChange} />
      </Flex>
      <Paper
        withBorder
        shadow="md"
        radius="lg"
        p="xl"
        bg={theme.colors.dark[9]}
        mb="lg"
      >
        <Stack spacing="sm" align="center">
          {/* 🗓️ Always show MonthSelector */}

          {isLoading ? (
            <Center h={300}>
              <Loader size="md" color="blue" />
            </Center>
          ) : isError ? (
            <Center h={300}>
              <Text color="red">Failed to load chart data.</Text>
            </Center>
          ) : !report?.report?.length ? (
            <Center h={300}>
              <Text color="dimmed">No data available for this month.</Text>
            </Center>
          ) : (
            <>
              <Text size="sm" color="dimmed">
                Total: ₹{total.toLocaleString()}
              </Text>
              <Box w="100%" h={360}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
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
