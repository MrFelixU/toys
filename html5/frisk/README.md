# Data

Each territory needs:
- a list of its immediate neighbours (alternatively, this could be a global list
  but it seems nicer to allow the map-builder to define these inline)
- current number of armies
- the current ruler

Each player needs:
- an id
- an icon or some identifying feature to mark their territories clearly (could
  be a placeholder shape defined as part of the territory)

The game needs to:
- know whose turn it is
- update each territory's info after a move
