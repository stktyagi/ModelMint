// Football (soccer ball) model with classic black and white pattern
// Standard FIFA size 5 ball diameter: 220mm
// Scaled down to 90%: 198mm diameter (99mm radius)

$fn = 100; // Smooth sphere

// Main white sphere
color("white")
sphere(r = 99);

// Black pentagon pattern
// Classic football has 12 black pentagons and 20 white hexagons

module black_pentagon() {
    color("black")
    linear_extrude(height = 1)
    circle(r = 12, $fn = 5);
}

// Position 12 black pentagons on the sphere surface
// Top pentagon
color("black")
translate([0, 0, 99]) 
sphere(r = 12, $fn = 5);

// Upper ring (5 pentagons)
for (i = [0:4]) {
    color("black")
    rotate([0, 0, i * 72]) 
    rotate([26.57, 0, 0]) 
    translate([0, 0, 99]) 
    sphere(r = 12, $fn = 5);
}

// Middle upper ring (5 pentagons rotated)
for (i = [0:4]) {
    color("black")
    rotate([0, 0, i * 72 + 36]) 
    rotate([63.43, 0, 0]) 
    translate([0, 0, 99]) 
    sphere(r = 12, $fn = 5);
}

// Middle lower ring (5 pentagons rotated)
for (i = [0:4]) {
    color("black")
    rotate([0, 0, i * 72 + 36]) 
    rotate([116.57, 0, 0]) 
    translate([0, 0, 99]) 
    sphere(r = 12, $fn = 5);
}

// Lower ring (5 pentagons)
for (i = [0:4]) {
    color("black")
    rotate([0, 0, i * 72]) 
    rotate([153.43, 0, 0]) 
    translate([0, 0, 99]) 
    sphere(r = 12, $fn = 5);
}

// Bottom pentagon
color("black")
rotate([180, 0, 0]) 
translate([0, 0, 99]) 
sphere(r = 12, $fn = 5);
