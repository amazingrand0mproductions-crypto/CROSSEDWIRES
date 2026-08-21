// ============================================================================
// CROSSED WIRES — Adaptive Relationship Engine for AI Dungeon
// Version 6 — adaptive social continuity for any genre, relationship role awareness and scenario-shaped drama
// Put this ENTIRE file in the Library tab.
//
// Design goal: relationships create plot without turning every turn into drama.
// The model identifies story-supported social events; JavaScript owns durable
// state, scoring, pacing, scars, milestones, trajectory and twist selection.
// ============================================================================

const CW_ENGINE_VERSION = 6;

let CW_RUNTIME_EVENT_INDEX = null;

const CW_DEFAULT_CONFIG = {
  enabled: true,
  observationTurns: 3,
  observationAppearances: 2,
  sceneHistoryActions: 5,
  maxContextRelationships: 6,
  contextBudgetChars: 4200,
  maxEventsPerTurn: 4,
  maxLedgerEvents: 2500,
  maxRecentMemories: 6,
  maxDashboardLinks: 30,
  relationshipPace: "SLOW",       // SLOW | BALANCED | FAST
  eventSensitivity: "BALANCED",  // CONSERVATIVE | BALANCED | EXPRESSIVE
  memoryAnchors: 2,                // older turning points included per bond
  scenarioMode: "AUTO",           // AUTO or an explicit scenario profile
  adaptationStrength: "FULL",     // LIGHT | BALANCED | FULL
  roleAwareness: true,
  enableScenarioTwists: true,
  npcInitiative: true,
  enableNpcNpc: true,
  enableRomance: true,
  enableMatureThemes: true,
  playerCharacterIsAdult: true,
  enableAdultIntimacy: true,
  enableInfidelity: true,
  enableBreakups: true,
  enableParenthoodThemes: true,
  enableToxicDrama: true,
  enableCurveballs: true,
  twistMode: "WILD",              // OFF | GROUNDED | DRAMATIC | WILD | UNHINGED
  twistChancePercent: -1,          // -1 = AUTO from TWIST MODE
  twistCooldownTurns: 6,
  pairTwistCooldownTurns: 8,
  repeatTwistCooldownTurns: 24,
  twistMinTurn: 6,
  showExactNumbersInDashboard: true
};

const CW_METRICS = [
  "trust", "affection", "respect", "loyalty", "openness",
  "attachment", "attraction", "jealousy", "resentment", "fear", "tension"
];

const CW_EVENT_EFFECTS = {
  warmth:                  { affection: 3, trust: 1, tension: -1 },
  banter:                  { affection: 2, tension: -1 },
  support:                 { affection: 4, trust: 3, loyalty: 2, attachment: 1 },
  empathy:                 { trust: 3, affection: 3, openness: 3, resentment: -1 },
  honesty:                 { trust: 5, openness: 4, respect: 1 },
  vulnerability:           { trust: 4, affection: 3, openness: 6, attachment: 2, tension: -1 },
  admiration:              { respect: 5, affection: 1 },
  quality_time:            { affection: 4, attachment: 2, trust: 1, tension: -2 },
  shared_secret:           { trust: 5, openness: 5, attachment: 3, tension: 1 },
  protection:              { trust: 5, affection: 3, loyalty: 5, attachment: 2, fear: -2 },
  public_defense:          { trust: 5, loyalty: 5, respect: 3, affection: 2 },
  flirtation:              { attraction: 5, affection: 1, tension: 2 },
  date_or_courtship:       { affection: 4, attraction: 4, attachment: 2, openness: 1 },
  confession:              { openness: 6, affection: 3, attraction: 3, tension: 2 },
  affection_declared:      { affection: 5, openness: 4, attachment: 2, tension: 1 },
  relationship_defined:    { trust: 4, openness: 5, attachment: 4, tension: -2 },
  exclusivity:             { trust: 5, loyalty: 6, attachment: 5, jealousy: -2, tension: -2 },
  moving_in:               { attachment: 6, trust: 3, openness: 3, tension: 2 },
  mutual_reassurance:      { trust: 4, affection: 3, jealousy: -3, resentment: -2, tension: -4 },
  apology:                 { openness: 3, respect: 1, resentment: -2, tension: -2 },
  adult_intimacy:          { affection: 5, attraction: 7, trust: 2, attachment: 4, openness: 2, tension: -1 },
  casual_intimacy:         { attraction: 6, affection: 2, attachment: 2, openness: 1, tension: 2 },
  commitment:              { trust: 5, affection: 5, loyalty: 7, attachment: 7, openness: 3, tension: -2 },
  proposal:                { trust: 4, affection: 6, loyalty: 8, attachment: 8, tension: 2 },
  marriage:                { trust: 5, affection: 6, loyalty: 9, attachment: 9, openness: 3 },
  gift:                    { affection: 2, respect: 1 },
  kept_promise:            { trust: 7, respect: 2, loyalty: 3 },
  trust_test_passed:       { trust: 7, respect: 3, loyalty: 3, resentment: -1 },
  shared_success:          { trust: 2, respect: 4, affection: 2, loyalty: 2, attachment: 1 },
  rescue:                  { trust: 8, affection: 4, respect: 4, loyalty: 5, attachment: 3, fear: -3 },
  sacrifice:               { trust: 9, affection: 6, respect: 6, loyalty: 7, attachment: 5 },
  forgiveness:             { resentment: -7, trust: 2, affection: 2, openness: 2, tension: -4 },
  reconciliation:          { trust: 4, affection: 6, attachment: 4, resentment: -7, tension: -6, openness: 3 },
  boundary_discussion:     { trust: 2, respect: 3, openness: 4, tension: -1 },
  boundary_respected:      { trust: 4, respect: 4, openness: 2, tension: -3, fear: -2 },
  healthy_space:           { trust: 2, respect: 3, attachment: -1, jealousy: -2, tension: -3 },
  trust_repair:            { trust: 5, openness: 3, respect: 2, resentment: -4, tension: -3 },
  boundary_repair:         { trust: 3, respect: 5, openness: 3, resentment: -4, fear: -2, tension: -4 },
  abandonment_repair:      { trust: 3, affection: 2, attachment: 3, openness: 2, resentment: -4, fear: -2, tension: -3 },

  // Scenario-adaptive social events. These keep Crossed Wires useful when the
  // central bond is comradeship, family, hierarchy, rivalry, politics, survival
  // or professional trust rather than romance.
  cooperation:             { trust: 3, respect: 3, loyalty: 2, affection: 1 },
  dependability:           { trust: 5, respect: 3, loyalty: 3 },
  competence_proven:       { respect: 6, trust: 2 },
  solidarity:              { loyalty: 5, trust: 3, attachment: 2, affection: 2 },
  shared_duty:             { loyalty: 4, respect: 3, attachment: 2 },
  mentorship:              { trust: 3, respect: 5, openness: 2, attachment: 1 },
  guidance:                { trust: 2, respect: 3, openness: 2 },
  mercy:                   { trust: 5, respect: 4, fear: -3, resentment: -2 },
  ideological_alignment:   { respect: 4, trust: 2, loyalty: 2, openness: 1 },
  ideological_conflict:    { respect: -1, trust: -2, resentment: 2, tension: 5, openness: 1 },
  command_backed:          { trust: 3, respect: 4, loyalty: 4 },
  command_refused:         { trust: -2, respect: -2, loyalty: -3, resentment: 2, tension: 4 },
  resource_shared:         { trust: 4, loyalty: 3, affection: 2, respect: 2 },
  resource_denied:         { trust: -4, loyalty: -2, resentment: 4, tension: 4 },
  secret_identity_revealed:{ trust: 5, openness: 7, attachment: 2, tension: 2 },
  accusation:              { trust: -5, respect: -2, resentment: 3, tension: 6 },
  suspicion_cleared:       { trust: 5, resentment: -3, tension: -5, openness: 2 },
  grief_support:           { trust: 4, affection: 4, attachment: 3, openness: 3 },
  grief_blame:             { trust: -4, affection: -3, resentment: 5, tension: 5 },
  professional_support:    { trust: 3, respect: 4, loyalty: 2 },
  credit_shared:           { trust: 3, respect: 4, affection: 1 },
  credit_stolen:           { trust: -6, respect: -5, resentment: 6, tension: 4 },
  family_support:          { trust: 4, affection: 5, loyalty: 4, attachment: 4 },
  favoritism:              { trust: -3, respect: -2, resentment: 5, jealousy: 3, tension: 4 },
  team_victory:            { trust: 3, respect: 4, loyalty: 3, affection: 2 },
  team_failure:            { trust: -1, respect: -1, resentment: 2, tension: 4 },
  political_alliance:      { trust: 2, respect: 3, loyalty: 4, openness: 1, tension: 1 },
  public_scandal:          { trust: -4, respect: -5, resentment: 3, tension: 6 },
  blackmail:               { trust: -9, respect: -6, resentment: 7, fear: 5, tension: 8, openness: -5 },

  insult:                  { affection: -3, respect: -3, resentment: 3, tension: 4 },
  threat:                  { trust: -6, fear: 6, resentment: 4, tension: 6, openness: -3 },
  deception:               { trust: -6, openness: -5, respect: -1, resentment: 3 },
  secrecy_discovered:      { trust: -5, openness: -6, resentment: 4, jealousy: 2, tension: 4 },
  broken_promise:          { trust: -8, respect: -2, loyalty: -4, resentment: 6, tension: 3 },
  trust_test_failed:       { trust: -7, respect: -2, resentment: 5, tension: 4 },
  betrayal:                { trust: -11, affection: -6, loyalty: -8, openness: -6, resentment: 10, tension: 8 },
  infidelity:              { trust: -14, affection: -9, loyalty: -12, openness: -9, jealousy: 12, resentment: 12, tension: 12, attachment: -4 },
  neglect:                 { affection: -4, trust: -2, attachment: -2, resentment: 3, openness: -1 },
  emotional_withdrawal:    { affection: -3, openness: -5, attachment: -2, resentment: 2, tension: 3 },
  stonewalling:            { trust: -3, openness: -7, respect: -2, resentment: 4, tension: 5 },
  humiliation:             { respect: -5, affection: -4, resentment: 6, tension: 5, openness: -3 },
  conflict:                { trust: -2, affection: -1, resentment: 2, tension: 5 },
  incompatibility:         { affection: -1, attachment: -2, tension: 5, openness: 2 },
  rivalry:                 { respect: 2, resentment: 1, tension: 5 },
  suspicion:               { trust: -4, jealousy: 3, tension: 4, openness: -2 },
  jealousy_episode:        { jealousy: 8, trust: -2, resentment: 2, tension: 5, openness: -1 },
  snooping:                { trust: -6, respect: -4, jealousy: 4, resentment: 4, tension: 5 },
  manipulation:            { trust: -7, respect: -4, resentment: 6, fear: 2, tension: 5, openness: -5 },
  coercive_pressure:       { trust: -8, respect: -6, fear: 5, resentment: 6, tension: 7, openness: -4 },
  rejection:               { affection: -2, attraction: -3, attachment: -2, resentment: 1, tension: 3 },
  public_rejection:        { affection: -4, respect: -4, resentment: 5, tension: 6 },
  breakup:                 { affection: -6, loyalty: -7, attachment: -9, resentment: 4, tension: 9, openness: -2 },
  abandonment:             { trust: -9, affection: -5, attachment: -6, resentment: 8, fear: 3, tension: 6 },
  ultimatum:               { trust: -2, respect: -1, tension: 7, fear: 1, openness: 1 },
  boundary_violated:       { trust: -8, respect: -6, resentment: 7, fear: 4, tension: 7, openness: -5 },
  rumor_or_gossip:         { trust: -3, respect: -2, jealousy: 2, resentment: 3, tension: 5 },
  temptation:              { attraction: 4, tension: 4 },
  exclusivity_mismatch:    { trust: -2, jealousy: 5, resentment: 2, tension: 7, openness: 2 },
  shared_trauma:           { trust: 2, affection: 2, attachment: 3, fear: 3, tension: 3 },
  parenthood_news:         { attachment: 5, affection: 2, fear: 3, tension: 5, openness: 3 }
};

const CW_ROMANCE_EVENTS = [
  "flirtation", "date_or_courtship", "confession", "affection_declared", "relationship_defined",
  "exclusivity", "adult_intimacy", "casual_intimacy", "commitment", "proposal", "marriage",
  "temptation", "exclusivity_mismatch", "infidelity"
];
const CW_MATURE_EVENTS = ["adult_intimacy", "casual_intimacy", "infidelity", "temptation", "exclusivity_mismatch", "parenthood_news"];
const CW_TOXIC_EVENTS = ["manipulation", "coercive_pressure", "boundary_violated", "snooping", "blackmail"];

const CW_SCENARIO_MODES = [
  "AUTO", "UNIVERSAL", "ROMANCE", "SLICE_OF_LIFE", "HORROR", "FANTASY", "SCI_FI",
  "SUPERHERO", "CRIME", "MYSTERY", "SURVIVAL", "POLITICAL", "MILITARY", "WORKPLACE",
  "SCHOOL", "FAMILY", "ADVENTURE", "COMEDY", "HISTORICAL", "SPORTS"
];

const CW_ROLE_CODES = [
  "unknown", "stranger", "acquaintance", "friend", "best_friend", "family", "parent", "child",
  "sibling", "relative", "romantic", "ex", "rival", "ally", "enemy", "mentor", "student",
  "superior", "subordinate", "colleague", "teammate", "political", "professional"
];
const CW_FAMILY_ROLES = ["family", "parent", "child", "sibling", "relative"];
const CW_PROFESSIONAL_ROLES = ["superior", "subordinate", "colleague", "professional", "mentor", "student", "teammate"];
const CW_ROLE_INVERSE = {
  friend: "friend", best_friend: "best_friend", family: "family", parent: "child", child: "parent",
  sibling: "sibling", relative: "relative", romantic: "romantic", ex: "ex", rival: "rival", ally: "ally",
  enemy: "enemy", mentor: "student", student: "mentor", superior: "subordinate", subordinate: "superior",
  colleague: "colleague", teammate: "teammate", political: "political", professional: "professional",
  acquaintance: "acquaintance", stranger: "stranger", unknown: "unknown"
};

const CW_SCENARIO_EVENT_CODES = [
  "cooperation", "dependability", "competence_proven", "solidarity", "shared_duty", "mentorship", "guidance",
  "mercy", "ideological_alignment", "ideological_conflict", "command_backed", "command_refused",
  "resource_shared", "resource_denied", "secret_identity_revealed", "accusation", "suspicion_cleared",
  "grief_support", "grief_blame", "professional_support", "credit_shared", "credit_stolen", "family_support",
  "favoritism", "team_victory", "team_failure", "political_alliance", "public_scandal", "blackmail"
];

const CW_PROFILE_EVENT_CODES = {
  UNIVERSAL: ["cooperation", "dependability", "competence_proven", "solidarity", "shared_duty", "mentorship", "guidance", "grief_support", "mercy"],
  ROMANCE: ["flirtation", "confession", "relationship_defined", "mutual_reassurance", "commitment", "jealousy_episode"],
  SLICE_OF_LIFE: ["quality_time", "warmth", "banter", "support", "family_support", "professional_support"],
  HORROR: ["protection", "shared_trauma", "grief_support", "grief_blame", "suspicion", "accusation", "mercy"],
  FANTASY: ["shared_duty", "dependability", "solidarity", "mentorship", "ideological_alignment", "ideological_conflict"],
  SCI_FI: ["cooperation", "competence_proven", "shared_duty", "secret_identity_revealed", "ideological_conflict"],
  SUPERHERO: ["secret_identity_revealed", "public_defense", "protection", "shared_duty", "ideological_conflict"],
  CRIME: ["shared_secret", "loyalty", "deception", "betrayal", "blackmail", "accusation", "suspicion_cleared"],
  MYSTERY: ["suspicion", "accusation", "suspicion_cleared", "honesty", "deception", "shared_secret"],
  SURVIVAL: ["resource_shared", "resource_denied", "dependability", "protection", "rescue", "sacrifice", "solidarity"],
  POLITICAL: ["political_alliance", "ideological_alignment", "ideological_conflict", "public_defense", "public_scandal", "betrayal"],
  MILITARY: ["shared_duty", "command_backed", "command_refused", "dependability", "solidarity", "sacrifice"],
  WORKPLACE: ["professional_support", "credit_shared", "credit_stolen", "competence_proven", "rivalry", "public_defense"],
  SCHOOL: ["support", "admiration", "rivalry", "team_victory", "team_failure", "mentorship", "guidance"],
  FAMILY: ["family_support", "favoritism", "support", "neglect", "forgiveness", "boundary_discussion", "shared_duty"],
  ADVENTURE: ["cooperation", "dependability", "protection", "rescue", "shared_success", "shared_duty", "resource_shared"],
  COMEDY: ["banter", "warmth", "quality_time", "conflict", "forgiveness", "public_rejection"],
  HISTORICAL: ["shared_duty", "political_alliance", "public_defense", "loyalty", "ideological_conflict", "family_support"],
  SPORTS: ["team_victory", "team_failure", "competence_proven", "rivalry", "professional_support", "solidarity", "dependability"]
};

const CW_PROFILE_DEFINITIONS = {
  UNIVERSAL: { label: "Universal", clues: [], directive: "Follow the scenario's established genre, stakes and tone. Relationships should support the main story rather than replace it." },
  ROMANCE: { label: "Romance", clues: ["romance", "romantic", "dating", "love interest", "boyfriend", "girlfriend", "husband", "wife", "crush", "courtship", "marriage", "fiance", "fiancée"], directive: "Let chemistry, communication, commitment, boundaries and incompatibility shape the plot without forcing attraction or reciprocation." },
  SLICE_OF_LIFE: { label: "Slice of life", clues: ["slice of life", "roommate", "apartment", "cafe", "coffee shop", "bookstore", "neighborhood", "daily life", "flatmate"], directive: "Favor believable everyday follow-ups, routines, friendship, family, work and small changes; keep drama proportional to ordinary life." },
  HORROR: { label: "Horror", clues: ["horror", "haunted", "ghost", "demon", "slasher", "eldritch", "curse", "cursed", "nightmare", "monster", "zombie", "vampire", "werewolf", "paranormal", "cult"], directive: "Let fear, uncertainty, trauma and dangerous choices pressure trust and loyalty. Do not deflate horror with constant soap-opera beats." },
  FANTASY: { label: "Fantasy", clues: ["fantasy", "kingdom", "magic", "wizard", "mage", "dragon", "knight", "elf", "orc", "paladin", "warlock", "witch", "spell", "tavern", "guild", "sorcerer", "dungeons & dragons"], directive: "Use oaths, duty, rank, factions, kinship, quests and magical consequences as relationship pressure when established." },
  SCI_FI: { label: "Science fiction", clues: ["science fiction", "sci-fi", "spaceship", "starship", "galaxy", "alien", "android", "cyberpunk", "space station", "colony", "robot", "orbital", "jedi", "sith", "lightsaber", "tardis", "time lord", "time travel"], directive: "Use mission duty, identity, technology, culture clashes, protocol and isolation to shape bonds without turning every scene into romance." },
  SUPERHERO: { label: "Superhero", clues: ["superhero", "superheroine", "superpower", "superpowers", "villain", "secret identity", "masked hero", "metahuman", "mutant", "cape", "marvel", "dc comics", "avengers", "justice league", "vigilante"], directive: "Use secret identities, civilian risk, team trust, responsibility, public reputation and moral codes as social pressure." },
  CRIME: { label: "Crime", clues: ["mafia", "mob", "gang", "cartel", "heist", "criminal", "underworld", "assassin", "thief", "smuggler", "crime family"], directive: "Use loyalty, leverage, secrecy, divided allegiances and consequences. Trust should be costly and betrayal should matter." },
  MYSTERY: { label: "Mystery", clues: ["mystery", "detective", "investigation", "clue", "suspect", "alibi", "evidence", "murder case", "whodunit"], directive: "Let suspicion, testimony, withheld information and conflicting loyalties affect bonds, but never let relationship tags solve the mystery for the player." },
  SURVIVAL: { label: "Survival", clues: ["survival", "stranded", "apocalypse", "post-apocalyptic", "post apocalyptic", "wasteland", "shelter", "supplies", "ration", "disaster", "wilderness", "infected"], directive: "Use resource choices, rescue priorities, competence, leadership and dependency to test trust and loyalty under pressure." },
  POLITICAL: { label: "Political", clues: ["political", "election", "senator", "president", "parliament", "minister", "diplomat", "diplomacy", "campaign", "cabinet", "ambassador"], directive: "Use ideology, allegiance, reputation, public/private conflict, negotiation and faction pressure while preserving individual motives." },
  MILITARY: { label: "Military", clues: ["military", "army", "soldier", "squad", "platoon", "commander", "commanding officer", "special forces", "marine", "navy", "air force", "barracks", "war zone"], directive: "Use chain of command, comradeship, duty, competence, sacrifice and moral disagreement. Do not mistake obedience for affection." },
  WORKPLACE: { label: "Workplace", clues: ["workplace", "office", "coworker", "co-worker", "boss", "manager", "company", "promotion", "shift", "colleague", "employee", "hospital", "law firm", "retail", "store manager"], directive: "Use professional boundaries, hierarchy, collaboration, competition, reputation and career consequences. Romance should never be assumed from proximity." },
  SCHOOL: { label: "School / campus", clues: ["school", "high school", "boarding school", "university", "college", "campus", "student", "teacher", "professor", "classroom", "dorm", "exam", "academy"], directive: "Use peer groups, belonging, mentorship, competition, friendship and authority dynamics. Adult-only mechanics remain strictly age-gated." },
  FAMILY: { label: "Family", clues: ["family", "mother", "father", "sister", "brother", "sibling", "parent", "daughter", "son", "cousin", "grandmother", "grandfather"], directive: "Use shared history, obligation, favoritism, expectations, care and boundaries. Never romanticize a bond identified as family." },
  ADVENTURE: { label: "Adventure", clues: ["adventure", "quest", "expedition", "treasure", "treasure hunt", "pirate", "ruins", "journey", "exploration", "dungeon", "artifact", "adventurer"], directive: "Use leadership, risk tolerance, promises, rescue, teamwork and competing goals to deepen relationships alongside the adventure." },
  COMEDY: { label: "Comedy", clues: ["comedy", "sitcom", "comedic", "funny", "absurd", "ridiculous", "prank", "farce"], directive: "Use timing, banter, misunderstandings and social embarrassment without treating every joke as permanent emotional damage." },
  HISTORICAL: { label: "Historical", clues: ["historical", "victorian", "regency", "edwardian", "1920s", "ancient rome", "roman empire", "ancient greece", "renaissance", "medieval court", "feudal", "western", "cowboy", "frontier", "historical fiction"], directive: "Respect established period pressures, duty, reputation, class and custom while preserving character agency and the scenario's own tone." },
  SPORTS: { label: "Sports", clues: ["sports", "football team", "soccer team", "soccer", "rugby", "basketball", "baseball", "hockey", "boxing", "wrestling", "racing", "athlete", "coach", "championship", "league", "training camp"], directive: "Use teamwork, competition, performance pressure, leadership, mentorship and rivalry; do not equate intense team bonds with romance." }
};

const CW_TWISTS = [
  { id: "vulnerable_reveal", risk: 1, weight: 9, text: "A guarded character reveals a fear, insecurity, past mistake, private need, or difficult truth that changes the emotional temperature." },
  { id: "unexpected_kindness", risk: 1, weight: 7, text: "Someone acts with unexpected care at exactly the moment the other person expected distance, hostility, or indifference." },
  { id: "boundary_talk", risk: 1, weight: 7, text: "A character asks for clearer boundaries, expectations, space, honesty, exclusivity, or commitment. Let the answer matter." },
  { id: "public_choice", risk: 1, weight: 6, text: "In front of other people, a character gets a chance to defend, claim, distance themselves from, or remain silent about the bond." },
  { id: "reconciliation_window", risk: 1, weight: 6, text: "A small but genuine opportunity to repair old damage appears. Reconciliation must be earned and may be rejected." },
  { id: "protective_choice", risk: 1, weight: 5, text: "One character must decide whether to protect the other socially, emotionally, professionally, or physically when doing so has a cost." },
  { id: "quiet_followup", risk: 1, weight: 8, text: "A character remembers a small but important detail from an earlier conversation and follows up on it naturally, showing attention without turning the moment into a speech." },
  { id: "earned_respect", risk: 1, weight: 6, text: "A disagreement, difficult task, or principled choice gives one character a new reason to respect the other even if they still do not fully agree." },
  { id: "shared_ritual", risk: 1, weight: 5, text: "An inside joke, routine, shared place, repeated habit, or small ritual begins to mean something to the bond. Keep it subtle and continuity-based." },

  { id: "friendship_strain", risk: 2, weight: 7, text: "A friend, ally, sibling-like figure, or confidant feels sidelined, taken for granted, replaced, or uncertain about where they stand. Make the concern specific and earned." },
  { id: "confidant_dilemma", risk: 2, weight: 6, text: "A secret or confidence creates tension between loyalty, honesty, privacy, and another important relationship. Do not reveal the secret automatically; create a meaningful choice or pressure." },
  { id: "role_change", risk: 2, weight: 5, text: "A familiar relationship has to adjust because one person's role changes: promotion, leadership, dependence, mentorship, rivalry, duty, fame, or responsibility alters the balance between them." },
  { id: "unexpected_alliance", risk: 2, weight: 5, text: "Two people with tension, distance, or rivalry find themselves genuinely aligned on one issue. Let cooperation reveal new respect or new complications without erasing the old friction." },

  { id: "platonic_breakpoint", risk: 3, weight: 4, text: "A close friendship, alliance, or chosen-family bond reaches a point where one unresolved issue has to be confronted or the relationship may fundamentally change. Do not force a rupture without supporting history." },
  { id: "social_circle_pressure", risk: 3, weight: 4, text: "The wider friend group, family, team, household, or community starts reacting to a bond, feud, secret, or loyalty conflict, creating consequences beyond the two people directly involved." },

  { id: "unexpected_confession", risk: 2, weight: 8, romantic: true, text: "A feeling that has been hidden becomes difficult to keep hidden. The confession may be romantic or deeply emotional; never force reciprocity." },
  { id: "define_the_relationship", risk: 2, weight: 8, romantic: true, text: "Ambiguity becomes uncomfortable enough that someone asks what this relationship actually is and what each person wants from it." },
  { id: "mixed_signals", risk: 2, weight: 7, romantic: true, text: "Warmth and hesitation collide. One character gives mixed signals for a believable reason, creating uncertainty rather than instant melodrama." },
  { id: "jealousy_flare", risk: 2, weight: 7, romantic: true, text: "A plausible social situation triggers jealousy or insecurity. Let subtext build before confrontation, and never treat jealousy as proof of love." },
  { id: "friend_disapproval", risk: 2, weight: 6, romantic: true, text: "A friend, relative, teammate, or ally questions the relationship and forces a character to defend, reconsider, or hide it." },
  { id: "rumor_spreads", risk: 2, weight: 6, text: "A rumor, overheard remark, or piece of gossip changes the social atmosphere. Keep it relationship-relevant and plausibly sourced." },
  { id: "secret_exposed", risk: 2, weight: 7, text: "A relationship-relevant secret comes to light. It must connect to established behavior or history rather than appear as random lore." },
  { id: "misunderstanding", risk: 2, weight: 6, text: "Ambiguous evidence creates a believable misunderstanding. Avoid an idiot-plot: both sides should have understandable reasons for what they believe." },
  { id: "loyalty_test", risk: 2, weight: 7, text: "A character must choose between the relationship and another loyalty, duty, friend, family member, faction, career, or principle." },
  { id: "distance_pressure", risk: 2, weight: 5, text: "Work, duty, travel, danger, status, or incompatible goals create possible separation and force a discussion about what the bond is worth." },
  { id: "career_collision", risk: 2, weight: 5, text: "A career, mission, ambition, or responsibility creates a relationship cost that cannot be solved without tradeoffs." },
  { id: "future_mismatch", risk: 2, weight: 5, romantic: true, text: "The pair discover they may want different futures: commitment, location, lifestyle, priorities, family, or independence." },
  { id: "rivalry_shift", risk: 2, weight: 6, romantic: true, text: "Rivalry or competitive respect changes emotional temperature. Attraction is possible only if existing chemistry supports it; otherwise deepen the rivalry." },

  { id: "old_flame", risk: 3, weight: 5, romantic: true, text: "Someone with unfinished romantic history re-enters the social orbit. Only use this when it can fit continuity without rewriting established backstory." },
  { id: "triangle_pressure", risk: 3, weight: 5, romantic: true, text: "A third person complicates an attraction or partnership through mutual interest, rivalry, loyalty, or mistaken assumptions. Nobody is obligated to reciprocate." },
  { id: "secret_relationship", risk: 3, weight: 4, romantic: true, text: "Keeping the relationship private begins to create practical or emotional consequences: secrecy, suspicion, accidental exposure, or disagreement about going public." },
  { id: "accidental_reveal", risk: 3, weight: 4, romantic: true, text: "Something private about the bond becomes visible to the wrong person at the wrong time, creating social consequences rather than random catastrophe." },
  { id: "friend_group_split", risk: 3, weight: 4, text: "A relationship conflict begins pulling mutual friends or allies into different camps, making the social consequences larger than the original argument." },
  { id: "breakup_pressure", risk: 3, weight: 5, breakups: true, text: "Unresolved incompatibility reaches a point where separation, a break, or renegotiating the relationship becomes a real possibility. Do not force a breakup if the evidence is weak." },
  { id: "betrayal_opportunity", risk: 3, weight: 3, toxic: true, text: "A character faces a choice where betraying confidence, siding with someone else, or protecting themselves would carry relationship consequences. Make it a choice, not a personality rewrite." },
  { id: "possessiveness_confronted", risk: 3, weight: 3, toxic: true, romantic: true, text: "Jealousy, control, or possessiveness is challenged directly. Treat unhealthy behavior as a problem, not as proof of devotion." },
  { id: "living_together_pressure", risk: 3, weight: 4, romantic: true, text: "Daily-life compatibility becomes the issue: moving in, sharing space, routines, privacy, money, or the realization that closeness works differently in practice." },
  { id: "proposal_pressure", risk: 3, weight: 3, romantic: true, text: "Commitment expectations escalate toward engagement, marriage, or a serious future decision. Pressure and hesitation are as valid as excitement." },
  { id: "social_status_pressure", risk: 3, weight: 4, romantic: true, text: "Reputation, class, fame, rank, faction, workplace rules, or public scrutiny creates pressure on the relationship without overriding anyone's agency." },

  { id: "adult_intimacy_shift", risk: 3, weight: 5, mature: true, romantic: true, text: "If both participants are established adults and mutual consent is clear, consensual intimacy may change expectations. Keep sexual activity non-explicit and focus on emotional/social consequences." },
  { id: "morning_after", risk: 3, weight: 4, mature: true, romantic: true, requiresIntimacy: true, text: "After prior consensual adult intimacy, expectations no longer match perfectly. Explore closeness, uncertainty, regret, exclusivity, awkwardness, or a difficult conversation." },
  { id: "casual_vs_serious", risk: 3, weight: 4, mature: true, romantic: true, requiresIntimacy: true, text: "Two adults realize they may not agree on whether their intimate relationship is casual, exclusive, romantic, or becoming serious." },
  { id: "rebound_question", risk: 3, weight: 3, mature: true, romantic: true, text: "A new adult connection raises the uncomfortable possibility that one person is using it to avoid processing an earlier relationship. Do not assume this is true; make it a question the story can answer." },
  { id: "nonmonogamy_talk", risk: 3, weight: 2, mature: true, romantic: true, text: "Established adults discuss exclusivity, openness, or relationship structure. This is a negotiation requiring clear consent, not permission for secret cheating." },

  { id: "temptation", risk: 4, weight: 3, mature: true, romantic: true, infidelity: true, text: "An adult character in an established relationship faces plausible romantic or sexual temptation. Do not force cheating; the interesting part is the decision, secrecy, boundaries, and consequences." },
  { id: "infidelity_suspicion", risk: 4, weight: 3, mature: true, romantic: true, infidelity: true, text: "Something creates a plausible suspicion of infidelity. Suspicion is not proof; let trust, evidence, and communication determine what follows." },
  { id: "parenthood_curveball", risk: 4, weight: 2, mature: true, parenthood: true, requiresIntimacy: true, text: "Only if established adult history makes it biologically and narratively plausible, introduce a pregnancy/parenthood possibility or discussion. Otherwise skip it entirely." },
  { id: "major_secret", risk: 4, weight: 2, curveball: true, text: "Reveal or threaten to reveal a major relationship-relevant secret that is compatible with established continuity. It must reshape choices, not rewrite a character's entire past from nowhere." },
  // Scenario-shaped twists. They only receive normal weight when the detected or
  // manually selected scenario profile supports them.
  { id: "fear_breaks_trust", risk: 2, weight: 6, profiles: ["HORROR", "SURVIVAL"], text: "Fear or exhaustion makes one character doubt another's judgment, honesty, or reliability. Keep the threat real and the conflict proportional to what they have endured." },
  { id: "survivor_guilt", risk: 3, weight: 4, profiles: ["HORROR", "SURVIVAL", "MILITARY"], text: "Survivor guilt or responsibility for a loss strains a bond. Do not invent a death; use only losses or near-losses already supported by continuity." },
  { id: "resource_choice", risk: 2, weight: 6, profiles: ["SURVIVAL", "ADVENTURE"], text: "A scarce resource, rescue priority, or limited safe option forces a revealing choice about trust, duty, fairness, or who gets protected first." },
  { id: "leadership_challenge", risk: 2, weight: 6, profiles: ["SURVIVAL", "ADVENTURE", "MILITARY", "SPORTS"], text: "Someone challenges another character's leadership, plan, or right to decide. Make the disagreement about competence, values, or responsibility rather than random hostility." },
  { id: "oath_vs_person", risk: 3, weight: 5, profiles: ["FANTASY", "HISTORICAL", "POLITICAL", "MILITARY"], text: "An oath, duty, office, faction, family expectation, or code conflicts with loyalty to a person. Neither side should be made obviously irrational just to create drama." },
  { id: "faction_divide", risk: 3, weight: 5, profiles: ["FANTASY", "POLITICAL", "CRIME", "HISTORICAL"], text: "Two people are pulled toward opposing factions, houses, crews, parties, or loyalties. Let their established bond complicate the divide rather than erase it." },
  { id: "magical_debt", risk: 2, weight: 4, profiles: ["FANTASY"], text: "A magical promise, curse, pact, prophecy, or supernatural obligation creates a relationship cost, but only if such forces already exist in the setting." },
  { id: "mission_vs_bond", risk: 3, weight: 6, profiles: ["SCI_FI", "SUPERHERO", "MILITARY", "ADVENTURE"], text: "Mission success conflicts with protecting, trusting, or staying loyal to someone. Preserve the larger plot stakes instead of making the mission disappear for relationship drama." },
  { id: "identity_question", risk: 2, weight: 4, profiles: ["SCI_FI", "SUPERHERO", "MYSTERY"], text: "A hidden identity, altered memory, duplicate, disguise, or uncertain truth makes a character question what they know about someone. Use only setting-supported possibilities." },
  { id: "secret_identity_strain", risk: 2, weight: 6, profiles: ["SUPERHERO"], text: "A secret identity or double life creates missed commitments, suspicious behavior, danger, or an honesty dilemma. Do not reveal the secret unless continuity makes the reveal plausible." },
  { id: "heroic_code_split", risk: 3, weight: 5, profiles: ["SUPERHERO", "ADVENTURE"], text: "Two allies disagree over methods, collateral risk, mercy, responsibility, or how far they are willing to go. Their respect and history should affect how the disagreement plays out." },
  { id: "informant_suspicion", risk: 3, weight: 5, profiles: ["CRIME", "MYSTERY"], text: "Evidence suggests someone may be informing, withholding evidence, or playing both sides. Suspicion is not proof; let behavior and investigation determine the truth." },
  { id: "leverage_changes_hands", risk: 3, weight: 4, profiles: ["CRIME", "POLITICAL", "MYSTERY"], text: "Sensitive information or leverage changes who has power in a relationship. Make the consequence social, strategic, or emotional rather than inventing unrelated lore." },
  { id: "withheld_clue", risk: 2, weight: 6, profiles: ["MYSTERY", "CRIME"], text: "A character realizes someone withheld a clue, suspicion, or relevant fact. The reason could be protective, selfish, fearful, or strategic; do not decide guilt from the omission alone." },
  { id: "suspect_someone_close", risk: 3, weight: 4, profiles: ["MYSTERY", "HORROR", "CRIME"], text: "A plausible clue puts suspicion on someone emotionally important. Keep evidence ambiguous enough that the mystery remains playable." },
  { id: "public_private_split", risk: 2, weight: 6, profiles: ["POLITICAL", "HISTORICAL", "WORKPLACE", "SUPERHERO"], text: "A character must behave one way publicly and another privately because of reputation, office, rank, rules, or safety. Let the mismatch create believable relationship pressure." },
  { id: "ideology_over_person", risk: 3, weight: 5, profiles: ["POLITICAL", "HISTORICAL", "MILITARY"], text: "A genuine ideological or moral disagreement tests whether respect and loyalty can survive incompatible principles." },
  { id: "order_vs_loyalty", risk: 3, weight: 6, profiles: ["MILITARY"], text: "An order or mission requirement conflicts with loyalty to a teammate, subordinate, superior, or civilian. Do not make insubordination or obedience automatically correct." },
  { id: "promotion_rift", risk: 2, weight: 5, profiles: ["MILITARY", "WORKPLACE", "SPORTS"], text: "Promotion, selection, rank, captaincy, or recognition changes the balance between two people and exposes pride, support, envy, or uncertainty." },
  { id: "credit_dispute", risk: 2, weight: 6, profiles: ["WORKPLACE", "SCHOOL", "SPORTS"], text: "Credit, responsibility, recognition, or blame for a shared result becomes contested. Let professional or peer consequences matter." },
  { id: "professional_boundary", risk: 2, weight: 6, profiles: ["WORKPLACE", "SCHOOL", "MILITARY"], text: "A professional, academic, or chain-of-command boundary needs clarification because closeness, favoritism, secrecy, or competing duties are affecting the relationship." },
  { id: "peer_group_shift", risk: 2, weight: 6, profiles: ["SCHOOL", "SLICE_OF_LIFE", "SPORTS"], text: "A change in friend group, team status, social circle, or belonging alters who spends time together and who feels left out without requiring a romance plot." },
  { id: "mentor_expectation", risk: 2, weight: 5, profiles: ["SCHOOL", "WORKPLACE", "SPORTS", "FANTASY"], text: "A mentor or authority figure's expectations become harder to meet, forcing a conversation about trust, independence, disappointment, or growth." },
  { id: "old_family_wound", risk: 2, weight: 6, profiles: ["FAMILY", "SLICE_OF_LIFE"], familyOnly: true, text: "An old family pattern resurfaces through a current disagreement. Ground it in established history, expectations, favoritism, care, or boundaries rather than inventing melodrama from nowhere." },
  { id: "family_expectation", risk: 2, weight: 6, profiles: ["FAMILY", "HISTORICAL"], familyOnly: true, text: "A family expectation about duty, independence, reputation, caregiving, tradition, or the future creates pressure on the bond." },
  { id: "quiet_life_change", risk: 1, weight: 7, profiles: ["SLICE_OF_LIFE", "FAMILY", "WORKPLACE"], text: "A believable life change—new schedule, move, responsibility, friendship, hobby, or routine—quietly changes how much time or attention two people can give each other." },
  { id: "harmless_social_disaster", risk: 1, weight: 7, profiles: ["COMEDY", "SLICE_OF_LIFE"], text: "A misunderstanding, bad timing, accidental remark, or social mistake creates comic awkwardness without permanently damaging the relationship unless later choices make it serious." },
  { id: "accidental_matchmaking", risk: 1, weight: 4, profiles: ["COMEDY", "ROMANCE"], romantic: true, text: "Other characters misread or meddle in a possible attraction, creating awkward social pressure. Do not make either person reciprocate just because others assume they do." },
  { id: "reputation_constraint", risk: 2, weight: 5, profiles: ["HISTORICAL", "POLITICAL", "FAMILY"], text: "Reputation, class, custom, family standing, or period expectations constrain what a character can safely say or do in public. Preserve agency within those pressures." },
  { id: "team_role_conflict", risk: 2, weight: 6, profiles: ["SPORTS", "MILITARY", "ADVENTURE"], text: "Two people disagree over roles, leadership, playing time, tactics, responsibility, or who gets trusted in a high-pressure moment." },
  { id: "performance_pressure", risk: 2, weight: 5, profiles: ["SPORTS", "SCHOOL", "WORKPLACE"], text: "Performance pressure makes support, blame, rivalry, confidence, or loyalty more visible. Do not reduce the character to a single win or failure." },

  { id: "wild_card", risk: 4, weight: 2, wildOnly: true, curveball: true, text: "Invent one surprising relationship-specific curveball grounded in the established cast, scenario genre and continuity. It may be social, professional, familial, political, survival-driven, romantic, painful, funny, or life-changing, but it must grow from the current scenario rather than importing a different genre." }
];

function CW_freshTwistState(old) {
  const src = old && typeof old === "object" ? old : {};
  return {
    rngSeed: Number.isFinite(Number(src.rngSeed)) ? Number(src.rngSeed) : 246813579,
    lastRollTurn: Number.isFinite(Number(src.lastRollTurn)) ? Number(src.lastRollTurn) : -1,
    lastSeedTurn: Number.isFinite(Number(src.lastSeedTurn)) ? Number(src.lastSeedTurn) : -9999,
    lastTwistTurn: Number.isFinite(Number(src.lastTwistTurn)) ? Number(src.lastTwistTurn) : -9999,
    pending: src.pending || null,
    history: Array.isArray(src.history) ? src.history : [],
    pairLastSeed: src.pairLastSeed && typeof src.pairLastSeed === "object" ? src.pairLastSeed : {},
    idLastSeed: src.idLastSeed && typeof src.idLastSeed === "object" ? src.idLastSeed : {}
  };
}

function CW_init() {
  let cw = state.crossedWires;
  if (!cw || typeof cw !== "object") cw = {};

  // Migrate older Crossed Wires saves in place. Never wipe an adventure merely
  // because the script version changed.
  cw.npcs = cw.npcs && typeof cw.npcs === "object" ? cw.npcs : {};
  cw.aliases = cw.aliases && typeof cw.aliases === "object" ? cw.aliases : {};
  cw.roles = cw.roles && typeof cw.roles === "object" ? cw.roles : {};
  cw.scenario = cw.scenario && typeof cw.scenario === "object" ? cw.scenario : { primary: "UNIVERSAL", secondary: "", confidence: 0, turn: -1 };
  cw.ledger = Array.isArray(cw.ledger) ? cw.ledger : [];
  cw.sightings = Array.isArray(cw.sightings) ? cw.sightings : [];
  cw.command = cw.command || null;
  cw.lastActionCount = Number.isFinite(Number(cw.lastActionCount)) ? Number(cw.lastActionCount) : 0;
  cw.forceTwist = cw.forceTwist || false;
  cw.forceTwistTier = cw.forceTwistTier || "";
  cw.configCardVersion = Number.isFinite(Number(cw.configCardVersion)) ? Number(cw.configCardVersion) : 0;
  cw.twist = CW_freshTwistState(cw.twist);
  cw.version = CW_ENGINE_VERSION;
  state.crossedWires = cw;

  // Normalize old NPC records without destroying their history.
  for (const key in cw.npcs) {
    const npc = cw.npcs[key] || {};
    if (!npc.name) npc.name = key;
    if (!Number.isFinite(Number(npc.introducedAt))) npc.introducedAt = 0;
    if (!Number.isFinite(Number(npc.lastSeen))) npc.lastSeen = npc.introducedAt;
    if (!Number.isFinite(Number(npc.lastMentionTurn))) npc.lastMentionTurn = npc.lastSeen;
    if (!Number.isFinite(Number(npc.mentions))) npc.mentions = 1;
    if (!npc.adultStatus) npc.adultStatus = "unknown";
    cw.npcs[key] = npc;
  }
}

function CW_turn() {
  return (typeof info !== "undefined" && typeof info.actionCount === "number") ? info.actionCount : 0;
}

function CW_key(name) {
  return String(name || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’‛]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function CW_cleanName(name) {
  let n = String(name || "")
    .normalize("NFKC")
    .replace(/[‘’‛]/g, "'")
    .replace(/[‐‑‒–—―]/g, "-")
    .replace(/[\[\]{}<>|]/g, "")
    .replace(/^['"`]+|['"`]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!n || n.length > 42) return "";
  if (/\d|[:;=+*\\/@#$%^&!?]/.test(n)) return "";
  if (!/[A-Za-zÀ-ÖØ-öø-ÿ\u0100-\u024F\u0370-\u03FF\u0400-\u04FF]/.test(n)) return "";

  const banned = [
    "you", "your", "yours", "he", "she", "they", "them", "him", "her",
    "we", "us", "i", "me", "my", "man", "woman", "boy", "girl", "child",
    "guard", "soldier", "stranger", "narrator", "someone", "somebody", "person",
    "enemy", "friend", "mother", "father", "mom", "dad", "sir", "ma'am", "maam"
  ];
  if (banned.includes(CW_key(n))) return "";
  return n;
}

function CW_playerNames() {
  const names = ["you"];
  if (typeof info !== "undefined" && Array.isArray(info.characterNames)) {
    for (const n of info.characterNames) names.push(CW_key(n));
  }
  return names;
}

function CW_isPlayerName(name) {
  return CW_playerNames().includes(CW_key(name));
}

function CW_wordPresent(text, name) {
  if (!text || !name) return false;
  const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^A-Za-z0-9_])" + escaped + "([^A-Za-z0-9_]|$)", "i").test(String(text));
}

function CW_recentHistoryText(limit) {
  const cfg = CW_config();
  const count = Math.max(1, Number(limit) || cfg.sceneHistoryActions);
  if (typeof history === "undefined" || !Array.isArray(history)) return "";
  return history.slice(-count).map(function (h) {
    return h && h.text ? h.text : "";
  }).join("\n");
}

const CW_CONFIG_TITLE = "Crossed Wires Config";
const CW_CONFIG_MARKER = "CWCFG6";

function CW_cardKeysText(card) {
  if (!card) return "";
  if (Array.isArray(card.keys)) return card.keys.join(",");
  return String(card.keys || "");
}

function CW_configCard() {
  if (typeof storyCards === "undefined" || !Array.isArray(storyCards)) return null;
  for (let i = 0; i < storyCards.length; i++) {
    const c = storyCards[i];
    if (!c) continue;
    const title = String(c.title || c.name || "").trim().toLowerCase();
    const type = String(c.type || "").trim().toLowerCase();
    const keys = CW_cardKeysText(c).toLowerCase();
    const notes = String(c.description || c.notes || "");
    if (title === CW_CONFIG_TITLE.toLowerCase()) return c;
    if (type === "crossed wires config") return c; // v2/v3 migration
    if (keys.includes("__crossed_wires_config__")) return c; // v2/v3 migration
    if (notes.includes(CW_CONFIG_MARKER)) return c;
  }
  return null;
}

function CW_defaultConfigEntryFrom(cfg) {
  const c = cfg || CW_DEFAULT_CONFIG;
  return [
    "Crossed Wires Settings",
    "Change values after the colon only. Full explanations are in Notes.",
    "",
    "[Core]",
    "Enabled: " + (c.enabled ? "ON" : "OFF"),
    "Relationship Pace: " + c.relationshipPace,
    "Event Sensitivity: " + c.eventSensitivity,
    "NPC Initiative: " + (c.npcInitiative ? "ON" : "OFF"),
    "Observation Turns: " + c.observationTurns,
    "Observation Appearances: " + c.observationAppearances,
    "Active Bonds: " + c.maxContextRelationships,
    "Memory Anchors: " + c.memoryAnchors,
    "",
    "[Adaptation]",
    "Scenario Mode: " + c.scenarioMode,
    "Adaptation Strength: " + c.adaptationStrength,
    "Role Awareness: " + (c.roleAwareness ? "ON" : "OFF"),
    "Scenario Twists: " + (c.enableScenarioTwists ? "ON" : "OFF"),
    "",
    "[Drama & Twists]",
    "Twist Mode: " + c.twistMode,
    "Twist Chance: " + (c.twistChancePercent < 0 ? "AUTO" : c.twistChancePercent),
    "Twists Start After: " + c.twistMinTurn,
    "Twist Cooldown: " + c.twistCooldownTurns,
    "Curveballs: " + (c.enableCurveballs ? "ON" : "OFF"),
    "",
    "[Relationship Scope]",
    "NPC to NPC: " + (c.enableNpcNpc ? "ON" : "OFF"),
    "Romance: " + (c.enableRomance ? "ON" : "OFF"),
    "Mature Themes: " + (c.enableMatureThemes ? "ON" : "OFF"),
    "Player Is Adult: " + (c.playerCharacterIsAdult ? "ON" : "OFF"),
    "Adult Intimacy: " + (c.enableAdultIntimacy ? "ON" : "OFF"),
    "Infidelity: " + (c.enableInfidelity ? "ON" : "OFF"),
    "Breakups: " + (c.enableBreakups ? "ON" : "OFF"),
    "Parenthood: " + (c.enableParenthoodThemes ? "ON" : "OFF"),
    "Toxic Drama: " + (c.enableToxicDrama ? "ON" : "OFF"),
    "",
    "[Advanced]",
    "Scene History: " + c.sceneHistoryActions,
    "Context Budget: " + c.contextBudgetChars,
    "Pair Twist Cooldown: " + c.pairTwistCooldownTurns,
    "Repeat Twist Cooldown: " + c.repeatTwistCooldownTurns,
    "",
    "[Display]",
    "Dashboard Numbers: " + (c.showExactNumbersInDashboard ? "ON" : "OFF")
  ].join("\n");
}

function CW_defaultConfigEntry() {
  return CW_defaultConfigEntryFrom(CW_DEFAULT_CONFIG);
}

function CW_configNotes() {
  return [
    "Crossed Wires v6 — configuration guide",
    "",
    "Edit values in Entry. These Notes are player-facing reference text and are not intended as narrator context.",
    "",
    "CORE",
    "• Enabled — Master switch. OFF stops relationship tracking/context injection while keeping saved history and commands available.",
    "• Relationship Pace — SLOW, BALANCED, FAST. Controls how quickly repeated story events move long-term scores. SLOW is best for gradual relationship scenarios.",
    "• Event Sensitivity — CONSERVATIVE, BALANCED, EXPRESSIVE. Controls how selective the narrator should be when creating relationship evidence tags. Conservative ignores most small beats; Expressive records more subtle but still genuine changes.",
    "• NPC Initiative — ON lets established NPCs naturally start follow-ups, check-ins, dates, arguments, support, awkward conversations and other relationship-relevant beats when appropriate. OFF keeps continuity but reduces proactive social beats.",
    "• Observation Turns — Minimum turns after first introduction before a bond can become established. 0–12. Default 3.",
    "• Observation Appearances — Minimum separate appearances before a bond becomes established. 1–8. Default 2. Both observation gates must be satisfied.",
    "• Active Bonds — Maximum scene-relevant directional relationships included in Crossed Wires context at once. 1–12. Lower saves context; higher suits large ensemble scenes.",
    "• Memory Anchors — Number of older major turning points retained in each active bond summary in addition to the newest memory. 0–3. Higher improves long-term continuity but uses more context.",
    "",
    "ADAPTATION",
    "• Scenario Mode — AUTO lets Crossed Wires infer the current scenario from plot context, recent story, Story Cards and placeholders. Manual options: UNIVERSAL, ROMANCE, SLICE_OF_LIFE, HORROR, FANTASY, SCI_FI, SUPERHERO, CRIME, MYSTERY, SURVIVAL, POLITICAL, MILITARY, WORKPLACE, SCHOOL, FAMILY, ADVENTURE, COMEDY, HISTORICAL, SPORTS.",
    "• Adaptation Strength — LIGHT, BALANCED, FULL. Controls how strongly the detected scenario profile changes twist weighting, event vocabulary and private guidance. LIGHT keeps behavior closest to the universal relationship engine; FULL adapts aggressively without overriding story continuity.",
    "• Role Awareness — ON lets the narrator classify established bonds such as friend, family, rival, teammate, mentor/student, superior/subordinate, colleague, ally/enemy, romantic/ex and professional. Roles guide twists and prevent mismatched assumptions such as romanticizing family bonds or treating military obedience as affection.",
    "• Scenario Twists — ON enables genre-shaped relationship complications such as chain-of-command conflicts, horror suspicion, survival resource choices, workplace credit disputes, superhero secret-identity strain, fantasy oath conflicts and family expectations. OFF keeps only universal relationship twists.",
    "",
    "DRAMA & TWISTS",
    "• Twist Mode — OFF, GROUNDED, DRAMATIC, WILD, UNHINGED. Controls natural twist frequency and the maximum risk of automatic relationship twists.",
    "• Twist Chance — AUTO starts from the selected Twist Mode and, when adaptation is active, scales frequency to the current scenario so action/horror/survival plots get more breathing room than romance or slice-of-life. Or enter 0–60 for an exact unscaled percentage whenever a twist roll is eligible.",
    "• Twists Start After — Earliest adventure turn automatic twists may begin. 0–100.",
    "• Twist Cooldown — Minimum turns between general twist seeds. 2–30.",
    "• Curveballs — ON permits continuity-safe major-secret and wild-card twists. OFF keeps more structured relationship twists only.",
    "",
    "RELATIONSHIP SCOPE",
    "• NPC to NPC — ON tracks directional NPC→NPC bonds as well as NPC→YOU. OFF limits the engine to NPC feelings toward the player.",
    "• Romance — Enables attraction, courtship, romantic status changes and romantic twist logic. OFF leaves friendship, rivalry, loyalty, trust and conflict fully active.",
    "• Mature Themes — Enables adult-only relationship themes. Adult gating still applies to every participant.",
    "• Player Is Adult — Fallback declaration used only when the player's age is otherwise unknown. An explicit under-18 Age placeholder overrides this setting.",
    "• Adult Intimacy — Allows consensual adult intimacy to affect relationship state. Narration guidance remains non-explicit/fade-to-black and focuses on expectations and aftermath.",
    "• Infidelity — Enables adult temptation/infidelity relationship mechanics. Twists create pressure or choices; they never force cheating.",
    "• Breakups — Enables breakup events and breakup-pressure twists when continuity supports them.",
    "• Parenthood — Enables adult pregnancy/parenthood relationship developments only when prior continuity makes them plausible.",
    "• Toxic Drama — Enables manipulation, coercive pressure, snooping and boundary-violation mechanics. These are treated as problems, never proof of love.",
    "",
    "ADVANCED",
    "• Scene History — Recent actions searched for names when deciding which bonds are active. 2–10.",
    "• Context Budget — Maximum characters Crossed Wires may append to model context. 2400–8000. The script automatically uses less when AI Dungeon reports less available space.",
    "• Pair Twist Cooldown — Minimum turns before the same relationship pair can receive another automatic twist. 2–40.",
    "• Repeat Twist Cooldown — Minimum turns before the same twist type can be selected again. 4–100.",
    "",
    "DISPLAY",
    "• Dashboard Numbers — ON shows exact hidden scores in !wire and !wires. OFF keeps only descriptive reads.",
    "",
    "REPAIR SYSTEM",
    "Major betrayal, abandonment and boundary damage now creates durable scars. A normal apology or forgiveness lowers immediate heat but does not erase those scars. The narrator must observe concrete repair before trust repair, boundary repair or abandonment repair can reduce them.",
    "",
    "COMMANDS",
    "!wire NAME • !wires • !wiretwists • !wirestatus • !wireprofile • !wireforget NAME • !spark [small|medium|major] • !wirehelp",
    "",
    "Internal format marker: " + CW_CONFIG_MARKER
  ].join("\n");
}

function CW_parseBool(v, fallback) {
  const s = String(v || "").trim().toLowerCase();
  if (["on", "yes", "true", "1", "enabled", "enable"].includes(s)) return true;
  if (["off", "no", "false", "0", "disabled", "disable"].includes(s)) return false;
  return fallback;
}

function CW_readNumber(v, fallback, min, max) {
  const n = parseInt(String(v || "").trim(), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function CW_configMap(entry) {
  const map = {};
  String(entry || "").split(/\r?\n/).forEach(function (line) {
    const m = line.match(/^\s*([A-Z0-9 '&\-]+?)\s*:\s*(.*?)\s*$/i);
    if (m) map[m[1].trim().toUpperCase()] = m[2].trim();
  });
  return map;
}

function CW_configFromEntry(entry) {
  const cfg = Object.assign({}, CW_DEFAULT_CONFIG);
  const map = CW_configMap(entry);

  cfg.enabled = CW_parseBool(map["ENABLED"], cfg.enabled);
  cfg.relationshipPace = String(map["RELATIONSHIP PACE"] || cfg.relationshipPace).trim().toUpperCase();
  if (!["SLOW", "BALANCED", "FAST"].includes(cfg.relationshipPace)) cfg.relationshipPace = "SLOW";
  cfg.eventSensitivity = String(map["EVENT SENSITIVITY"] || cfg.eventSensitivity).trim().toUpperCase();
  if (!["CONSERVATIVE", "BALANCED", "EXPRESSIVE"].includes(cfg.eventSensitivity)) cfg.eventSensitivity = "BALANCED";
  cfg.npcInitiative = CW_parseBool(map["NPC INITIATIVE"], cfg.npcInitiative);
  cfg.observationTurns = CW_readNumber(map["OBSERVATION TURNS"], cfg.observationTurns, 0, 12);
  cfg.observationAppearances = CW_readNumber(map["OBSERVATION APPEARANCES"], cfg.observationAppearances, 1, 8);
  cfg.maxContextRelationships = CW_readNumber(map["ACTIVE BONDS"], cfg.maxContextRelationships, 1, 12);
  cfg.memoryAnchors = CW_readNumber(map["MEMORY ANCHORS"], cfg.memoryAnchors, 0, 3);
  cfg.scenarioMode = String(map["SCENARIO MODE"] || cfg.scenarioMode).trim().toUpperCase().replace(/[ -]+/g, "_");
  if (!CW_SCENARIO_MODES.includes(cfg.scenarioMode)) cfg.scenarioMode = "AUTO";
  cfg.adaptationStrength = String(map["ADAPTATION STRENGTH"] || cfg.adaptationStrength).trim().toUpperCase();
  if (!["LIGHT", "BALANCED", "FULL"].includes(cfg.adaptationStrength)) cfg.adaptationStrength = "FULL";
  cfg.roleAwareness = CW_parseBool(map["ROLE AWARENESS"], cfg.roleAwareness);
  cfg.enableScenarioTwists = CW_parseBool(map["SCENARIO TWISTS"], cfg.enableScenarioTwists);
  cfg.sceneHistoryActions = CW_readNumber(map["SCENE HISTORY"], cfg.sceneHistoryActions, 2, 10);
  cfg.contextBudgetChars = CW_readNumber(map["CONTEXT BUDGET"], cfg.contextBudgetChars, 2400, 8000);

  cfg.twistMode = String(map["TWIST MODE"] || cfg.twistMode).trim().toUpperCase();
  if (!["OFF", "GROUNDED", "DRAMATIC", "WILD", "UNHINGED"].includes(cfg.twistMode)) cfg.twistMode = "WILD";
  const twistChanceRaw = String(map["TWIST CHANCE"] || "AUTO").trim().toUpperCase();
  cfg.twistChancePercent = twistChanceRaw === "AUTO" ? -1 : CW_readNumber(twistChanceRaw, -1, 0, 60);
  cfg.twistMinTurn = CW_readNumber(map["TWISTS START AFTER"], cfg.twistMinTurn, 0, 100);
  cfg.twistCooldownTurns = CW_readNumber(map["TWIST COOLDOWN"], cfg.twistCooldownTurns, 2, 30);
  cfg.pairTwistCooldownTurns = CW_readNumber(map["PAIR TWIST COOLDOWN"], cfg.pairTwistCooldownTurns, 2, 40);
  cfg.repeatTwistCooldownTurns = CW_readNumber(map["REPEAT TWIST COOLDOWN"], cfg.repeatTwistCooldownTurns, 4, 100);
  cfg.enableCurveballs = CW_parseBool(map["CURVEBALLS"], cfg.enableCurveballs);

  cfg.enableNpcNpc = CW_parseBool(map["NPC TO NPC"], cfg.enableNpcNpc);
  cfg.enableRomance = CW_parseBool(map["ROMANCE"], cfg.enableRomance);
  cfg.enableMatureThemes = CW_parseBool(map["MATURE THEMES"], cfg.enableMatureThemes);
  cfg.playerCharacterIsAdult = CW_parseBool(map["PLAYER IS ADULT"] != null ? map["PLAYER IS ADULT"] : map["PLAYER CHARACTER IS ADULT"], cfg.playerCharacterIsAdult);
  cfg.enableAdultIntimacy = CW_parseBool(map["ADULT INTIMACY"], cfg.enableAdultIntimacy);
  cfg.enableInfidelity = CW_parseBool(map["INFIDELITY"], cfg.enableInfidelity);
  cfg.enableBreakups = CW_parseBool(map["BREAKUPS"], cfg.enableBreakups);
  cfg.enableParenthoodThemes = CW_parseBool(map["PARENTHOOD"] != null ? map["PARENTHOOD"] : map["PARENTHOOD THEMES"], cfg.enableParenthoodThemes);
  cfg.enableToxicDrama = CW_parseBool(map["TOXIC DRAMA"], cfg.enableToxicDrama);
  cfg.showExactNumbersInDashboard = CW_parseBool(map["DASHBOARD NUMBERS"] != null ? map["DASHBOARD NUMBERS"] : map["EXACT DASHBOARD STATS"], cfg.showExactNumbersInDashboard);
  return cfg;
}

function CW_writeConfigCard(card, cfg) {
  if (!card || typeof storyCards === "undefined") return;
  const index = storyCards.indexOf(card);
  if (index < 0) return;
  const entry = CW_defaultConfigEntryFrom(cfg || CW_configFromEntry(card.entry));
  const notes = CW_configNotes();
  try {
    if (typeof updateStoryCard === "function") {
      updateStoryCard(index, "", entry, "Custom", CW_CONFIG_TITLE, notes);
    }
  } catch (e) {
    try {
      if (typeof updateStoryCard === "function") updateStoryCard(index, "", entry, "Custom");
    } catch (fallbackError) {
      if (typeof log === "function") log("Crossed Wires: config card API update fallback: " + fallbackError);
    }
  }
  // Current AI Dungeon exposes title/name and notes/description in newer builds.
  // Keep mutable-field fallbacks for sandboxes that only honor the older update call.
  const current = storyCards[index] || card;
  current.keys = "";
  current.entry = entry;
  current.type = "Custom";
  current.title = CW_CONFIG_TITLE;
  current.name = CW_CONFIG_TITLE;
  current.description = notes;
  current.notes = notes;
}

function CW_upgradeConfigCard(card) {
  if (!card) return;
  const notes = String(card.description || card.notes || "");
  const cleanIdentity = String(card.title || card.name || "") === CW_CONFIG_TITLE && !CW_cardKeysText(card).includes("__crossed_wires_config__");
  if (cleanIdentity && state.crossedWires && state.crossedWires.configCardVersion >= 6) return;
  if (cleanIdentity && notes.includes(CW_CONFIG_MARKER)) {
    if (state.crossedWires) state.crossedWires.configCardVersion = 6;
    return;
  }
  const migrated = CW_configFromEntry(card.entry);
  CW_writeConfigCard(card, migrated);
  if (state.crossedWires) state.crossedWires.configCardVersion = 6;
}

function CW_ensureConfigCard() {
  const existing = CW_configCard();
  if (existing) {
    CW_upgradeConfigCard(existing);
    return existing;
  }
  if (typeof addStoryCard !== "function" || typeof storyCards === "undefined" || !Array.isArray(storyCards)) return null;

  const entry = CW_defaultConfigEntry();
  const notes = CW_configNotes();
  const before = storyCards.length;
  let createdIndex = null;
  try {
    // Newer AI Dungeon builds accept name/title and notes after the documented
    // keys/entry/type arguments. Older builds simply use the first three.
    const result = addStoryCard("CWConfig", entry, "Custom", CW_CONFIG_TITLE, notes);
    if (Number.isFinite(Number(result))) createdIndex = Number(result);
  } catch (e) {
    try {
      const result = addStoryCard("CWConfig", entry, "Custom");
      if (Number.isFinite(Number(result))) createdIndex = Number(result);
    } catch (fallbackError) {
      if (typeof log === "function") log("Crossed Wires: could not create config card: " + fallbackError);
      return null;
    }
  }

  // The scripting API returns an index, but historical builds have differed in
  // how creators interpreted it. If a card was appended, the pre-call length is
  // unambiguous and prevents us from ever overwriting an unrelated Story Card.
  let card = storyCards.length > before ? storyCards[before] : null;
  if (!card && createdIndex != null && storyCards[createdIndex]) card = storyCards[createdIndex];
  if (!card) card = CW_configCard();
  if (!card) return null;

  const index = storyCards.indexOf(card);
  if (index >= 0) {
    try {
      if (typeof updateStoryCard === "function") updateStoryCard(index, "", entry, "Custom", CW_CONFIG_TITLE, notes);
    } catch (e) {
      try { if (typeof updateStoryCard === "function") updateStoryCard(index, "", entry, "Custom"); } catch (_) {}
    }
  }
  card.keys = "";
  card.entry = entry;
  card.type = "Custom";
  card.title = CW_CONFIG_TITLE;
  card.name = CW_CONFIG_TITLE;
  card.description = notes;
  card.notes = notes;
  if (state.crossedWires) state.crossedWires.configCardVersion = 6;
  return card;
}

function CW_config() {
  const card = CW_configCard();
  return card && card.entry ? CW_configFromEntry(card.entry) : Object.assign({}, CW_DEFAULT_CONFIG);
}

function CW_profileCorpus(baseContext) {
  const parts = [];
  const base = String(baseContext || "");
  const recent = CW_recentHistoryText(8);
  if (base) parts.push(base.slice(-24000));
  parts.push(recent);

  // Only use Story Cards that appear relevant to the live scene/context. Scanning
  // an entire 5000-card world database would let unused lore drown out the
  // scenario actually being played.
  const liveText = (base + "\n" + recent).toLowerCase();
  const configCard = CW_configCard();
  if (typeof storyCards !== "undefined" && Array.isArray(storyCards)) {
    let included = 0;
    for (let i = 0; i < storyCards.length && included < 30; i++) {
      const c = storyCards[i];
      if (!c || c === configCard) continue;
      const title = String(c.title || c.name || "").trim();
      const keys = CW_cardKeysText(c).split(/[,;]/).map(function (x) { return x.trim(); }).filter(Boolean);
      const signals = [title].concat(keys).filter(Boolean);
      const relevant = signals.some(function (signal) { return signal.length >= 3 && liveText.indexOf(signal.toLowerCase()) >= 0; });
      if (!relevant) continue;
      parts.push(title, String(c.type || ""), String(c.entry || "").slice(0, 700));
      included++;
    }
  }
  const ph = (typeof placeholders !== "undefined" && Array.isArray(placeholders))
    ? placeholders
    : ((state && Array.isArray(state.placeholders)) ? state.placeholders : []);
  for (const p of ph) parts.push(String((p && p.question) || ""), String((p && p.answer) || ""));
  return parts.join("\n").toLowerCase().slice(-50000);
}

function CW_countPhrase(text, phrase) {
  const p = String(phrase || "").toLowerCase();
  if (!p) return 0;
  let pos = 0, count = 0;
  while ((pos = text.indexOf(p, pos)) >= 0 && count < 6) { count++; pos += p.length; }
  return count;
}

function CW_detectScenarioProfile(baseContext, cfg) {
  const c = cfg || CW_config();
  if (c.scenarioMode && c.scenarioMode !== "AUTO") {
    const explicit = { primary: c.scenarioMode, secondary: "", confidence: 100, manual: true, turn: CW_turn(), candidates: [{ mode: c.scenarioMode, score: 100 }] };
    state.crossedWires.scenario = explicit;
    return explicit;
  }
  const corpus = CW_profileCorpus(baseContext);
  const scored = [];
  for (const mode of CW_SCENARIO_MODES) {
    if (mode === "AUTO" || mode === "UNIVERSAL") continue;
    const def = CW_PROFILE_DEFINITIONS[mode];
    let score = 0;
    for (const clue of (def.clues || [])) {
      const hits = CW_countPhrase(corpus, clue);
      if (hits) score += hits * (clue.indexOf(" ") >= 0 ? 3 : 2);
    }
    scored.push({ mode: mode, score: score });
  }
  scored.sort(function (a, b) { return b.score - a.score; });
  const top = scored[0] || { mode: "UNIVERSAL", score: 0 };
  const second = scored[1] || { mode: "", score: 0 };
  let primary = top.score >= 4 ? top.mode : "UNIVERSAL";
  let secondary = "";
  if (primary !== "UNIVERSAL" && second.score >= 4 && second.score >= top.score * 0.55) secondary = second.mode;
  const confidence = primary === "UNIVERSAL" ? Math.min(40, top.score * 8) : Math.min(99, 45 + top.score * 5);
  const result = { primary: primary, secondary: secondary, confidence: confidence, manual: false, turn: CW_turn(), candidates: scored.slice(0, 5) };
  state.crossedWires.scenario = result;
  return result;
}

function CW_currentScenarioProfile() {
  const s = state.crossedWires && state.crossedWires.scenario;
  return s && s.primary ? s : { primary: "UNIVERSAL", secondary: "", confidence: 0, manual: false, turn: -1 };
}

function CW_profileDirective(profile, cfg) {
  const p = profile || CW_currentScenarioProfile();
  const modes = [p.primary, p.secondary].filter(Boolean);
  const bits = modes.map(function (m) { return CW_PROFILE_DEFINITIONS[m] ? CW_PROFILE_DEFINITIONS[m].directive : ""; }).filter(Boolean);
  if (!bits.length) bits.push(CW_PROFILE_DEFINITIONS.UNIVERSAL.directive);
  const strength = (cfg || CW_config()).adaptationStrength;
  const prefix = strength === "LIGHT" ? "Light adaptation: " : (strength === "BALANCED" ? "Scenario adaptation: " : "Strong scenario adaptation: ");
  return prefix + bits.join(" Secondary influence: ");
}

function CW_profileEventCodes(profile) {
  const p = profile || CW_currentScenarioProfile();
  const out = [];
  [p.primary, p.secondary].filter(Boolean).forEach(function (m) {
    (CW_PROFILE_EVENT_CODES[m] || []).forEach(function (e) { if (CW_EVENT_EFFECTS[e] && !out.includes(e)) out.push(e); });
  });
  return out;
}

function CW_explicitAgeStatus(value) {
  const s = String(value || "");
  const patterns = [
    /\b(?:age\s*[:=-]?\s*|aged\s+)([0-9]{1,2})\b/i,
    /\b([0-9]{1,2})\s*(?:-| )?years?[- ]old\b/i
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (!m) continue;
    const age = parseInt(m[1], 10);
    if (Number.isFinite(age)) return age >= 18 ? "adult" : "minor";
  }
  return "unknown";
}

function CW_wordAgeStatus(value) {
  const s = String(value || "").toLowerCase().replace(/[–—-]/g, " ");
  const small = {
    zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10,
    eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17,
    eighteen:18, nineteen:19, twenty:20, thirty:30, forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90
  };
  const ageWords = "(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty(?:\\s+(?:one|two|three|four|five|six|seven|eight|nine))?|thirty(?:\\s+(?:one|two|three|four|five|six|seven|eight|nine))?|forty(?:\\s+(?:one|two|three|four|five|six|seven|eight|nine))?|fifty|sixty|seventy|eighty|ninety)";
  let m = s.match(new RegExp("\\b(?:age\\s+|aged\\s+)" + ageWords + "\\b", "i"));
  if (!m) m = s.match(new RegExp("\\b" + ageWords + "\\s+years?\\s+old\\b", "i"));
  if (!m) return "unknown";
  const parts = m[1].split(/\s+/);
  let age = small[parts[0]];
  if (parts.length > 1 && small[parts[1]] != null) age += small[parts[1]];
  return Number.isFinite(age) ? (age >= 18 ? "adult" : "minor") : "unknown";
}

function CW_detectAdultFromEntry(entry) {
  const s = String(entry || "");
  const explicit = CW_explicitAgeStatus(s);
  if (explicit !== "unknown") return explicit;
  const wordAge = CW_wordAgeStatus(s);
  if (wordAge !== "unknown") return wordAge;
  if (/\b(adult|grown man|grown woman|grown adult)\b/i.test(s)) return "adult";
  // Explicit decade descriptions such as "early twenties" or "in his late forties"
  // establish adulthood without requiring an exact numeric age.
  if (/\b(?:(?:in\s+(?:his|her|their)\s+)?(?:early|mid|late)[ -]?)?(?:twenties|thirties|forties|fifties|sixties|seventies|eighties|nineties)\b/i.test(s)) return "adult";
  return "unknown";
}

function CW_playerExplicitAgeStatus() {
  if (!state || !Array.isArray(state.placeholders)) return "unknown";
  for (const p of state.placeholders) {
    if (!p || !/\bage\b/i.test(String(p.question || ""))) continue;
    const answer = String(p.answer || "").trim();
    let n = parseInt(answer, 10);
    if (!Number.isFinite(n)) {
      let status = CW_explicitAgeStatus(answer);
      if (status === "unknown") status = CW_wordAgeStatus(answer);
      if (status !== "unknown") return status;
      continue;
    }
    if (n >= 0 && n <= 99) return n >= 18 ? "adult" : "minor";
  }
  return "unknown";
}

function CW_resolveNpcKey(nameOrKey) {
  const clean = CW_cleanName(nameOrKey) || String(nameOrKey || "").trim();
  let key = CW_key(clean);
  if (!key) return "";
  const seen = {};
  for (let i = 0; i < 8 && state.crossedWires.aliases[key] && !seen[key]; i++) {
    seen[key] = true;
    key = state.crossedWires.aliases[key];
  }
  return key;
}

function CW_nameFormsForKey(key) {
  const canonicalKey = CW_resolveNpcKey(key);
  if (!canonicalKey) return [];
  const forms = [];
  const npc = state.crossedWires.npcs[canonicalKey];
  if (npc && npc.name) forms.push(npc.name);
  for (const aliasKey in state.crossedWires.aliases) {
    if (CW_resolveNpcKey(aliasKey) === canonicalKey) forms.push(aliasKey);
  }
  return forms.filter(function (x, i, arr) { return x && arr.indexOf(x) === i; });
}

function CW_mergeNpcAlias(aliasKey, canonicalKey, canonicalName) {
  const cw = state.crossedWires;
  if (!aliasKey || !canonicalKey || aliasKey === canonicalKey) return;
  const oldNpc = cw.npcs[aliasKey];
  let target = cw.npcs[canonicalKey];

  if (oldNpc) {
    if (!target) {
      target = Object.assign({}, oldNpc, { name: canonicalName || oldNpc.name });
      cw.npcs[canonicalKey] = target;
    } else {
      target.introducedAt = Math.min(target.introducedAt == null ? Infinity : target.introducedAt, oldNpc.introducedAt == null ? Infinity : oldNpc.introducedAt);
      if (!Number.isFinite(target.introducedAt)) target.introducedAt = 0;
      target.lastSeen = Math.max(target.lastSeen || 0, oldNpc.lastSeen || 0);
      target.lastMentionTurn = Math.max(target.lastMentionTurn || 0, oldNpc.lastMentionTurn || 0);
      target.mentions = Math.max(target.mentions || 0, oldNpc.mentions || 0);
      if (oldNpc.adultStatus === "adult") target.adultStatus = "adult";
      if (canonicalName) target.name = canonicalName;
    }
    delete cw.npcs[aliasKey];
  }

  for (const e of cw.ledger) {
    if (CW_key(e.from) === aliasKey) e.from = target && target.name ? target.name : canonicalName;
    if (CW_key(e.to) === aliasKey) e.to = target && target.name ? target.name : canonicalName;
  }

  const rebuiltRoles = {};
  for (const rk in cw.roles) {
    const bits = rk.split("->");
    if (bits.length !== 2) continue;
    const rf = bits[0] === aliasKey ? canonicalKey : bits[0];
    const rt = bits[1] === aliasKey ? canonicalKey : bits[1];
    const nk = rf + "->" + rt;
    const prior = rebuiltRoles[nk];
    if (!prior || Number((cw.roles[rk] || {}).turn || 0) >= Number(prior.turn || 0)) rebuiltRoles[nk] = cw.roles[rk];
  }
  cw.roles = rebuiltRoles;

  for (const sighting of cw.sightings) if (sighting && sighting.key === aliasKey) sighting.key = canonicalKey;
  const dedupe = {};
  cw.sightings = cw.sightings.filter(function (x) {
    if (!x) return false;
    const k = x.key + "|" + x.turn;
    if (dedupe[k]) return false;
    dedupe[k] = true;
    return true;
  });

  for (const a in cw.aliases) if (cw.aliases[a] === aliasKey) cw.aliases[a] = canonicalKey;
  CW_invalidateEventIndex();
}

function CW_registerAlias(alias, canonicalName) {
  const cleanAlias = CW_cleanName(alias);
  const cleanCanonical = CW_cleanName(canonicalName);
  if (!cleanAlias || !cleanCanonical) return;
  const a = CW_key(cleanAlias);
  const c = CW_resolveNpcKey(cleanCanonical) || CW_key(cleanCanonical);
  if (!a || !c || a === c || CW_isPlayerName(cleanAlias)) return;
  CW_mergeNpcAlias(a, c, cleanCanonical);
  state.crossedWires.aliases[a] = c;
}

function CW_resolveNpcName(name) {
  const clean = CW_cleanName(name);
  if (!clean) return "";
  const canonicalKey = CW_resolveNpcKey(clean);
  const npc = state.crossedWires.npcs[canonicalKey];
  return npc && npc.name ? npc.name : clean;
}

function CW_roleKey(from, to) {
  const f = CW_key(CW_resolveNpcName(from));
  const t = CW_key(to) === "you" ? "you" : CW_key(CW_resolveNpcName(to));
  return f + "->" + t;
}

function CW_getRole(from, to) {
  const rec = state.crossedWires.roles[CW_roleKey(from, to)];
  return rec && CW_ROLE_CODES.includes(rec.role) ? rec.role : "unknown";
}

function CW_setRole(from, to, role, turn) {
  const cfg = CW_config();
  if (!cfg.roleAwareness) return false;
  const fromName = CW_resolveNpcName(from);
  const toName = CW_key(to) === "you" ? "YOU" : CW_resolveNpcName(to);
  const r = String(role || "").toLowerCase();
  if (!fromName || CW_isPlayerName(fromName) || !toName || !CW_ROLE_CODES.includes(r)) return false;
  if (!cfg.enableNpcNpc && toName !== "YOU") return false;
  if (CW_key(fromName) === CW_key(toName)) return false;
  CW_registerNpc(fromName, turn);
  if (toName !== "YOU") CW_registerNpc(toName, turn);
  state.crossedWires.roles[CW_roleKey(fromName, toName)] = { role: r, turn: Number(turn) || 0 };
  // Populate the inverse for NPC↔NPC relationships when the role has a stable inverse.
  if (toName !== "YOU" && CW_ROLE_INVERSE[r]) {
    state.crossedWires.roles[CW_roleKey(toName, fromName)] = { role: CW_ROLE_INVERSE[r], turn: Number(turn) || 0 };
  }
  return true;
}

function CW_roleDisplay(role) {
  return String(role || "unknown").replace(/_/g, " ");
}

function CW_isFamilyRole(role) {
  return CW_FAMILY_ROLES.includes(String(role || "").toLowerCase());
}

function CW_noteSighting(key, turn) {
  const cw = state.crossedWires;
  if (!key || !Number.isFinite(Number(turn))) return;
  const t = Math.max(0, Math.floor(Number(turn)));
  const duplicate = cw.sightings.some(function (s) { return s && s.key === key && s.turn === t; });
  if (!duplicate) cw.sightings.push({ key: key, turn: t });
  if (cw.sightings.length > 6000) cw.sightings.splice(0, cw.sightings.length - 6000);
}

function CW_registerNpc(name, turn, adultStatus) {
  const cleanInput = CW_cleanName(name);
  if (!cleanInput || CW_isPlayerName(cleanInput)) return null;
  const inputKey = CW_key(cleanInput);
  const canonicalKey = CW_resolveNpcKey(inputKey) || inputKey;
  const existing = state.crossedWires.npcs[canonicalKey];
  const clean = existing && existing.name ? existing.name : cleanInput;
  const key = CW_key(clean);
  const statusRaw = String(adultStatus || "unknown").toLowerCase();
  const incomingAdult = ["adult", "minor"].includes(statusRaw) ? statusRaw : "unknown";

  if (!state.crossedWires.npcs[key]) {
    state.crossedWires.npcs[key] = {
      name: clean,
      introducedAt: turn,
      lastSeen: turn,
      lastMentionTurn: turn,
      mentions: 1,
      adultStatus: incomingAdult
    };
  } else {
    const npc = state.crossedWires.npcs[key];
    npc.lastSeen = Math.max(npc.lastSeen || 0, turn);
    if (!npc.name) npc.name = clean;
    if (incomingAdult === "adult" || incomingAdult === "minor") npc.adultStatus = incomingAdult;
  }
  CW_noteSighting(key, turn);
  return state.crossedWires.npcs[key];
}

function CW_touchKnownNpcs(text, turn) {
  const source = String(text || "");
  for (const key in state.crossedWires.npcs) {
    const npc = state.crossedWires.npcs[key];
    const forms = CW_nameFormsForKey(key);
    if (forms.some(function (n) { return CW_wordPresent(source, n); }) && npc.lastMentionTurn !== turn) {
      npc.lastMentionTurn = turn;
      npc.lastSeen = turn;
      npc.mentions = (npc.mentions || 0) + 1;
      CW_noteSighting(key, turn);
    }
  }
}

function CW_seedFromCharacterCards(turn) {
  if (typeof storyCards === "undefined" || !Array.isArray(storyCards)) return;
  const recent = CW_recentHistoryText();
  for (const card of storyCards) {
    if (!card) continue;
    const type = String(card.type || "").toLowerCase();
    if (type !== "character" && type !== "npc") continue;

    const candidates = [];
    const titleName = CW_cleanName(card.title || card.name || "");
    if (titleName) candidates.push(titleName);
    const rawKeys = CW_cardKeysText(card).split(/[,;]/).map(function (x) { return x.trim(); }).filter(Boolean);
    for (const k of rawKeys) {
      const clean = CW_cleanName(k);
      if (clean && !candidates.some(function (x) { return CW_key(x) === CW_key(clean); })) candidates.push(clean);
    }
    if (!candidates.length) continue;

    const canonical = candidates[0];
    const mentioned = candidates.some(function (candidate) { return CW_wordPresent(recent, candidate); });
    if (!mentioned) continue;
    CW_registerNpc(canonical, turn, CW_detectAdultFromEntry(String(card.entry || "") + "\n" + String(card.description || card.notes || "")));
    for (const alias of candidates.slice(1, 8)) CW_registerAlias(alias, canonical);
  }
}

function CW_handleUndo(turn) {
  const cw = state.crossedWires;
  if (turn < (cw.lastActionCount || 0)) {
    cw.ledger = cw.ledger.filter(function (e) { return e.turn <= turn; });
    CW_invalidateEventIndex();
    cw.sightings = cw.sightings.filter(function (x) { return x.turn <= turn; });
    for (const key in cw.npcs) {
      const npc = cw.npcs[key];
      if ((npc.introducedAt || 0) > turn) {
        delete cw.npcs[key];
        continue;
      }
      const sightings = cw.sightings.filter(function (x) { return x.key === key; }).map(function (x) { return x.turn; });
      npc.mentions = Math.max(1, sightings.length || 1);
      npc.lastMentionTurn = sightings.length ? Math.max.apply(null, sightings) : npc.introducedAt;
      npc.lastSeen = npc.lastMentionTurn;
    }
    for (const alias in cw.aliases) if (!cw.npcs[cw.aliases[alias]]) delete cw.aliases[alias];
    for (const rk in cw.roles) if (Number((cw.roles[rk] || {}).turn || 0) > turn) delete cw.roles[rk];
    if (cw.scenario && Number(cw.scenario.turn || -1) > turn) cw.scenario = { primary: "UNIVERSAL", secondary: "", confidence: 0, turn: turn };

    cw.twist.history = cw.twist.history.filter(function (t) { return (t.turn || 0) <= turn; });
    if (cw.twist.pending && (cw.twist.pending.armedAt || 0) > turn) cw.twist.pending = null;
    cw.twist.lastRollTurn = Math.min(cw.twist.lastRollTurn || -1, turn - 1);
    cw.twist.lastSeedTurn = -9999;
    cw.twist.lastTwistTurn = -9999;
    cw.twist.pairLastSeed = {};
    cw.twist.idLastSeed = {};
    for (const t of cw.twist.history) {
      const tt = Number(t.turn) || 0;
      cw.twist.lastSeedTurn = Math.max(cw.twist.lastSeedTurn, tt);
      if (t.used) cw.twist.lastTwistTurn = Math.max(cw.twist.lastTwistTurn, tt);
      if (t.pairKey) cw.twist.pairLastSeed[t.pairKey] = Math.max(cw.twist.pairLastSeed[t.pairKey] || -9999, tt);
      if (t.id) cw.twist.idLastSeed[t.id] = Math.max(cw.twist.idLastSeed[t.id] || -9999, tt);
    }
  }
  cw.lastActionCount = turn;
}

function CW_matureAtForName(name) {
  const cfg = CW_config();
  if (CW_key(name) === "you") return 0;
  const resolved = CW_resolveNpcName(name);
  const key = CW_key(resolved);
  const npc = state.crossedWires.npcs[key];
  if (!npc) return Infinity;
  const elapsedGate = (npc.introducedAt || 0) + cfg.observationTurns;
  const appearanceTurns = state.crossedWires.sightings
    .filter(function (x) { return x.key === key; })
    .map(function (x) { return x.turn; })
    .sort(function (a, b) { return a - b; });
  let appearanceGate;
  if (appearanceTurns.length >= cfg.observationAppearances) appearanceGate = appearanceTurns[cfg.observationAppearances - 1];
  else if ((npc.mentions || 0) >= cfg.observationAppearances) appearanceGate = elapsedGate; // v2 migration fallback
  else appearanceGate = Infinity;
  return Math.max(elapsedGate, appearanceGate);
}

function CW_isMatureName(name, turn) {
  return turn >= CW_matureAtForName(name);
}

function CW_pairMature(from, to, turn) {
  return CW_isMatureName(from, turn) && CW_isMatureName(to, turn);
}

function CW_isAdultName(name) {
  const cfg = CW_config();
  if (CW_key(name) === "you") {
    const explicit = CW_playerExplicitAgeStatus();
    if (explicit === "minor") return false;
    if (explicit === "adult") return true;
    return !!cfg.playerCharacterIsAdult;
  }
  const resolved = CW_resolveNpcName(name);
  const npc = state.crossedWires.npcs[CW_key(resolved)];
  return !!npc && npc.adultStatus === "adult";
}

function CW_pairAdults(from, to) {
  return CW_isAdultName(from) && CW_isAdultName(to);
}

function CW_addEvent(from, to, kind, severity, note, turn) {
  const cfg = CW_config();
  const cw = state.crossedWires;
  const fromClean = CW_resolveNpcName(from);
  const toClean = CW_key(to) === "you" ? "YOU" : CW_resolveNpcName(to);
  const eventKind = String(kind || "").toLowerCase();
  const sev = Math.max(1, Math.min(3, parseInt(severity, 10) || 1));
  const cleanNote = String(note || "").replace(/[\r\n|\]]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 150);

  // Never invent or score the protagonist's feelings.
  if (!fromClean || CW_isPlayerName(fromClean)) return false;
  if (!toClean || !CW_EVENT_EFFECTS[eventKind]) return false;
  if (!cfg.enableNpcNpc && toClean !== "YOU") return false;
  if (CW_key(fromClean) === CW_key(toClean)) return false;
  if (!cfg.enableRomance && CW_ROMANCE_EVENTS.includes(eventKind)) return false;
  if (CW_MATURE_EVENTS.includes(eventKind) && (!cfg.enableMatureThemes || !CW_pairAdults(fromClean, toClean))) return false;
  if (["adult_intimacy", "casual_intimacy"].includes(eventKind) && !cfg.enableAdultIntimacy) return false;
  if (eventKind === "infidelity" && !cfg.enableInfidelity) return false;
  if (eventKind === "breakup" && !cfg.enableBreakups) return false;
  if (eventKind === "parenthood_news" && !cfg.enableParenthoodThemes) return false;
  if (CW_TOXIC_EVENTS.includes(eventKind) && !cfg.enableToxicDrama) return false;

  CW_registerNpc(fromClean, turn);
  if (toClean !== "YOU") CW_registerNpc(toClean, turn);

  const normalizedNote = cleanNote.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const duplicate = cw.ledger.some(function (e) {
    if (Math.abs(Number(e.turn || 0) - Number(turn || 0)) > 3) return false;
    if (CW_key(e.from) !== CW_key(fromClean) || CW_key(e.to) !== CW_key(toClean) || e.kind !== eventKind) return false;
    const priorNote = String(e.note || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    return priorNote === normalizedNote;
  });
  if (duplicate) return false;

  cw.ledger.push({ turn: turn, from: fromClean, to: toClean, kind: eventKind, severity: sev, note: cleanNote });
  if (cw.ledger.length > cfg.maxLedgerEvents) cw.ledger.splice(0, cw.ledger.length - cfg.maxLedgerEvents);
  CW_invalidateEventIndex();
  return true;
}

function CW_bounds(metric) {
  if (["attachment", "attraction", "jealousy", "resentment", "fear", "tension"].includes(metric)) return [0, 100];
  return [-100, 100];
}

function CW_clampMetric(metric, value) {
  const b = CW_bounds(metric);
  return Math.max(b[0], Math.min(b[1], Math.round(value)));
}

function CW_applyPassiveDecay(scores, turns) {
  if (turns <= 0) return;
  const steps = Math.floor(turns / 9);
  if (steps <= 0) return;
  scores.tension = Math.max(0, scores.tension - steps * 2);
  scores.fear = Math.max(0, scores.fear - steps);
  scores.jealousy = Math.max(0, scores.jealousy - steps);
  scores.resentment = Math.max(0, scores.resentment - Math.floor(steps / 2));
}

function CW_relationshipFlags(events) {
  const f = {
    confessed: false, defined: false, exclusive: false, committed: false, proposed: false,
    married: false, movedIn: false, brokenUp: false, reconciled: false,
    adultIntimacy: false, casualIntimacy: false,
    betrayalScars: 0, abandonmentScars: 0, boundaryScars: 0
  };
  for (const e of events) {
    if (e.kind === "confession" || e.kind === "affection_declared") f.confessed = true;
    if (e.kind === "relationship_defined") { f.defined = true; f.brokenUp = false; }
    if (e.kind === "exclusivity") { f.exclusive = true; f.defined = true; f.brokenUp = false; }
    if (e.kind === "commitment") { f.committed = true; f.defined = true; f.brokenUp = false; }
    if (e.kind === "proposal") { f.proposed = true; f.committed = true; f.defined = true; f.brokenUp = false; }
    if (e.kind === "marriage") { f.married = true; f.proposed = true; f.committed = true; f.exclusive = true; f.defined = true; f.brokenUp = false; }
    if (e.kind === "moving_in") f.movedIn = true;
    if (e.kind === "breakup") { f.brokenUp = true; f.committed = false; f.proposed = false; f.exclusive = false; }
    if (e.kind === "reconciliation") { f.reconciled = true; f.brokenUp = false; }
    if (e.kind === "adult_intimacy") f.adultIntimacy = true;
    if (e.kind === "casual_intimacy") { f.adultIntimacy = true; f.casualIntimacy = true; }
    if ((e.kind === "betrayal" || e.kind === "infidelity") && e.severity >= 2) f.betrayalScars += (e.kind === "infidelity" ? 2 : 1);
    if (e.kind === "abandonment" && e.severity >= 2) f.abandonmentScars += 1;
    if (["boundary_violated", "coercive_pressure"].includes(e.kind) && e.severity >= 2) f.boundaryScars += 1;
    if (e.kind === "trust_repair" && e.severity >= 2) f.betrayalScars = Math.max(0, f.betrayalScars - 1);
    if (e.kind === "boundary_repair" && e.severity >= 2) f.boundaryScars = Math.max(0, f.boundaryScars - 1);
    if (e.kind === "abandonment_repair" && e.severity >= 2) f.abandonmentScars = Math.max(0, f.abandonmentScars - 1);
  }
  return f;
}


function CW_invalidateEventIndex() {
  CW_RUNTIME_EVENT_INDEX = null;
}

function CW_eventIndex() {
  if (CW_RUNTIME_EVENT_INDEX) return CW_RUNTIME_EVENT_INDEX;
  const map = {};
  const cw = state.crossedWires;
  for (const e of cw.ledger) {
    if (!e) continue;
    const key = CW_key(e.from) + "=>" + CW_key(e.to);
    if (!map[key]) map[key] = [];
    map[key].push(e);
  }
  for (const key in map) map[key].sort(function (a, b) { return a.turn - b.turn; });
  CW_RUNTIME_EVENT_INDEX = map;
  return map;
}

function CW_eventsForPair(from, to, turn) {
  const key = CW_key(from) + "=>" + CW_key(to);
  const list = CW_eventIndex()[key] || [];
  if (!Number.isFinite(Number(turn))) return list.slice();
  const maxTurn = Number(turn);
  // Lists are sorted once per hook; stop as soon as events move beyond this turn.
  const out = [];
  for (const e of list) {
    if (e.turn > maxTurn) break;
    out.push(e);
  }
  return out;
}

function CW_eventValence(e) {
  const effect = CW_EVENT_EFFECTS[e.kind] || {};
  const positive = ["trust", "affection", "respect", "loyalty", "openness", "attachment", "attraction"];
  const pressure = ["jealousy", "resentment", "fear", "tension"];
  let total = 0;
  for (const metric in effect) {
    if (positive.includes(metric)) total += effect[metric];
    else if (pressure.includes(metric)) total -= effect[metric];
  }
  return total * (e.severity === 3 ? 1.6 : (e.severity === 2 ? 1 : 0.7));
}

function CW_trajectory(events) {
  const recent = events.slice(-6);
  if (recent.length < 2) return "forming";
  const values = recent.map(CW_eventValence);
  const total = values.reduce(function (a, b) { return a + b; }, 0);
  const hasPos = values.some(function (v) { return v >= 4; });
  const hasNeg = values.some(function (v) { return v <= -4; });
  if (hasPos && hasNeg) return "volatile";
  if (total >= 12) return "warming";
  if (total <= -12) return "cooling";
  return "steady";
}

function CW_unresolvedThread(scores, flags, events) {
  const recentKinds = events.slice(-8).map(function (e) { return e.kind; });
  if (flags.betrayalScars || flags.boundaryScars) return "repair is still unresolved";
  if (flags.brokenUp && (scores.affection >= 30 || scores.attachment >= 35)) return "the breakup still has emotional loose ends";
  if ((flags.committed || flags.married) && (scores.resentment >= 40 || scores.tension >= 45)) return "the established relationship is under strain";
  if (recentKinds.includes("exclusivity_mismatch") || (scores.jealousy >= 40 && scores.trust < 35)) return "expectations around trust/exclusivity are unresolved";
  if (recentKinds.includes("incompatibility")) return "a compatibility issue remains unresolved";
  if (!flags.defined && scores.attraction >= 40 && scores.attachment >= 28) return "the bond has meaningful chemistry but remains undefined";
  if (scores.openness <= -30 && scores.trust <= 5) return "guardedness is blocking repair or closeness";
  if (scores.jealousy >= 40) return "jealousy or insecurity remains active";
  return "";
}

function CW_computeLink(from, to, turn) {
  const cfg = CW_config();
  const resolvedFrom = CW_resolveNpcName(from) || from;
  const resolvedTo = CW_key(to) === "you" ? "YOU" : (CW_resolveNpcName(to) || to);
  const events = CW_eventsForPair(resolvedFrom, resolvedTo, turn);
  if (!events.length) return null;

  const scores = {
    trust: 0, affection: 0, respect: 0, loyalty: 0, openness: 0,
    attachment: 0, attraction: 0, jealousy: 0, resentment: 0, fear: 0, tension: 3
  };

  const matureAt = Math.max(CW_matureAtForName(resolvedFrom), CW_matureAtForName(resolvedTo));
  let betrayalScars = 0;
  let abandonmentScars = 0;
  let boundaryScars = 0;
  let lastTurn = events[0].turn;
  const paceUp = cfg.relationshipPace === "FAST" ? 1.22 : (cfg.relationshipPace === "BALANCED" ? 1.0 : 0.78);
  const paceDown = cfg.relationshipPace === "FAST" ? 1.06 : (cfg.relationshipPace === "BALANCED" ? 1.0 : 0.92);

  for (const e of events) {
    CW_applyPassiveDecay(scores, e.turn - lastTurn);
    lastTurn = e.turn;

    const effect = CW_EVENT_EFFECTS[e.kind] || {};
    const severityMultiplier = e.severity === 1 ? 0.65 : (e.severity === 2 ? 1.0 : 1.65);
    const incubationMultiplier = e.turn < matureAt ? 0.38 : 1.0;

    for (const metric in effect) {
      let delta = effect[metric] * severityMultiplier * incubationMultiplier;
      delta *= delta >= 0 ? paceUp : paceDown;
      const current = scores[metric] || 0;

      // Damage leaves inertia. Apologies can lower heat, but trust and closeness
      // recover primarily through repeated story-supported behavior.
      if (delta > 0 && metric === "trust" && (betrayalScars + boundaryScars) > 0) {
        delta *= Math.max(0.25, 1 - betrayalScars * 0.2 - boundaryScars * 0.16);
      }
      if (delta > 0 && metric === "attachment" && abandonmentScars > 0) {
        delta *= Math.max(0.42, 1 - abandonmentScars * 0.18);
      }
      if (delta > 0 && metric === "openness" && boundaryScars > 0) {
        delta *= Math.max(0.45, 1 - boundaryScars * 0.18);
      }

      // Diminishing returns prevent a handful of repeated tags from maxing a stat.
      if ((delta > 0 && current > 45) || (delta < 0 && current < -45)) delta *= 0.72;
      if ((delta > 0 && current > 75) || (delta < 0 && current < -75)) delta *= 0.58;
      if (delta > 0 && ["attachment", "attraction", "jealousy", "resentment", "fear", "tension"].includes(metric) && current > 75) delta *= 0.58;

      scores[metric] = CW_clampMetric(metric, current + delta);
    }

    if ((e.kind === "betrayal" || e.kind === "infidelity") && e.severity >= 2) betrayalScars += (e.kind === "infidelity" ? 2 : 1);
    if (e.kind === "abandonment" && e.severity >= 2) abandonmentScars++;
    if (["boundary_violated", "coercive_pressure"].includes(e.kind) && e.severity >= 2) boundaryScars++;
    if (e.kind === "trust_repair" && e.severity >= 2) betrayalScars = Math.max(0, betrayalScars - 1);
    if (e.kind === "boundary_repair" && e.severity >= 2) boundaryScars = Math.max(0, boundaryScars - 1);
    if (e.kind === "abandonment_repair" && e.severity >= 2) abandonmentScars = Math.max(0, abandonmentScars - 1);
  }

  CW_applyPassiveDecay(scores, turn - lastTurn);
  const memories = events.slice(-cfg.maxRecentMemories);
  const fromNpc = state.crossedWires.npcs[CW_key(resolvedFrom)];
  const toNpc = resolvedTo === "YOU" ? null : state.crossedWires.npcs[CW_key(resolvedTo)];
  const appearanceWeight = ((fromNpc && fromNpc.mentions) || 1) + ((toNpc && toNpc.mentions) || (resolvedTo === "YOU" ? 2 : 1));
  const familiarity = Math.min(100, events.length * 6 + Math.min(25, appearanceWeight * 2) + Math.min(15, Math.max(0, turn - events[0].turn)));
  const flags = CW_relationshipFlags(events);
  flags.betrayalScars = betrayalScars;
  flags.abandonmentScars = abandonmentScars;
  flags.boundaryScars = boundaryScars;

  return {
    from: events[events.length - 1].from,
    to: events[events.length - 1].to,
    scores: scores,
    familiarity: familiarity,
    eventCount: events.length,
    lastChanged: events[events.length - 1].turn,
    memories: memories,
    flags: flags,
    trajectory: CW_trajectory(events),
    unresolved: CW_unresolvedThread(scores, flags, events),
    mature: Number.isFinite(matureAt) && turn >= matureAt,
    matureAt: matureAt
  };
}

function CW_pairKeys() {
  const seen = {};
  const pairs = [];
  for (const e of state.crossedWires.ledger) {
    const key = CW_key(e.from) + "=>" + CW_key(e.to);
    if (!seen[key]) { seen[key] = true; pairs.push({ from: e.from, to: e.to }); }
  }
  return pairs;
}

function CW_intensity(v, signed) {
  if (signed && v <= -65) return "very low";
  if (signed && v <= -35) return "low";
  if (signed && v < 20) return "uncertain";
  if (v >= 75) return "very high";
  if (v >= 50) return "high";
  if (v >= 30) return "moderate";
  if (v >= 15) return "noticeable";
  return "low";
}

function CW_pressureText(s) {
  const p = [];
  if (s.trust >= 35) p.push("trust " + CW_intensity(s.trust, true));
  if (s.trust <= -30) p.push("distrust " + CW_intensity(-s.trust, false));
  if (s.affection >= 35) p.push("affection " + CW_intensity(s.affection, true));
  if (s.affection <= -30) p.push("dislike " + CW_intensity(-s.affection, false));
  if (s.respect >= 35) p.push("respect " + CW_intensity(s.respect, true));
  if (s.respect <= -30) p.push("lost respect " + CW_intensity(-s.respect, false));
  if (s.loyalty >= 35) p.push("loyalty " + CW_intensity(s.loyalty, true));
  if (s.openness >= 35) p.push("openness " + CW_intensity(s.openness, true));
  if (s.openness <= -30) p.push("guardedness high");
  if (s.attachment >= 35) p.push("attachment " + CW_intensity(s.attachment, false));
  if (s.attraction >= 30) p.push("attraction " + CW_intensity(s.attraction, false));
  if (s.jealousy >= 30) p.push("jealousy " + CW_intensity(s.jealousy, false));
  if (s.resentment >= 30) p.push("resentment " + CW_intensity(s.resentment, false));
  if (s.fear >= 30) p.push("fear " + CW_intensity(s.fear, false));
  if (s.tension >= 30) p.push("tension " + CW_intensity(s.tension, false));
  return p.length ? p.slice(0, 7).join(", ") : "mixed/uncertain feelings";
}

function CW_label(s, familiarity, f) {
  if (familiarity < 18) return "new impression";
  if (f.brokenUp && f.married && s.affection >= 35) return "separated with unfinished feelings";
  if (f.brokenUp && f.married) return "separated former spouses";
  if (f.brokenUp && s.affection >= 35) return "unfinished exes";
  if (f.brokenUp && s.resentment >= 45) return "bitter exes";
  if (f.brokenUp) return "former relationship";
  if (f.married && s.resentment >= 45) return "marriage under strain";
  if (f.married) return "established marriage";
  if (f.proposed) return "engaged/seriously committed";
  if (f.committed && s.resentment >= 45) return "committed but strained";
  if (f.committed) return "committed bond";
  if (f.exclusive && s.tension >= 45) return "exclusive but unsettled";
  if (f.exclusive) return "exclusive relationship";
  if (f.defined) return "defined relationship";
  if (f.casualIntimacy && s.attachment >= 40) return "casual bond becoming emotionally complicated";
  if (f.casualIntimacy) return "casual intimate connection";
  if (s.resentment >= 70 && s.trust <= -35) return "deep grudge";
  if (s.attraction >= 60 && s.resentment >= 45) return "volatile chemistry";
  if (s.attraction >= 55 && s.jealousy >= 45) return "jealous attraction";
  if (s.fear >= 60 && s.resentment >= 35) return "fearful hostility";
  if (s.trust >= 60 && s.affection >= 55 && s.loyalty >= 35) return "deep loyal bond";
  if (s.attraction >= 60 && s.affection >= 35 && s.trust >= 15) return "strong romantic pull";
  if (s.respect >= 50 && s.tension >= 45) return "charged rivalry";
  if (s.trust <= -55) return "deep distrust";
  if (s.affection <= -45) return "strong dislike";
  if (s.attachment >= 60 && s.trust <= 5) return "insecure attachment";
  if (s.affection >= 45 && s.attachment >= 35) return "close bond";
  if (s.respect >= 50) return "growing respect";
  if (s.affection >= 40) return "growing fondness";
  if (s.trust >= 40) return "growing trust";
  if (s.tension >= 45) return "unresolved tension";
  return "developing relationship";
}

function CW_mutualPattern(link, reverse) {
  if (!link || !reverse || CW_key(link.to) === "you") return "";
  const a = link.scores, b = reverse.scores;
  const bits = [];
  if (a.attraction >= 35 && b.attraction >= 35) bits.push("mutual attraction");
  else if ((a.attraction >= 45 && b.attraction < 20) || (b.attraction >= 45 && a.attraction < 20)) bits.push("uneven attraction");
  if (a.affection >= 40 && b.affection >= 40) bits.push("mutual fondness");
  if (Math.abs(a.trust - b.trust) >= 38) bits.push("trust is asymmetric");
  if ((a.resentment >= 40) !== (b.resentment >= 40)) bits.push("resentment is one-sided");
  if (a.tension >= 40 && b.tension >= 40) bits.push("shared tension");
  return bits.slice(0, 3).join(", ");
}

function CW_scoreText(s) {
  return "Trust " + s.trust + " | Affection " + s.affection + " | Respect " + s.respect +
    " | Loyalty " + s.loyalty + " | Openness " + s.openness + " | Attachment " + s.attachment +
    " | Attraction " + s.attraction + " | Jealousy " + s.jealousy + " | Resentment " + s.resentment +
    " | Fear " + s.fear + " | Tension " + s.tension;
}

function CW_sceneNameScores() {
  const cfg = CW_config();
  const scores = {};
  if (typeof history === "undefined" || !Array.isArray(history)) return scores;
  const recent = history.slice(-cfg.sceneHistoryActions);
  for (let i = 0; i < recent.length; i++) {
    const h = recent[recent.length - 1 - i];
    const text = h && h.text ? h.text : "";
    const weight = Math.max(1, cfg.sceneHistoryActions - i);
    for (const key in state.crossedWires.npcs) {
      const forms = CW_nameFormsForKey(key);
      if (forms.some(function (name) { return CW_wordPresent(text, name); })) scores[key] = Math.max(scores[key] || 0, weight);
    }
  }
  return scores;
}

function CW_recentSceneNames() {
  return Object.keys(CW_sceneNameScores());
}

function CW_relevantLinks(turn) {
  const cfg = CW_config();
  const sceneScores = CW_sceneNameScores();
  const links = [];
  for (const pair of CW_pairKeys()) {
    // Reject off-screen pairs before reconstructing their scores. This matters
    // in long ensemble adventures with hundreds of historical relationships.
    const fromKey = CW_resolveNpcKey(pair.from) || CW_key(pair.from);
    const toKey = CW_key(pair.to) === "you" ? "you" : (CW_resolveNpcKey(pair.to) || CW_key(pair.to));
    const relevance = Math.max(sceneScores[fromKey] || 0, toKey === "you" ? 0 : (sceneScores[toKey] || 0));
    if (relevance <= 0) continue;

    const link = CW_computeLink(pair.from, pair.to, turn);
    if (!link || !link.mature) continue;
    link.sceneRelevance = relevance;
    links.push(link);
  }
  links.sort(function (a, b) {
    return (b.sceneRelevance - a.sceneRelevance) || (b.lastChanged - a.lastChanged);
  });
  return links.slice(0, cfg.maxContextRelationships);
}

function CW_rand() {
  const t = state.crossedWires.twist;
  let s = Number(t.rngSeed) >>> 0;
  s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
  t.rngSeed = s;
  return s / 4294967296;
}

function CW_twistChance(cfg) {
  const modeBase = { OFF: 0, GROUNDED: 6, DRAMATIC: 10, WILD: 14, UNHINGED: 22 };
  const base = modeBase[cfg.twistMode] || 0;
  if (cfg.twistChancePercent >= 0) return Math.max(0, Math.min(60, cfg.twistChancePercent));
  const p = CW_currentScenarioProfile().primary || "UNIVERSAL";
  const factors = {
    UNIVERSAL: 1.0, ROMANCE: 1.15, SLICE_OF_LIFE: 1.0, FAMILY: 1.0, COMEDY: 0.95,
    WORKPLACE: 0.9, SCHOOL: 0.9, SPORTS: 0.82, SUPERHERO: 0.82, FANTASY: 0.8,
    SCI_FI: 0.78, POLITICAL: 0.78, CRIME: 0.76, HISTORICAL: 0.8, ADVENTURE: 0.74,
    MYSTERY: 0.72, SURVIVAL: 0.68, HORROR: 0.66, MILITARY: 0.68
  };
  const target = factors[p] == null ? 1 : factors[p];
  const blend = cfg.adaptationStrength === "LIGHT" ? 0.35 : (cfg.adaptationStrength === "BALANCED" ? 0.65 : 1);
  const factor = 1 + (target - 1) * blend;
  return Math.max(0, Math.min(60, Math.round(base * factor)));
}

function CW_twistRisk(id) {
  const t = CW_TWISTS.find(function (x) { return x.id === id; });
  return t ? (t.risk || 2) : 2;
}

function CW_twistProfileFactor(t, profile, cfg) {
  const p = profile || CW_currentScenarioProfile();
  const strength = cfg.adaptationStrength || "FULL";
  if (Array.isArray(t.profiles) && t.profiles.length) {
    if (!cfg.enableScenarioTwists) return 0;
    if (t.profiles.includes(p.primary)) return strength === "LIGHT" ? 1.25 : (strength === "BALANCED" ? 1.6 : 2.0);
    if (p.secondary && t.profiles.includes(p.secondary)) return strength === "LIGHT" ? 1.1 : (strength === "BALANCED" ? 1.35 : 1.6);
    return strength === "LIGHT" ? 0.5 : (strength === "BALANCED" ? 0.12 : 0);
  }
  if (t.romantic && !["ROMANCE", "SLICE_OF_LIFE", "COMEDY"].includes(p.primary)) {
    return strength === "FULL" ? 0.55 : 0.8;
  }
  return 1;
}

function CW_twistCandidates(link, cfg, turn, forcedTier) {
  const defaultMax = { OFF: 2, GROUNDED: 2, DRAMATIC: 3, WILD: 4, UNHINGED: 4 }[cfg.twistMode] || 3;
  const requestedRisk = forcedTier === "small" ? 1 : (forcedTier === "medium" ? 2 : (forcedTier === "major" ? 4 : 0));
  const maxRisk = requestedRisk || defaultMax;
  const minRisk = requestedRisk === 4 ? 3 : (requestedRisk || 1);
  const tw = state.crossedWires.twist;
  const profile = CW_currentScenarioProfile();
  const role = CW_getRole(link.from, link.to);

  return CW_TWISTS.filter(function (t) {
    const risk = t.risk || 2;
    if (risk > maxRisk || risk < minRisk) return false;
    if (t.romantic && !cfg.enableRomance) return false;
    if (t.romantic && CW_isFamilyRole(role)) return false;
    if (t.familyOnly && !CW_isFamilyRole(role)) return false;
    if (Array.isArray(t.profiles) && t.profiles.length && CW_twistProfileFactor(t, profile, cfg) <= 0) return false;
    if (t.mature && (!cfg.enableMatureThemes || !CW_pairAdults(link.from, link.to))) return false;
    if (t.mature && ["adult_intimacy_shift", "morning_after", "casual_vs_serious"].includes(t.id) && !cfg.enableAdultIntimacy) return false;
    if (t.infidelity && !cfg.enableInfidelity) return false;
    if (t.breakups && !cfg.enableBreakups) return false;
    if (t.parenthood && !cfg.enableParenthoodThemes) return false;
    if (t.toxic && !cfg.enableToxicDrama) return false;
    if (t.curveball && !cfg.enableCurveballs) return false;
    if (t.requiresIntimacy && !link.flags.adultIntimacy) return false;
    if (t.wildOnly && !["WILD", "UNHINGED"].includes(cfg.twistMode) && !requestedRisk) return false;
    if (turn - (tw.idLastSeed[t.id] || -9999) < cfg.repeatTwistCooldownTurns) return false;

    const s = link.scores;
    if (t.id === "unexpected_confession" && s.affection < 18 && s.attraction < 20 && s.openness < 20) return false;
    if (t.id === "define_the_relationship" && s.affection < 25 && s.attraction < 25 && s.attachment < 25) return false;
    if (t.id === "jealousy_flare" && s.attraction < 25 && s.attachment < 35 && s.jealousy < 20) return false;
    if (t.id === "triangle_pressure" && s.attraction < 30 && s.attachment < 35) return false;
    if (t.id === "future_mismatch" && !link.flags.defined && !link.flags.committed && s.attachment < 35) return false;
    if (t.id === "rivalry_shift" && s.tension < 25 && s.respect < 25) return false;
    if (t.id === "reconciliation_window" && s.resentment < 25 && !link.flags.brokenUp && link.flags.betrayalScars < 1 && link.flags.boundaryScars < 1) return false;
    if (t.id === "breakup_pressure" && !link.flags.committed && !link.flags.married && !link.flags.exclusive && s.attachment < 45) return false;
    if (t.id === "betrayal_opportunity" && s.loyalty > 65 && s.resentment < 20) return false;
    if (t.id === "possessiveness_confronted" && s.jealousy < 35 && s.attachment < 55) return false;
    if (t.id === "living_together_pressure" && !link.flags.movedIn && !link.flags.committed && s.attachment < 50) return false;
    if (t.id === "proposal_pressure" && !link.flags.committed && !link.flags.exclusive && s.attachment < 55) return false;
    if (t.id === "adult_intimacy_shift" && s.attraction < 35 && s.affection < 30) return false;
    if (t.id === "casual_vs_serious" && !link.flags.casualIntimacy) return false;
    if (t.id === "nonmonogamy_talk" && !link.flags.defined && !link.flags.committed && !link.flags.exclusive) return false;
    if (["temptation", "infidelity_suspicion"].includes(t.id) && !link.flags.committed && !link.flags.married && !link.flags.exclusive) return false;
    return true;
  }).map(function (t) {
    let weight = t.weight || 1;
    weight *= CW_twistProfileFactor(t, profile, cfg);
    if (CW_PROFESSIONAL_ROLES.includes(role) && t.romantic && !link.flags.defined && link.scores.attraction < 30) weight *= 0.35;
    if (["romantic", "ex"].includes(role) && t.romantic) weight *= 1.6;
    if (["rival", "enemy"].includes(role) && ["rivalry_shift", "loyalty_test", "public_choice"].includes(t.id)) weight *= 1.5;
    if (cfg.twistMode === "UNHINGED" && t.id === "wild_card") weight = Math.max(weight, 11);
    if (link.trajectory === "volatile" && (t.risk || 2) >= 2) weight += 2;
    if (link.unresolved && ["reconciliation_window", "boundary_talk", "define_the_relationship"].includes(t.id)) weight += 2;
    return Object.assign({}, t, { weight: weight });
  });
}

function CW_weightedPick(items) {
  if (!items.length) return null;
  let total = 0;
  for (const i of items) total += Math.max(1, i.weight || 1);
  let roll = CW_rand() * total;
  for (const i of items) {
    roll -= Math.max(1, i.weight || 1);
    if (roll <= 0) return i;
  }
  return items[items.length - 1];
}

function CW_pairKey(from, to) {
  const a = CW_key(from), b = CW_key(to);
  return a < b ? a + "<->" + b : b + "<->" + a;
}

function CW_chooseTwistLink(turn, cfg, forced) {
  const tw = state.crossedWires.twist;
  let links = CW_relevantLinks(turn);
  if (!links.length) {
    links = CW_pairKeys().map(function (p) { return CW_computeLink(p.from, p.to, turn); })
      .filter(function (l) { return l && l.mature; })
      .sort(function (a, b) { return b.lastChanged - a.lastChanged; });
  }
  if (!links.length) return null;
  if (!forced) {
    links = links.filter(function (l) {
      return turn - (tw.pairLastSeed[CW_pairKey(l.from, l.to)] || -9999) >= cfg.pairTwistCooldownTurns;
    });
  }
  if (!links.length) return null;
  const recent = links.slice(0, Math.min(6, links.length));
  const weighted = [];
  for (const link of recent) {
    let weight = 2 + (link.sceneRelevance || 0);
    if (link.trajectory === "volatile") weight += 2;
    if (link.unresolved) weight += 1;
    for (let i = 0; i < weight; i++) weighted.push(link);
  }
  return weighted[Math.floor(CW_rand() * weighted.length)] || recent[0];
}

function CW_recentDramaFactor(turn) {
  const recent = state.crossedWires.ledger.filter(function (e) { return e.turn >= turn - 3; });
  if (!recent.length) return 1.05;
  const major = recent.some(function (e) { return e.severity >= 3 && CW_eventValence(e) <= -8; });
  if (major) return 0.45;
  const meaningful = recent.some(function (e) { return e.severity >= 2; });
  return meaningful ? 0.78 : 1.0;
}

function CW_maybeArmTwist(turn) {
  const cfg = CW_config();
  const tw = state.crossedWires.twist;
  if (tw.pending) return tw.pending;
  const forced = !!state.crossedWires.forceTwist;
  const forcedTier = String(state.crossedWires.forceTwistTier || "").toLowerCase();
  if (cfg.twistMode === "OFF" && !forced) return null;
  if (turn < cfg.twistMinTurn && !forced) return null;
  if (tw.lastRollTurn === turn) return null;
  tw.lastRollTurn = turn;

  const lastHistory = tw.history.length ? tw.history[tw.history.length - 1] : null;
  const seedCooldown = lastHistory && lastHistory.used ? cfg.twistCooldownTurns : Math.max(2, Math.floor(cfg.twistCooldownTurns / 2));
  if (!forced && turn - (tw.lastSeedTurn || -9999) < seedCooldown) return null;

  const adjustedChance = CW_twistChance(cfg) * CW_recentDramaFactor(turn);
  if (!forced && CW_rand() * 100 >= adjustedChance) return null;

  const link = CW_chooseTwistLink(turn, cfg, forced);
  if (!link) return null;
  const candidates = CW_twistCandidates(link, cfg, turn, forcedTier);
  const idea = CW_weightedPick(candidates);
  if (!idea) return null;

  const pairKey = CW_pairKey(link.from, link.to);
  tw.pending = {
    token: "T" + turn + "_" + Math.floor(CW_rand() * 1000000),
    id: idea.id,
    text: idea.text,
    risk: idea.risk || 2,
    from: link.from,
    to: link.to,
    pairKey: pairKey,
    profile: CW_currentScenarioProfile().primary || "UNIVERSAL",
    armedAt: turn,
    forced: forced
  };
  tw.lastSeedTurn = turn;
  tw.pairLastSeed[pairKey] = turn;
  tw.idLastSeed[idea.id] = turn;
  if (forced) {
    state.crossedWires.forceTwist = false;
    state.crossedWires.forceTwistTier = "";
  }
  return tw.pending;
}

function CW_twistPrompt(turn) {
  const p = CW_maybeArmTwist(turn);
  if (!p) return "";
  return [
    "OPTIONAL SCENARIO-AWARE RELATIONSHIP PRESSURE [" + (p.profile || "UNIVERSAL") + "] (risk " + p.risk + ") for " + p.from + " ↔ " + p.to + ": " + p.text,
    "Treat this as pressure, not predetermined canon. Use it only if continuity and the current scene support it. Never force the player character's feelings/actions/consent. If used in visible prose, append [[CW_TWIST|" + p.token + "|USED]] at the end; otherwise omit the tag."
  ].join("\n");
}

function CW_clipText(value, max) {
  const source = String(value || "").replace(/\s+/g, " ").trim();
  const limit = Math.max(40, Number(max) || 200);
  if (source.length <= limit) return source;
  let cut = source.slice(0, limit - 1);
  const boundary = cut.lastIndexOf(" ");
  if (boundary >= Math.floor(limit * 0.6)) cut = cut.slice(0, boundary);
  return cut.replace(/[\s,;:–—-]+$/g, "") + "…";
}

function CW_anchorMemories(link, maxCount) {
  const max = Math.max(0, Math.min(3, Number(maxCount) || 0));
  if (!max || !link) return [];
  const events = CW_eventsForPair(link.from, link.to, CW_turn());
  const newestTurn = link.memories && link.memories.length ? link.memories[link.memories.length - 1].turn : -1;
  const significantKinds = [
    "confession", "relationship_defined", "exclusivity", "commitment", "proposal", "marriage",
    "rescue", "sacrifice", "betrayal", "infidelity", "breakup", "abandonment",
    "boundary_violated", "reconciliation", "parenthood_news",
    "trust_repair", "boundary_repair", "abandonment_repair"
  ];
  const candidates = events.filter(function (e) {
    return e && e.turn !== newestTurn && (e.severity >= 3 || significantKinds.includes(e.kind));
  });
  const chosen = [];
  let pos = null, neg = null;
  for (let i = candidates.length - 1; i >= 0; i--) {
    const e = candidates[i];
    const v = CW_eventValence(e);
    if (!pos && v >= 4) pos = e;
    if (!neg && v <= -4) neg = e;
    if (pos && neg) break;
  }
  if (neg) chosen.push(neg);
  if (pos && (!neg || pos.turn !== neg.turn || pos.kind !== neg.kind)) chosen.push(pos);
  for (let i = candidates.length - 1; i >= 0 && chosen.length < max; i--) {
    const e = candidates[i];
    if (!chosen.includes(e)) chosen.push(e);
  }
  return chosen.slice(0, max).sort(function (a, b) { return a.turn - b.turn; });
}

function CW_anchorText(link, cfg) {
  const anchors = CW_anchorMemories(link, cfg.memoryAnchors);
  if (!anchors.length) return "";
  const bits = anchors.map(function (e) {
    return CW_clipText(e.note || e.kind.replace(/_/g, " "), 90);
  }).filter(Boolean);
  return bits.length ? bits.join(" / ") : "";
}

function CW_relationshipContextLine(link, turn) {
  const cfg = CW_config();
  const last = link.memories.length ? link.memories[link.memories.length - 1] : null;
  const role = CW_getRole(link.from, link.to);
  let line = "- " + link.from + " → " + link.to + (role !== "unknown" ? " [" + CW_roleDisplay(role) + "]" : "") + ": " + CW_label(link.scores, link.familiarity, link.flags) +
    "; " + CW_pressureText(link.scores) + "; trajectory " + link.trajectory + ".";
  if (link.flags.betrayalScars || link.flags.abandonmentScars || link.flags.boundaryScars) line += " Durable relationship damage remains and requires earned repair.";
  if (link.unresolved) line += " Unresolved: " + link.unresolved + ".";
  const anchor = CW_anchorText(link, cfg);
  if (anchor) line += " Turning point: " + anchor + ".";
  if (last && last.note) line += " Recent: " + CW_clipText(last.note, 105) + ".";
  if (CW_key(link.to) !== "you") {
    const reverse = CW_computeLink(link.to, link.from, turn);
    const mutual = CW_mutualPattern(link, reverse);
    if (mutual) line += " Pair pattern: " + mutual + ".";
  }
  return CW_clipText(line, 470);
}

function CW_allowedEventCodes(cfg, profile) {
  const scenarioPreferred = CW_profileEventCodes(profile);
  return Object.keys(CW_EVENT_EFFECTS).filter(function (kind) {
    if (!cfg.enableRomance && CW_ROMANCE_EVENTS.includes(kind)) return false;
    if (!cfg.enableMatureThemes && CW_MATURE_EVENTS.includes(kind)) return false;
    if (!cfg.enableAdultIntimacy && ["adult_intimacy", "casual_intimacy"].includes(kind)) return false;
    if (!cfg.enableInfidelity && kind === "infidelity") return false;
    if (!cfg.enableBreakups && kind === "breakup") return false;
    if (!cfg.enableParenthoodThemes && kind === "parenthood_news") return false;
    if (!cfg.enableToxicDrama && CW_TOXIC_EVENTS.includes(kind)) return false;
    if (cfg.adaptationStrength !== "LIGHT" && CW_SCENARIO_EVENT_CODES.includes(kind) && !scenarioPreferred.includes(kind) && !(CW_PROFILE_EVENT_CODES.UNIVERSAL || []).includes(kind)) return false;
    return true;
  });
}

function CW_coreEventCodes(cfg, profile) {
  const allowed = CW_allowedEventCodes(cfg, profile);
  const preferred = [
    "warmth", "support", "empathy", "honesty", "vulnerability", "admiration", "protection",
    "flirtation", "confession", "relationship_defined", "commitment", "kept_promise", "rescue",
    "forgiveness", "trust_repair", "boundary_repair", "abandonment_repair",
    "insult", "deception", "broken_promise", "betrayal", "conflict", "rivalry", "jealousy_episode",
    "rejection", "breakup", "abandonment", "boundary_violated", "manipulation",
    "adult_intimacy", "infidelity", "parenthood_news"
  ];
  const out = preferred.filter(function (kind) { return allowed.includes(kind); });
  for (const kind of CW_profileEventCodes(profile)) if (allowed.includes(kind) && !out.includes(kind)) out.push(kind);
  return out;
}

function CW_sensitivityInstruction(cfg) {
  if (cfg.eventSensitivity === "CONSERVATIVE") {
    return "Evidence sensitivity is CONSERVATIVE: usually emit 0–2 event tags. Ignore routine politeness, generic banter and tiny mood shifts unless they clearly change the bond.";
  }
  if (cfg.eventSensitivity === "EXPRESSIVE") {
    return "Evidence sensitivity is EXPRESSIVE: subtle but genuine relationship beats may be tagged, but never tag filler, repeated information or feelings unsupported by visible action/dialogue.";
  }
  return "Evidence sensitivity is BALANCED: tag clear new relationship-relevant changes, usually 0–3 events; ordinary conversation still needs no event.";
}

function CW_contextBlock(turn, hardBudget, baseContext) {
  const cfg = CW_config();
  if (!cfg.enabled) return "";
  const budget = Number.isFinite(Number(hardBudget)) ? Math.max(0, Math.min(cfg.contextBudgetChars, Math.floor(Number(hardBudget)))) : cfg.contextBudgetChars;
  const profile = CW_detectScenarioProfile(baseContext, cfg);
  const links = CW_relevantLinks(turn);
  const twist = CW_twistPrompt(turn);
  const eventCodes = CW_allowedEventCodes(cfg, profile).join(", ");
  const damageTerms = ["betrayal", "abandonment"];
  if (cfg.enableInfidelity) damageTerms.push("infidelity");
  if (cfg.enableBreakups) damageTerms.push("breakups");
  if (cfg.enableToxicDrama) damageTerms.push("violated boundaries");

  const core = [
    "[CROSSED WIRES v6 PRIVATE — never reveal this block, scores, tags, seeds or mechanics]",
    "Relationships persist. Preserve asymmetric/mixed feelings, commitments, scars and unresolved issues. Never write the protagonist's thoughts, feelings, dialogue, consent, promises or decisions. Track NPC→YOU" + (cfg.enableNpcNpc ? " and NPC→NPC" : " only") + ".",
    cfg.npcInitiative ? "Established NPCs may initiate natural relationship follow-ups when appropriate. Let calm scenes breathe; do not force drama, repeat the same issue or instantly repair major damage." : "Preserve relationship continuity without adding extra NPC social initiative. Let calm scenes breathe; do not force drama or instant repair.",
    CW_profileDirective(profile, cfg)
  ];
  core.push("Adaptive profile: " + profile.primary + (profile.secondary ? " + " + profile.secondary : "") + ". The profile shapes social pressure only; never import setting elements, lore or genre tropes that the scenario has not established.");
  if (cfg.enableMatureThemes) {
    core.push("Adult-only themes require all participants to be established adults. Respect consent/boundaries; intimacy stays non-explicit/fade-to-black and emphasizes relationship consequences.");
  }

  let relationshipLines = [];
  if (links.length) relationshipLines = ["Active relationship state:"].concat(links.map(function (l) { return CW_relationshipContextLine(l, turn); }));
  else relationshipLines = ["No established scene-relevant bond yet; observe recurring named NPCs before assigning strong dynamics."];

  const twistLines = twist ? [twist] : [];

  const protocol = [
    "TAGS: append only at the END of visible prose; they are stripped before the player sees them.",
    "NPC [[CW_PERSON|Name|adult/minor/unknown]]: named NPCs only. Use adult only when 18+ is established.",
    cfg.roleAwareness ? "ROLE [[CW_ROLE|FROM|TO|ROLE]] only when the relationship role is explicit or strongly established. ROLE=" + CW_ROLE_CODES.join(",") + ". Family roles must never be romanticized." : "",
    "EVENT [[CW_EVT|FROM|TO|TYPE|SEVERITY|brief factual memory]]. FROM = NPC whose bond changes, not necessarily the actor; TO = person they react toward; FROM is never YOU. Example: YOU betray Mara → Mara|YOU|betrayal. Severity 1 small, 2 meaningful, 3 major/lasting.",
    CW_sensitivityInstruction(cfg),
    cfg.enableRomance ? "Romance codes such as flirtation, date_or_courtship, confession, relationship_defined, exclusivity, commitment, proposal and marriage require explicitly romantic relationship evidence. Do not use them for mission commitment, testimony, ordinary secrets, teamwork or duty." : "",
    "TYPE=" + eventCodes.replace(/, /g, ","),
    "Max " + cfg.maxEventsPerTurn + " events. New story-supported evidence only: no routine talk, recalled old incidents, repeated updates or unsupported private feelings. Memory note: factual, <=150 chars, no | or ].",
    "trust_repair/boundary_repair/abandonment_repair require demonstrated rebuilding, not one apology or instant forgiveness.",
    "New NPCs remain provisional for " + cfg.observationTurns + " turns AND " + cfg.observationAppearances + " appearances; record early evidence conservatively.",
    "[/CROSSED WIRES]"
  ];

  if (budget < 2400) {
    if (budget < 320) return "";
    if (budget < 900) {
      const closing = "\n[/CROSSED WIRES]";
      const microBody = [
        "[CROSSED WIRES v6 PRIVATE] Profile " + profile.primary + (profile.secondary ? "+" + profile.secondary : "") + ". Preserve active NPC relationship continuity, mixed feelings, agency and consequences. Never decide the protagonist's thoughts/feelings/actions/consent; do not force drama.",
        relationshipLines.length > 1 ? relationshipLines[1] : relationshipLines[0]
      ].filter(Boolean).join("\n");
      const available = Math.max(0, budget - closing.length - 2);
      const clipped = microBody.length > available ? microBody.slice(0, available).replace(/\s+$/g, "") : microBody;
      return "\n\n" + clipped + closing;
    }

    const lowCodes = CW_coreEventCodes(cfg, profile).join(",");
    const lowProtocol = [
      "[CROSSED WIRES v6 PRIVATE] Profile " + profile.primary + (profile.secondary ? "+" + profile.secondary : "") + ". Preserve NPC relationship continuity/mixed feelings; never decide protagonist thoughts, feelings, actions or consent; do not force drama or instant repair.",
      relationshipLines.length > 1 ? relationshipLines[1] : relationshipLines[0],
      twistLines.length ? CW_clipText(twistLines[0], 220) : "",
      "Hidden tags at END only. NPC [[CW_PERSON|Name|adult/minor/unknown]]. " + (cfg.roleAwareness ? "ROLE [[CW_ROLE|FROM|TO|ROLE]]. " : "") + "EVENT [[CW_EVT|FROM|TO|TYPE|1/2/3|brief memory]]. FROM is the NPC whose bond changes; TO is who they react toward; never FROM=YOU.",
      (cfg.enableRomance ? "Romance codes require explicitly romantic evidence; mission/team/family commitment is not romantic commitment. " : "") + "TYPE=" + lowCodes + ". New evidence only; ordinary talk/recalled events need no tag. Repair tags require demonstrated rebuilding.",
      "[/CROSSED WIRES]"
    ].filter(Boolean).join("\n");
    if (lowProtocol.length > budget) {
      const closing = "\n[/CROSSED WIRES]";
      return "\n\n" + lowProtocol.slice(0, Math.max(0, budget - closing.length - 2)).replace(/\s+$/g, "") + closing;
    }
    return "\n\n" + lowProtocol;
  }

  let sections = core.concat(relationshipLines, twistLines, protocol);
  let result = "\n\n" + sections.join("\n");

  if (result.length > budget) {
    while (relationshipLines.length > 2 && result.length > budget) {
      relationshipLines.splice(relationshipLines.length - 1, 1);
      sections = core.concat(relationshipLines, twistLines, protocol);
      result = "\n\n" + sections.join("\n");
    }
  }
  if (result.length > budget && twistLines.length) {
    twistLines[0] = CW_clipText(twistLines[0], 380);
    sections = core.concat(relationshipLines, twistLines, protocol);
    result = "\n\n" + sections.join("\n");
  }
  if (result.length > budget) {
    const compactCore = [
      "[CROSSED WIRES v6 — PRIVATE]",
      "Profile " + profile.primary + (profile.secondary ? "+" + profile.secondary : "") + ". Preserve directional NPC relationship continuity, mixed feelings, agency, consent and consequences. Never decide the protagonist's feelings/actions. Do not force drama or instant repair.",
      CW_clipText(CW_profileDirective(profile, cfg), 260)
    ];
    const compactProtocol = [
      "TAGS only at END. NPC [[CW_PERSON|Name|adult/minor/unknown]]; adult requires established 18+.",
      "EVENT [[CW_EVT|FROM|TO|TYPE|1/2/3|brief factual memory]]. FROM is the NPC whose bond changes (never YOU); TO is who they react toward.",
      "TYPE=" + eventCodes.replace(/, /g, ","),
      "Max " + cfg.maxEventsPerTurn + ". New story-supported evidence only; no repeated old events, invented updates or unsupported inner feelings. No | or ] in memory.",
      "[/CROSSED WIRES]"
    ];
    sections = compactCore.concat(relationshipLines.slice(0, 2), twistLines, compactProtocol);
    result = "\n\n" + sections.join("\n");

    if (result.length > budget && twistLines.length) {
      twistLines[0] = CW_clipText(twistLines[0], 260);
      sections = compactCore.concat(relationshipLines.slice(0, 2), twistLines, compactProtocol);
      result = "\n\n" + sections.join("\n");
    }
    if (result.length > budget && relationshipLines.length > 1) {
      sections = compactCore.concat([relationshipLines[1]], twistLines, compactProtocol);
      result = "\n\n" + sections.join("\n");
    }
    if (result.length > budget) {
      sections = compactCore.concat(twistLines, compactProtocol);
      result = "\n\n" + sections.join("\n");
    }
  }
  // Budgets at or above 2400 should normally fit the compact protocol intact.
  // If an unusually large enabled event set still exceeds it, preserve the end
  // marker rather than returning a half-open private block.
  if (result.length > budget) {
    const closing = "\n[/CROSSED WIRES]";
    result = result.slice(0, Math.max(0, budget - closing.length)).replace(/\s+$/g, "") + closing;
  }
  return result;
}

function CW_stripTags(text) {
  let out = String(text || "");
  out = out.replace(/\[\[CW_PERSON\|[^\]]*\]\]/gi, "");
  out = out.replace(/\[\[CW_EVT\|[^\]]*\]\]/gi, "");
  out = out.replace(/\[\[CW_ROLE\|[^\]]*\]\]/gi, "");
  out = out.replace(/\[\[CW_TWIST\|[^\]]*\]\]/gi, "");
  out = out.split("\n").filter(function (line) { return !/\[\[CW_(?:PERSON|EVT|ROLE|TWIST)\|/i.test(line); }).join("\n");
  out = out.replace(/\n{3,}/g, "\n\n").trim();
  return out || "\u200B";
}

function CW_eventEvidenceSupported(raw, from, to) {
  const prose = CW_stripTags(raw);
  const evidence = prose + "\n" + CW_recentHistoryText(CW_config().sceneHistoryActions);
  const fromKey = CW_resolveNpcKey(from);
  const fromForms = CW_nameFormsForKey(fromKey);
  if (!fromForms.length) fromForms.push(CW_resolveNpcName(from) || from);
  if (!fromForms.some(function (name) { return CW_wordPresent(evidence, name); })) return false;

  if (CW_key(to) !== "you") {
    const toKey = CW_resolveNpcKey(to);
    const toForms = CW_nameFormsForKey(toKey);
    if (!toForms.length) toForms.push(CW_resolveNpcName(to) || to);
    if (!toForms.some(function (name) { return CW_wordPresent(evidence, name); })) return false;
  }
  return true;
}

function CW_prepareOutputTurn(turn) {
  // Retry/regenerate can produce a different answer at the same actionCount.
  // Replace that turn's machine-derived relationship events instead of stacking
  // mutually incompatible versions of the same story beat.
  state.crossedWires.ledger = state.crossedWires.ledger.filter(function (e) { return e.turn !== turn; });
  CW_invalidateEventIndex();
}

function CW_parseModelOutput(text, turn) {
  const raw = String(text || "");
  let m;

  const personRegex = /\[\[CW_PERSON\|([^|\]]{1,42})\|(adult|minor|unknown)\]\]/gi;
  while ((m = personRegex.exec(raw)) !== null) CW_registerNpc(m[1], turn, m[2]);

  const roleRegex = /\[\[CW_ROLE\|([^|\]]{1,42})\|([^|\]]{1,42})\|([a-z_]+)\]\]/gi;
  while ((m = roleRegex.exec(raw)) !== null) {
    if (CW_eventEvidenceSupported(raw, m[1], m[2])) CW_setRole(m[1], m[2], m[3], turn);
  }

  let accepted = 0;
  const evtRegex = /\[\[CW_EVT\|([^|\]]{1,42})\|([^|\]]{1,42})\|([a-z_]+)\|([123])\|([^\]]{0,150})\]\]/gi;
  while ((m = evtRegex.exec(raw)) !== null && accepted < CW_config().maxEventsPerTurn) {
    if (!CW_eventEvidenceSupported(raw, m[1], m[2])) continue;
    if (CW_addEvent(m[1], m[2], m[3], m[4], m[5], turn)) accepted++;
  }

  const tw = state.crossedWires.twist;
  let used = false;
  if (tw.pending) {
    const tokenEscaped = tw.pending.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const twistRegex = new RegExp("\\[\\[CW_TWIST\\|" + tokenEscaped + "\\|USED\\]\\]", "i");
    used = twistRegex.test(raw);
    tw.history.push({
      turn: turn, id: tw.pending.id, risk: tw.pending.risk || 2,
      from: tw.pending.from, to: tw.pending.to, pairKey: tw.pending.pairKey, profile: tw.pending.profile || "UNIVERSAL",
      used: used, forced: !!tw.pending.forced
    });
    if (tw.history.length > 80) tw.history.splice(0, tw.history.length - 80);
    if (used) tw.lastTwistTurn = turn;
    tw.pending = null;
  }

  return CW_stripTags(raw);
}

function CW_incubationLine(npc, turn) {
  const cfg = CW_config();
  const elapsed = Math.max(0, turn - (npc.introducedAt || 0));
  const turnsRemain = Math.max(0, cfg.observationTurns - elapsed);
  const appearancesRemain = Math.max(0, cfg.observationAppearances - (npc.mentions || 1));
  if (turnsRemain <= 0 && appearancesRemain <= 0) return "";
  return npc.name + " — observation: " + Math.min(elapsed, cfg.observationTurns) + "/" + cfg.observationTurns +
    " turns, " + Math.min(npc.mentions || 1, cfg.observationAppearances) + "/" + cfg.observationAppearances + " appearances";
}

function CW_forgetNpc(name) {
  const cw = state.crossedWires;
  const key = CW_resolveNpcKey(name);
  const npc = key ? cw.npcs[key] : null;
  if (!npc) return "";
  const display = npc.name || name;

  cw.ledger = cw.ledger.filter(function (e) {
    return CW_resolveNpcKey(e.from) !== key && (CW_key(e.to) === "you" || CW_resolveNpcKey(e.to) !== key);
  });
  cw.sightings = cw.sightings.filter(function (x) { return x && x.key !== key; });
  delete cw.npcs[key];
  for (const rk in cw.roles) {
    if (rk.startsWith(key + "->") || rk.endsWith("->" + key)) delete cw.roles[rk];
  }
  for (const alias in cw.aliases) {
    if (alias === key || CW_resolveNpcKey(alias) === key) delete cw.aliases[alias];
  }

  const tw = cw.twist;
  tw.history = (tw.history || []).filter(function (t) {
    return CW_key(t.from) !== key && CW_key(t.to) !== key;
  });
  if (tw.pending && (CW_key(tw.pending.from) === key || CW_key(tw.pending.to) === key)) tw.pending = null;
  tw.pairLastSeed = {};
  tw.idLastSeed = {};
  tw.lastSeedTurn = -9999;
  tw.lastTwistTurn = -9999;
  for (const t of tw.history) {
    const tt = Number(t.turn) || 0;
    tw.lastSeedTurn = Math.max(tw.lastSeedTurn, tt);
    if (t.used) tw.lastTwistTurn = Math.max(tw.lastTwistTurn, tt);
    if (t.pairKey) tw.pairLastSeed[t.pairKey] = Math.max(tw.pairLastSeed[t.pairKey] || -9999, tt);
    if (t.id) tw.idLastSeed[t.id] = Math.max(tw.idLastSeed[t.id] || -9999, tt);
  }
  CW_invalidateEventIndex();
  return display;
}

function CW_dashboard(filterName) {
  const cfg = CW_config();
  const turn = CW_turn();
  const filterKey = filterName ? CW_key(CW_resolveNpcName(filterName) || filterName) : "";
  const lines = ["CROSSED WIRES v6 — RELATIONSHIPS"];
  const links = [];

  for (const pair of CW_pairKeys()) {
    const link = CW_computeLink(pair.from, pair.to, turn);
    if (!link) continue;
    if (filterKey && CW_key(link.from) !== filterKey && CW_key(link.to) !== filterKey) continue;
    links.push(link);
  }
  links.sort(function (a, b) { return b.lastChanged - a.lastChanged; });

  let shown = 0;
  for (const link of links) {
    if (shown >= cfg.maxDashboardLinks) break;
    shown++;
    const status = link.mature ? CW_label(link.scores, link.familiarity, link.flags) : "still forming";
    lines.push("");
    const role = CW_getRole(link.from, link.to);
    lines.push(link.from + " → " + link.to + (role !== "unknown" ? " [" + CW_roleDisplay(role) + "]" : "") + " — " + status);
    lines.push("Read: " + CW_pressureText(link.scores));
    lines.push("Trajectory: " + link.trajectory + (link.unresolved ? " | Unresolved: " + link.unresolved : ""));
    if (cfg.showExactNumbersInDashboard) lines.push(CW_scoreText(link.scores));
    if (link.flags.betrayalScars || link.flags.abandonmentScars || link.flags.boundaryScars) {
      lines.push("Scars: betrayal " + link.flags.betrayalScars + " | abandonment " + link.flags.abandonmentScars + " | boundaries " + link.flags.boundaryScars);
    }
    const anchors = CW_anchorMemories(link, Math.min(2, cfg.memoryAnchors));
    if (anchors.length) {
      const turning = anchors.map(function (e) { return e.note || e.kind.replace(/_/g, " "); }).filter(Boolean);
      if (turning.length) lines.push("Turning points: " + turning.join(" / "));
    }
    if (link.memories.length) {
      const recent = link.memories.slice(-3).map(function (e) { return e.note || e.kind; }).filter(Boolean);
      if (recent.length) lines.push("Recent: " + recent.join(" / "));
    }
    if (!link.mature) lines.push("Still observing this bond before strong guidance is injected.");
  }

  for (const key in state.crossedWires.npcs) {
    if (filterKey && key !== filterKey) continue;
    const inc = CW_incubationLine(state.crossedWires.npcs[key], turn);
    if (inc) lines.push("\n" + inc);
  }

  if (lines.length === 1) lines.push("\nNo relationship history yet. Recurring named NPCs will be picked up as the story develops.");
  return lines.join("\n");
}

function CW_twistHistory() {
  const h = state.crossedWires.twist.history || [];
  const lines = ["CROSSED WIRES v6 — RECENT TWISTS"];
  if (!h.length) return lines.concat(["No twist seeds have fired yet."]).join("\n");
  for (const t of h.slice(-15).reverse()) {
    lines.push("Turn " + t.turn + ": " + t.id.replace(/_/g, " ") + " [risk " + (t.risk || 2) + "]" + (t.profile ? " [" + t.profile + "]" : "") + " — " + t.from + " ↔ " + t.to + (t.used ? " [used]" : " [skipped]") + (t.forced ? " [forced]" : ""));
  }
  return lines.join("\n");
}

function CW_configIssues() {
  const card = CW_configCard();
  if (!card || !card.entry) return ["Config card is missing; defaults are being used."];
  const map = CW_configMap(card.entry);
  const issues = [];
  const boolKeys = ["ENABLED", "NPC INITIATIVE", "ROLE AWARENESS", "SCENARIO TWISTS", "CURVEBALLS", "NPC TO NPC", "ROMANCE", "MATURE THEMES", "PLAYER IS ADULT", "ADULT INTIMACY", "INFIDELITY", "BREAKUPS", "PARENTHOOD", "TOXIC DRAMA", "DASHBOARD NUMBERS"];
  const boolValues = ["on", "yes", "true", "1", "enabled", "enable", "off", "no", "false", "0", "disabled", "disable"];
  for (const key of boolKeys) {
    if (map[key] == null) issues.push("Missing " + key.toLowerCase() + " (default used)");
    else if (!boolValues.includes(String(map[key]).trim().toLowerCase())) issues.push("Invalid " + key.toLowerCase() + ": " + map[key]);
  }
  const enums = {
    "RELATIONSHIP PACE": ["SLOW", "BALANCED", "FAST"],
    "EVENT SENSITIVITY": ["CONSERVATIVE", "BALANCED", "EXPRESSIVE"],
    "SCENARIO MODE": CW_SCENARIO_MODES,
    "ADAPTATION STRENGTH": ["LIGHT", "BALANCED", "FULL"],
    "TWIST MODE": ["OFF", "GROUNDED", "DRAMATIC", "WILD", "UNHINGED"]
  };
  for (const key in enums) {
    if (map[key] == null) {
      issues.push("Missing " + key.toLowerCase() + " (default used)");
      continue;
    }
    let value = String(map[key]).trim().toUpperCase();
    if (key === "SCENARIO MODE") value = value.replace(/[ -]+/g, "_");
    if (!enums[key].includes(value)) issues.push("Invalid " + key.toLowerCase() + ": " + map[key]);
  }
  const nums = {
    "OBSERVATION TURNS": [0, 12], "OBSERVATION APPEARANCES": [1, 8],
    "ACTIVE BONDS": [1, 12], "MEMORY ANCHORS": [0, 3], "SCENE HISTORY": [2, 10],
    "CONTEXT BUDGET": [2400, 8000], "TWISTS START AFTER": [0, 100],
    "TWIST COOLDOWN": [2, 30], "PAIR TWIST COOLDOWN": [2, 40], "REPEAT TWIST COOLDOWN": [4, 100]
  };
  for (const key in nums) {
    if (map[key] == null) { issues.push("Missing " + key.toLowerCase() + " (default used)"); continue; }
    const n = parseInt(String(map[key]).trim(), 10);
    if (!Number.isFinite(n) || n < nums[key][0] || n > nums[key][1]) issues.push("Out-of-range " + key.toLowerCase() + ": " + map[key]);
  }
  if (map["TWIST CHANCE"] == null) issues.push("Missing twist chance (default AUTO used)");
  else if (String(map["TWIST CHANCE"]).trim().toUpperCase() !== "AUTO") {
    const n = parseInt(String(map["TWIST CHANCE"]).trim(), 10);
    if (!Number.isFinite(n) || n < 0 || n > 60) issues.push("Invalid twist chance: " + map["TWIST CHANCE"]);
  }
  return issues;
}

function CW_status() {
  const cfg = CW_config();
  const cw = state.crossedWires;
  return [
    "CROSSED WIRES v" + CW_ENGINE_VERSION + " — ENGINE STATUS",
    "Engine: " + (cfg.enabled ? "ON" : "OFF") + " | NPC initiative: " + (cfg.npcInitiative ? "ON" : "OFF"),
    "NPCs: " + Object.keys(cw.npcs).length + " | relationship events: " + cw.ledger.length + "/" + cfg.maxLedgerEvents,
    "Twist mode: " + cfg.twistMode + " | chance: " + (cfg.twistChancePercent < 0 ? "AUTO (" + CW_twistChance(cfg) + "%)" : cfg.twistChancePercent + "%") + " | starts after turn " + cfg.twistMinTurn,
    "Relationship pace: " + cfg.relationshipPace + " | event sensitivity: " + cfg.eventSensitivity,
    "Scenario mode: " + cfg.scenarioMode + " | detected: " + (CW_currentScenarioProfile().primary || "UNIVERSAL") + (CW_currentScenarioProfile().secondary ? " + " + CW_currentScenarioProfile().secondary : "") + " | adaptation: " + cfg.adaptationStrength,
    "Role awareness: " + (cfg.roleAwareness ? "ON" : "OFF") + " | scenario twists: " + (cfg.enableScenarioTwists ? "ON" : "OFF"),
    "Observation: " + cfg.observationTurns + " turns + " + cfg.observationAppearances + " appearances | active bonds: " + cfg.maxContextRelationships + " | memory anchors: " + cfg.memoryAnchors,
    "Context budget: " + cfg.contextBudgetChars + " chars | scene window: " + cfg.sceneHistoryActions + " actions",
    "Mature themes: " + (cfg.enableMatureThemes ? "ON" : "OFF") + " | adult intimacy: " + (cfg.enableAdultIntimacy ? "ON" : "OFF") + " | infidelity: " + (cfg.enableInfidelity ? "ON" : "OFF"),
    "Config card: " + (CW_configCard() ? "found" : "not visible yet — it should be created automatically"),
    (function () {
      const issues = CW_configIssues();
      return issues.length ? "Config check: " + issues.length + " issue(s) — " + issues.slice(0, 3).join("; ") + (issues.length > 3 ? "; …" : "") : "Config check: OK";
    })()
  ].join("\n");
}

function CW_profileStatus() {
  const cfg = CW_config();
  const p = CW_currentScenarioProfile();
  const lines = [
    "CROSSED WIRES v" + CW_ENGINE_VERSION + " — ADAPTATION PROFILE",
    "Configured mode: " + cfg.scenarioMode + " | strength: " + cfg.adaptationStrength,
    "Active profile: " + (p.primary || "UNIVERSAL") + (p.secondary ? " + " + p.secondary : "") + " | confidence: " + Math.round(Number(p.confidence) || 0) + "%" + (p.manual ? " [manual]" : " [auto]"),
    "Role awareness: " + (cfg.roleAwareness ? "ON" : "OFF") + " | scenario twists: " + (cfg.enableScenarioTwists ? "ON" : "OFF")
  ];
  if (Array.isArray(p.candidates) && p.candidates.length && !p.manual) {
    lines.push("Top signals: " + p.candidates.slice(0, 4).map(function (x) { return x.mode + " " + x.score; }).join(" | "));
  }
  lines.push("Guidance: " + CW_profileDirective(p, cfg));
  return lines.join("\n");
}

function CW_help() {
  return [
    "CROSSED WIRES v6 COMMANDS",
    "!wire NAME        — inspect relationships involving one character",
    "!wires            — inspect all tracked relationships",
    "!wiretwists       — show recent twist seeds and whether the narrator used them",
    "!wirestatus       — show engine/config status",
    "!wireprofile      — show the detected/adaptive scenario profile",
    "!wireforget NAME  — remove one NPC and all tracked relationship history involving them",
    "!spark            — force any eligible twist on the NEXT normal turn",
    "!spark small      — force a low-risk relational beat",
    "!spark medium     — force a medium complication",
    "!spark major      — force a high-stakes twist when eligible",
    "!wirehelp         — show this help",
    "",
    "Settings live in the 'Crossed Wires Config' Story Card. AUTO Scenario Mode adapts to the adventure; Notes explain every setting, supported profile and repair rule."
  ].join("\n");
}

function CW_commandNameArg(raw) {
  let s = String(raw || "").trim();
  s = s.replace(/[\u200B\u200C\u200D\uFEFF]/g, "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1).trim();
  return s.replace(/\s+$/g, "").trim();
}

function CW_readCommand(text) {
  const s = String(text || "").trim();
  let m = s.match(/^!wireforget\s+(.+?)\s*$/i);
  if (m) return { type: "forget", name: CW_commandNameArg(m[1]) };
  m = s.match(/^!wire\s+(.+?)\s*$/i);
  if (m) return { type: "one", name: CW_commandNameArg(m[1]) };
  if (/^!wires\s*$/i.test(s)) return { type: "all" };
  if (/^!wiretwists\s*$/i.test(s)) return { type: "twists" };
  if (/^!wirestatus\s*$/i.test(s)) return { type: "status" };
  if (/^!wireprofile\s*$/i.test(s)) return { type: "profile" };
  m = s.match(/^!spark(?:\s+(small|medium|major))?\s*$/i);
  if (m) return { type: "spark", tier: String(m[1] || "").toLowerCase() };
  if (/^!wirehelp\s*$/i.test(s)) return { type: "help" };
  return null;
}

function CW_onInput(text) {
  CW_init();
  CW_ensureConfigCard();
  const turn = CW_turn();
  CW_handleUndo(turn);

  const command = CW_readCommand(text);
  if (command) {
    state.crossedWires.command = command;
    if (command.type === "spark") {
      state.crossedWires.forceTwist = true;
      state.crossedWires.forceTwistTier = command.tier || "";
    }
    // Empty input / stop currently throws script errors in AI Dungeon. A
    // zero-width action lets Output replace the generated text with the command response.
    return "\u200B";
  }
  state.crossedWires.command = null;

  const cfg = CW_config();
  if (!cfg.enabled) return text;
  CW_seedFromCharacterCards(turn);
  CW_touchKnownNpcs(text, turn);
  return text;
}

function CW_onContext(text) {
  CW_init();
  CW_ensureConfigCard();
  const turn = CW_turn();
  CW_handleUndo(turn);
  if (state.crossedWires.command) return text;

  const cfg = CW_config();
  if (!cfg.enabled) return text;
  CW_seedFromCharacterCards(turn);

  // Append-only for AI Dungeon's cache-compatible context mode. Respect live
  // platform headroom and shrink Crossed Wires rather than deleting/reordering
  // any existing context, history, Story Cards or Memory Bank text.
  let headroom = cfg.contextBudgetChars;
  if (typeof info !== "undefined" && Number.isFinite(Number(info.maxChars))) {
    headroom = Math.max(0, Math.min(headroom, Math.floor(Number(info.maxChars)) - String(text || "").length - 24));
  }
  return text + CW_contextBlock(turn, headroom, text);
}

function CW_onOutput(text) {
  CW_init();
  CW_ensureConfigCard();
  const turn = CW_turn();
  CW_handleUndo(turn);

  if (state.crossedWires.command) {
    const cmd = state.crossedWires.command;
    state.crossedWires.command = null;
    if (cmd.type === "help") return CW_help();
    if (cmd.type === "one") return CW_dashboard(cmd.name);
    if (cmd.type === "twists") return CW_twistHistory();
    if (cmd.type === "status") return CW_status();
    if (cmd.type === "profile") return CW_profileStatus();
    if (cmd.type === "forget") {
      const forgotten = CW_forgetNpc(cmd.name);
      return forgotten ? "Crossed Wires: forgot " + forgotten + " and removed relationship history involving them." : "Crossed Wires: no tracked NPC matched '" + cmd.name + "'.";
    }
    if (cmd.type === "spark") return "Crossed Wires: " + (cmd.tier ? cmd.tier + "-risk " : "") + "relationship twist armed for your next normal turn.";
    return CW_dashboard("");
  }

  const cfg = CW_config();
  if (!cfg.enabled) return text;

  CW_prepareOutputTurn(turn);
  const visible = CW_parseModelOutput(text, turn);
  CW_touchKnownNpcs(visible, turn);
  return visible;
}

