export const labFlaws = {
  upload: {
    minimalValidation: true,
    noSizeLimit: true,
    verboseErrors: true,
    trustPublicUrl: true,
    weakCsrf: true
  },
  authz: {
    missingOwnershipChecks: true,
    insecureOwnerQuery: true,
    trustClientRole: true
  },
  storage: {
    longLivedUrls: true,
    insecureRulesDoc: true
  },
  share: {
    lowEntropyToken: true,
    ignoreExpiry: true,
    nonAtomicAccessCount: true,
    leakMetadata: true
  },
  admin: {
    clientSideOnlyGate: true,
    noServerRoleEnforcement: true,
    overfetch: true,
    weakAudit: true
  },
  logging: {
    minimalAudit: true,
    noRequestIds: true,
    verboseConsole: true
  },
  headers: {
    noCsp: true,
    noRateLimit: true,
    permissiveCors: true,
    verboseErrors: true
  },
  ai: {
    promptInjection: true,
    trustBoundaryViolations: true,
    dataLeakage: true
  }
};
