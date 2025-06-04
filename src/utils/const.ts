export enum SpendingStatus {
  EXCELLENT = 'excellent',
  OK = 'ok',
  WARNING = 'warning',
  LOW = 'low'
}


export const getStatusColorSpending = (status) => {
  switch (status) {
    case SpendingStatus.EXCELLENT:
      return 'green';
    case SpendingStatus.OK:
      return 'blue';
    case SpendingStatus.WARNING:
      return 'orange';
    case SpendingStatus.LOW:
      return 'gray';
    default:
      return 'black';
  }
};


export const BASE_URL = "/api"