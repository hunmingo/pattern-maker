

d3.layout.pattern = function() {
  var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
  function pack(d, i) {

    var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1],
    r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
      return radius;
    };

    root.x = root.y = 0;


    d3_layout_hierarchyVisitAfter(root, function(d) {
      d.r = +r(d.value);
    });
    //console.log(root.r);
    //console.log(d.value); -> sum of all value
    //console.log(d.r); -> sqrt(d.value) = root.r

    d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
    if (padding) {
      var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
      d3_layout_hierarchyVisitAfter(root, function(d) {
        d.r += dr;
      });
      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
      d3_layout_hierarchyVisitAfter(root, function(d) {
        d.r -= dr;
      });
    }
    d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
    return nodes;

  }

  pack.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return pack;
  };

  pack.radius = function(_) {
    if (!arguments.length) return radius;
    radius = _ == null || typeof _ === "function" ? _ : +_;
    return pack;
  };

  return d3_layout_hierarchyRebind(pack, hierarchy);
};


function equiTriPath(d) {
  var hL = d.halfLength,
      hL2 = -hL
      ty1 = -hL*tan6030,
      ty2 = -ty1/2;
      return { ty1: ty1, ty2: ty2, result: "M0,"+ty1+"L"+hL+","+ty2+"L"+hL2+ "," + ty2 };
}


function chevronPath(d){
  var l = d.halfLength,
      w = d.halfWidth;

  var tempTri = equiTriPath({ halfLength: l});
  var ty1 = tempTri.ty1,
      ty2 = tempTri.ty2,
      midPY = (ty1+ty2)/2;

  var v1 = new Vector2(-l/2, midPY),
      v2 = new Vector2(-l/2+w*0.5, midPY-w*cos30),
      v3 = new Vector2(0, -w/cos30),
      v4 = v2.clone().xNegate(),
      v5 = v1.clone().xNegate(),
      v6 = new Vector2(0, 0);

  return { result: "M"+v1.x+","+v1.y+"L"+v2.x+","+v2.y+"L"+v3.x+","+v3.y
                  +"L"+v4.x+","+v4.y+"L"+v5.x+","+v5.y+"L"+v6.x+","+v6.y };
}
