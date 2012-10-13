//to maintain a graph
/*	a graph is a mapping/hashing of objects in finite 2d world into a 2d array
	is used in collision detection to boost performance
 */
/*	config=
	{
		width: w, //width
		height: h,//   and height of the 2d world

		gridx: gx,//make a
		gridy: gy,//   gx*gy sized 2d array
		//specify only (gridx,gridy) OR (cellx,celly)
		cellx: cx,//the size of
		celly: cy //   each cell is cx*cy
	}
 */

define(['core/F'],function(F) //exports a class `graph`
{

function graph (config)
{
	//[--constructor
	//	no private member
	if( !config.cellx)
	{
		config.cellx=config.width/config.gridx;
		config.celly=config.height/config.gridy;
	}
	if( !config.gridx)
	{
		config.gridx=config.width/config.cellx;
		config.gridy=config.height/config.celly;
	}
	this.config=config;
	this.create_graph(config.gridx, config.gridy);
	//--]
}

graph.prototype.create_graph=function(w,h) //create a 3D array
{
	var A = new Array(w);
	for ( var i=0; i<w; i++)
	{
		A[i] = new Array(h);
		for ( var j=0; j<h; j++)
			A[i][j] = new Array();
	}
	this.G = A; //grid storing indices of objects
}

graph.prototype.at=function(P) //convert P from world space to grid space
{
	var A={ x:Math.floor(P.x/this.config.cellx), y:Math.floor(P.y/this.config.celly) };
	//include the boundaries
	if( A.x==this.config.gridx) A.x=this.config.gridx-1;
	if( A.y==this.config.gridy) A.y=this.config.gridy-1;
	if( A.x==-1) A.x=0;
	if( A.y==-1) A.y=0;
	return A;
}

graph.prototype.get=function(P) //return array of object('s index) present at a particular point
{
	return this.G[P.x][P.y];
}

graph.prototype.add=function(i,P) //add an object i at P
{
	this.get(this.at(P)).push(i);
}

graph.prototype.remove=function(i,P) //remove object i at P
{
	var g=this.get(this.at(P));
	var res = F.arr_search( g, function(e){return e==i} ); //search for i
	if (res) g.splice(res,1); //remove
}

graph.prototype.move=function(i,A,B) //an object i moves from A to B
{
	var gA=this.get(this.at(A));
	var gB=this.get(this.at(B));
	if(!gB)
		var x=1;
	if( gA !== gB)
	{
		var res = F.arr_search( gA, function(e){return e===i} ); //search for i
		if (res) gA.splice(res,1); //remove
		gB.push(i);
	}
}

return graph;

});
