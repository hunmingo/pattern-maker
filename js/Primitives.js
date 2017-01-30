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


function tripodPath(d){
  var l = d.halfLength,
      w = d.halfWidth;

  var tempTri = equiTriPath({ halfLength: l});
  var ty1 = tempTri.ty1,
      ty2 = tempTri.ty2,
      midPY = (ty1+ty2)/2,
      angle = 2.0943951;

  var center = new Vector2(0,0),
          v1 = new Vector2(-l/2+w*0.5, midPY-w*cos30),
          v2 = new Vector2(0, -w/cos30),
          v3 = v1.clone().xNegate(),
          v4 = v1.clone().rotateAround(center, angle),
          v5 = v2.clone().rotateAround(center, angle),
          v6 = v3.clone().rotateAround(center, angle),
          v7 = v4.clone().rotateAround(center, angle),
          v8 = v5.clone().rotateAround(center, angle),
          v9 = v6.clone().rotateAround(center, angle);

  return { result: "M"+v1.x+","+v1.y+"L"+v2.x+","+v2.y+"L"+v3.x+","+v3.y
                  +"L"+v4.x+","+v4.y+"L"+v5.x+","+v5.y+"L"+v6.x+","+v6.y
                  +"L"+v7.x+","+v7.y+"L"+v8.x+","+v8.y+"L"+v9.x+","+v9.y };


}

function ringPath(d){
  var r1 = d.outerR,
      r2 = d.innerR,
      rRatio = r2/r1;
  var percentage = 100;
  var unit = (Math.PI *2) / 100;
  var startangle = 0;
  var endangle = percentage * unit - 0.001;
  var x1 =  r1 * Math.sin(startangle);
  var y1 = -r1 * Math.cos(startangle);
  var x2 =  r1 * Math.sin(endangle);
  var y2 = -r1 * Math.cos(endangle);

  var x3 =  x1*rRatio,
      y3 =  y1*rRatio,
      x4 =  x2*rRatio,
      y4 =  y2*rRatio;
  var big = 0;

  if (endangle - startangle > Math.PI) {
      big = 1;
  }
//A rx ry x-axis-rotation large-arc-flag sweep-flag x y
  var ringPath =
      " M " + x1 + "," + y1 +     // Draw line to (x1,y1)
      " A " + r1 + "," +r1       // Draw an arc of radius r
      + " 0 " + big + " 1 "       //x-axis-rotation + large-arc-flag +sweep-flag
      + x2 + "," + y2 +             // Arc goes to to (x2,y2)

      " L " + x4 + "," + y4 +     // Draw line to (x1,y1)
      " A " + r2 + "," + r2 +       // Draw an arc of radius r
      " 0 " + big + " 0 " +       // Arc details...
      x3 + "," + y3 +
      " Z";                       // Close path back to (cx,cy)

  return  { result: ringPath }
}


function petalPath(d) {

  var angle = Math.PI / d.petals,
      s = polarToCartesian(-angle, d.halfRadius),
      e = polarToCartesian(angle, d.halfRadius),
      r = d.rPetal;

  var  m = {x: d.halfRadius + r, y: 0},
      c1 = {x: d.halfRadius + r / 2, y: s.y},
      c2 = {x: d.halfRadius + r / 2, y: e.y};

  var center = new Vector2(0,0),
      sV = new Vector2(s.x, s.y),
      eV = new Vector2(e.x, e.y),
      mV = new Vector2(m.x, m.y),
      c1V = new Vector2(c1.x, c1.y),
      c2V = new Vector2(c2.x, c2.y);

  var returnPath = "M"+ e.x + "," + e.y;
  for (var i = 1; i <= d.petals; i++ ){
    var sVN = sV.clone().rotateAround(center,angle*i*2),
        eVN = eV.clone().rotateAround(center,angle*i*2),
        mVN = mV.clone().rotateAround(center,angle*i*2),
        c1VN = c1V.clone().rotateAround(center,angle*i*2),
        c2VN = c2V.clone().rotateAround(center,angle*i*2);
    returnPath += "Q" + c1VN.x+ "," +c1VN.y+" "+ mVN.x + "," +mVN.y+"L"+ mVN.x + "," +mVN.y+"Q"+c2VN.x+ "," +c2VN.y +" "+ eVN.x + "," + eVN.y;
  }
  returnPath += "Z";
  return  { result: returnPath };
};


function polarToCartesian(angle, radius) {
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius
  };
};
