⚡ Crossed Wires

An adaptive relationship engine for AI Dungeon

Crossed Wires makes characters remember each other.

It tracks how NPC relationships change over time, remembers important moments, understands different kinds of bonds, adapts to the scenario you’re playing, and quietly feeds that history back into the story.

It isn’t just a romance system.

You can drop it into a superhero scenario, zombie apocalypse, fantasy kingdom, workplace drama, military campaign, murder mystery, family story, school scenario, political thriller or almost anything else and let it adapt.

⸻

✨ What Crossed Wires Does

AI Dungeon can be great at individual scenes, but relationships can sometimes lose continuity over a long adventure.

A character might:

* trust you with their life
* discover you lied to them
* fall out with you
* slowly forgive you
* fight beside you again

…and eventually some of that history can get lost.

Crossed Wires keeps its own persistent relationship history so those moments continue to matter.

The aim isn’t to control the story.

The aim is to give the AI enough memory to write characters who feel like they’ve actually lived through it.

⸻

❤️ Deep Relationship Tracking

Every directional relationship can track:

* Trust
* Affection
* Respect
* Loyalty
* Openness
* Attachment
* Attraction
* Jealousy
* Resentment
* Fear
* Tension

Relationships are directional.

Mara → Alex

does not have to equal:

Alex → Mara

One character can trust somebody who doesn’t trust them back.

Someone can love another person while resenting them.

A rival can dislike you while genuinely respecting you.

A friend can remain loyal while being furious.

Crossed Wires deliberately keeps those contradictions instead of collapsing everything into a single relationship score.

⸻

🧠 More Than Numbers

The raw values are only part of the system.

Crossed Wires also derives higher-level relationship information such as:

Bond Stage

A relationship can move through stages like:

* Provisional
* Developing
* Established
* Close
* Interdependent
* Fractured
* Rebuilding
* Post-Relationship

A relationship that has existed for hundreds of turns therefore doesn’t get treated the same as somebody you met ten minutes ago.

⸻

Relationship Arc

The engine can recognise patterns such as:

* Deepening
* Drifting
* Repairing
* Fractured
* Active Rivalry
* Competitive Respect
* Family Strain
* Professional Tension
* Proven Alliance
* Slow-Burn Chemistry
* Volatile Chemistry
* Stable Close Bond

⸻

Current Social Threads

Relationships can carry several unresolved issues at once.

Examples:

* damaged trust
* secrecy
* boundaries
* abandonment
* responsibility
* recognition
* grief
* jealousy
* rivalry
* ideological conflict
* power imbalance
* unresolved chemistry

This gives the narrator something much more useful than:

Trust: 47

A relationship might instead be understood as:

Established friendship. Repairing. Strong operational trust but weak personal trust. Resentment remains over an old betrayal. Recent behavior suggests genuine rebuilding.

⸻

🔐 Different Kinds of Trust

Trust isn’t always one thing.

Crossed Wires can derive:

Personal Trust

Can this person be emotionally honest and vulnerable with them?

Operational Trust

Can they be relied upon when something actually needs doing?

Confidentiality Trust

Can they safely be trusted with secrets or sensitive information?

Judgment Trust

Does the character respect their decisions?

That allows much more interesting relationships.

A soldier might trust someone completely in combat but never discuss their personal life with them.

A friend might emotionally trust someone while thinking they’re useless in a crisis.

⸻

🛡️ Bond Resilience

Long-standing healthy relationships become more resilient to minor friction.

A twenty-year friendship shouldn’t mechanically collapse because of one sarcastic comment.

Minor arguments can still create:

* tension
* irritation
* resentment
* temporary distance

But established trust and loyalty give the relationship some resistance.

Serious events are different.

Things like:

* betrayal
* infidelity
* abandonment
* coercion
* blackmail
* major deception
* serious boundary violations

still hit hard.

A strong relationship is resilient, not invincible.

⸻

💥 Emotional Inertia

Crossed Wires also works in the opposite direction.

A massive betrayal shouldn’t disappear because of two friendly conversations.

Serious relationship damage can create temporary emotional inertia.

While that damage is still fresh:

* minor warmth has reduced effect
* small supportive moments don’t instantly restore trust
* affection can’t simply erase resentment
* genuine repair has to be demonstrated

This helps prevent:

betrayal → apology → everything is fine

⸻

🩹 Repair Has To Be Earned

Major relationship damage has dedicated repair mechanics.

Crossed Wires can distinguish between:

* calming down
* forgiving someone
* actually trusting them again

Those are not the same thing.

For serious trust, boundary or abandonment damage, repair requires actual evidence across later turns.

For example:

1. The betrayal happens.
2. The character admits what they did.
3. They behave honestly afterward.
4. They keep an important promise.
5. They prove dependable when it matters.
6. Trust begins rebuilding.

The narrator can’t simply emit a trust_repair event immediately and erase everything.

The JavaScript checks whether the repair has actually been earned.

⸻

🕰️ Long-Term Memory

Crossed Wires maintains a large relationship-event ledger.

Routine events can eventually roll out to keep performance under control.

Major moments are different.

Important events are preserved in a separate Turning-Point Archive.

Examples include:

* betrayals
* sacrifices
* rescues
* breakups
* reconciliation
* marriage
* commitment
* major boundary violations
* abandonment
* shared trauma
* parenthood developments
* secret identity reveals

Archive selection considers:

* severity
* mechanical impact
* narrative importance
* recency
* event diversity
* relationship coverage

An ancient life-changing sacrifice isn’t automatically forgotten just because it’s old.

⸻

🔁 Repetition Damping

Repeated small events gradually become less powerful.

For example:

warmth → warmth → warmth → warmth → warmth

won’t endlessly farm Affection.

But:

support → vulnerability → kept promise → sacrifice → reconciliation

continues to matter because genuinely different things are happening.

This makes long relationships much harder to accidentally max out.

⸻

🌍 Adaptive Scenario Detection

Crossed Wires can automatically work out what kind of scenario you’re playing.

Supported profiles include:

* ❤️ Romance
* 🏠 Slice of Life
* 👻 Horror
* ⚔️ Fantasy
* 🚀 Sci-Fi
* 🦸 Superhero
* 🔫 Crime
* 🔍 Mystery
* 🌲 Survival
* 🏛️ Political
* 🪖 Military
* 💼 Workplace
* 🎓 School
* 👨‍👩‍👧 Family
* 🗺️ Adventure
* 😂 Comedy
* 🏰 Historical
* 🏆 Sports
* 🏥 Medical
* ⚖️ Legal
* 🕵️ Espionage
* 🎬 Celebrity
* ⛵ Nautical
* 🤠 Western
* ☢️ Post-Apocalyptic
* 🌃 Cyberpunk

It can combine profiles too.

Examples:

SUPERHERO + ROMANCE

FANTASY + POLITICAL

HORROR + SURVIVAL

CRIME + MYSTERY

If the scenario doesn’t fit anything confidently, Crossed Wires uses a flexible Universal profile instead of forcing the wrong genre.

⸻

🎭 Scenario-Specific Relationship Events

Different scenarios create different kinds of relationship evidence.

🌲 Survival

* resource sharing
* resource denial
* dependency
* leadership
* sacrifice
* reliability under pressure

🪖 Military

* shared duty
* command backed
* command refused
* competence under fire
* loyalty
* responsibility

💼 Workplace

* professional support
* credit shared
* credit stolen
* delegated responsibility
* power abuse
* professional boundaries

🔍 Mystery

* accusations
* suspicion
* withheld information
* confidentiality
* evidence support
* suspicion cleared

🦸 Superhero

* secret identity reveals
* protection
* responsibility
* heroic duty
* divided loyalties

🏥 Medical

* care under pressure
* confidentiality
* ethical disagreement
* professional trust
* difficult responsibility

🕵️ Espionage

* cover protected
* cover compromised
* handler/asset trust
* secrets
* divided loyalty

And many more.

⸻

🤝 Relationship Roles

Crossed Wires can understand different types of bonds.

Examples include:

* friend
* best friend
* sibling
* parent
* child
* relative
* romantic partner
* ex
* rival
* enemy
* ally
* teammate
* mentor
* student
* superior
* subordinate
* colleague
* political relationship
* professional relationship
* caregiver
* dependent
* clinician
* patient
* attorney
* client
* handler
* asset
* captain
* crew

These roles influence how relationship events are interpreted.

⸻

🚫 Not Every Relationship Becomes Romance

This is deliberately enforced.

A sibling being protective is not flirting.

A commander respecting a soldier is not attraction.

Two rivals constantly arguing doesn’t automatically mean they secretly want each other.

Generic:

* banter
* admiration
* rivalry
* teamwork
* respect

do not automatically increase Attraction.

Romance requires genuinely romantic evidence.

Family-role relationships also have a JavaScript-level romance block, so even if the narrator outputs an incorrect romantic event, the engine can reject it.

⸻

⚖️ Power Dynamics

Crossed Wires understands that relationships can contain structural power differences.

Examples:

* parent → child
* superior → subordinate
* mentor → student
* caregiver → dependent
* clinician → patient
* attorney → client
* handler → asset
* captain → crew

It can also recognise story-created leverage such as:

* blackmail
* authority
* dependency
* power abuse
* power being shared

Power dynamics influence relationship context without taking control away from the player.

⸻

👥 Group Dynamics

Relationships don’t exist in isolation.

Crossed Wires can analyse several active bonds in the same scene and detect patterns such as:

* mixed loyalties
* group strain
* strong cohesion
* conflicting allegiances
* different attitudes toward the player

The narrator is encouraged to preserve those differences.

Instead of:

Everyone glares at you.

you can get individual reactions based on actual history.

⸻

👥 Cast-Balanced Context

Large casts can easily cause one heavily connected NPC to consume all available relationship context.

Crossed Wires balances active relationship slots across the current cast.

It still prioritises relevance.

It just avoids unnecessarily spending every slot on one character while other important people disappear.

This is especially useful for:

* superhero teams
* military squads
* families
* friend groups
* workplaces
* sports teams
* survival groups
* ensemble dramas

⸻

🎲 Adaptive Relationship Twists

Crossed Wires can occasionally seed relationship complications.

Twists aren’t simply chosen from one universal random list.

Selection can consider:

* scenario
* relationship role
* bond stage
* current relationship arc
* unresolved social threads
* recent events
* current scene
* active cast
* relationship needs
* previous twist topics

⸻

Examples

Horror

* fear damaging trust
* survivor guilt
* paranoia
* blame

Survival

* scarce resources
* leadership conflict
* responsibility
* mutual dependence

Workplace

* favouritism
* stolen credit
* professional boundaries
* authority shifts

Military

* orders versus loyalty
* command disputes
* rank tension

Superhero

* secret identities
* duty versus personal relationships
* mission pressure

Family

* expectations
* old wounds
* responsibility
* favouritism

Romance

* jealousy
* old flames
* commitment
* reconciliation
* temptation
* breakups

⸻

🎨 Twist Diversity

Crossed Wires doesn’t only prevent the exact same twist repeating.

It also tracks broader topics.

For example:

* Secret Exposed
* Confidentiality Problem
* Withheld Information
* Cover Compromised

are different twists, but they’re all broadly about secrecy.

Recently used topics are temporarily downweighted.

This helps relationship drama stay varied instead of circling one issue endlessly.

⸻

🚨 Scene Awareness

Automatic twists are scene-aware.

If the player is:

* in combat
* being chased
* escaping an explosion
* dealing with an emergency
* fighting for survival

relationship twists become less likely.

Quiet conversations and downtime can allow more social developments.

This helps prevent ridiculous interruptions like:

The reactor is exploding.

followed by:

Sarah wants to discuss your relationship.

⸻

📌 Pin Important Characters

Keep an important off-screen character available for continuity:

!wirepin Mara

Remove the pin:

!wireunpin Mara

Useful for:

* partners
* family
* major rivals
* mentors
* recurring villains
* important allies

Pinning does not bypass relationship safety rules or automatically force off-screen twists.

⸻

🔇 Mute Characters

Keep a character’s history without automatically using them:

!wiremute Mara

Restore them:

!wireunmute Mara

This is useful when somebody temporarily leaves the story.

Their relationship history remains intact.

⸻

🛠️ Manual Corrections

No automatic classifier is perfect.

Crossed Wires includes tools for fixing mistakes without destroying relationship history.

Merge duplicate identities

!wiremerge Mara | Mara Voss

Preserves:

* events
* aliases
* sightings
* turning points
* roles
* locks
* pin/mute state

⸻

Correct a role

NPC → Player:

!wirerole Mara | sibling

NPC → NPC:

!wirerole Mara | Leo | colleague

Manual role corrections are authoritative.

Automatic inference cannot silently overwrite them.

Release the lock:

!wireunlockrole Mara

or:

!wireunlockrole Mara | Leo

⸻

Correct age status

!wireage Mara | adult
!wireage Mara | minor
!wireage Mara | unknown

Release the manual age lock:

!wireunlockage Mara

⸻

🔞 Optional Adult Relationship Themes

For characters established as adults, optional settings can support themes such as:

* attraction
* consensual intimacy
* jealousy
* temptation
* infidelity
* breakups
* commitment
* complicated relationships
* parenthood-related developments

The relationship engine focuses on:

* expectations
* trust
* consequences
* emotional aftermath
* boundaries
* commitment

rather than explicit sexual writing.

Adult-only mechanics remain gated behind established adulthood.

⸻

⚙️ Config Story Card

Crossed Wires automatically creates:

Crossed Wires Config

You do not need to edit Library.js every time you want to change something.

The Story Card Entry contains the actual settings.

The Story Card Notes explain what every option does.

⸻

Example Config

[Core]
Enabled: ON
Relationship Pace: SLOW
NPC Initiative: ON
Observation Turns: 3
Observation Appearances: 2
Event Sensitivity: BALANCED
Bond Resilience: ON
Emotional Inertia: ON
Trust Domains: ON
Bond Stages: ON
Social Threads: ON
Power Dynamics: ON
Cast Balance: ON
[Adaptation]
Scenario Mode: AUTO
Adaptation Strength: FULL
Profile Stability: 4
Role Awareness: ON
Role Inference: ON
Scenario Twists: ON
Offscreen Twists: OFF
[Drama & Twists]
Twist Mode: WILD
Twist Chance: AUTO
Twist Need Bias: ON
Twist Diversity: ON
[Relationship Scope]
NPC To NPC: ON
Romance: ON
Mature Themes: ON
Adult Intimacy: ON
Infidelity: ON
Breakups: ON
Parenthood: ON
Toxic Drama: ON
[Advanced]
Adaptive Protocol: ON
Archive Anchors: 600
[Display]
Dashboard Numbers: ON

The exact generated card contains additional settings.

⸻

📟 Commands

Relationships

!wire NAME

Inspect relationships involving one character.

!wires

View tracked relationships.

⸻

Scenario

!wireprofile

See what kind of scenario Crossed Wires currently thinks you’re playing.

⸻

Twists

!wiretwists

View recent relationship twists.

!spark

Force an eligible twist.

You can also choose intensity:

!spark small
!spark medium
!spark major

⸻

Engine Status

!wirestatus

Shows engine status and checks the config.

!wirecast

Shows pinned/muted NPCs and manual locks.

!wirehelp

Command help.

⸻

Character Management

!wireforget NAME

Completely erase one NPC and their tracked relationship history.

!wiremerge NAME | CANONICAL NAME

Merge duplicate identities.

!wirepin NAME
!wireunpin NAME

Manage persistent continuity.

!wiremute NAME
!wireunmute NAME

Temporarily suppress automatic relationship influence.

⸻

📦 Installation

Crossed Wires uses all four AI Dungeon script tabs.

The package contains:

Library.js
Input.js
Context.js
Output.js

1. Open your Scenario

Open the AI Dungeon scenario you want Crossed Wires to run in.

2. Open Scripts

Enable/open the scenario scripting editor.

3. Copy each file into its matching tab

* Library.js → Library
* Input.js → Input
* Context.js → Context
* Output.js → Output

4. Start or continue the adventure

Crossed Wires will create its Config Story Card automatically.

5. Edit the Config Story Card if needed

You can leave everything at its defaults and simply play.

⸻

🔄 Updating Crossed Wires

When replacing an older Crossed Wires build:

1. Replace all four script tabs.
2. Do not deliberately delete the existing relationship state.
3. Continue the adventure.

The engine includes migration handling for previous Crossed Wires state/config structures.

Existing relationship history, aliases, archived events and recognised configuration choices are designed to migrate forward rather than intentionally reset.

⸻

👤 Player Agency

Crossed Wires does not track:

YOU → NPC

It tracks:

NPC → YOU

and:

NPC → NPC

The narrator is explicitly instructed not to decide:

* your thoughts
* your emotions
* your dialogue
* your consent
* your commitments
* your actions

The script models what the NPCs feel.

What you feel remains yours.

⸻

🕵️ Hidden Tracking

Crossed Wires uses temporary machine tags in generated output to classify relationship evidence.

Those tags are removed by the Output script before the player sees the final story.

Normal play therefore stays normal prose.

The engine doesn’t need to display:

Trust +4
Affection +2

inside every story response.

Use the dashboard commands when you actually want to inspect the mechanics.

⸻

⚡ Context Efficiency

Crossed Wires is designed for long adventures.

It includes:

* scene relevance filtering
* active-bond limits
* cast balancing
* indexed event lookup
* per-hook caches
* archive limits
* dynamic event vocabularies
* adaptive protocol sizes
* context headroom checking
* append-only Context behavior

The Context script uses:

// @cache-compatible

for AI Dungeon’s cache-compatible V1 Context behavior.

If there isn’t enough available context, Crossed Wires progressively reduces its private guidance rather than overwriting the existing story context.

⸻

🔁 Retry & Undo Handling

Crossed Wires includes protection for:

* Retry
* regenerated outputs
* deleted future turns
* failed/empty generations
* role changes
* relationship events
* twist state

A replaced response shouldn’t remain in relationship history after the story has moved to a different version of that turn.

⸻

🧪 Tested For

The engine has been repeatedly regression-tested around:

* long adventures
* large casts
* NPC-to-NPC relationships
* scenario changes
* mixed genres
* retries
* undo
* duplicate identities
* Character Card aliases
* family-role romance prevention
* adult/minor gating
* malformed machine tags
* config migration
* context limits
* long relationship ledgers
* archive compaction
* manual corrections
* ensemble scenes
* relationship repair

⸻

💡 Recommended Uses

Crossed Wires works particularly well for:

❤️ Romance & relationship drama
🦸 Superhero universes
🧟 Zombie/apocalypse scenarios
⚔️ Fantasy campaigns
👻 Horror
🔍 Murder mysteries
🔫 Crime dramas
🪖 Military stories
💼 Workplace scenarios
🎓 School/campus stories
👨‍👩‍👧 Family dramas
🏛️ Political intrigue
🚀 Science fiction
🌃 Cyberpunk
🏆 Sports stories
🎭 Ensemble casts

But none of those are required.

If the scenario is about characters who interact with each other, Crossed Wires has something to work with.

⸻

❓ FAQ

Does this force romance?

No.

Crossed Wires actively tries to prevent every meaningful relationship from becoming romantic.

Romance requires actual romantic evidence.

⸻

Does it decide how my character feels?

No.

The player’s emotional state is deliberately outside the relationship ledger.

⸻

Will it create drama every turn?

No.

The twist system uses cooldowns, scene pressure, scenario adaptation and topic diversity.

Calm scenes are allowed to stay calm.

⸻

Can NPCs have relationships with each other?

Yes.

NPC-to-NPC relationship tracking can be enabled or disabled in the Config Story Card.

⸻

Can I use it without twists?

Yes.

Turn the twist system OFF and keep the persistent relationship engine.

⸻

Can I disable romance completely?

Yes.

The wider friendship, family, professional, rivalry, alliance and team systems still work.

⸻

What happens if it detects somebody incorrectly?

Use the correction commands.

You can:

* merge identities
* correct roles
* correct ages
* mute characters
* remove characters entirely

⸻

Will it work with existing scenarios?

Usually, yes.

Crossed Wires was deliberately designed to adapt to the story around it rather than requiring a scenario written specifically for the script.

⸻

🛠️ Project Files

Crossed Wires/
├── Library.js
├── Input.js
├── Context.js
├── Output.js
├── ALL_TABS.txt
├── QUICK_START.txt
├── README.md
├── CHANGELOG.txt
└── TEST_REPORT.txt

⸻

⚠️ Notes

Crossed Wires depends heavily on the AI correctly understanding ordinary story events.

The JavaScript adds validation and safeguards, but no language-model classifier will be perfect in every possible story.

That’s why manual correction commands exist.

If something strange happens, check:

!wire NAME
!wirestatus
!wireprofile

before assuming the relationship history is wrong.

⸻

💬 Feedback

If you use Crossed Wires, feedback is genuinely useful.

Especially:

* false relationship detections
* scenario types AUTO struggles with
* strange twist choices
* relationships that change too quickly/slowly
* large-cast behavior
* long-adventure performance
* event types that feel missing

The best improvements usually come from seeing where the script behaves strangely in an actual adventure rather than just adding another hundred lines of theoretical features.

⸻

⚡ Crossed Wires

NPCs shouldn’t just remember facts.

They should remember:

who helped them,
who failed them,
who embarrassed them,
who earned their respect,
who they trusted when everything went wrong,
who stood beside them,
and who they still haven’t completely forgiven.

Crossed Wires makes that history harder to forget.
