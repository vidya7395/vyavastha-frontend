import {
  SegmentedControl,
  Button,
  Box,
  Group,
  Divider,
  Text
} from '@mantine/core';
import AddExpenseForm from './AddExpenseForm';
import SmartInput from './SmartInput';
import { useState } from 'react';
import PropTypes from 'prop-types';
import TransactionReviewModal from './TransactionReviewModal';

const AddTransaction = ({ drawerId }) => {
  const [selectedTab, setSelectedTab] = useState(
    drawerId === 'expenseDrawer' ? 'expenses' : 'income'
  );

  const [useSmartInput, setUseSmartInput] = useState(true);
  const [parsedTransactions, setParsedTransactions] = useState([]);

  const [parsedData, setParsedData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const handleParsed = (parsed) => {
    setParsedData(parsed);
    setModalOpen(true);
  };
  return (
    <>
      <Box>
        {/* Toggle Smart / Legacy */}
        <Group position="apart" mb="sm">
          <Text fw={700}>
            {useSmartInput ? 'Smart Transaction Input' : 'Legacy Form Input'}
          </Text>
          <Button
            variant="light"
            size="xs"
            onClick={() => setUseSmartInput(!useSmartInput)}
          >
            Switch to {useSmartInput ? 'Legacy Form' : 'Smart Input'}
          </Button>
        </Group>

        <Divider mb="md" />

        {/* Input UI */}
        {useSmartInput ? (
          <SmartInput onParse={handleParsed} />
        ) : (
          <>
            <SegmentedControl
              value={selectedTab}
              onChange={setSelectedTab}
              data={[
                { label: 'Expenses', value: 'expenses' },
                { label: 'Income', value: 'income' }
              ]}
              fullWidth
            />
            <Box mt="md">
              <AddExpenseForm isExpense={selectedTab === 'expenses'} />
            </Box>
          </>
        )}
      </Box>
      <TransactionReviewModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        parsedTransactions={parsedData}
        setParsedTransactions={setParsedTransactions}
      />
      ;
    </>
  );
};

AddTransaction.propTypes = {
  drawerId: PropTypes.string.isRequired
};

export default AddTransaction;
