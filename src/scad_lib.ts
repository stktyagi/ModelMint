export const SCAD_LIBRARY = `
// --- STANDARD LIBRARY (INJECTED) ---
$fn = 100; 

// 1. A PERFECT TUBE
module Tube(height, radius, wall, center = false) {
    difference() {
        cylinder(h = height, r = radius, center = center);
        translate([0, 0, center ? 0 : wall])
            cylinder(h = height + 1, r = radius - wall, center = center);
    }
}

// 2. A ROUNDED BOX
module SoftBox(size, radius) {
    minkowski() {
        cube(size - [radius*2, radius*2, radius*2], center=true);
        sphere(r=radius);
    }
}

// 3. A PERFECT HANDLE (Improved)
// Sinks into the mug body and cleans up the inside
module ArcHandle(mug_radius, handle_radius, thickness, z_center) {
    
    translate([0, 0, z_center])
    difference() {
        // The Handle Ring
        translate([mug_radius - thickness/2, 0, 0])
        rotate([90, 0, 0])
        rotate_extrude(angle = 360)
            translate([handle_radius, 0])
            circle(d = thickness);
            
        // CLEANUP: Remove any handle bits that poke into the drink area
        // We cut with a cylinder slightly smaller than the mug's inner wall
        // Assuming mug wall is roughly 2-4mm, we subtract radius - 4
        cylinder(h=200, r=mug_radius - 4, center=true);
        
        // OPTIONAL: Cut the outer half if you want a "C" handle instead of a "D" handle
        // But for a standard mug, a full loop sunken in is strongest.
    }
}
`;