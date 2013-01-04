# Project F
[http://project--f.blogspot.com/](http://project--f.blogspot.com/)

## About
The core component of Project F used to build browser based fighter games.
F.core is not an engine. F.core is a set of simple systems that can be used to build an engine.

## Components and features

### sprite
- display and control sprites on page using `<div>` and `<img>` tag
- **not** using canvas for sprite animations
- support CSS 2d transform

### animator
- animate sprites
- support multiple animation sequence on the same image

### controller
- controllers for multiple players on the same keyboard
- maintains a table of key states of interest
- generate key events for 'child' controllers
- buffered mode: buffer inputs and fetch only once a loop
- never drops keys

### combodec
- combo detector
- maintains a clean sequence of pressed keys and fire events when combo is detected
- King of Fighter style combos
- eliminating repeated keys

### controller-recorder
- record and playback activity of a controller
- useful in game demo and testing

### states
- nested state transition system, a Hierarchical State Machine ( HSM )
- intuitive state machine definition syntax
- simple (not UML compatible) yet powerful enough for interactive gaming
- reduces logical bugs if used as a programming paradigm

### states_simple
- non-nested state transition system, a traditional finite state machine ( FSM )

### collision
- performing rectangle-rectangle, triangle-triangle, circle-circle, line-line intersect tests
and point in rectangle test

### graph
- mapping(hashing) objects in finite 2d space into a 2d array

### math
- some useful vector operations

### in general
- [requirejs](http://requirejs.org/) compatible

## License
Generally has complete freedom except for profit- making. For exact terms see [license](http://project--f.blogspot.hk/2012/05/license.html).
