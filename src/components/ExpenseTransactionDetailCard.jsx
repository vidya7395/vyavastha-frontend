import { Badge, Box, Card, Flex, Text } from '@mantine/core';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const ExpenseTransactionDetailCard = ({ data }) => {
  const { amount, spendingType, description, date } = data;
  return (
    <Card mt={20} style={{ position: 'relative' }} p={'sm'}>
      <Badge
        size="lg"
        style={{
          borderRadius: '0 0px 10px 10px',
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
        variant="light"
        color={
          (spendingType == 'savings' && 'green') ||
          (spendingType == 'needs' && 'blue') ||
          (spendingType == 'wants' && 'yellow')
        }
      >
        {spendingType}
      </Badge>
      <Flex
        mt={10}
        gap="md"
        justify="space-between"
        align="flex-start"
        direction="row"
        wrap="nowrap"
      >
        <Box>
          <Text size="sm">{format(new Date(date), 'd MMMM yyyy')}</Text>
          <Text size="lg" fw={700}>
            {description}
          </Text>
        </Box>
        <Box>
          <Text size="lg" fw={700}>
            {amount}
          </Text>
          <Text size="xs">Recurring</Text>
        </Box>
      </Flex>
    </Card>
  );
};
ExpenseTransactionDetailCard.propTypes = {
  data: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    spendingType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  }).isRequired
};

export default ExpenseTransactionDetailCard;
