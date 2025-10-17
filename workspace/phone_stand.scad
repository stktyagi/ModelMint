// Phone Stand with Base, Backplate, Front Lip, and Captain America Shield
// Base: 80mm wide, 100mm deep, 6mm thick
// Backplate: 80mm wide, 70mm tall, 6mm thick, tilted 15 degrees back
// Front Lip: 80mm wide, 10mm tall, 6mm thick
// Shield: Carved into the base

// Base with shield design carved in
difference() {
    cube([80, 100, 6]);
    
    // Carve the shield design - centered on base
    translate([40, 50, 4]) {
        // Outer ring
        difference() {
            cylinder(h=2.5, r=30, $fn=100);
            cylinder(h=2.5, r=25, $fn=100);
        }
        
        // Middle ring
        difference() {
            cylinder(h=2.5, r=20, $fn=100);
            cylinder(h=2.5, r=15, $fn=100);
        }
        
        // Inner ring
        difference() {
            cylinder(h=2.5, r=10, $fn=100);
            cylinder(h=2.5, r=5, $fn=100);
        }
        
        // Center star
        linear_extrude(height=2.5)
            for(i = [0:4]) {
                rotate([0, 0, i*72])
                    polygon([[0, 0], [3, 8], [1.5, 3], [-1.5, 3], [-3, 8]]);
            }
    }
}

// Backplate - positioned at the back edge and tilted 15 degrees
translate([0, 100, 6])
    rotate([-15, 0, 0])
        cube([80, 6, 70]);

// Front Lip - along the front edge
translate([0, 0, 6])
    cube([80, 6, 10]);
