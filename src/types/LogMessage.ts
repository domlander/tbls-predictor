const LOG_MESSAGE_TYPE = {
  fixture_added: 101,
  fixture_amended: 102,
  fixture_deleted: 103,
  /**
   *  The populateFixtures serverless function has been run and found no differences between the FPL API and the DB
   */
  populate_fixtures_no_change: 104,
};

type LogMessage = {
  type: keyof typeof LOG_MESSAGE_TYPE;
  message: string;
  /**
   * The time the log message was created
   */
  createdAt: string;
  [key: string]: string | number;
};

export default LogMessage;
export { LOG_MESSAGE_TYPE };
