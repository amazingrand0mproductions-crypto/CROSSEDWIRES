# ⚡ Crossed Wires

### Adaptive Relationship Engine for AI Dungeon

**Crossed Wires gives NPC relationships memory, direction, consequences, and independent character agency.**

It tracks how NPCs feel about the player and each other, reconstructs relationships that already exist, preserves important turning points, and feeds only the relevant bond information back into the story.

The player remains player-controlled. Crossed Wires never assigns the player's feelings, consent, dialogue, commitments, or decisions.

---

## ❤️ Deep Directional Relationships

Crossed Wires tracks eleven separate pressures:

**Trust • Affection • Respect • Loyalty • Openness • Attachment • Attraction • Jealousy • Resentment • Fear • Tension**

Relationships are directional. `Mara → YOU` can be completely different from `Leo → Mara` or `Mara → Leo`.

That allows mixed bonds such as:

- affection with resentment
- loyalty with anger
- attraction with distrust
- rivalry with respect
- forgiveness without restored trust
- fear without loyalty

---

## 🧠 Existing Relationship Reconstruction

Crossed Wires does not assume everybody is a stranger when tracking begins.

It can reconstruct established bonds from information already available to the script, including recent history, Story/Character Cards, accessible memory/context, placeholders, and later relationship evidence.

Recovered relationships use a persistent **baseline layer** rather than being faked as new events.

If two characters are already siblings, spouses, exes, best friends, rivals, roommates, teammates, coworkers, mentor/student, parent/child, or another established relationship, that existing history can be recognised immediately.

Relationship **type** and relationship **quality** stay separate. Being married establishes the role; it does not automatically invent perfect trust or affection.

`/wire rescan` forces a fresh relationship reconstruction pass.

---

## ⚡ Guaranteed Bond Formation

Recurring characters no longer depend entirely on the model remembering to emit a relationship tag.

With **Auto Form Bonds** enabled, once an NPC passes the configured Observation Turns and Observation Appearances gates, Crossed Wires guarantees a bond exists.

If no stronger role has been established, the fallback is deliberately neutral:

**NPC → YOU [acquaintance]**

This means only that the characters now know each other. It does not invent friendship, attraction, loyalty, or trust.

Recurring NPC pairs can likewise form a neutral **associate** connection when NPC-to-NPC auto formation is enabled.

Explicit family, romantic, friendship, rivalry, professional, or other roles always override the neutral fallback.

---

## 🧍 Independent NPC Agency

Crossed Wires actively resists the common **yes-person** problem.

With **NPC Agency: STRONG** enabled, player requests, commands, persuasion, flirting, and physical/romantic actions are treated as **attempts**, not automatic success.

NPCs can naturally:

- agree
- refuse
- hesitate
- negotiate
- impose conditions
- disagree
- counteroffer
- challenge an order
- set a boundary
- leave
- call for help
- cooperate reluctantly

Their response is guided by their established personality, relationship role, trust, loyalty, respect, resentment, fear, goals, history, and current stakes.

Crossed Wires also derives a bond-specific **cooperation stance**. A trusted ally can be more willing to help without becoming blindly obedient; a resentful acquaintance can resist without automatically becoming an enemy.

Authority roles can create duties, but not mindless obedience.

---

## 🛡️ Consent-Aware Social Attempts

With **Consent Guard: ON**, physical and romantic advances require the other character's current willingness.

A relationship does **not** create blanket consent.

Being a spouse, partner, superior, famous hero, feared villain, or trusted friend does not force another character to reciprocate a kiss, accept intimacy, or obey a personal request.

For strangers and acquaintances, sudden physical or romantic advances are specifically prevented from being treated as automatically welcome unless the story has already established clear willingness.

Fear, dependence, authority, or compliance are not interpreted as consent.

Family-role relationships are code-blocked from romantic/sexual relationship events.

A refusal is not automatically scored as hatred or relationship failure. Healthy boundaries can actually increase respect.

---

## 🚫 Deterministic Refusal Fallback

The narrator normally reports relationship evidence through hidden machine tags, but Crossed Wires now has an extra fallback for obvious refusals.

If an NPC clearly:

- refuses
- declines
- pulls away
- steps back
- says not to touch/kiss them
- tells the player to stop/back off
- pushes the player away

and the model forgets to emit a relationship event tag, Crossed Wires can still record the refusal/boundary event itself.

This gives agency and consent consequences a second layer of reliability.

Continued pressure after a clear refusal can create durable boundary damage and emotional inertia.

---

## 🔐 Multiple Types of Trust

Crossed Wires can derive:

- **Personal Trust** — emotional honesty and vulnerability
- **Operational Trust** — whether somebody can be relied upon when it matters
- **Confidentiality Trust** — whether sensitive information is safe
- **Judgment Trust** — whether their decisions are respected

A character can trust someone in combat while refusing to share personal information with them.

---

## 🪢 Bond Stages, Arcs & Social Threads

Relationships can develop through stages such as:

**Provisional • Developing • Established • Close • Interdependent • Fractured • Rebuilding • Post-Relationship**

Crossed Wires also derives relationship arcs, including deepening, drifting, repairing, family strain, professional tension, competitive respect, proven alliance, stable close bond, slow-burn chemistry, and volatile chemistry.

Multiple unresolved threads can exist at the same time, including trust, secrecy, boundaries, responsibility, grief, rivalry, jealousy, ideology, recognition, power, and unresolved chemistry.

---

## 💥 Emotional Inertia & Earned Repair

Major damage does not vanish after one positive scene.

Betrayal, abandonment, infidelity, coercive pressure, serious boundary violations, blackmail, power abuse, and pressure after refusal can create emotional inertia.

Small positive events have reduced healing power while the damage is fresh.

Trust, boundary, and abandonment repair must be **earned through multiple later actions across separate turns**. One apology cannot mechanically erase a lasting scar.

---

## 🛡️ Bond Resilience

Long-standing healthy relationships gain resistance to minor friction.

One sarcastic remark should not mechanically destroy a decades-long friendship.

Resilience softens small disagreements while still allowing major betrayals or serious harm to land normally.

Strong bonds are resilient, not invincible.

---

## 🧠 Long-Term Turning-Point Memory

Routine events can eventually roll out of the active ledger for performance, but major moments are preserved separately.

Turning points can include:

- betrayal
- rescue
- sacrifice
- breakup
- reconciliation
- commitment
- marriage
- abandonment
- serious boundary violations
- shared trauma
- secret-identity reveals
- parenthood developments

Archive compaction considers importance, severity, relationship coverage, diversity, and recency rather than deleting history purely because it is old.

---

## 🔁 Repetition Damping

Repeated minor events gradually matter less.

Five identical warmth events cannot endlessly farm Affection, while genuinely different developments can continue moving the bond.

---

## 👥 Broad Relationship Coverage

Crossed Wires understands a wide range of relationships, including:

### Family
Parents, children, siblings, twins, half/step/foster/adoptive siblings, grandparents, grandchildren, aunts/uncles, nieces/nephews, cousins, guardians/wards, stepparents, in-laws, godparents, and more.

### Social
Friends, best friends, childhood friends, former friends, confidants, roommates, neighbours, classmates, acquaintances, hosts/guests, and associates.

### Romantic
Crushes, dating, partners, fiancés, spouses, exes, former partners, and other explicitly established romantic bonds.

### Conflict
Rivals, competitors, enemies, nemeses, captors, and captives.

### Team / Work / Authority
Allies, teammates, mentors, students, superiors, subordinates, colleagues, employers, employees, business partners, coaches, athletes, leaders/followers, captains/crew, and political/professional relationships.

### Care / Specialist
Caregivers/dependents, clinicians/patients, attorneys/clients, handlers/assets, landlords/tenants, providers/customers, co-parents, creators/creations, and more.

Unusual established bonds can fall back to **associate** without inventing friendship or romance.

---

## 👥 Group Dynamics & Cast Balance

Crossed Wires keeps individual relationships separate in ensemble scenes.

One NPC can trust the player, another can resent them, and a third can respect their competence while disliking them personally.

Cast balancing prevents one heavily connected NPC from consuming every available relationship-context slot.

---

## 🎭 Relationship Twists

The optional twist engine can seed relationship complications based on current bonds, unresolved needs, roles, recent events, and scene pressure.

Twist diversity prevents different twist IDs from repeatedly circling the same topic.

Combat, emergencies, chases, and high-pressure scenes reduce automatic social interruptions so relationship mechanics support the story rather than constantly hijacking it.

---

## 📚 Live Character Card Notes

Character/NPC Story Cards can receive a managed Crossed Wires status panel in their Notes.

The user's own Notes are preserved outside the managed block.

Depending on detail level, the panel can show:

- known bonds
- recovered relationship roles
- stage, arc, and trajectory
- trust read
- live threads and needs
- turning points
- recent memories
- relationship behavior guidance
- agency/cooperation guidance
- pin/mute state
- age classification

Crossed Wires excludes its own managed block from future scans so it cannot learn from its own status text.

`/wire cards` forces a card refresh.

---

## ⚡ Visible Pulse

The optional **Crossed Wires Pulse** proves the engine is active without dumping raw mechanics into every response.

Example:

```text
⚡ Crossed Wires • Mara → You updated • /wire Mara
```

Pulse can show meaningful bond updates, recovered relationships, auto-formed relationships, twist activity, or an occasional heartbeat during quiet stretches.

Display modes:

**SUBTLE • STANDARD • DETAILED • OFF**

---

## ⚙️ Config Story Card

Crossed Wires automatically creates **Crossed Wires Config**.

The Entry contains editable settings; the Notes explain what each setting does.

Major controls include relationship pacing, observation gates, auto formation, NPC agency, consent guard, scenario adaptation, relationship roles, twists, romance, adult themes, NPC-to-NPC tracking, long-term memory, Character Card Notes, visible Pulse, resilience, emotional inertia, cast balancing, and context limits.

---

# 📟 Slash Commands

All public commands use one reliable root: **`/wire`**.

### Inspect

```text
/wire NAME
/wire all
/wire status
/wire profile
/wire twists
/wire cast
/wire agency
/wire test
```

### Relationship recovery / cards

```text
/wire rescan
/wire cards
```

### Pulse

```text
/wire pulse
/wire pulse on
/wire pulse off
/wire pulse subtle
/wire pulse standard
/wire pulse detailed
/wire pulse test
```

### Cast management

```text
/wire pin NAME
/wire unpin NAME
/wire mute NAME
/wire unmute NAME
/wire forget NAME
```

### Corrections

```text
/wire merge ALIAS | CANONICAL
/wire role NAME | ROLE
/wire role FROM | TO | ROLE
/wire unlockrole NAME
/wire age NAME | adult
/wire age NAME | minor
/wire age NAME | unknown
/wire unlockage NAME
```

### Twists

```text
/wire spark
/wire spark small
/wire spark medium
/wire spark major
```

### Help

```text
/wire help
```

Legacy shortcut forms remain accepted internally for older adventures, but `/wire ...` is the supported public command format.

---

## 🧪 Built-In Self Check

Run:

```text
/wire test
```

It checks the slash parser, relationship/twist/role registries, Config health, Config Story Card detection, persistent-state structure, and agency/consent settings.

`/wire agency` shows the current agency settings, latest detected player social attempt, and latest clear refusal/boundary outcome when available.

---

## 👤 Player Agency

Crossed Wires tracks:

**NPC → YOU**

and optionally:

**NPC → NPC**

It does **not** create a `YOU → NPC` emotional ledger.

The player's feelings, intentions, dialogue, consent, commitments, and decisions remain controlled by the player.

---

## ⚡ Crossed Wires

**Characters should not just remember facts. They should remember people — who earned their trust, who crossed a line, who kept showing up, who they rely on, and who they are willing to say no to.**
