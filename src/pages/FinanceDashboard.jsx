import { Box, Flex } from '@mantine/core';
import SynopsisCard from '../components/SynopsisCard';
import TransactionDetailPage from './TransactionDetailPage';

const FinanceDashboard = () => {
  return (
    <>
      <SynopsisCard></SynopsisCard>
      <Box mt="30">
        <Flex
          gap="md"
          justify="normal"
          align="normal"
          direction="row"
          wrap="nowrap"
        >
          <Box flex="1">
            <TransactionDetailPage
              isShowExpense={false}
            ></TransactionDetailPage>
          </Box>
          <Box flex="1">
            <TransactionDetailPage isShowExpense={true}></TransactionDetailPage>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default FinanceDashboard;
