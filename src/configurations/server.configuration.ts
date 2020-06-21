export const ROUTES = {
  DASHBOARD: '/',
  RESULTS: '/results',
  CHALLENGE: {
    LIST: '/challenges',
    CREATION: '/challenge/create',
    SHOOTER: {
      LIST: '/shooters',
      CREATION: '/shooter/create',
      SHOT_RESULTS: {
        LIST: '/shot-results'
      }
    },
  },
  CLUBS: '/clubs',
  MYCLUB: '/myclub',
};

export const ERRORS = {
  EXPIRED_TOKEN: 'AUTH001',
  SHOT_RESULTS_SAVED_FOR_PARTICIPATION: 'PA0003'
};
