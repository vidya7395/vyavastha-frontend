import {
  SegmentedControl,
  Button,
  Box,
  Group,
  Divider,
  Text
} from '@mantine/core';
import AddTransactionForm from './AddTransactionForm';
import SmartInput from './SmartInput';
import { useState } from 'react';
import PropTypes from 'prop-types';
import TransactionReviewModal from './TransactionReviewModal';
import { useDispatch } from 'react-redux';
import { drawerSize } from '../store/drawerSlice';

const AddTransactionParent = ({ drawerId }) => {
  const [selectedTab, setSelectedTab] = useState(
    drawerId === 'expenseDrawer' ? 'expenses' : 'income'
  );

  const [useSmartInput, setUseSmartInput] = useState(false);
  const [, setParsedTransactions] = useState([]);
  const dispatch = useDispatch();

  const [parsedData, setParsedData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const handleParsed = (parsed) => {
    setParsedData(parsed);
    setModalOpen(true); // ✅ Show the modal
  };
  const handleSwitchSmartInput = () => {
    setUseSmartInput(!useSmartInput);
    if (!useSmartInput) {
      dispatch(drawerSize({ id: drawerId, size: 'lg' }));
    } else {
      dispatch(drawerSize({ id: drawerId, size: 'lg' }));
    }
  };
  return (
    <>
      <Box height="100%">
        {/* Toggle Smart / Legacy */}
        <Group position="apart" mb="sm">
          <Text fw={700}>
            {useSmartInput ? 'Smart Transaction Input' : 'Legacy Form Input'}
          </Text>
          <Button
            variant="light"
            size="xs"
            onClick={() => handleSwitchSmartInput()}
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
              <AddTransactionForm
                onSubmitOverride={undefined}
                isEdit={false}
                isExpense={selectedTab === 'expenses'}
              />
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
    </>
  );
};

AddTransactionParent.propTypes = {
  drawerId: PropTypes.string.isRequired
};

export default AddTransactionParent;
