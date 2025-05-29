import { Button, Group } from '@mantine/core';
import PropTypes from 'prop-types';

const FormFooter = ({ isExpense, onSubmitLabel, totalAmount }) => {
  return (
    <>
      <Group position="right" mt={30}>
        <Button type="submit">{onSubmitLabel}</Button>
      </Group>

      {totalAmount > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>
            Total {isExpense ? 'Expenses' : 'Income'} Added:{' '}
            {totalAmount.toFixed(2)}
          </h3>
        </div>
      )}
    </>
  );
};

FormFooter.propTypes = {
  isExpense: PropTypes.bool.isRequired,
  onSubmitLabel: PropTypes.string.isRequired,
  totalAmount: PropTypes.number.isRequired
};

export default FormFooter;
