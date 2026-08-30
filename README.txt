CROSSED WIRES
Adaptive Relationship Engine for AI Dungeon
============================================

Crossed Wires is designed to make characters remember each other rather than merely remember facts.

It tracks directional NPC relationships, interprets meaningful social events, preserves major turning points, adapts to the scenario, and injects only the relationship continuity that matters to the current scene.

The model identifies story-supported relationship evidence. JavaScript owns the persistent mechanics.

CORE MODEL
----------
Crossed Wires tracks 11 relationship pressures:

Trust • Affection • Respect • Loyalty • Openness • Attachment • Attraction • Jealousy • Resentment • Fear • Tension

Relationships are directional:

Mara → YOU can be very different from Leo → YOU.
Mara → Leo can be different from Leo → Mara.

The script never creates YOU → NPC emotional state. The player character's thoughts, feelings, consent, commitments and decisions stay with the player.

WHAT MAKES IT DIFFERENT
-----------------------

1. RELATIONSHIP HISTORY, NOT A SINGLE SCORE
A bond can carry strong affection and resentment at once, loyalty despite anger, attraction despite distrust, or respect between enemies.

2. BOND STAGES + ARCS
Relationships can be provisional, developing, established, close, interdependent, fractured, rebuilding or post-relationship, while separately following arcs such as repair, rivalry, family strain, professional tension or slow-burn chemistry.

3. TRUST DOMAINS
Crossed Wires can distinguish personal trust, operational reliability, confidentiality and judgment. Somebody can be trusted in a firefight but not with a secret.

4. SOCIAL THREADS / NEEDS
A bond can have several unresolved areas at once: trust, secrecy, boundaries, responsibility, reputation, grief, autonomy, jealousy, rivalry or relationship clarity.

5. EMOTIONAL INERTIA
Severe betrayal, abandonment, coercion and boundary damage create resistance to instant positive rebound. An apology can cool heat without restoring deep trust.

6. BOND RESILIENCE
The reverse is also true. A healthy relationship with real history should not collapse because of one severity-1 argument. Minor friction lands, but established trust gives the bond realistic resilience. Serious harm is never softened by this system.

7. EARNED REPAIR
trust_repair, boundary_repair and abandonment_repair must be mechanically supported by prior damage plus later rebuilding behavior across multiple turns.

8. REPETITION DAMPING
Repeated warmth/support/conflict-style event families have diminishing mechanical impact, preventing tag spam from maxing relationships.

9. TURNING-POINT MEMORY
Major events can survive beyond the normal ledger in a durable archive. Memory selection is salience-aware so an old sacrifice or betrayal can remain more important than several newer routine milestones.

10. ENSEMBLE AWARENESS
Group dynamics and Cast Balance keep multi-character scenes from collapsing into one uniform reaction or using every context slot on one NPC.

ADAPTIVE SCENARIOS
------------------
AUTO Scenario Mode can detect and combine profiles including:

Universal • Romance • Slice of Life • Horror • Fantasy • Sci-Fi • Superhero • Crime • Mystery • Survival • Political • Military • Workplace • School • Family • Adventure • Comedy • Historical • Sports • Medical • Legal • Espionage • Celebrity • Nautical • Western • Post-Apocalyptic • Cyberpunk

The profile changes social vocabulary and twist weighting, not established lore. Crossed Wires should adapt to the story rather than importing a new genre into it.

RELATIONSHIP ROLES
------------------
Supported roles include:

stranger • acquaintance • friend • best friend • family • parent • child • sibling • relative • romantic • ex • rival • ally • enemy • mentor • student • superior • subordinate • colleague • teammate • political • professional • caregiver • dependent • clinician • patient • attorney • client • handler • asset • captain • crew

Explicit role phrases can be inferred directly from prose. Manual corrections can also be locked.

Family-role bonds are mechanically blocked from romantic event scoring even if the narrator emits an incorrect tag.

RELATIONSHIP TWISTS
-------------------
Twists are optional pressure, not predetermined canon.

They are filtered by:
• scenario profile
• relationship role
• current relationship state
• adult gating
• scene presence
• pair cooldown
• exact twist cooldown
• relationship needs
• recent drama
• current scene urgency
• twist-topic diversity

Twist-topic diversity stops several different twist IDs from repeatedly attacking the same secrecy, jealousy, power, trust, rivalry, family or resource issue.

Automatic twists are scene-bound by default. Offscreen Twists can be enabled if you deliberately want major absent relationships to re-enter the story.

MATURE THEMES
-------------
Optional mature relationship mechanics only apply when all participants are established adults.

These can include attraction, consensual adult intimacy, jealousy, temptation, infidelity, commitment, breakups and parenthood-related developments.

Private narrator guidance keeps intimacy non-explicit/fade-to-black and focuses on expectations, communication and consequences.

CONFIG STORY CARD
-----------------
The script automatically creates:

Crossed Wires Config

The Entry is deliberately short and contains only editable values. The default Entry is 1,164 characters.

Every one of the 51 settings is explained individually in the Story Card Notes.

Important newer controls:

Bond Resilience: ON
Cast Balance: ON
Twist Diversity: ON
Emotional Inertia: ON
Trust Domains: ON
Bond Stages: ON
Social Threads: ON
Power Dynamics: ON
Adaptive Protocol: ON

COMMANDS
--------
Crossed Wires now uses slash commands. Type the command as the whole input.
The parser also recognizes AI Dungeon Do/Say wrappers such as > You /wire Mara.

MAIN
/wire NAME
Inspect relationships involving one character. Names with spaces work; quotes are supported.

/wires
Inspect all tracked relationships.

/wire status
Show engine, config and runtime health.

/wire profile
Show current adaptive scenario detection.

/wire twists
Show recent twist seeds, topic, risk and whether they were used.

/wire cast
Show pinned/muted NPCs and manual locks.

/wire test
Run a non-destructive self-check of the slash parser, registries, config and persistent state.

CAST MANAGEMENT
/wire pin NAME
/wire unpin NAME
Keep/remove an important NPC from off-screen continuity eligibility.

/wire mute NAME
/wire unmute NAME
Keep all history while suppressing/restoring automatic context and twist use.

/wire forget NAME
Permanently remove an NPC and relationship history involving them.

/wire merge ALIAS | CANONICAL
Merge duplicate identities while preserving history, aliases, roles and cast controls.

MANUAL CORRECTIONS
/wire role NAME | ROLE
Lock NAME → YOU relationship role.

/wire role FROM | TO | ROLE
Lock an NPC → NPC relationship role.

/wire unlockrole NAME
/wire unlockrole FROM | TO
Release the corresponding manual role lock.

/wire age NAME | adult
/wire age NAME | minor
/wire age NAME | unknown
Set and lock age status used by adult-only gating.

/wire unlockage NAME
Release the manual age lock without deleting current history/status.

TWISTS
/spark
/spark small
/spark medium
/spark major
Arm an eligible relationship twist for the next normal turn.

HELP
/wire help
Show the full command guide in the adventure.

SHORT ALIASES
/wirestatus, /wireprofile, /wirecast, /wiretwists and /wirehelp are also accepted.
/cw can be used as a short root for /wire subcommands.

MALFORMED COMMANDS
Recognized slash commands with bad syntax are intercepted and return a usage message instead of being sent to the narrator. This prevents command mistakes becoming story prose.

COMMAND OUTPUT NOTE
AI Dungeon currently errors if an Input script returns an empty string or stop. Crossed Wires therefore uses a zero-width input and replaces the generated Output with the command response. Command/dashboard responses are flagged in state as interface-only so later relationship context tells the narrator not to treat them as story canon.

CONTEXT BEHAVIOR
----------------
Context.js is append-only and contains // @cache-compatible.

Crossed Wires respects info.maxChars when it is available and shrinks its own private block rather than deleting, moving or replacing existing model context.

The hidden protocol has full, compact and micro forms. Low context therefore reduces relationship detail before it sacrifices the original story context.

The event vocabulary is dynamic: the narrator only receives a subset that makes sense for the scenario and currently active relationships.

LONG-ADVENTURE PERFORMANCE
--------------------------
The primary event ledger is capped. Major turning points roll into a separately capped archive.

Event indexes, pair lists, relevant-link selection, profile/config lookup and link reconstruction are cached per hook where useful.

A synthetic local test with 2,500 events, 500 NPCs and 100 repeated Context builds after warm-up measured roughly:

Average ~19.23 ms
Median ~18.77 ms
95th percentile ~21.70 ms
Maximum observed ~23.21 ms

These figures are development benchmarks only and do not guarantee AI Dungeon server timings.

INSTALLATION
------------
1. Library.js → Library tab
2. Input.js → Input tab
3. Context.js → Context tab
4. Output.js → Output tab
5. Save and enable scripting
6. Start/continue the adventure
7. Crossed Wires Config should be created automatically

UPGRADING
---------
Replace all four tabs.

Existing Crossed Wires relationship state is migrated in place rather than deliberately erased. Recognized Config choices are read from the previous card and rewritten into the current clean layout with new settings receiving current defaults.

FILES
-----
Library.js      complete engine
Input.js        Input hook
Context.js      append-only Context hook
Output.js       Output/tag processing hook
ALL_TABS.txt    all four tabs in one file
QUICK_START.txt fast setup guide
CHANGELOG_v11.txt changes in this build
TEST_REPORT.txt automated/stress-test summary
