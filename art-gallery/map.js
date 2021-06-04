// adapted by ASJ 6/6/20 from 
// https://github.com/hexahedria/math_198o_gallery/blob/master/index.html
// edited so that
// (1) clicks outside polygon add to the polygon
// (2) there is a preset collection of polygons
var DISTANCE_THRESHOLD = 10;

var width = 960,
    height = 500;

var background_square = [[0,0],[width,0],[width,height],[0,height]];
// var polygon = [[300,300],[600, 300],[450, 450]];
var polygons = [
  [[100,100],[400, 100],[250, 250]],
  [[100, 100], [353, 55.125], [400, 100], [381, 248.125], [153, 248]],
  [[119, 133], [76, 90], [162, 114], [164, 180], [337, 214], [115, 215]],
  [[125, 65], [177, 79], [364, 82.125], [415, 68], [367, 108], [269, 267], [176, 111]],
  [[115, 73], [340, 73], [340, 130], [180, 130], [180, 170], [300, 170], [300, 215], [115, 215]],
  [[136, 152], [177, 79], [281, 143.125], [358, 120], [410, 172], [389, 255.125], [341, 203.125], [190, 270.125], [202, 191], [149, 250]],
  [[115, 73], [340, 73], [340, 130], [180, 130], [180, 170], [300, 170], [299, 303], [216, 303.125], [216, 216.125], [115, 215]],
  [[115, 73], [269, 154], [152, 121], [152, 172], [300, 170], [284, 330], [134, 271.125], [258, 276.125], [261, 231.125], [115, 215]],
  // [[161,138.125],[157,72],[345,74],[203,97.125],[204,121.125],[326,136],[317,231.125],[286,230.125],[125,185.125],[285,201.125],[287,178]],
  [[159,44.125],[183,44],[202,65],[326,66.125],[325,146],[201,146.125],[200,177.125],[156,177.125],[157,147.125],[76,147.125],[76,125.125],[157,126.125],[157,97.125],[144,82.125],[144,62]],
    [[98,73],[216,73],[218,172.125],[410,173.125],[411,278.125],[386,278.125],[385,229.125],[363,229.125],[363,378.125],[292,379.125],[292,419.125],[245,419.125],[245,379.125],[177,379.125],[177,279.125],[143,279.125],[143,232.125],[116,232.125],[116,176.125],[98,176]]
];
var polygon;
setPolygon(0);
var polygon_is_good = true;

var guards = []; //[[450,375]];
var guard_vis = [];

var triangulation = [];

var dragguard = d3.behavior.drag()
        .on("drag", dragmove)
        .on("dragend",drag_removeguards);

var dragpoly = d3.behavior.drag()
        .on("drag", dragmove)
        .on("dragstart",drag_spawnpoly)
        .on("dragend",drag_removeguards);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

var background_path = svg.append("g").selectAll("path.background_path");
var polygon_path = svg.append("g").selectAll("path.polygon");
var triangulation_path = svg.append("g").selectAll("path.triangulation");
var guard_vis_path = svg.append("g").selectAll("path.guard_vis");
var polygon_verts = svg.append("g").selectAll("circle.polygon_v");
var guard_verts = svg.append("g").selectAll("circle.guard");
//////////////////////////
function setPolygon( indx )
{
  polygon = [];
  for ( var i = 0; i < polygons[indx].length; i++ )
    polygon.push(polygons[indx][i].slice());
}
function dragmove(d,i) {
  // console.log("Drag");
  d[0] += d3.event.dx;
  d[1] += d3.event.dy;

  if(d[0]<0) d[0]=0;
  if(d[0]>width) d[0]=width;
  if(d[1]<0) d[1]=0;
  if(d[1]>height) d[1]=height;

  d3.select(this).attr("transform", function(d,i){
    return "translate(" + d + ")"
  });
  triangulation = [];
  update();
}

function drag_removeguards(){
  var good = check_simple(polygon) && check_clockwise(polygon);
  if(!good) return;
  for (var i = 0; i < guards.length; i++) {
    var g = guards[i];
    if(!check_inside(g,polygon)){
      // console.log("Guard dragged out!");
      guards.splice(i,1);
      i--;
    }
  };
  update();
}

function drag_spawnpoly(d,i) {
  // console.log("Start");
  if(d3.event.sourceEvent.shiftKey){
    // console.log("Drag spawn!");
    var copy = d.slice();
    polygon.splice(i,0,copy);
  }
  update();
}



function click_to_remove(x, sourcearray, min){
  min = min | 0;
  x.on("click.to_rem", function(d,i){
    if (d3.event.defaultPrevented) return;
    if (sourcearray.length <= min) return;
    sourcearray.splice(i,1);
    update();
  });
}

function click_spawn_guard(x){
  // console.log("click spawn");
  x.on("click.spawn", function(d,i){
    if (d3.event.defaultPrevented) return;
    pos = d3.mouse(svg[0][0]);
    guards.push(pos);
    update();

  });
}

function click_spawn_poly(x){
  x.on("click.spawn", function(d,i){
    if (d3.event.defaultPrevented) return;
    pos = d3.mouse(svg[0][0]);

  // if outside the polygon, adding to the polygon
  if ( !check_inside(pos,polygon))
  {
    var copy = pos.slice();
    var closestPolyPoint = findClosestPolygonPoint( copy, polygon );
    // console.log( "closest index:" + closestPolyPoint );

    // if far enough away, add to the polygon
    if ( closestPolyPoint[1] >= DISTANCE_THRESHOLD )
    {
      // try inserting after this index
      polygon.splice(closestPolyPoint[0],0,copy);

      // if it caused an intersection
      if ( !check_simple( polygon) )
      {
        // console.log( "no longer simple!" );
        // undo the insertion
        polygon.splice(closestPolyPoint[0],1 );
        // and add it before
        polygon.splice((closestPolyPoint[0]+1)%polygon.length,0,copy);
      }
    }
    // console.log( "polygon sides: " + polygon.length );
    update();  
  }
});

}

/**
 * Given a polygon as a list of points and a query point,
 * find the index of the closest polygon point to the query and return it.
 */
function findClosestPolygonPoint( query, poly )
{
  var minDistance = Number.MAX_VALUE;
  var minIndex = -1;
  for ( var i = 0; i < poly.length; i++ )
  {
    var dist = Math.hypot(poly[i][0]-query[0],poly[i][1]-query[1]);
    if ( dist < minDistance )
    {
      minDistance = dist;
      minIndex = i;
    }
  }
  return [minIndex,minDistance];
}

function determinant(a,b,c,d){
  return a*d - b*c;
}

function intersect_edges(a1,a2,b1,b2){
  // s a1x + (1-s) a2x = t b1x + (1-t) a2x
  var a = a1[0];
  var b = a2[0]-a1[0];
  var c = b1[0];
  var d = b2[0]-b1[0];
  var e = a1[1];
  var f = a2[1]-a1[1];
  var g = b1[1];
  var h = b2[1]-b1[1];

  var det = determinant(b,-d,f,-h);
  var a_time = determinant(c-a,-d,g-e,-h)/det;
  var b_time = determinant(b,c-a,f,g-e)/det;

  return {a:a_time,b:b_time};
}

function vector_angle(x1,y1,x2,y2){
  var dot = x1*x2 + y1*y2;
  var cross_z = x1*y2 - y1*x2;
  var angle = Math.atan2(cross_z,dot);
  return angle;
}

function check_simple(poly){
  // STUB: Should return true if polygon is simple
  // (doesn't cross itself)
  for (var i = 0; i < poly.length; i++) {
    var v1 = poly[i];
    var v2 = poly[(i+1)%poly.length];
    var j = 0;
    if(i==poly.length-1) j=1;
    for (; j < i-1; j++) {
      var v3 = poly[j];
      var v4 = poly[(j+1)%poly.length];
      var ires = intersect_edges(v1,v2,v3,v4);
      if(!(ires.a < 0 || ires.a > 1 || ires.b < 0 || ires.b > 1)){
        return false;
      }
    }
  };
  return true;
}

function check_clockwise(poly){
  var cum_ang = 0;
  for (var i = 0; i < poly.length; i++) {
    var v1 = poly[i];
    var v2 = poly[(i+1)%poly.length];
    var v3 = poly[(i+2)%poly.length];
    cum_ang += vector_angle(v2[0]-v1[0],v2[1]-v1[1],v3[0]-v2[0],v3[1]-v2[1]);
  };
  // console.log(cum_ang);
  return cum_ang > 0;
}

function check_inside(point,poly){
  // Return true if the [x,y] point is in the polygon, which
  // is guaranteed to be simple.
  var EPSILON = 0.000001;
  var end = [point[0], 2*height];
  var num_intersects = 0;
  for (var i = 0; i < poly.length; i++) {
    var v1 = poly[i];
    var v2 = poly[(i+1)%poly.length];
    // bump them if they are in line with the guard
    if(v1[0]==point[0]) v1=[v1[0]+EPSILON, v1[1]];
    if(v2[0]==point[0]) v2=[v2[0]+EPSILON, v2[1]];

    var ires = intersect_edges(point,end,v1,v2);
    if(ires.a>=0 && ires.b >= 0 && ires.b < 1){
      num_intersects++;
    }
  };
  // console.log(num_intersects);
  return (num_intersects%2) == 1;
}


function generate_guard_vis(guard,poly){
  // STUB: Given a [x,y] guard position (guaranteed inside the polygon),
  // should return a polygon of the form
  // [[x1,y1],[x2,y2],...]
  // that represents the guard's visibility as a simple,
  // clockwise-oriented polygon
  var visPoly = [];
  var vertexAngle = [];
  for(var i = 0; i < poly.length; i++) {
    vertexAngle.push([poly[i],vector_angle(poly[0][0]-guard[0],poly[0][1]-guard[1],
      poly[i][0]-guard[0],poly[i][1]-guard[1]),i]);
  }

  vertexAngle.sort(function(a,b){return a[1]-b[1]});
  var vertexByAngle = [];

  for(var i = 0; i < vertexAngle.length;i++) {
    vertexByAngle.push([vertexAngle[i][0],vertexAngle[i][2]]);
  }

  for(var i = 0; i < vertexByAngle.length;i++) {
    var trackVertex = Infinity;

    var guardRay = vertexByAngle[i][0];

    var addForward = false;
    var addBackward = false;
    var polyIndex = vertexByAngle[i][1];
    // console.log(polyIndex);
    // console.log((polyIndex-1+poly.length)%poly.length);
    var ang1 = vector_angle(guardRay[0]-guard[0],guardRay[1]-guard[1],
      poly[(polyIndex-1+poly.length)%poly.length][0]-poly[polyIndex][0],
      poly[(polyIndex-1+poly.length)%poly.length][1]-poly[polyIndex][1]);
    var ang2 = vector_angle(guardRay[0]-guard[0],guardRay[1]-guard[1],
      poly[(polyIndex+1)%poly.length][0]-poly[polyIndex][0],
      poly[(polyIndex+1)%poly.length][1]-poly[polyIndex][1]);



    for(var j = 0; j < poly.length; j++) {
      var v1 = poly[j];
      var v2 = poly[(j+1)%poly.length];

      if(v1 === vertexByAngle[i][0] || v2 === vertexByAngle[i][0]) {
        continue;
      }



      var intersection = intersect_edges(guard,guardRay,v1,v2);

      if((intersection.a > 0) &&(intersection.b > 0) && (intersection.b < 1)) {
        if(intersection.a < trackVertex) {
          trackVertex = intersection.a
        }
      }
    }
    if(trackVertex < 1) {
      visPoly.push([trackVertex*(guardRay[0]-guard[0])+guard[0],
        trackVertex*(guardRay[1]-guard[1])+guard[1]]);  
    }
    else if((ang1 > 0) && (ang2 > 0)) {
      visPoly.push([trackVertex*(guardRay[0]-guard[0])+guard[0],
        trackVertex*(guardRay[1]-guard[1])+guard[1]]);
      visPoly.push(guardRay);
    }
  
    else if((ang1 < 0) && (ang2 < 0)) {
      visPoly.push(guardRay);
      visPoly.push([trackVertex*(guardRay[0]-guard[0])+guard[0],
        trackVertex*(guardRay[1]-guard[1])+guard[1]]);
    }

    else if((ang1 > 0) === (ang2 < 0)) {
      visPoly.push(guardRay);
    }
    
  }
  return visPoly;

}

function trim_ear(poly){
  // Returns [ear, newPoly] where ear is a triangle
  // and newPoly is poly with the ear removed

  var ear = [];
  var newPoly = [];

  // The case where the ear is [poly[0], poly[1], poly[length-1]]
  // is awkward. Luckily, the polygon has two ears, so we can
  // just avoid checking this triangle. This means the for loop
  // doesn't hit the first and last elements.
  for (var i = 1; i < poly.length - 1; i++) {
    var maybe_ear = [];
    maybe_ear.push(poly[i - 1]);  // Left corner
    maybe_ear.push(poly[i]);      // Ear tip
    maybe_ear.push(poly[i + 1]);; // Right corner
    var maybe_ear_angle = vector_angle(
            poly[i][0] - poly[i-1][0], poly[i][1] - poly[i-1][1],
            poly[i+1][0] - poly[i][0], poly[i+1][1] - poly[i][1]);

    // Check whether the candidate is actually an ear.
    for (var j = 0; j < poly.length; j++) {
      // If a vertex is inside the ear candidate and
      // it does not belong to the ear candidate OR
      // if we have an "inverse ear" we need to break
      // and try a new candidate ear
      if ((j !== i - 1 &&
           j !== i &&
           j !== i + 1 && 
           check_inside(poly[j], maybe_ear)) ||
           maybe_ear_angle < 0) {
        break;
      }
    }
    if (j === poly.length) {
      // If we get here, the candidate is an ear.
      ear = maybe_ear;
      newPoly = poly.slice();
      newPoly.splice(i, 1); // Remove the ear
      return [ear, newPoly];
    }
  }
  // console.log("not returdnre");
}

function triangulate_and_color(poly){
  // Returns [t, colorDict] where t is a set of
  // triangles and colorDict is a mapping of 
  // colors to vertices of poly

  var copy = poly.slice();
  var ear_stack = [];
  var colorDict = {};
  var t = [];

  // Trim ears and put them on a stack
  while (copy.length > 2) {
    var trimmed = trim_ear(copy);
    ear_stack.push(trimmed[0]);
    copy = trimmed[1];
  }

  t = ear_stack.slice();

  // Color the first triangle arbitrarily
  var earToColor = ear_stack.pop();
  for (var i = 0; i < 3; i++) {
    colorDict[earToColor[i]] = i;
  }

  // Pop ears, color them, put the vertices in the dictionary
  while (ear_stack.length > 0) {
    // colorTracker[i] is true if color i has been used
    var colorTracker = [false, false, false];
    var newlyAddedVertex = [];
    earToColor = ear_stack.pop();
    for (var i = 0; i < 3; i++) {
      if (earToColor[i] in colorDict) {
        colorTracker[colorDict[earToColor[i]]] = true;
      }
      else {
        newlyAddedVertex = earToColor[i];
      }
    }
    // The missing color will be the only false left in the array
    colorDict[newlyAddedVertex] = colorTracker.indexOf(false);
  }

  return [t, colorDict];
}

function minimal_color(colorDict) {
  // Returns the int representing the least frequently-used
  // vertex color in colorDict
  var colorCount = [0, 0, 0];
  for (var i in colorDict) {
    colorCount[colorDict[i]]++;
  }
  return colorCount.indexOf(Math.min.apply(Math, colorCount));
}

function generate_triangulation_and_guard_pos(poly){
  // Triangulate the polygon, place guards, and return
  // [t, g] where t is an array of triangles
  // [[x1,y1],[x2,y2],[x3,y3]]
  // and g is an array of points [x,y]
  var t_and_c = triangulate_and_color(poly);
  var t = t_and_c[0];
  var c = t_and_c[1];
  var g = [];

  // Place guards on the vertices of least frequent color
  var guardColor = minimal_color(t_and_c[1]);

  for (var i = 0; i < poly.length; i++) {
    var point = poly[i];
    // Figure out how to bump the guard position to avoid
    // guards exactly on vertices
    var prevVertex = poly[(i - 1 + poly.length)%poly.length];
    var nextVertex = poly[(i + 1)%poly.length];
    var bumpAngle = vector_angle(point[0] - prevVertex[0], point[1] - prevVertex[1], 
                                 nextVertex[0] - point[0], nextVertex[1] - point[1]);
    bumpAngle = (bumpAngle + Math.PI)/2;
    var baseAngle = Math.atan2(point[1] - prevVertex[1], point[0] - prevVertex[0]);
    // console.log("Baseangle is ", baseAngle);
    bumpAngle += baseAngle;
    // console.log("bumpAngle is ", bumpAngle);
    var guardPoint = [point[0] + Math.cos(bumpAngle), point[1] + Math.sin(bumpAngle)];
    // console.log("guardpoint is ", guardPoint);
    if (c[point] === guardColor) {
      g.push(guardPoint);
    }
  }
  return [t,g];
};

function update(){
  polygon_is_good = check_simple(polygon) && check_clockwise(polygon);
  if(polygon_is_good){
    guard_vis = [];
    for (var i = 0; i < guards.length; i++) {
      var guard = guards[i];
      if(check_inside(guard,polygon)){
        guard_vis.push(generate_guard_vis(guard,polygon));
      }
    }
  }else{
    guard_vis = [];
  }

  redraw();
}

function redraw(){
//   console.log( polygon );
  updatePolygonText();

  background_path = background_path.data([background_square]);
  background_path.exit().remove();
  background_path.enter().append("path").attr("class","background_square");
  background_path.attr("d", poly_d_fn)
      .call(click_spawn_poly);

  polygon_path = polygon_path.data([polygon]);
  polygon_path.exit().remove();
  polygon_path.enter().append("path").attr("class","polygon");
  polygon_path.attr("d", poly_d_fn)
      .call(click_spawn_guard);

  if(polygon_is_good){
    polygon_path.attr("class", "polygon");
  }else{
    polygon_path.attr("class", "polygon bad");
  }

  triangulation_path = triangulation_path.data(triangulation);
  triangulation_path.exit().remove();
  triangulation_path.enter().append("path").attr("class","triangulation");
  triangulation_path.attr("d", poly_d_fn);

  guard_vis_path = guard_vis_path.data(guard_vis);
  guard_vis_path.exit().remove();
  guard_vis_path.enter().append("path").attr("class","guard_vis");
  guard_vis_path.attr("d", poly_d_fn);
  
  polygon_verts = polygon_verts.data(polygon);
  polygon_verts.exit().remove();
  polygon_verts.enter().append("circle");
  polygon_verts.attr("class","polygon_v")
      .attr("transform", function(d) { return "translate(" + d + ")"; })
      .attr("r", 6)
      .call(dragpoly).call(click_to_remove,polygon,3);

  guard_verts = guard_verts.data(guards);
  guard_verts.exit().remove();
  guard_verts.enter().append("circle");
  guard_verts.attr("class","guard")
      .attr("transform", function(d) { return "translate(" + d + ")"; })
      .attr("r", 4)
      .call(dragguard).call(click_to_remove,guards);
}

function poly_d_fn(d) {
  return "M" + d.join("L") + "Z";
}