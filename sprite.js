//sprite-animator for LF2
//	accept a bmp object (defined in data file) as config
//	support switching frames between multiple image files

define(['core/sprite','core/animator'], function (Fsprite, Fanimator)
{

function sprite (bmp, parent)
{
	var num_of_images = this.num_of_images = bmp.file.length;
	var w = this.w = bmp.file[0].w+1;
	var h = this.h = bmp.file[0].h+1;
	var ani = this.ani = {length:0};
	this.dir = 'right';
	this.cur_img = '0r';

	var sp_con=
	{
		canvas: parent,
		wh: {x:w,y:h},
		img:{}
	}
	var sp = this.sp = new Fsprite(sp_con);

	for( var i=0; i<bmp.file.length; i++)
	{
		var imgpath='';
		for( var j in bmp.file[i])
		{
			if( typeof bmp.file[i][j] === 'string' &&
			    j.indexOf('file')===0 )
				imgpath = bmp.file[i][j];
		}
		if( imgpath==='')
			alert( 'cannot find img path in data:\n'+JSON.stringify(bmp.file[i]) );
		sp.add_img( imgpath, i+'r');
		if( bmp.file[i]['mirror']) //extended standard
		{
			if( bmp.file[i]['mirror'] !== 'none')
				sp.add_img( bmp.file[i]['mirror'], i+'l');
		}
		else
		{
			var ext=imgpath.lastIndexOf('.');
			sp.add_img( imgpath.slice(0,ext)+'_mirror'+imgpath.slice(ext), i+'l');
		}

		var ani_con=
		{
			x:0,  y:0,   //top left margin of the frames
			w:bmp.file[i].w+1, h:bmp.file[i].h+1,    //width, height of a frame
			gx:bmp.file[i].row, gy:bmp.file[i].col,//define a gx*gy grid of frames
			tar:sp,     //target sprite
			borderright: 1,
			borderbottom: 1
		};
		var ani_mirror_con=
		{
			x:(bmp.file[i].row-1)*(bmp.file[i].w+1),  y:0,
			w:-bmp.file[i].w-1, h:bmp.file[i].h+1,
			gx:bmp.file[i].row, gy:bmp.file[i].col,
			tar:sp,
			borderleft: 1,
			borderbottom: 1
		};
		ani.length++; //watch out! ani.length means how many _pairs_
		ani[i+'r'] = new Fanimator(ani_con);
		if( sp.img[i+'l']); //some sprites do not need mirror
			ani[i+'l'] = new Fanimator(ani_mirror_con);
	}
}

sprite.prototype.show_pic = function(I)
{
	var slot=0;
	for( var k=0; k<this.ani.length; k++)
	{
		var i = I - this.ani[k+'r'].config.gx * this.ani[k+'r'].config.gy;
		if( i >= 0)
		{
			I = i;
			slot++;
		}
		else
			break;
	}
	this.cur_img = slot + (this.dir==='right' ? 'r':'l');
	this.ani[this.cur_img].set_frame(I);
	this.sp.switch_img(this.cur_img);
	this.w = this.ani[this.cur_img].config.w;
	this.w = this.w > 0 ? this.w:-this.w;
	this.h = this.ani[this.cur_img].config.h;
}

sprite.prototype.switch_lr = function(dir) //switch to `dir`
{
	var I = this.ani[this.cur_img].I;
	this.dir=dir;
	this.cur_img = this.cur_img.slice(0,-1) + (this.dir==='right' ? 'r':'l');
	this.sp.switch_img(this.cur_img);
	this.ani[this.cur_img].set_frame(I);
}

sprite.prototype.set_xy = function(P)
{
	this.sp.set_xy(P);
}
sprite.prototype.set_z = function(Z)
{
	this.sp.set_z(Z);
}

sprite.prototype.show = function()
{
	this.sp.show();
}
sprite.prototype.hide = function()
{
	this.sp.hide();
}

return sprite;
});
