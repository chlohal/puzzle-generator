# Puzzle Generator

This is a quick puzzle generator for my Product Design class. It's very messy code, but my teacher wanted to see it, so it's on GitHub!

- [hex-grid.js](./hex-grid.js) is a left-over from an earlier version. The puzzle *used* to have all its pieces made out of hexagons, but that didn't look good, so I didn't use it.
- [perlin.js](./perlin.js) is from a version where i used a Perlin algorithm to layout the pieces. This was a bad choice-- pieces were not the same size at *all*.
- [voronoi.js](./voronoi.js) is a library for [Voronoi diagrams](https://en.wikipedia.org/wiki/Voronoi_diagram). It was originally a browser library, but I modified it to work in Node. Currently, this uses Voronoi, along with an algorithm similar to [lightspeedstory.com](github.com/chlohal/lightspeedstory)'s "star field" generator, to make a puzzle.