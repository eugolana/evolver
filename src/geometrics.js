function dot(v1, v2) {
	return v1[0] * v2[0] + v1[1] * v2[1]
}

function normalise(v) {
	let term = 1.0 / Math.sqrt(v[0] * v[0] + v[1] * v[1])
	return [v[0] * term, v[1] * term]
}


function getAngle(v1, v2) {
	let v3 = [v2[0], v2[1] + 1]
	let a =  Math.acos(dot(normalise( [v2[0] - v1[0], v2[1] - v1[1]]), normalise([v3[0] - v2[0], v3[1] - v2[0]])))
	if (v1[0] < v2[0]) {
		a = 2 * Math.PI - a
	}
	return a
}

function getMiddle(points){
	 return [
      points.map((x,i)=>
        x[0]
      ).reduce((a,b)=>
         a + b
      )/points.length,
      points.map((x,i)=>
        x[1]
      ).reduce((a,b)=>
        a + b
      )/points.length
      ]
}

function sortClockwise(points){
	let mid = getMiddle(points);
	points = points.sort((a,b)=>
		getAngle(a, mid) > getAngle(b, mid)
	)
	return points
}

function smooth(a,b){
	const b1 =  [ a[0] - b[0], a[1] - b[1]]
	return [a[0] + b1[0]/6, a[1] + b1[1] / 6 ]
}

function getBezierPath(points){
	let path = "M" + points[0].join(',');
	path += [...Array(points.length )].map((x,i)=>
		"C" + smooth(points[i], points[(i+1) % points.length]).join(',') + ' ' +
			 smooth(points[(i+1) % points.length],points[(i+2) % points.length]).join(',') + ' ' + 
			 points[(i +1) % points.length]
		).join(" ")
	path += "z"
	return path
}

export {
	getAngle,
	getMiddle,
	sortClockwise,
	getBezierPath
}
