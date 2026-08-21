CROSSED WIRES — Adaptive Relationship Engine for AI Dungeon
==============================================================



A horror story should still feel like horror. A military scenario should care about command, comradeship and duty. A workplace story should understand hierarchy and professional boundaries. A family story should use shared history and expectations. A superhero story should understand secret identities and responsibility. Romance can still develop naturally inside any of them when the story actually supports it.

INSTALLATION
------------
1. Open your AI Dungeon Scenario on the web.
2. Details -> Scripting -> enable Scripts -> Edit Scripts.
3. Put Library.js in Library.
4. Put Input.js in Input.
5. Put Context.js in Context. Keep // @cache-compatible as the first line.
6. Put Output.js in Output.
7. Save.
8. Start or continue an adventure. Crossed Wires automatically creates/upgrades the Crossed Wires Config Story Card.

UPGRADING FROM v2-v5
--------------------
Replace all four tabs. Existing state.crossedWires relationship history is migrated in place rather than intentionally wiped.

The config card is upgraded to v6 while preserving recognized older settings. New adaptive settings receive safe defaults.

ADAPTIVE SCENARIO ENGINE
------------------------
Default: Scenario Mode = AUTO

AUTO examines the current model context, recent history, Character/Story Cards and scenario placeholders. It selects a primary profile and, when strongly supported, a secondary profile.

Built-in profiles:
- UNIVERSAL
- ROMANCE
- SLICE_OF_LIFE
- HORROR
- FANTASY
- SCI_FI
- SUPERHERO
- CRIME
- MYSTERY
- SURVIVAL
- POLITICAL
- MILITARY
- WORKPLACE
- SCHOOL
- FAMILY
- ADVENTURE
- COMEDY
- HISTORICAL
- SPORTS

Anything that does not fit confidently falls back to UNIVERSAL. This is intentional: Crossed Wires should not force an unknown genre into the wrong template.

Hybrid examples:
- superhero + romance
- fantasy + political
- crime + mystery
- horror + survival
- school + sports
- historical + family

Use !wireprofile to see what AUTO currently believes the scenario is.

Manual override:
Set Scenario Mode in the Config card to one of the profiles above. Friendly forms such as SCI FI or SLICE OF LIFE are normalized automatically.

ADAPTATION STRENGTH
-------------------
LIGHT — Mostly universal behavior. Scenario signals lightly influence event/twist selection.
BALANCED — Stronger scenario shaping while retaining a broad universal pool.
FULL — Default. Scenario-specific twists that do not fit the detected genre are heavily suppressed/excluded while universal relationship logic remains available.

AUTO twist frequency also respects genre. Romance/slice-of-life can tolerate more social pressure; horror, survival, mystery, military and action-heavy profiles automatically get more breathing room. If you enter an exact Twist Chance, your number is used directly and is not scenario-scaled.

ROLE AWARENESS
--------------
Crossed Wires can now learn what kind of relationship two characters actually have, not just how positive or negative it is.

Supported roles include:
stranger, acquaintance, friend, best friend, family, parent, child, sibling, relative, romantic, ex, rival, ally, enemy, mentor, student, superior, subordinate, colleague, teammate, political and professional.

Roles are directional where appropriate. Mentor -> student becomes student -> mentor in the reverse direction. Superior -> subordinate is likewise inverted.

Why this matters:
- Family bonds are not automatically given romantic twists.
- Workplace/hierarchy bonds do not assume attraction from proximity.
- Military obedience is not treated as affection.
- Rivalry can remain rivalry instead of automatically becoming chemistry.
- Established romantic/ex roles can receive more relevant romantic pressure.
- Family, professional, teammate and political scenarios receive complications that match their actual relationship structure.

Role tags are hidden machine data and are removed from visible output.

SCENARIO-SHAPED RELATIONSHIP EVENTS
-----------------------------------
v6 adds relationship evidence beyond romance/friendship, including:
- cooperation
- dependability
- competence proven
- solidarity
- shared duty
- mentorship/guidance
- mercy
- ideological alignment/conflict
- command backed/refused
- resource sharing/denial
- secret identity reveal
- accusation/suspicion cleared
- grief support/blame
- professional support
- credit shared/stolen
- family support/favoritism
- team victory/failure
- political alliance/public scandal
- blackmail

These feed the same durable trust/respect/loyalty/etc. model, allowing genre events to change relationships without inventing a separate score system for every scenario.

SCENARIO-SHAPED TWISTS
----------------------
When Scenario Twists is ON, the engine can choose complications that fit the active profile.

Examples:
HORROR / SURVIVAL
- fear breaks trust
- survivor guilt
- scarce resource choice
- leadership challenge

FANTASY / HISTORICAL / POLITICAL
- oath versus personal loyalty
- faction divide
- magical obligation when magic already exists
- reputation constraints

SCI_FI / SUPERHERO
- mission versus bond
- identity uncertainty
- secret-identity strain
- heroic-code disagreement

CRIME / MYSTERY
- informant suspicion
- leverage changes hands
- withheld clue
- suspicion falling on someone close

MILITARY
- order versus loyalty
- command conflict
- promotion/rank rift

WORKPLACE / SCHOOL
- credit disputes
- professional boundaries
- peer-group shifts
- mentor expectations

FAMILY
- old family wounds
- expectations and obligation
- quiet life changes

SPORTS
- team-role conflict
- performance pressure
- promotion/captaincy rivalry

COMEDY / SLICE OF LIFE
- harmless social disasters
- awkward matchmaking when romance is plausible
- routine/life changes

Scenario twists remain optional pressure seeds. They are never predetermined canon and should be ignored by the narrator when continuity does not support them.

CORE RELATIONSHIP MODEL
-----------------------
Crossed Wires still tracks eleven independent pressures:
Trust, Affection, Respect, Loyalty, Openness, Attachment, Attraction, Jealousy, Resentment, Fear and Tension.

Relationships are directional. Mara -> YOU can differ from Alex -> Mara. The engine never assigns the player's thoughts, feelings, dialogue, consent or decisions.

OBSERVATION
-----------
New NPCs remain provisional until BOTH observation gates are met. Default:
- 3 turns
- 2 appearances

Early evidence is retained conservatively, preventing instant soulmate/enemy conclusions.

MEMORY & REPAIR
---------------
Recent memories plus older Memory Anchors preserve major turning points.

Major betrayal, abandonment and boundary damage create durable scars. Apology or forgiveness can reduce immediate resentment/tension without magically restoring trust.

Earned repair events:
- trust_repair
- boundary_repair
- abandonment_repair

MATURE THEMES
-------------
Adult-only mechanics still require all participants to be established adults. Numeric ages, written ages and adult decade descriptions are supported. Explicit under-18 information overrides adult assumptions.

Adult intimacy remains non-explicit/fade-to-black. Crossed Wires focuses on expectations, consent, boundaries, exclusivity, jealousy, trust, commitment and aftermath.

A SCHOOL profile does not bypass age gating.

CONFIG CARD
-----------
The Crossed Wires Config card has:
- Title: Crossed Wires Config
- Triggers: blank
- Type: Custom
- Entry: editable settings only
- Notes: full explanations

Important v6 settings:
Scenario Mode: AUTO
Adaptation Strength: FULL
Role Awareness: ON
Scenario Twists: ON

Existing relationship, drama, mature-content, pacing, observation and context settings remain available.

COMMANDS
--------
!wire NAME        Inspect relationships involving one character
!wires            Inspect all tracked relationships
!wiretwists       Show recent twist seeds, profile and whether they were used
!wirestatus       Show engine/config status
!wireprofile      Show AUTO/manual adaptation profile and top detected signals
!wireforget NAME  Remove one NPC and their relationship history
!spark            Force an eligible twist next normal turn
!spark small      Force a low-risk beat
!spark medium     Force a medium complication
!spark major      Force a high-stakes twist when eligible
!wirehelp         Show command help

LOW-CONTEXT BEHAVIOR
--------------------
Crossed Wires remains append-only and respects live info.maxChars headroom.

Normal headroom:
- scenario profile
- active directional relationships
- roles
- turning points
- twist seed
- full event protocol

Reduced headroom:
- compact profile/relationship guidance
- reduced adaptive event vocabulary
- relationship and role tracking remain active where possible

Extremely tight headroom:
- continuity-only micro block

No safe headroom:
- original context remains untouched

TECHNICAL NOTES
---------------
- Persistent state: state.crossedWires
- Adaptive profile source: current model context + recent history + Story Cards + placeholders
- Profile mode can be AUTO or manual
- Primary + optional secondary profile
- Relationship roles persisted separately from numeric scores
- Context injection remains append-only
- Context respects info.maxChars
- Ledger cap: 2,500 events
- Indexed directional relationship lookups
- Hidden CW_PERSON / CW_ROLE / CW_EVT / CW_TWIST tags stripped before display
- Same-turn regenerate replaces that turn's machine-derived relationship evidence
- Undo removes future relationship evidence, sightings, roles and twist data
- Character Story Cards can canonicalize names/aliases
- Config migration preserves recognized older values
