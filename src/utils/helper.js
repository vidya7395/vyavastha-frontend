export let enFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
});
export const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(date));
};
