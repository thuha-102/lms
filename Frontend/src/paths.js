export const paths = {
  index: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  /*auth: {
    auth0: {
      callback: '/auth/auth0/callback',
      login: '/auth/auth0/login'
    },
    jwt: {
      login: '/auth/jwt/login',
      register: '/auth/jwt/register'
    },
    firebase: {
      login: '/auth/firebase/login',
      register: '/auth/firebase/register'
    },
    amplify: {
      confirmRegister: '/auth/amplify/confirm-register',
      forgotPassword: '/auth/amplify/forgot-password',
      login: '/auth/amplify/login',
      register: '/auth/amplify/register',
      resetPassword: '/auth/amplify/reset-password'
    }
  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern'
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern'
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern'
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern'
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern'
    }
  },*/
  usedAuth: {
    auth0: {
      callback: '/used-auth/auth0/callback',
      login: '/used-auth/auth0/login'
    },
    jwt: {
      login: '/used-auth/jwt/login',
      register: '/used-auth/jwt/register'
    },
    firebase: {
      login: '/used-auth/firebase/login',
      register: '/used-auth/firebase/register'
    },
    amplify: {
      confirmRegister: '/used-auth/amplify/confirm-register',
      forgotPassword: '/used-auth/amplify/forgot-password',
      login: '/used-auth/amplify/login',
      register: '/used-auth/amplify/register',
      resetPassword: '/used-auth/amplify/reset-password'
    }
  },
  dashboard: {
    index: '/dashboard',
    academy: {
      index: '/dashboard/academy',
      courseDetails: '/dashboard/academy/courses/:courseId',
      lessonDetails: '/dashboard/academy/courses/lesson_admin',
    },
    account: '/dashboard/account',
    analytics: '/dashboard/analytics',
    blank: '/dashboard/blank',
    blog: {
      index: '/dashboard/blog',
      postDetails: '/dashboard/blog/:postId',
      postCreate: '/dashboard/blog/create'
    },
    forum: {
      index: '/dashboard/forum',
      details: '/dashboard/forum/:forumId',
      create: '/dashboard/forum/create'
    },
    calendar: '/dashboard/calendar',
    chat: '/dashboard/chat',
    code: '/dashboard/code',
    crypto: '/dashboard/crypto',
    customers: {
      index: '/dashboard/customers',
      details: '/dashboard/customers/:customerId',
      edit: '/dashboard/customers/:customerId/edit'
    },
    ecommerce: '/dashboard/ecommerce',
    explore: '/dashboard/explore',
    fileManager: '/dashboard/file-manager',
    invoices: {
      index: '/dashboard/invoices',
      details: '/dashboard/invoices/:orderId'
    },
    jobs: {
      index: '/dashboard/jobs',
      create: '/dashboard/jobs/create',
      companies: {
        details: '/dashboard/jobs/companies/:companyId'
      }
    },
    kanban: '/dashboard/kanban',
    learningPaths: {
      index: '/dashboard/learning-path',
      create: '/dashboard/learning-path/create'
    },
    logistics: {
      index: '/dashboard/logistics',
      fleet: '/dashboard/logistics/fleet'
    },
    note: '/dashboard/note',
    mail: '/dashboard/mail',
    model: {
      index: '/dashboard/model',
      details: '/dashboard/model/:modelId',
      create: '/dashboard/model/create',
      model_variation_create: '/dashboard/model/:modelId/modelVariationCreate'
    },
    dataset: {
      index: '/dashboard/dataset',
      details: '/dashboard/dataset/:datasetId',
      create: '/dashboard/dataset/create',
    },
    notebook: {
      index: '/dashboard/notebook',
      details: '/dashboard/notebook/:notebookId',
      create: '/dashboard/notebook/create'
    },
    orders: {
      index: '/dashboard/orders',
      details: '/dashboard/orders/:orderId'
    },
    products: {
      index: '/dashboard/products',
      create: '/dashboard/products/create'
    },
    personal_info: '/dashboard/personal-info',
    social: {
      index: '/dashboard/social',
      profile: '/dashboard/social/profile',
      feed: '/dashboard/social/feed'
    },
    topic_manage: '/dashboard/topic-manage',
    lm_manage: '/dashboard/lm-manage',
    account_manage: {
      index: '/dashboard/account-manage',
      create: '/dashboard/account-manage/create'
    }
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats'
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists'
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs'
  },
  docs: {
    analytics: {
      configuration: '/docs/analytics-configuration',
      eventTracking: '/docs/analytics-event-tracking',
      introduction: '/docs/analytics-introduction'
    },
    auth: {
      amplify: '/docs/auth-amplify',
      auth0: '/docs/auth-auth0',
      firebase: '/docs/auth-firebase',
      jwt: '/docs/auth-jwt'
    },
    changelog: '/docs/changelog',
    contact: '/docs/contact',
    dependencies: '/docs/dependencies',
    deployment: '/docs/deployment',
    environmentVariables: '/docs/environment-variables',
    gettingStarted: '/docs/getting-started',
    guards: {
      auth: '/docs/guards-auth',
      guest: '/docs/guards-guest',
      roleBased: '/docs/guards-role-based'
    },
    furtherSupport: '/docs/further-support',
    internationalization: '/docs/internationalization',
    mapbox: '/docs/mapbox',
    redux: '/docs/redux',
    routing: '/docs/routing',
    rtl: '/docs/rtl',
    serverCalls: '/docs/server-calls',
    settings: '/docs/settings',
    theming: '/docs/theming',
    welcome: '/docs/welcome'
  },
  401: '/401',
  404: '/404',
  500: '/500'
};
