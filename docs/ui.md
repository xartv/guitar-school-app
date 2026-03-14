# UI Specification

## Main Layout

The application shows a Program containing Levels.

Levels are displayed as collapsible accordions.

Structure:

Program

Level 1 Skill Card Skill Card

Level 2 Skill Card

------------------------------------------------------------------------

## Level Accordion

Levels use the shadcn/ui Accordion component.

Example:

Level 1\
▼

Skill Card\
Skill Card\
Skill Card

-   Add Skill

------------------------------------------------------------------------

## Skill Card

Skill Card is the primary UI element of the application.

Example layout:

┌──────────────────────────┐ Alternate Picking
──────────────────────────

Progress ☑ Week 1 ☑ Week 2 ☐ Week 3 ☐ Week 4

Video Lessons youtube.com/...

Notes markdown text

\[ Edit \] └──────────────────────────┘

------------------------------------------------------------------------

## Skill Card Structure

SkillCard

SkillHeader\
SkillProgress\
SkillVideos\
SkillNotes

------------------------------------------------------------------------

## SkillHeader

Displays the skill title and edit controls.

Example:

Alternate Picking ✏️ Edit

------------------------------------------------------------------------

## SkillProgress

Represents four stages of practice progress.

Example:

\[✓\] Week 1\
\[✓\] Week 2\
\[ \] Week 3\
\[ \] Week 4

Alternative display:

Progress Bar

██████░░░░\
2 / 4 weeks

------------------------------------------------------------------------

## SkillVideos

Displays a list of YouTube learning resources.

Example:

Video Lessons

▶ https://youtube.com/...

▶ https://youtube.com/...

-   Add video

Future improvement: embedded YouTube player.

------------------------------------------------------------------------

## SkillNotes

Markdown text area for notes.

Example:

Notes

Practice with metronome.

Start at 60 bpm\
Increase to 120 bpm

Recommended library for rendering:

react-markdown

------------------------------------------------------------------------

## Styling Rules

Use:

-   shadcn/ui components
-   CSS Modules

Card visual style:

border-radius: 12px\
padding: 16px\
soft shadow

Example styling concept:

bg-card\
border\
hover:shadow-md

------------------------------------------------------------------------

## Skill Completion UI

When a skill is fully completed:

Card becomes highlighted.

Example:

border-green-500\
bg-green-50

------------------------------------------------------------------------

## Level Completion Feedback

When all skills in a level are completed:

Display message:

🎉 Level completed\
Next level created automatically

------------------------------------------------------------------------

## MVP UI Structure

Program

▼ Level 1

[Skill Card](#skill-card)\
[Skill Card](#skill-card)

-   Add Skill

▼ Level 2

[Skill Card](#skill-card)

------------------------------------------------------------------------

## UX Enhancements

Optional improvement: add icons to skills.

Examples:

Alternate Picking 🎸\
Palm Muting 🤚\
Sweep Picking ⚡

Icons make the interface more engaging and easier to scan.
