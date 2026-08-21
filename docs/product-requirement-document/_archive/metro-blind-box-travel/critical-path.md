# Critical Path — metro-blind-box-travel

## Classification

**Brand New** — Module 2 has its own independent user journey. It does not extend or supersede Module 1's `commit → predict → verify → settle → combo` path. The only shared surface is the MRT point balance (Module 1 earns points; Module 2 spends them).

## Primary Critical Path

```
purchase → reveal → (optional re-roll) → travel → scan-station → scan-merchant → reward
```

### Journey (Gherkin)

```gherkin
Feature: Blind Box Travel — full redemption journey

  Scenario: Happy path — purchase, reveal, travel, scan, bonus win
    Given a rider has at least 30 MRT points in their balance
    When they tap "Buy Blind Box" on the Module 2 home screen
    Then the system deducts 30 points and plays the unboxing reveal animation
    And the revealed destination station, hidden spot, and merchant discount are displayed

    When the rider taps "Let's Go!" to confirm the destination
    Then the destination detail card is shown with a "Scan Station QR" button

    When the rider simulates scanning the station QR code
    Then the station-verified flag is set and the "Scan Merchant QR" button is enabled

    When the rider simulates scanning the merchant QR code
    Then the guaranteed discount is activated
    And the system runs the probabilistic bonus-point check
    And (if won) bonus points are added to the balance with a celebratory animation

    When the rider taps "Back to Home"
    Then their updated point balance is visible on the Module 2 home screen

  Scenario: Re-roll path
    Given a rider has at least 45 MRT points (30 box + 15 re-roll)
    When they purchase a blind box and see the reveal
    And they tap "Re-roll" (costs 15 points)
    Then a new random destination is selected and the reveal animation replays

  Scenario: Insufficient points for purchase
    Given a rider has fewer than 30 MRT points
    When they view the Module 2 home screen
    Then the "Buy Blind Box" button is disabled and an insufficient-points message is shown
```

## Success Metric

The happy-path journey must be walkable by a first-time hackathon judge with no guidance in under 2 minutes.
