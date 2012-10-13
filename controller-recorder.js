//controller recorder and player
/*	to record and playback activity of a controller
 */
/*	require: F.js
 */

define(['core/F'],function(F) //exports 2 classes `control_recorder` and `control_player` in an object
{

return {

//control recorder
control_recorder: function(target_controller)
{
	this.time=0;
	this.rec= new Array();
	this.key= function(k,down)
	{
		this.rec.push({t:this.time, k:k, d:down});
	}
	this.frame= function()
	{
		this.time+=1;
	}
	this.export_str= function()
	{	//export to JSON
		var str="";
		str+= '[\n';
		for( var i=0; i<this.rec.length; i++)
		{
			if( i!==0)
				str+= ',';
			str+= JSON.stringify(this.rec[i]);
		}
		str+= '\n]';
		this.rec=[];
		return str;
	}
	target_controller.child.push(this);
},

//control record playback
control_player: function(control_config, record)
{
	var I=0;
	var time=0;
	var rec=record;
	this.state= F.extend_object({},control_config);
	for ( var j in this.state)
		this.state[j]=0;
	this.child=[];
	this.sync=false;

	this.frame=function()
	{
		time++;
		if( this.sync===false)
			this.fetch();
	}
	this.fetch=function()
	{
		for (; time===rec[I].t; I++)
		{
			for( var i in this.child)
				this.child[i].key(rec[I].k, rec[I].d);
			this.state[rec[I].k] = rec[I].d;

			if( I===rec.length-1)
				I=0;
		}
	}
	this.clear_states=function(){}
	this.flush=function(){}
}

}});