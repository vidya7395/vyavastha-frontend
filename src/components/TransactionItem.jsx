import {
  Paper,
  Group,
  Box,
  Text,
  Title,
  Badge,
  useMantineTheme
} from '@mantine/core';
import { TransactionType } from '../utils/transactionTypes';
import { SpendingType } from '../utils/spendingTypes';
import PropTypes from 'prop-types';
import api from '../api/axiosInstance';

const TransactionItem = ({
  date,
  title,
  amount,
  category,
  type,
  spendingType,
  isRecurring,
  recurringDetails,
  transactionId
}) => {
  const theme = useMantineTheme();

  function getBadgeColor(spendingType) {
    switch (spendingType) {
      case TransactionType.Expense:
        return theme.colors.orange[9];

      case TransactionType.Income:
        return theme.colors.green[9];

      case SpendingType.Needs:
        return theme.colors.blue[9];

      case SpendingType.Savings:
        return theme.colors.green[9];

      case SpendingType.Wants:
        return theme.colors.yellow[9];

      default:
        return theme.colors.gray[9];
    }
  }

  const handleDelete = async () => {
    // Implement the delete functionality here
    const response = await api.delete(`transaction/${transactionId}`, {
      withCredentials: true
    });
    return response.data;
  };
  return (
    <Paper radius={'md'} bg={theme.colors.dark[9]} p={'lg'} pos={'relative'}>
      <Group justify="space-between">
        <Box flex="1">
          <Group
            left={'0'}
            right={'0'}
            pos={'absolute'}
            top={'0'}
            m={'auto'}
            align="center"
            justify="center"
          >
            {/* <Badge variant="default" radius={'xs'}>
              {category}
            </Badge> */}
            {/* {type === TransactionType.Expense && (
              <Badge
                variant="filled"
                color={getBadgeColor(spendingType)}
                radius={'xs'}
              >
                {spendingType}
              </Badge>
            )} */}
          </Group>
          <Text fz={'sm'}>{date}</Text>
          <Group>
            <Title c={'white'} order={3}>
              {category}
            </Title>
            {type === TransactionType.Expense && (
              <Badge
                variant="filled"
                color={getBadgeColor(spendingType)}
                radius={'xs'}
              >
                {spendingType}
              </Badge>
            )}
          </Group>
          <Text>{title}</Text>
        </Box>

        <Box ta={'right'}>
          <Text c={'white'} fw={'bold'}>
            ₹ {amount}
          </Text>
          <>
            {isRecurring && (
              <Paper p={'xs'} bg={theme.colors.dark[8]} radius={'md'} my={'xs'}>
                <Group>
                  <Text size="xs" fs={'italic'}>
                    Recurring
                  </Text>
                </Group>
                {recurringDetails && (
                  <Text size="xs" fs={'italic'}>
                    {`(${recurringDetails.remaining}/${recurringDetails.totalOccurrences} remaining)`}
                  </Text>
                )}
              </Paper>
            )}
            {/* <button onClick={() => handleDelete()}>Delete</button> */}
          </>
        </Box>
      </Group>
    </Paper>
  );
};
TransactionItem.propTypes = {
  transactionId: PropTypes.string.optional,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string,
  isRecurring: PropTypes.bool,
  spendingType: PropTypes.string,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  recurringDetails: PropTypes.shape({
    totalOccurrences: PropTypes.number,
    completedOccurrences: PropTypes.number,
    remaining: PropTypes.number
  }).optional
};

export default TransactionItem;
