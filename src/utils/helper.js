import dayjs from 'dayjs'; // you'll need to install this if not already

export const groupTransactionsByMonth = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const month = dayjs(transaction.date).format('MMMM YYYY'); // e.g. "March 2025"
    if (!acc[month]) acc[month] = [];
    acc[month].push(transaction);
    return acc;
  }, {});
};

export let enFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
});
export const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
};
export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
export const formatIndianCurrency = (value) => {
  if (!value) return '';
  const num = value.replace(/,/g, '');
  if (isNaN(num)) return value;

  const parts = num.split('.');
  const intPart = parts[0];
  const decimalPart = parts[1] || '';

  let lastThree = intPart.slice(-3);
  const otherNumbers = intPart.slice(0, -3);

  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    (otherNumbers ? ',' : '') +
    lastThree;

  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
};

export const getReadableAmountWithEmojiAndLabel = (value) => {
  const raw = value.replace(/,/g, '');
  const num = Number(raw);

  if (!raw || isNaN(num) || !isFinite(num)) {
    return { text: '', emoji: '', label: '' };
  }

  if (num >= 1e12) {
    return {
      text: `${(num / 1e12).toFixed(2)} T`,
      emoji: '🤑🤑💵💰💸',
      label: `Trillion (₹${num.toLocaleString('en-IN')})`
    };
  }

  if (num >= 1e9) {
    return {
      text: `${(num / 1e9).toFixed(2)} B`,
      emoji: '🤑🤑💵🏦',
      label: `Billion (₹${num.toLocaleString('en-IN')})`
    };
  }

  if (num >= 1e7) {
    return {
      text: `${(num / 1e7).toFixed(2)} Cr`,
      emoji: '💵💰🤑',
      label: `Crore (₹${num.toLocaleString('en-IN')})`
    };
  }

  if (num >= 1e5) {
    return {
      text: `${(num / 1e5).toFixed(2)} L`,
      emoji: '💵💰',
      label: `Lakh (₹${num.toLocaleString('en-IN')})`
    };
  }

  if (num >= 1e3) {
    return {
      text: `${(num / 1e3).toFixed(2)} K`,
      emoji: '💵',
      label: `Thousand (₹${num.toLocaleString('en-IN')})`
    };
  }

  return {
    text: `${num}`,
    emoji: '🪙',
    label: `Exact (₹${num.toLocaleString('en-IN')})`
  };
};
