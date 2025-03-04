import { SegmentedControl } from '@mantine/core';
import AddExpenseForm from './AddExpenseForm';
import { useState } from 'react';

const AddTransaction = () => {
  const [selectedTab, setSelectedTab] = useState('expenses');

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

      <div style={{ marginTop: '20px' }}>
        {selectedTab === 'expenses' ? (
          <AddExpenseForm></AddExpenseForm>
        ) : (
          <h1>Yeeahh</h1>
        )}
      </div>
    </>
  );
};

export default AddTransaction;
