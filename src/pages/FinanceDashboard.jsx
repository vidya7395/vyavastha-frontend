import { Box } from '@mantine/core';
import SynopsisCard from '../components/SynopsisCard';
import ExpenseDetailPage from './ExpenseDetailPage';

const FinanceDashboard = () => {
  return (
    <>
      <SynopsisCard></SynopsisCard>
      <Box mt="30">
        <ExpenseDetailPage></ExpenseDetailPage>
      </Box>
    </>
  );
};

export default FinanceDashboard;
