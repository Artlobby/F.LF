//scene in F.LF
//	keeps a list a characters and items
//	scrolling across the background
/*	vol= //the volume format
	{
		x, y, z, //the reference point
		vx, vy, w, h, //the volume defined with reference to (x,y,z)
		zwidth	//zwidth spans into the +ve and -ve direction
	}
 */

define(['core/util','core/collision'], function (Futil,Fcollision)
{
var UID=0;

function scene (config)
{
	this.live = {}; //list of living objects
}

scene.prototype.add = function(C)
{
	C.uid = UID++;
	this.live[C.uid]=C;
	return C.uid;
}

scene.prototype.remove = function(C)
{
	delete this.live[C.uid];
	C.uid=-1;
}

/**	@function
	@return the all the objects whose volume intersect with a specified volume
	@param exclude [single Object] or [array of objects]
	@param where [Object] what to intersect with
	[default] {tag:'body'} intersect with body
			{tag:'itr:2'} intersect with itr kind:2
			{type:'character'} with character only
			{not_team:1} exclude team
			{filter:function}
*/
scene.prototype.query = function(volume, exclude, where)
{
	var result=[];
	var tag=where.tag;
	if(!tag) tag='body';
	var tagvalue=0;
	var colon=tag.indexOf(':');
	if( colon!==-1)
	{
		tagvalue = tag.slice(colon+1);
		tag = tag.slice(0,colon);
	}
	exclude=Futil.make_array(exclude);

	for ( var i in this.live)
	{
		var excluded=false;
		for( var ex in exclude)
		{
			if( this.live[i] === exclude[ex])
			{
				excluded=true;
				break;
			}
		}
		if( excluded)
			continue;

		if( where.not_team && this.live[i].team === where.not_team)
			continue;

		if( where.type && this.live[i].type !== where.type)
			continue;

		if( where.filter && !where.filter(this.live[i]))
			continue;

		if( this.live[i]['vol_'+tag])
		{
			var vol = this.live[i]['vol_'+tag](tagvalue);
			for( var j in vol)
			{
				if( this.intersect( volume, vol[j]))
				{
					result.push( this.live[i] );
					break;
				}
			}
		}
	}
	return result;
}

scene.prototype.intersect = function(A,B) //return true if volume A and B intersect
{
	var AV={ left:A.x+A.vx, top:A.y+A.vy, right:A.x+A.vx+A.w, bottom:A.y+A.vy+A.h };
	var BV={ left:B.x+B.vx, top:B.y+B.vy, right:B.x+B.vx+B.w, bottom:B.y+B.vy+B.h };

	return ( Fcollision.rect( AV, BV ) && Fcollision.rect(
	{ left:A.z-A.zwidth, top:0, right:A.z+A.zwidth, bottom:1 },
	{ left:B.z-B.zwidth, top:0, right:B.z+B.zwidth, bottom:1 }
	));
}

scene.prototype.distance=function(A,B) //return the distance between object A and B, as measured at center points
{
	var dx= (A.x+A.centerx) - (B.x+B.centerx);
	var dy= A.y - B.y;
	var dz= (A.z+A.centery) - (B.z+B.centery);

	return Math.sqrt(dx*dx+dy*dy+dz*dz);
}

return scene;
});
