import { SegmentedControl } from '@mantine/core';
import AddExpenseForm from './AddExpenseForm';
import { useState } from 'react';
import PropTypes from 'prop-types';

const AddTransaction = ({ drawerId }) => {
  const [selectedTab, setSelectedTab] = useState(
    drawerId == 'expenseDrawer' ? 'expenses' : 'income'
  );
  return (
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

      <div style={{ marginTop: 20 }}>
        <AddExpenseForm isExpense={selectedTab === 'expenses'} />
      </div>
    </>
  );
};
AddTransaction.propTypes = {
  drawerId: PropTypes.string.isRequired
};

export default AddTransaction;
