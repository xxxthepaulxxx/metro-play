# Critical Path: metro-city-rpg-unlock

**Classification:** BRAND NEW

## Summary

The City RPG Unlock module introduces a standalone adventure map where riders explore Taipei districts by accumulating station visits. The critical path is: open map, see district grid, tap a district, view station-level progress, trigger unlock at threshold, see animation + points reward, return to map with updated state.

## Journey (Gherkin)

```gherkin
Feature: City RPG District Unlock

  Background:
    Given the adventure map shows 6 Taipei districts
    And 信義探險區 is pre-seeded with 3 of 4 required stations visited (one away from unlock)
    And 大安文青區 is pre-seeded as fully unlocked
    And the remaining districts have partial or zero progress

  Scenario: View adventure map
    When the user opens the adventure map
    Then all 6 districts are displayed in a grid
    And unlocked districts appear fully lit with a checkmark
    And locked districts appear dimmed with a lock icon
    And overall progress shows "1 / 6 districts unlocked" and total bonus earned

  Scenario: View district detail
    When the user taps 信義探險區
    Then a detail view shows the list of 6 stations
    And 3 stations are marked as visited
    And the progress bar shows "3 / 4"
    And the bonus reward "50 pts" is displayed as a preview

  Scenario: Trigger district unlock
    Given 信義探險區 has 3 of 4 stations visited
    When the user's 4th station visit is recorded (mock trigger in demo)
    Then the progress bar fills to "4 / 4"
    And a one-shot unlock animation fires (entrance-only)
    And 50 bonus points are credited to the wallet
    And the district state changes to "已解鎖"

  Scenario: Return to map after unlock
    Given 信義探險區 was just unlocked
    When the user returns to the adventure map
    Then 信義探險區 appears fully lit with a checkmark
    And overall progress updates to "2 / 6 districts unlocked"
    And total bonus earned reflects the newly credited points

  Scenario: All districts already unlocked
    Given all 6 districts have been unlocked
    When the user opens the adventure map
    Then all districts appear fully lit
    And overall progress shows "6 / 6 districts unlocked"
    And no special completion badge or animation is shown
```
