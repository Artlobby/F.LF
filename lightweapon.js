/** light and heavy weapons
 */

define(['LF/global','LF/sprite','LF/mechanics','core/util','core/states'],
function ( Global, Sprite, Mech, Futil, Fstates)
{

/**	config=
	{
		stage,
		scene
	}
 */
function lightweapon(config,dat,id)
{
	//must have these for identity
	this.type='lightweapon';
	this.uid=-1; //unique id, will be assigned by scene
	this.id=id; //identify special behavior. accept values from 100-149
	this.team=0;
	config.scene.add(this);

	var This=this;
	var GC=Global.gameplay;

	function frame_transistor()
	{
		var wait=1; //when wait decreases to zero, a frame transition happens
		var next=999; //next frame

		//cause a transition
		this.frame=function(F)
		{
			this.set_next(F);
			this.set_wait(0);
		}

		this.set_wait=function(value)
		{
			wait=value;
		}

		this.set_next=function(value)
		{
			next=value;
		}

		//when frame transition happens
		this.trans=function()
		{
			if( wait===0 && next!==0)
			{
				if( next===999)
					next=0;
				frame.PN=frame.N;
				frame.N=next;
				frame.D=dat.frame[next];
				frame_update();
			}
			else
				wait--;
		}
	}

	//create a sprite as specified by dat.bmp and append to stage
	var sp = new Sprite(dat.bmp, config.stage);

	//reasonably to have health
	var health=
	{
		hp: dat.bmp.weapon_hp
	};

	//for frame transition
	var frame=
	{
		PN: 0, //previous frame number
		N: 0, //current frame number
		D: dat.frame[0], //current frame's data object
		mobility: 1 //ignor it
	};

	var effect=
	{
		freeze: 0 //duration to freeze
	};

	var itr=
	{
		vrest: 0
	};

	var holder=null; //the character holding me

	//the mechanics backend
	var mech = new Mech(id,frame,sp);
	var ps = mech.create_metric(); //position, velocity, and other physical properties

	//you will need a simple frame transistor
	var trans = new frame_transistor();

	//direction switcher
	function switch_dir_fun(e)
	{
		if( ps.dir==='left' && e==='right')
		{
			ps.dir='right';
			sp.switch_lr('right');
		}
		else if( ps.dir==='right' && e==='left')
		{
			ps.dir='left';
			sp.switch_lr('left');
		}
	}
	function dirh()
	{
		return (ps.dir==='left'?-1:1);
	}

	//generic update done at every frame
	function frame_update()
	{
		//show frame
		sp.show_pic(frame.D.pic);

		//velocity
		ps.vx+= dirh() * frame.D.dvx;
		ps.vz+= frame.D.dvz;
		ps.vy+= frame.D.dvy;

		//wait for next frame
		trans.set_wait(frame.D.wait);
		trans.set_next(frame.D.next);

		if( frame.N === 64) //on ground
			This.team=0; //loses team
	}

	//generic update done at every TU (30fps)
	function state_update()
	{
		if( This.id===101)
			var x;
		if( effect.freeze===0)
		{
			interaction();

			switch( frame.D.state)
			{
				case 1001:
					//I am passive! so I dont need to care states of myself
				break;

				default:
					//dynamics: position, friction, gravity
					mech.dynamics();
				break;
			}

			if( ps.y===0 && ps.vy>0) //fell onto ground
			{
				ps.vy=0; //set to zero
				trans.frame(70); //go to frame 70
				health.hp -= dat.bmp.weapon_drop_hurt;
			}
		}
		else
			effect.freeze--;

		if( itr.vrest>0)
			itr.vrest--;
	}

	function interaction()
	{
		var ITR=Futil.make_array(frame.D.itr);

		if( itr.vrest===0)
		if( This.team!==0)
		for( var j in ITR)
		{	//for each itr tag
			if( ITR[j].kind===0) //kind 0 only
			{
				var vol=mech.volume(ITR[j]);
				if( vol.zwidth===0) vol.zwidth = GC.default.itr.zwidth;
				var hit= config.scene.query(vol, This, {body:0, not_team:This.team});
				for( var k in hit)
				{	//for each being hit
					if( hit[k].hit(ITR[j],This,{x:ps.x,y:ps.y,z:ps.z}))
					{	//hit you!
						ps.vx = dirh() * GC.weapon.hit.vx;
						ps.vy = GC.weapon.hit.vy;
						effect.freeze = 2;
						itr.vrest = GC.default.weapon.vrest;
					}
				}
			}
			//kind 5 is handled in `act()`
		}
	}

	//---external interface---

	this.TU=function()
	{
		state_update();
	}
	this.trans=function()
	{
		if( effect.freeze===0)
			trans.trans();
	}
	this.set_pos=function(x,y,z)
	{
		mech.set_pos(x,y,z);
	}
	this.bdy=function()
	{
		return mech.body();
	}

	//---inter living objects protocal---

	this.dirh=dirh;
	this.hit=function(ITR, att, attps)
	{
		if( frame.D.state===1002) //if in air
		{
			ITR; //the itr object
			att; //the attacker!
			attps; //position of attacker
			if( (att.dirh()>0)!==(ps.vx>0))
				ps.vx *= GC.weapon.reverse.factor.vx;
			ps.vy *= GC.weapon.reverse.factor.vy;
			ps.vz *= GC.weapon.reverse.factor.vz;
			this.team = att.team; //change team!
			return true;
		}
	}
	this.act=function(wpoint,holdpoint,attps,attitr,att) //I act according to the character who is holding me
	{
		var fD = frame.D;
		var result={};

		trans.frame(wpoint.weaponact);
		trans.trans();

		if( fD.wpoint && fD.wpoint.kind===2)
		{
			if( wpoint.dvx) ps.vx = att.dirh() * wpoint.dvx;
			if( wpoint.dvz) ps.vz = att.dirv() * wpoint.dvz;
			if( wpoint.dvy) ps.vy = wpoint.dvy;
			if( ps.vx || ps.vy || ps.vz)
			{
				mech.set_pos( //impulse
					attps.x + att.dirh() * 73,
					attps.y - 23,
					attps.z + ps.vz );
				ps.zz=0;
				trans.frame(40);
				trans.trans();
				holder=null;
				result.thrown=true;
			}

			if( wpoint.cover && wpoint.cover===1)
				ps.zz = -1;
			else
				ps.zz = GC.default.wpoint.cover;

			if( !result.thrown)
			{
				switch_dir_fun(attps.dir);
				ps.sz = ps.z = attps.z;
				mech.coincideXY(holdpoint,mech.make_point(fD.wpoint));
				mech.project();
			}

			if( itr.vrest===0)
			if( wpoint.attacking)
			{
				var ITR=Futil.make_array(fD.itr);

				for( var j in ITR)
				{	//for each itr tag
					if( ITR[j].kind===5) //kind 5 only
					{
						var vol=mech.volume(ITR[j]);
						if( vol.zwidth===0) vol.zwidth = GC.default.itr.zwidth;
						var hit= config.scene.query(vol, [This, att], {body:0, not_team:This.team});
						for( var k in hit)
						{	//for each being hit
							if( !attitr.vrest[ hit[k].uid ])
							{	//if vrest allows

								var citr;
								if( dat.weapon_strength_list[wpoint.attacking])
									citr = dat.weapon_strength_list[wpoint.attacking];
								else
									citr = ITR[j];

								if( hit[k].hit(citr,att,{x:attps.x,y:attps.y,z:attps.z}))
								{	//hit you!
									itr.vrest = citr.vrest;
									result.hit = hit[k].uid;
									result.rest = citr.vrest;
								}
							}
						}
					}
				}
			}
		}
		return result;
	}

	this.drop=function(dvx,dvy)
	{
		This.team=0;
		holder=null;
		if( dvx) ps.vx=dvx * 0.5;
		if( dvy) ps.vy=dvy * 0.2;
		ps.zz=0;
		trans.frame(999);
	}

	this.pick=function(att)
	{
		if( !holder)
		{
			holder=att;
			return true;
		}
		return false;
	}
}

return lightweapon; //return your class to get it defined
});
