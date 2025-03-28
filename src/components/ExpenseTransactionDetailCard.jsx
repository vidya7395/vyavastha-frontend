import PropTypes from 'prop-types';
import TransactionItem from './TransactionItem';
import { TransactionType } from '../utils/transactionTypes';

const ExpenseTransactionDetailCard = ({ data }) => {
  const {
    amount,
    spendingType,
    description,
    date,
    type,
    category,
    recurring,
    recurringDetails,
    _id
  } = data;
  const transactionDate = new Date(date);

  const transaction = {
    date: transactionDate.getDate(), // Extract day (e.g., 12)
    month: transactionDate.toLocaleString('en-US', { month: 'short' }) // Extract the day from date
  };

  return (
    <TransactionItem
      transactionId={_id}
      amount={amount}
      category={category.name}
      spendingType={spendingType}
      type={type}
      title={description}
      date={`${transaction.date} ${transaction.month}`}
      isRecurring={recurring}
      recurringDetails={recurringDetails}
    />
  );
};
ExpenseTransactionDetailCard.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string.optional,
    amount: PropTypes.number.isRequired,
    spendingType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    type: PropTypes.oneOf([TransactionType.Expense, TransactionType.Income]),
    category: PropTypes.string.isRequired,
    recurring: PropTypes.bool.isRequired,
    recurringDetails: PropTypes.shape({
      totalOccurrences: PropTypes.number,
      completedOccurrences: PropTypes.number,
      remaining: PropTypes.number
    }).optional
  }).isRequired
};

export default ExpenseTransactionDetailCard;
