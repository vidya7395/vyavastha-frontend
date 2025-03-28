import { Box, Flex, Title } from '@mantine/core';
import TransactionDetailPage from './TransactionDetailPage';
// import SynopsisCard from '../components/SynopsisCard';

const FinanceDashboard = () => {
  return (
    <Box p="lg">
      {/* Dashboard Header */}
      <Title order={2} mb="md">
        Finance Overview
      </Title>

      {/* Summary Cards */}
      {/* <SynopsisCard /> */}

      {/* <Divider my="xl" /> */}

      {/* Transactions Section */}
      <Flex
        gap="lg"
        align="flex-start"
        direction={{ base: 'column', md: 'row' }} // responsive layout
      >
        {/* Income Section */}
        {/* <Box flex={1}>
          <TransactionDetailPage isShowExpense={false} />
        </Box> */}

        {/* Expense Section */}
        <Box flex={1}>
          <TransactionDetailPage isShowExpense={true} />
        </Box>
      </Flex>
    </Box>
  );
};

export default FinanceDashboard;
