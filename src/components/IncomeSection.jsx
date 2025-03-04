import {
  Badge,
  Button,
  Card,
  Center,
  Flex,
  Table,
  Text,
  useMantineTheme
} from '@mantine/core';
import { enFormatter } from '../utils/helper';
import PropTypes from 'prop-types';
import { IconHeart, IconTrendingUp } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const IncomeSection = ({ recentIncomeData }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const elements = recentIncomeData?.recentIncome?.map((transaction) => {
    const transactionDate = new Date(transaction.date);
    return {
      key: transaction._id,
      date: transactionDate.getDate(), // Extract day (e.g., 12)
      month: transactionDate.toLocaleString('en-US', { month: 'short' }), // Extract the day from date
      description: transaction.description,
      transaction: transaction.category.name, // Use category name as transaction name
      category: transaction.category.name, // Same as above
      type: transaction.type, // 'income' in this case
      amount: transaction.amount,
      spendingType: 'Income' // Default spendingType (change if required)
    };
  });

  const rows = elements.map((element) => (
    <Table.Tr key={element.key}>
      <Table.Td style={{ width: 30 }}>
        <Flex justify={Center}>
          <Card size="sm" justify={'center'} px="8" py={2}>
            <Text fw={700} size="sm" ta="center">
              {element.date}
            </Text>
            <Text tt="uppercase" size="sm" ta="center" c="orange" fw={500}>
              {element.month}
            </Text>
          </Card>
        </Flex>
      </Table.Td>
      <Table.Td>
        <div>
          <Text tt="uppercase" size="md">
            {element.transaction}
          </Text>
          <Text tt="uppercase" size="10px" mt={2}>
            {element.description}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Badge variant="outline" color={theme.colors.dark[5]} size="lg">
          <Flex
            gap="sm"
            justify="center"
            align="center"
            direction="row"
            wrap="nowrap"
          >
            <IconTrendingUp
              color={theme.colors.green[8]}
              size={18}
            ></IconTrendingUp>
            <Text c={theme.colors.dark[1]} size="sm">
              {element.category}
            </Text>
          </Flex>
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge variant="outline" color={theme.colors.dark[5]} size="lg">
          <Flex
            gap="sm"
            justify="center"
            align="center"
            direction="row"
            wrap="nowrap"
          >
            <IconHeart color={theme.colors.red[5]} size={14}></IconHeart>
            <Text c={theme.colors.dark[1]} size="sm">
              {element.spendingType}
            </Text>
          </Flex>
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text fw={700}>{enFormatter.format(element.amount)}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      <Table.Th>
        <Text size="sm" tt="uppercase" fw="500">
          Date
        </Text>
      </Table.Th>
      <Table.Th>
        <Text size="sm" tt="uppercase" fw="500">
          transaction
        </Text>
      </Table.Th>
      <Table.Th>
        <Text size="sm" tt="uppercase" fw="500">
          Category
        </Text>
      </Table.Th>
      <Table.Th>
        <Text size="sm" tt="uppercase" fw="500">
          Type
        </Text>
      </Table.Th>
      <Table.Th>
        <Text size="sm" tt="uppercase" fw="500">
          Amount
        </Text>
      </Table.Th>
    </Table.Tr>
  );
  const openAddIncomeModal = () => {};
  return (
    <>
      <Flex
        gap="md"
        justify="space-between"
        align="center"
        direction="row"
        wrap="nowrap"
        mb={10}
      >
        <div>
          <Text fw={700}>Recent Income</Text>
          <Text size="sm">You have total 2 income for this month</Text>
        </div>

        <Flex
          gap="md"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="nowrap"
        >
          <Button
            variant="white"
            color="dark"
            size="compact-sm"
            onClick={(event) => {
              event.stopPropagation(); // ✅ Stop event from reaching Accordion.Control
              openAddIncomeModal();
              navigate('/finance');
            }}
          >
            <Text size="sm" fw={500}>
              View All
            </Text>
          </Button>
        </Flex>
      </Flex>
      <Table
        withTableBorder
        withColumnBorders
        bgcolor={theme.colors.dark[9]}
        verticalSpacing="sm"
        borderColor={theme.colors.dark[7]}
      >
        <Table.Thead>{ths}</Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
        {/* {...rows} */}
      </Table>
    </>
  );
};
IncomeSection.propTypes = {
  recentIncomeData: PropTypes.array.isRequired
};
export default IncomeSection;
