# Shared Commands

Currently each card has a number of commands, e.g. Copy link, Delete, Close,
Zoom. This has the benefit of being close to the user's locus of attention, i.e.
the card that the user wants to perform the command on.

But what happens when the user wants to perform a command on multiple cards at
once, such as copying multiple links at once, or creating a new workspace with
multiple cards from the current workspace.

One solution is to remove the commands from the individual cards, and create a global command menu. This already exists to some extent when you are zoomed into a workspace: At top there is a command menu with a single command: Zoom out.

With a global command menu, you would first select one or more cards, and then
select the command to apply to them. This means that there is a single way to
perform commands, regardless of whether you want to perform it on one or more
cards. Additionally, this makes implementing keyboard shortcuts very straight forward as well.

## Focus vs. selection

There could be some value in having both a concept of a selection and a focus,
and those not being the same. E.g. you could have a note in focus, while
changing the selection to another note, to copy the link and paste it in the
note that is focussed.

But I fear that this may be a difficult model to understand. Instead, whatever
card was selected last, gets focus.

## Implementation

Each workspace will have a `selections` key with an array of paths to currently
selected cards. Storing it in the workspace means that you can zoom in/out
without losing your selection on the top level workspace.

Focusing a card, either by clicking it or tabbing into it, will remove any
existing selections and set the card as the only selection.

Ctrl/Cmd-Click will append the card to the current selections.

Commands that can work on multiple cards (Zoom, Close, Copy link) will take a
path to a Workspace, and then apply the command to any cards that are currently
selected.
