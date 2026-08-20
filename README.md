⚡ CROSSED WIRES v3 — Relationship Drama Engine for AI Dungeon

I’ve basically rebuilt Crossed Wires after testing it against longer adventures. The goal is still the same: relationships should actually matter instead of an NPC forgetting a betrayal 10 turns later or becoming your soulmate because you were nice twice.

This isn’t a generic NPC autonomy script. It’s made specifically for romance, friendships, rivalries, messy friend groups, dating stories, soap-opera drama, court intrigue, superhero relationship drama, reality-show chaos etc.

❤️ 11 separate relationship pressures
• Trust
• Affection
• Respect
• Loyalty
• Openness
• Attachment
• Attraction
• Jealousy
• Resentment
• Fear
• Tension

Relationships are directional. Mara → YOU can be completely different from John → Mara, and Mara → John can differ from John → Mara. The script never creates YOU → NPC stats, so it doesn’t decide what your character feels.

🧠 Relationships have actual continuity

The AI identifies meaningful social events, but JavaScript owns the numbers and persistence. Support, honesty, vulnerability, flirting, dates, promises, confessions, commitment, rejection, jealousy, lies, betrayal, boundaries, breakups, reconciliation, infidelity, marriage, sacrifice and loads more all affect the relationship differently.

A relationship can be affectionate AND resentful. Someone can still be loyal while furious with you. Attraction can survive distrust. It doesn’t squash everything into one “likes you 72/100” stat.

Major betrayal, abandonment and boundary violations can also leave scars, so one apology doesn’t magically fix everything.

⏳ No instant soulmates

New NPCs have to survive an observation period before the engine strongly guides their relationship. By default that means 3 turns AND 2 appearances. Early impressions count, but at reduced strength.

You can also choose SLOW, BALANCED or FAST relationship pacing. SLOW is the default because I wanted long scenarios to actually have room for slow burns.

📈 Relationship trajectory

Crossed Wires now works out whether a bond is forming, warming, cooling, steady or volatile, and it notices unresolved stuff like:

• betrayal that still needs repairing
• breakup feelings that aren’t actually gone
• relationship strain
• jealousy/exclusivity problems
• incompatibility
• chemistry in an undefined relationship
• guardedness and trust issues

🎭 Much better twist system

The twist engine is relationship-aware instead of just throwing random drama at the story.

Possible pressure includes confessions, mixed signals, old flames, triangles, rumours, secret relationships, friend-group splits, family/friend disapproval, loyalty tests, career or distance problems, jealousy, breakups, reconciliation chances, proposal/cohabitation pressure, temptation, infidelity suspicion, adult relationship aftermath, parenthood complications, major secrets and a Wild Card that invents something based on the actual relationship history.

There are five modes:
OFF / GROUNDED / DRAMATIC / WILD / UNHINGED

It also has pair cooldowns, repeated-twist cooldowns and a “recent drama” check so it doesn’t stack five disasters in a row just because RNG hates you 😂

You can force a twist too:
`!spark`
`!spark small`
`!spark medium`
`!spark major`

If there isn’t an eligible relationship yet, the forced twist stays armed instead of disappearing.

🔞 Adult relationship themes

Optional adult-cast mechanics cover consensual intimacy, attraction, commitment, jealousy, temptation, cheating, messy/toxic dynamics, breakup aftermath and parenthood-related complications.

The relationship engine keeps intimacy non-explicit/fade-to-black and focuses on the consequences, expectations, consent, boundaries and emotional fallout.

It also has stronger age gating now. NPCs explicitly under 18 are marked as minors and excluded from mature mechanics, and an under-18 Age placeholder overrides the player-adult config.

🪪 Character Card aliases finally merge properly

If the story knows somebody as “Mara” and later her Character Card establishes “Mara Voss, Mara”, Crossed Wires merges the old history into Mara Voss instead of accidentally creating two relationship records.

⚙️ Built for long adventures

This was one of the biggest v3 changes:

• relationship ledger increased from 180 → 2500 events
• indexed relationship lookups instead of rescanning the full ledger for every pair
• retry/regenerate replaces same-turn relationship evidence instead of stacking both versions
• undo removes relationship history from deleted future turns
• context only includes relationships relevant to the current scene
• live context headroom is respected
• append-only cache-compatible Context tab for AI Dungeon’s newer cache-efficient context support

If there isn’t enough context room for the full tracking protocol, it shrinks itself instead of chopping up the existing story context.

⚙️ Config Story Card

The script automatically creates a Crossed Wires Config card. You can change pacing, observation time, context budget, twist chance/mode/cooldowns, romance, NPC-to-NPC tracking, adult themes, infidelity, breakups, parenthood, toxic drama etc. while the adventure is running.

📊 Commands

`!wire NAME` — inspect one character
`!wires` — show tracked relationships
`!wiretwists` — recent twist history
`!wirestatus` — engine/config status
`!spark [small/medium/major]` — force a twist
`!wireforget NAME` — remove a mistaken/retired NPC and their tracked history
`!wirehelp` — help

All the CW machine tags are stripped before the output reaches you, so normal gameplay still just looks like a normal story.

I’m mainly interested in seeing how it holds up in really long relationship-heavy scenarios now. If anyone manages to create an absolutely cursed relationship web on UNHINGED, I want to hear about it 😂
