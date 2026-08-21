---
status: draft
---

# 盲盒旅行 — Blind Box Travel (Module 2)

## Problem Statement

Taipei MRT station neighborhoods contain many quality local businesses and hidden scenic spots that riders never discover because they always travel the same routes. Station-adjacent merchants lack foot traffic from non-local riders. The existing MRT point system (including points earned via Module 1) has no compelling spend mechanism that drives real-world exploration and merchant visits.

## User / Persona

| Persona | Description |
|---------|-------------|
| Commuter explorer | Regular MRT rider who has accumulated points (e.g., from Module 1) and wants a fun reason to explore unfamiliar stations on weekends or after work |
| Tourist adventurer | Visitor to Taipei looking for local, non-guidebook experiences; willing to pay points for curated surprise recommendations |

## Core Mechanic

| Step | Detail |
|------|--------|
| Purchase | User spends MRT points to buy one blind box (cost: 30 pts). |
| Reveal | System randomly selects: (a) a destination MRT station, (b) a hidden spot or merchant near that station, (c) a guaranteed merchant discount coupon. Presented with a dramatic unboxing animation. |
| Re-roll (optional) | User may spend additional points (15 pts) to re-roll for a different destination. Each re-roll costs points; no theme filtering. |
| Travel | User physically travels to the revealed MRT station. |
| Station scan | User scans a QR code at the destination station (simulated in demo) to prove arrival. |
| Merchant scan | User scans a QR code at the merchant/spot (simulated in demo) to redeem the discount coupon. |
| Reward | Guaranteed: merchant discount activated. Probabilistic: 20% chance of earning 50 bonus pts. |

## Success Criteria (Hackathon Demo)

- Full flow walkable end-to-end: purchase → reveal → simulate station scan → simulate merchant scan → reward
- Reveal animation delivers a clear moment of surprise and delight (the emotional peak)
- Re-roll option is demonstrable
- Realistic mock data: real Taipei MRT station names, plausible merchant names and discount amounts
- Demo script completable in under 2 minutes by a first-time judge with no guidance

## Scope (In)

- Module 2 UI: purchase screen, reveal/unboxing animation screen, destination detail card, station scan screen, merchant scan screen, reward summary screen
- Business logic: box purchase (point deduction), random destination selection, re-roll, station QR scan simulation, merchant QR scan simulation, reward calculation (guaranteed discount + probabilistic bonus points)
- Mock data: pool of at least 8 destination stations with associated hidden spots and merchant offers
- Point balance integration: reads from and writes to the same point balance used by Module 1
- API contract spec for: purchaseBox, rerollBox, scanStation, scanMerchant, claimReward

## Scope (Out)

- Real payment or point settlement with MRT systems
- Merchant back-office / CMS for managing offers
- Map or geolocation integration
- Social sharing features
- Coupon expiry enforcement or countdown timers
- Modules 1, 3, 4 (each has its own PRD)
- Native app development
- Backend infrastructure / production deployment

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Insufficient points to purchase | Purchase button disabled; message shows required balance |
| Insufficient points to re-roll | Re-roll button disabled |
| User purchases but never travels | Coupon remains in "unused" state; no penalty, no expiry enforced |
| Same destination rolled twice | Allowed; pure random with replacement |
| Bonus points + discount both apply | Both granted independently; bonus points added to shared balance |
| Station scan attempted without active box | Scan screen inaccessible without an active box in state |

## User Stories

### US-1: Purchase Blind Box
As a rider with accumulated MRT points, I want to spend points to buy a blind box so that I can discover a surprise destination.

- WHEN the user taps "Buy Blind Box" AND their point balance >= box cost, THEN the system SHALL deduct the box cost from the point balance AND transition to the reveal screen.
- WHEN the user taps "Buy Blind Box" AND their point balance < box cost, THEN the system SHALL display "Insufficient points" AND keep the user on the purchase screen.

### US-2: Reveal Destination (Unboxing)
As a rider who purchased a blind box, I want to see a dramatic reveal animation showing my random destination so that I feel surprised and excited.

- WHEN the purchase succeeds, THEN the system SHALL play a reveal animation lasting 2–4 seconds AND display: (a) destination station name, (b) hidden spot or merchant name, (c) guaranteed discount description.
- WHEN the reveal completes, THEN the system SHALL display a "Re-roll" button with its point cost AND a "Let's Go!" confirmation button.

### US-3: Re-roll Destination
As a rider who does not like the revealed destination, I want to spend additional points to get a different random destination.

- WHEN the user taps "Re-roll" AND their point balance >= re-roll cost, THEN the system SHALL deduct re-roll cost, randomly select a new destination, AND replay the reveal animation.
- WHEN the user taps "Re-roll" AND their point balance < re-roll cost, THEN the system SHALL display "Insufficient points for re-roll" AND keep the current destination.

### US-4: Station QR Scan
As a rider who has arrived at the destination station, I want to scan a QR code to prove I traveled there.

- WHEN the user taps "Scan Station QR" on the destination detail screen, THEN the system SHALL simulate a successful scan AND mark station-verified as true AND enable the merchant scan step.
- WHILE station-verified is false, THEN the system SHALL keep the merchant scan button disabled.

### US-5: Merchant QR Scan and Reward
As a rider who has verified arrival at the station, I want to scan the merchant QR code to redeem my discount and potentially win bonus points.

- WHEN the user taps "Scan Merchant QR" AND station-verified is true, THEN the system SHALL simulate a successful merchant scan AND activate the guaranteed discount AND run the probabilistic bonus-point check.
- WHEN the bonus-point check succeeds, THEN the system SHALL add bonus points to the shared balance AND display the bonus amount with a celebratory animation.
- WHEN the bonus-point check fails, THEN the system SHALL display only the discount confirmation with no bonus.

## Prototype Page Requirements

| Page ID | Name | Description |
|---------|------|-------------|
| P2-1 | Blind Box Purchase | Point balance display; box cost; "Buy" button; insufficient-points guard |
| P2-2 | Unboxing Reveal | Animated reveal of station + spot + discount; re-roll button with cost; "Let's Go!" confirm |
| P2-3 | Destination Detail | Station name, spot description, discount info; "Scan Station QR" CTA |
| P2-4 | Station Scan | Simulated QR scan interaction; success confirmation |
| P2-5 | Merchant Scan & Reward | Simulated QR scan; discount activation; bonus points animation (if won); reward summary with updated balance |
