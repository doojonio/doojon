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
  id           STRING(36)  NOT NULL,
  email        STRING(320) NOT NULL,
  password     STRING(70)  NOT NULL,
  username     STRING(16)  NOT NULL,
  bio          STRING(300),
  created      TIMESTAMP   NOT NULL
) PRIMARY KEY (id)`,
  /**
   * Creates unique index on profiles email
   *
   * @name profiles_email_idx
   * @type {CreateIndex}
   * @on email
   */
  `CREATE UNIQUE NULL_FILTERED INDEX ProfilesByEmail
ON Profiles (email) STORING (password)`,
  /**
   * Creates unique index on profiles username
   *
   * @name profiles_username_idx
   * @type {Index}
   * @on username
   */
  `CREATE UNIQUE NULL_FILTERED INDEX ProfilesByUsername
ON Profiles (username)`,
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

  `CREATE NULL_FILTERED INDEX PostsByAuthorId ON Posts(authorId)`,
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

  `CREATE NULL_FILTERED INDEX CommentsByPostId ON Comments(postId)`,
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
  `CREATE NULL_FILTERED INDEX RepliesByCommentId ON Replies(commentId)`,
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
  criterionType INT64         NOT NULL,
  created       TIMESTAMP     NOT NULL

) PRIMARY KEY (id)`,
  `CREATE NULL_FILTERED INDEX ChallengesByAuthorId ON Challenges(authorId)`,

  `CREATE TABLE ChallengeTranslations (
  challengeId       STRING(11)    NOT NULL,
  languageCode      STRING(13)    NOT NULL,
  title             STRING(100)   NOT NULL,
  tag               STRING(50)    NOT NULL,
  description       STRING(10000) NOT NULL,
  criteriumSpecific JSON,

  FOREIGN KEY (challengeId) REFERENCES Challenges(id),
) PRIMARY KEY (challengeId, languageCode)`,
  `CREATE NULL_FILTERED INDEX ChallengeTranslationsByChallengeId ON ChallengeTranslations(challengeId)`,
  `CREATE UNIQUE NULL_FILTERED INDEX ChallengeTranslationsByTag ON ChallengeTranslations(tag)`,

  `CREATE TABLE ChallengeCrSettingsTDPP (
    challengeId     STRING(11)  NOT NULL,
    minTimes        INT64       NOT NULL,
    maxTimes        INT64       NOT NULL,
    minPeriod       INT64       NOT NULL,
    maxPeriod       INT64       NOT NULL,
    minPeriodsNum   INT64       NOT NULL,
    maxPeriodsNum   INT64,

    FOREIGN KEY (challengeId) REFERENCES Challenges(id),
  ) PRIMARY KEY (challengeId)`,

  `CREATE TABLE ChallengeCrSettingsSD (
    challengeId     STRING(11)  NOT NULL,
    minNeedToSpend  INT64       NOT NULL,
    maxNeedToSpend  INT64,

    FOREIGN KEY (challengeId) REFERENCES Challenges(id),
  ) PRIMARY KEY (challengeId)`,
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
  status      INT64      NOT NULL,
  created     TIMESTAMP  NOT NULL,
  updated     TIMESTAMP,

  FOREIGN KEY (profileId) REFERENCES Profiles(id),
  FOREIGN KEY (challengeId) REFERENCES Challenges(id)
) PRIMARY KEY (id)`,
  `CREATE NULL_FILTERED INDEX AcceptancesByProfileId ON Acceptances(profileId)`,
  `CREATE NULL_FILTERED INDEX AcceptancesByChallengeId ON Acceptances(challengeId)`,
  /**
   * Creates table for storing users challenge
   * progresses with type bySpendedDays. We save
   * here user's spended days and date until user
   * fulfills the challenge
   *
   * @name ProgressesBySD
   * @type {CreateTable}
   * @column acceptanceId - Id of challenge acceptance
   * @column needToSpend  - Number of days needed to spend in challenge
   * @column finishedOnDay  - Number of day when user finished challenge
   *
   */
  `CREATE TABLE ProgressesBySD (
  acceptanceId STRING(26) NOT NULL,
  needToSpend  INT64,
  finishedOnDay  INT64,

  FOREIGN KEY (acceptanceId) REFERENCES Acceptances(id)
) PRIMARY KEY (acceptanceId)`,
  /**
   * Creates table for storing users challenge
   * progresses with type byThingDonePerPeriod.
   * We save here description of the thing that user
   * will do, how many times he will do this during
   * period, period in days and amount of periods.
   *
   * @name ProgressesByTDPP
   * @type {CreateTable}
   * @column acceptanceId - Id of challenge acceptance
   * @column thing - description of the thing user will do
   * @column times - number of times to do thing during period
   * @column period - period in days
   * @column periodsNum - number of periods. If null, then
   *    user is going to do things forever
   */
  `CREATE TABLE ProgressesByTDPP (
  acceptanceId STRING(26)  NOT NULL,
  times        INT64       NOT NULL,
  period       INT64       NOT NULL,
  periodsNum   INT64,

  FOREIGN KEY (acceptanceId) REFERENCES Acceptances(id)
) PRIMARY KEY (acceptanceId)`,
];
