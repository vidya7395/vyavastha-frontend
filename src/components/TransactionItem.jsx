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

const TransactionItem = ({
  date,
  title,
  amount,
  badges,
  type,
  isRecurring
}) => {
  const theme = useMantineTheme();

  function getBadgeColor(badge) {
    debugger;
    switch (badge) {
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

  return (
    <Paper radius={'md'} bg={theme.colors.dark[9]} p={'lg'} pos={'relative'}>
      <Group justify="space-between">
        <Box>
          <Text fz={'sm'}>{date}</Text>
          <Title c={'white'} order={3}>
            {title}
          </Title>
        </Box>
        <Group
          w={'100%'}
          pos={'absolute'}
          top={'0'}
          m={'auto'}
          align="center"
          justify="center"
        >
          {badges.map((badge, index) => (
            <Badge
              variant="filled"
              color={getBadgeColor(badge)}
              key={index}
              radius={'xs'}
            >
              {badge}
            </Badge>
          ))}
        </Group>
        <Box ta={'right'}>
          <Text c={'white'} fw={'bold'}>
            ₹ {amount}
          </Text>
          {isRecurring && (
            <Text size="xs" fs={'italic'}>
              Recurring
            </Text>
          )}
        </Box>
      </Group>
    </Paper>
  );
};

export default TransactionItem;
