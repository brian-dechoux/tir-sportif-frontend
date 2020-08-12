export const ROUTES = {
  DASHBOARD: '/',
  RESULTS: {
    LIST: '/results',
  },
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
  MYCLUB: {
    RESUME: '/myclub/resume',
    LICENSEES: '/myclub/licensees',
    BILLS: '/myclub/bills'
  }
};

export const ERRORS = {
  EXPIRED_TOKEN: 'AUTH001',
  SHOT_RESULTS_SAVED_FOR_PARTICIPATION: 'PA0003'
};
