export enum TimeStates {
  DAY_OFF = 'day off',
  OUTSIDE_SCHOOL_HOURS = 'outside school hours',
  SCHOOL_IN_CLASS_OUT = 'school is in session, but class is not',
  CLASS_IN_SESSION = 'class is in session'
}

export enum TimeTense {
  before = -1,
  after = 1,
  now = 0
}

// FLASH_SUCCESS = "SUCCESS"
// FLASH_INFO = "INFO"
// FLASH_WARN = "WARNING"
// FLASH_DANGER = "DANGER"
