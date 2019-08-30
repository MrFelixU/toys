# Data

Each territory needs:
- a list of its immediate neighbours (alternatively, this could be a global list
  but it seems nicer to allow the map-builder to define these inline)
- current number of armies
- the current ruler
- to know which continent it belongs to

Each player needs:
- an id
- an icon or some identifying feature to mark their territories clearly (could
  be a placeholder shape defined as part of the territory)

The game needs to:
- know whose turn it is
- update each territory's info after a move
- keep track of each player's info

# Behaviour

There should be different "phases":

1. place your fresh armies
1. attack some neighbours
1. mobilise troops


# Interface

The screen needs:

- a list of players with their current status and stats
- the map with the territory info
- the dice and phase interface
