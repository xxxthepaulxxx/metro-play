# Critical Path: metro-loyalty-tier

**Classification:** EXTENDS — Module 1 critical path

## Summary

The loyalty tier system extends the existing Module 1 off-peak prediction flow by adding a post-settle `tier-check` step. The tier-check reads updated cumulative points after settlement, evaluates tier thresholds, applies the passive multiplier to the just-settled reward, and (if a tier-up occurred) fires the entrance-only unlock animation.

## Journey (Gherkin)

```gherkin
Feature: Loyalty Tier Check

  Background:
    Given the user has cumulative points just below the Gold threshold (499 pts)
    And the user is currently at Silver tier

  Scenario: Tier-up after a winning session
    Given the user completes a session earning 10 bonus points (total 509 pts)
    When the settlement card is shown
    Then the settlement card displays "Gold 1.5x applied" as a line item
    When the user taps "確認等級"
    Then the Gold tier badge is displayed
    And an entrance-only unlock animation fires
    And the progress bar shows the user's position within the Gold tier

  Scenario: No tier change after a session
    Given the user's cumulative points remain below Silver threshold after settlement
    When the user taps "確認等級"
    Then the current tier badge and progress bar are shown
    And no unlock animation fires

  Scenario: Already at Platinum (max tier)
    Given the user is at Platinum tier (1000+ cumulative pts)
    When the user taps "確認等級"
    Then the Platinum badge is displayed
    And the progress bar shows "MAX"
    And no unlock animation fires
```
