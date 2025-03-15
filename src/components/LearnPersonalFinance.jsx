import {
  Text,
  Title,
  Group,
  Stack,
  Box,
  Paper,
  useMantineTheme
} from '@mantine/core';
import {
  IconPigMoney,
  IconHeartbeat,
  IconShieldCheck,
  IconChartPie
} from '@tabler/icons-react';
import SectionHeading from './SectionHeading';

const LearnPersonalFinance = () => {
  const theme = useMantineTheme();

  const tiles = [
    {
      icon: <IconPigMoney size={40} />,
      title: 'Emergency Fund',
      description:
        'An emergency fund, also known as contingency fund, is a personal budget set aside as a financial safety net for future mishaps or unexpected expenses.'
    },
    {
      icon: <IconHeartbeat size={40} />,
      title: 'Health Insurance',
      description:
        'Health insurance or medical insurance (also known as medical aid in South Africa) is a type of insurance that covers the whole or a part of the risk of a person incurring medical expenses.'
    },
    {
      icon: <IconShieldCheck size={40} />,
      title: 'Term Life Insurance',
      description:
        'Term life insurance or term assurance is life insurance that provides coverage at a fixed rate of payments for a limited period of time, the relevant term.'
    },
    {
      icon: <IconChartPie size={40} />,
      title: '50-30-20 Rule',
      description:
        'The 50-30-20 rule recommends putting 50% of your money toward needs, 30% toward wants, and 20% toward savings.'
    }
  ];

  return (
    <Box>
      <SectionHeading
        title={'Learn Personal Finance'}
        description={'Get started with the learning finance'}
      ></SectionHeading>
      <Stack mt="lg" gap={'sm'}>
        {tiles.map((tile) => (
          <Paper
            bg={theme.colors.dark[9]}
            key={tile.title}
            shadow="xs"
            radius={'md'}
          >
            <Group p={'lg'}>
              {tile.icon}
              <div>
                <Title order={5}>{tile.title}</Title>
                <Text size="xs">{tile.description}</Text>
              </div>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default LearnPersonalFinance;
