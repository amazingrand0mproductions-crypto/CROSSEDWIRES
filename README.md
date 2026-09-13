# ⚡ Crossed Wires

### Adaptive Relationship Engine for AI Dungeon

**Crossed Wires is built to make characters remember each other.**

It tracks how NPC relationships develop, preserves important history, reconstructs bonds that already existed before the script started tracking them, and feeds the most relevant relationship continuity back into the story.

The goal is simple: characters should react to people based on what has actually happened between them.

---

## ❤️ Deep Relationship Tracking

Crossed Wires tracks eleven separate relationship pressures:

**Trust • Affection • Respect • Loyalty • Openness • Attachment • Attraction • Jealousy • Resentment • Fear • Tension**

Relationships are **directional**.

`Mara → YOU` does not have to match `YOU → Mara`, and `Mara → Leo` does not have to match `Leo → Mara`.

Crossed Wires only models **NPC → YOU** and **NPC → NPC**. It never assigns the player's thoughts, feelings, consent, commitments or emotional state.

A relationship can contain contradictions at the same time:

- affection with resentment
- loyalty with anger
- attraction with distrust
- fear with respect
- rivalry with admiration
- forgiveness without restored trust

That keeps relationships from collapsing into a simple “likes you / hates you” score.

---

## 🧠 Existing Relationship Reconstruction

Crossed Wires does not assume every character is a stranger when tracking begins.

It progressively reconstructs established bonds from information already available to the script, including:

- recent history
- Story Cards and Character Cards
- accessible context and memory
- scenario placeholders
- relationship language in new outputs
- semantic backfill from the narrator

Recovered relationships use a **baseline layer** instead of being treated as fresh events.

If two characters are already siblings, spouses, rivals, roommates, best friends, coworkers, mentor/student, parent/child or another established relationship, Crossed Wires can recognise that history immediately.

The relationship **type** and relationship **quality** are kept separate.

Knowing two characters are married establishes the bond. It does not automatically invent perfect trust, affection or attraction. Those qualities still come from the actual evidence.

Use `/wire rescan` to force a new reconstruction pass over currently accessible history, context and Story Cards.

Use `/wire cards` when you specifically want Character Story Cards re-scanned and their managed Notes panels refreshed immediately.

---


## 🗂️ Live Character Story Card Notes

Crossed Wires can turn every Character/NPC Story Card into a live relationship status page without changing the card's Entry.

If the player also has a Character Story Card, its Notes can show the NPC → YOU relationships currently being tracked. Crossed Wires still never invents or scores YOU → NPC feelings, consent or intentions.

When **Character Card Notes** is enabled, the script carefully appends a managed block to the card's **Notes** section. Your own Notes are preserved exactly outside that block. Only the Crossed Wires section is replaced when relationship state changes.

A character card can show:

- whether Crossed Wires is actively tracking the character
- how many known bonds and recorded relationship events involve them
- relationships recovered from that card, history or other accessible context
- relationship role and direction
- bond stage, arc and trajectory
- current trust read
- unresolved social threads and relationship needs
- recovered baseline evidence/source
- major turning points and recent memories in DETAILED mode
- behavioral effect guidance in DETAILED mode
- pin/mute status and age classification

Example:

```text
----- ⚡ CROSSED WIRES — CHARACTER STATUS -----
Tracking: ACTIVE • relationship scan ON • history backfill ON
Character: Maya Walker • age status: adult
Known bonds: 3 • recovered baselines: 2 • recorded relationship events: 12

RELATIONSHIPS
• Maya Walker → YOU [aunt/uncle]
  Stage: established • Arc: repairing • Trajectory: warming
  Read: strong affection with damaged trust
  Live threads: damaged trust • family boundaries
  Recovered: story card — Maya Walker is your aunt

• Maya Walker → Sera Walker [sibling]
  Stage: close • Arc: stable close bond • Trajectory: steady
  Read: strong trust and loyalty
----- END CROSSED WIRES STATUS -----
```

The managed Notes block is deliberately excluded from future relationship scanning, so Crossed Wires cannot read its own dashboard as new evidence and reinforce itself.

Three display depths are available:

- **COMPACT** — role, stage and arc
- **STANDARD** — adds trust read, live threads, needs and recovered-source information
- **DETAILED** — adds power/resilience, turning points, recent memories, behavior guidance and optional exact numbers

Use:

```text
/wire cards
```

to force a fresh Character Story Card relationship scan and refresh the managed Notes panels.

---

## 🤝 Broad Relationship Coverage

Crossed Wires supports a wide range of established relationships rather than focusing only on romance.

### Family

Parents, children, siblings, twins, half-siblings, step-siblings, foster/adoptive family, grandparents, grandchildren, aunts/uncles, nieces/nephews, cousins, guardians, wards, stepparents, in-laws, godparents and more.

### Social

Friends, best friends, childhood friends, former friends, confidants, roommates, neighbours, classmates and acquaintances.

### Romantic

Crushes, dating relationships, partners, fiancés, spouses, exes, former partners and other explicitly established romantic bonds.

### Conflict

Rivals, competitors, enemies and nemeses.

### Team / Authority / Work

Allies, teammates, mentors, students, superiors, subordinates, colleagues, employers, employees, business partners, coaches, athletes, captains and crew.

### Care / Professional / Specialist

Caregivers, dependents, clinicians, patients, attorneys, clients, handlers, assets, landlords, tenants, providers, customers, co-parents, captors, captives, political contacts and professional contacts.

If an unusual bond is clearly established but does not fit a specific category, Crossed Wires can safely fall back to a neutral **associate** relationship rather than inventing friendship or romance.

---

## 🔐 Different Kinds of Trust

Trust is not treated as one universal feeling.

Crossed Wires can derive:

**Personal Trust** — emotional honesty and vulnerability.

**Operational Trust** — whether somebody can actually be relied upon.

**Confidentiality Trust** — whether sensitive information is safe with them.

**Judgment Trust** — whether their decisions are respected.

A character can therefore trust somebody in one area while distrusting them in another.

---

## 🪢 Bond Stages

Relationships develop through broader stages such as:

**Provisional • Developing • Established • Close • Interdependent • Fractured • Rebuilding • Post-Relationship**

This helps distinguish a bond with years of history from one that only started a few turns ago.

---

## 🧭 Relationship Arcs

Crossed Wires also derives the direction a bond is moving in.

Examples include:

- deepening
- drifting
- repairing
- fractured
- stable close bond
- active rivalry
- competitive respect
- family strain
- professional tension
- proven alliance
- slow-burn chemistry
- volatile chemistry

The arc is separate from the raw relationship values, giving the narrator a clearer understanding of what the bond is currently going through.

---

## 🧵 Social Threads & Relationship Needs

A relationship can carry several unresolved issues at once.

Crossed Wires can track threads involving:

- trust
- secrecy
- boundaries
- reliability
- responsibility
- reputation
- autonomy
- grief
- values
- jealousy
- rivalry
- unresolved chemistry
- relationship clarity

These threads help shape what the relationship currently needs without forcing a particular outcome.

---

## 💥 Emotional Inertia

Serious damage should not vanish after one nice conversation.

Major betrayal, abandonment, coercion, infidelity and serious boundary damage can create **emotional inertia**.

While that damage is still fresh:

- small warmth has less restorative effect
- minor support cannot instantly rebuild deep trust
- resentment does not disappear just because a character apologised
- meaningful repair needs to happen over time

---

## 🛡️ Bond Resilience

The same principle works in the opposite direction.

A long-standing healthy relationship should not collapse because of one minor disagreement.

Established trust and loyalty can give a bond resistance to low-severity friction while still allowing serious harm to land normally.

A resilient relationship is harder to shake — **not immune to consequences**.

---

## 🩹 Earned Repair

Crossed Wires treats calming down, forgiving somebody and trusting them again as different things.

Major trust, boundary and abandonment damage has dedicated repair logic.

Repair requires later evidence such as:

- honesty
- consistency
- responsibility
- kept promises
- dependable actions
- respected boundaries
- meaningful follow-through

A single apology cannot mechanically erase major damage.

---

## 🔁 Repetition Damping

Repeated low-level relationship events gradually have less mechanical impact.

Five small warmth events in a row do not endlessly farm Affection.

Different meaningful developments continue to matter normally.

This keeps long-running relationships from becoming artificially maxed out through repetitive interactions.

---

## 🕰️ Turning-Point Memory

Routine relationship events live in the normal event ledger.

Major moments can be preserved in a separate **Turning-Point Archive**.

Examples include:

- betrayals
- rescues
- sacrifices
- breakups
- reconciliation
- commitment
- marriage
- abandonment
- major boundary violations
- shared trauma
- major secrets
- identity reveals
- parenthood developments

Archive selection considers severity, mechanical impact, narrative importance, diversity and relationship coverage so old but defining moments are not forgotten simply because they are old.

---

## 👥 Group Dynamics

Crossed Wires does not treat a cast like a chorus.

When several established relationships are active at once, it can preserve differences in:

- loyalty
- trust
- resentment
- fear
- respect
- rivalry
- attachment
- allegiance

This helps different NPCs react according to their own history instead of all producing the same response.

---

## ⚖️ Power Dynamics

Crossed Wires recognises that some relationships have structural power differences.

Examples include:

- parent / child
- superior / subordinate
- mentor / student
- caregiver / dependent
- clinician / patient
- attorney / client
- handler / asset
- captain / crew

It can also recognise leverage created by authority, blackmail, dependency or abuse of power.

Power dynamics influence relationship interpretation without taking agency away from the player.

---

## 🚫 Romance Is Not Assumed

Crossed Wires deliberately avoids turning every strong relationship into romance.

Banter, admiration, teamwork, rivalry and respect do **not** automatically increase Attraction.

Family-role relationships are also protected at the JavaScript level from romantic event scoring.

Romantic developments require actual romantic evidence.

---

## 🎭 Relationship Twists

Crossed Wires can optionally create relationship pressure based on what is already happening between characters.

Twists consider:

- relationship role
- bond stage
- current arc
- unresolved social threads
- recent relationship events
- scene presence
- pair cooldowns
- relationship needs
- current urgency
- twist-topic diversity

Twists are **pressure, not predetermined canon**. They create an opportunity for the story to react rather than deciding the result.

Automatic twists remain scene-aware by default. Off-screen relationships only become twist-eligible when explicitly allowed.

---

## 🎨 Twist Diversity

Different twist IDs can still feel repetitive if they keep attacking the same underlying issue.

Crossed Wires groups twists into broader topics such as:

**Trust • Secrecy • Boundaries • Romance • Power • Rivalry • Family • Reputation • Grief • Resources**

Recently used topics are temporarily downweighted so relationship pressure stays varied instead of circling the same issue endlessly.

---

## 🚨 Scene Awareness

Crossed Wires reduces automatic relationship pressure when the current scene is already urgent.

Combat, emergencies, chases and immediate danger receive more breathing room.

Quieter scenes can naturally support more relationship follow-up.

---

## 🔞 Optional Adult Relationship Mechanics

Adult-only relationship features can support themes such as:

- attraction
- consensual intimacy
- jealousy
- temptation
- infidelity
- commitment
- breakups
- complicated relationships
- parenthood-related developments

Adult gating requires the relevant characters to be established as adults.

The relationship engine focuses on consequences, trust, communication and boundaries rather than explicit sexual writing.

---

## ⚡ Visible Pulse

Crossed Wires includes an optional **Visible Pulse** so the player can tell that the engine is actually working.

A meaningful relationship update can produce a small non-canon footer such as:

```text
⚡ Crossed Wires • Mara → You updated • /wire Mara
```

Pulse detail levels:

**SUBTLE** — shows which bond changed.

**STANDARD** — also shows the relationship event that was registered.

**DETAILED** — also shows the current bond stage or arc.

The Pulse can also provide:

- one-time notices when old relationships are reconstructed
- optional twist notices
- a quiet heartbeat after several inactive turns

Pulse lines are explicitly treated as interface UI, not story canon, and are removed from Crossed Wires' own history scans.

Useful Pulse commands:

```text
/wire pulse
/wire pulse on
/wire pulse off
/wire pulse subtle
/wire pulse standard
/wire pulse detailed
/wire pulse test
```

---

## 📌 Pin Important Characters

```text
/wire pin NAME
```

Pinned characters can remain available for relationship continuity while off-screen.

```text
/wire unpin NAME
```

removes the pin.

Pinning does not bypass relationship safeguards or automatically force off-screen twists.

---

## 🔇 Mute Characters Without Erasing Them

```text
/wire mute NAME
```

keeps the character's entire relationship history while suppressing automatic context and twist use.

```text
/wire unmute NAME
```

restores normal automatic use.

This is different from deleting the character.

---

## 🛠️ Manual Corrections

Crossed Wires includes tools for correcting model mistakes without destroying relationship history.

### Merge duplicate identities

```text
/wire merge Mara | Mara Voss
```

### Correct a relationship role

```text
/wire role Mara | sibling
```

or:

```text
/wire role Mara | Leo | colleague
```

Manual role corrections are authoritative until unlocked.

### Correct age status

```text
/wire age Mara | adult
/wire age Mara | minor
/wire age Mara | unknown
```

Manual age corrections are also locked until explicitly released.

### Release locks

```text
/wire unlockrole Mara
/wire unlockrole Mara | Leo
/wire unlockage Mara
```

---

## 📟 Slash Commands

Crossed Wires uses `/` commands throughout.

### Relationship inspection

```text
/wire NAME
/wires
```

### Engine information

```text
/wire status
/wire profile
/wire twists
/wire cast
/wire test
/wire help
```

### Relationship reconstruction

```text
/wire rescan
```

### Cast controls

```text
/wire pin NAME
/wire unpin NAME
/wire mute NAME
/wire unmute NAME
/wire forget NAME
/wire merge ALIAS | CANONICAL
```

### Manual corrections

```text
/wire role NAME | ROLE
/wire role FROM | TO | ROLE
/wire unlockrole NAME
/wire unlockrole FROM | TO
/wire age NAME | adult
/wire age NAME | minor
/wire age NAME | unknown
/wire unlockage NAME
```

### Twist controls

```text
/spark
/spark small
/spark medium
/spark major
```

### Short aliases

Compact forms such as `/wirestatus`, `/wireprofile`, `/wirecast`, `/wiretwists` and `/wirehelp` are recognised.

`/cw` can also be used as a short root for `/wire` subcommands.

Malformed recognised commands are intercepted and return usage help instead of becoming story prose.

---

## ⚙️ Crossed Wires Config

Crossed Wires automatically maintains a **Crossed Wires Config** Story Card.

The Entry contains only editable values while the Notes section explains every setting.

Config areas include:

- relationship pacing
- observation requirements
- NPC initiative
- event sensitivity
- bond resilience
- emotional inertia
- trust domains
- bond stages
- social threads
- power dynamics
- group dynamics
- cast balancing
- role awareness
- role inference
- twist frequency and intensity
- twist diversity
- relationship-need weighting
- off-screen behavior
- NPC-to-NPC tracking
- romance
- adult relationship mechanics
- memory/archive limits
- adaptive protocol size
- Visible Pulse behavior
- dashboard detail

The config is designed to be changed without editing the JavaScript itself.

---

## 🧩 Context Efficiency

Crossed Wires is designed to keep its private relationship context focused.

It uses:

- scene relevance filtering
- active-bond limits
- cast balancing
- indexed event lookup
- dynamic event vocabularies
- compact relationship summaries
- per-hook caching
- archive limits
- adaptive protocol sizes
- context-headroom checks

When context becomes tight, Crossed Wires reduces its own private detail before sacrificing existing story context.

---

## 🔁 Retry & Undo Protection

Relationship state is designed to stay consistent through regenerated outputs and story changes.

Crossed Wires tracks turn-stamped relationship information so replaced or future-deleted material can be removed without wiping durable history that existed before that turn.

Failed or empty generations are also prevented from being treated as meaningful relationship events.

---

## 🧪 Built-In Self Check

Use:

```text
/wire test
```

for a non-destructive health check of the command parser, registries, config and persistent state.

Use:

```text
/wire pulse test
```

to preview the visible Pulse without changing any relationship data.

---

# ⚡ Crossed Wires

**NPCs should not only remember facts. They should remember people.**

Who helped them.

Who failed them.

Who earned their trust.

Who broke it.

Who stood beside them.

Who embarrassed them.

Who they rely on.

Who they still have not completely forgiven.

**Crossed Wires keeps that history alive.**
