export const DDL_STATEMENTS = [
  /**
   * Creates table for user profiles.
   *
   * @name Profiles
   * @type {CreateTable}
   * @column id - Profile's unique identifier
   * @column email - Email for verification
   * @column password - Hashed password to profile
   * @column username - Username, human readable memorable
   *   identifier. Used for mentions, links and so on
   * @column bio - User defined profile description
   * @column created - Time when the profile was created
   */
  `CREATE TABLE Profiles (
  id       STRING(36)  NOT NULL,
  email    STRING(320) NOT NULL,
  password STRING(70) NOT NULL,
  username STRING(16)  NOT NULL,
  bio      STRING(256) NOT NULL,
  created  TIMESTAMP   NOT NULL
) PRIMARY KEY (id)`,
  /**
   * Creates table for user posts
   * @name Posts
   * @type {CreateTable}
   * @column id - Post uniq identifier
   * @column authorId - Id of profile used to post it
   * @column text - Content of the post
   * @column created - Time when the post was created
   */
  `CREATE TABLE Posts (
  id       STRING(11)    NOT NULL,
  authorId STRING(36)    NOT NULL,
  text     STRING(10000) NOT NULL,
  created  TIMESTAMP     NOT NULL,

  FOREIGN KEY (authorId) REFERENCES Profiles(id)
) PRIMARY KEY (id)`,
  /**
   * Creates table for user post comments
   * @name Comments
   * @type {CreateTable}
   * @column id - Comment uniq identifier
   * @column authorId - Id of the profile used to comment it
   * @column postId - Id of the commented post
   * @column text - Content of the comment
   * @column created - Time when the post was created
   */
  `CREATE TABLE Comments (
  id       STRING(26)    NOT NULL,
  authorId STRING(36)    NOT NULL,
  postId   STRING(11)    NOT NULL,
  text     STRING(10000) NOT NULL,
  created  TIMESTAMP     NOT NULL,

  FOREIGN KEY (authorId) REFERENCES Profiles(id),
  FOREIGN KEY (postId)   REFERENCES Posts(id)
) PRIMARY KEY (id)`,
  /**
   * Creates table for user post replies
   * @name Replies
   * @type {CreateTable}
   * @column id - Reply uniq identifier
   * @column authorId - Id of the profile used to leave a reply
   * @column commentId - Id of the replied comment
   * @column text - Content of the reply
   * @column created - Time when the reply was created
   */
  `CREATE TABLE Replies (
  id        STRING(26)    NOT NULL,
  authorId  STRING(36)    NOT NULL,
  commentId STRING(26)    NOT NULL,
  text      STRING(10000) NOT NULL,
  created   TIMESTAMP     NOT NULL,

  FOREIGN KEY (authorId)  REFERENCES Profiles(id),
  FOREIGN KEY (commentId) REFERENCES Comments(id)
) PRIMARY KEY (id)`,
  /**
   * Creates table for challenges.
   *
   * @name Challenges
   * @type {CreateTable}
   * @column id - Unique identifier
   * @column authorId - TODO
   * @column isPublic - TODO
   * @column criterionType - Challenge progress criterion type.
   *    For example, it can be 'userDefined' progress or 'bySpendedDays'
   *    and so on.
   * @column title - Title of the public challenge
   * @column description - Description of the public challenge
   * @column created - Time when public challenge was created
   */
  `CREATE TABLE Challenges (
  id            STRING(11)    NOT NULL,
  authorId      STRING(36),
  isPublic      BOOL          NOT NULL,
  criterionType STRING(16)    NOT NULL,
  title         STRING(100)   NOT NULL,
  description   STRING(10000) NOT NULL,
  created       TIMESTAMP     NOT NULL

) PRIMARY KEY (id)`,
  /**
   * Creates table for storing every challenge acceptance.
   *
   * @name Acceptances
   * @type {CreateTable}
   * @column id - Unique identifier
   * @column profileId - Id of profile used to accept challenge
   * @column challengeId - Id of challenge which user accepts
   * @column status - Status of acceptance. For example 'in progress'
   *    or 'finished'. Spanenr currently doesn't supports enums, so we use
   *    regular strings
   */
  `CREATE TABLE Acceptances (
  id          STRING(26) NOT NULL,
  profileId   STRING(36) NOT NULL,
  challengeId STRING(11) NOT NULL,
  status      STRING(16) NOT NULL,
  created     TIMESTAMP  NOT NULL,
  updated     TIMESTAMP,

  FOREIGN KEY (profileId) REFERENCES Profiles(id),
  FOREIGN KEY (challengeId) REFERENCES Challenges(id)
) PRIMARY KEY (id)`,
  /**
   * Creates table for storing users challenge
   * progresses with type bySpendedDays. We save
   * here user's spended days and date until user
   * fulfills the challenge
   *
   * @name ProgressesBySpendedDays
   * @type {CreateTable}
   * @column acceptanceId - Id of challenge acceptance
   * @column spendedDays  - Number of days spended during challenge
   * @column untillDate   - Date of the end of the challenge. If null
   *    then user is want to do this challege forever
   */
  `CREATE TABLE ProgressesBySpendedDays (
  acceptanceId STRING(26) NOT NULL,
  spendedDays  INT64      NOT NULL,
  untillDate   DATE,

  FOREIGN KEY (acceptanceId) REFERENCES Acceptances(id)
) PRIMARY KEY (acceptanceId)`,
  /**
   * Creates table for storing users challenge
   * progresses with type byThingDonePerPeriod.
   * We save here description of the thing that user
   * will do, how many times he will do this during
   * period, period in days and amount of periods.
   *
   * @name ProgressesByThingsDonePerPeriod
   * @type {CreateTable}
   * @column acceptanceId - Id of challenge acceptance
   * @column thing - description of the thing user will do
   * @column times - number of times to do thing during period
   * @column period - period in days
   * @column periodsNum - number of periods. If null, then
   *    user is going to do things forever
   */
  `CREATE TABLE ProgressesByThingsDonePerPeriod (
  acceptanceId STRING(26)  NOT NULL,
  thing        STRING(150) NOT NULL,
  times        INT64       NOT NULL,
  period       INT64       NOT NULL,
  periodsNum   INT64,

  FOREIGN KEY (acceptanceId) REFERENCES Acceptances(id)
) PRIMARY KEY (acceptanceId)`,
];
