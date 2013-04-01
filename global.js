/** global constants of a game
*/
define(function()
{

var G={};

/** controller config-------------------------------------------------*/

G.combo_list = [
	{ name:'left', seq:['left']},
	{ name:'right', seq:['right']},
	{ name:'def', seq:['def']},
	{ name:'jump', seq:['jump']},
	{ name:'att', seq:['att']},
	{ name:'run', seq:['right','right']},
	{ name:'run', seq:['left','left']},
	{ name:'DvA', seq:['def','down','att']},
	{ name:'D<A', seq:['def','left','att']},
	{ name:'D>A', seq:['def','right','att']},
	{ name:'D^A', seq:['def','up','att']},
	{ name:'DvJ', seq:['def','down','jump']},
	{ name:'D<J', seq:['def','left','jump']},
	{ name:'D>J', seq:['def','right','jump']},
	{ name:'D^J', seq:['def','up','jump']},
	{ name:'DJA', seq:['def','jump','att']}
];
G.detector_config = //combo detector config
{
	timeout:30, //time to clear buffer (approx. 1s in 30fps)
	comboout:8, //the max time interval(in frames) between keys to make a combo
	no_repeat_key: true //eliminate repeated key strokes by browser
};


/** gameplay constants------------------------------------------------*/

G.gameplay={};
var GC = G.gameplay;
/** What are the defaults?
default means `otherwise specified`. all defaults get overrided, and
  (mostly) you can set the specific property in data files.
  so it might not be meaningful to change default values
 */
GC.default={};

GC.default.itr={};
GC.default.itr.zwidth= 12; //default itr zwidth

GC.default.cpoint={};
GC.default.cpoint.hurtable= 0; //default cpoint hurtable
GC.default.cpoint.cover= 0; //default cpoint cover
GC.default.cpoint.vaction= 135; //default frame being thrown

GC.default.wpoint={};
GC.default.wpoint.cover= 0;

GC.default.effect={};
GC.default.effect.num= 0; //default effect num

GC.default.fall={};
GC.default.fall.value= 20; //default fall
GC.default.fall.dvy= -6.9; //default dvy when falling

GC.default.weapon={};
GC.default.weapon.vrest= 9; //default weapon vrest

GC.default.character={};
GC.default.character.arest= 7; //default character arest

GC.default.machanics={};
GC.default.machanics.mass= 1; //default mass; weight = mass * gravity

/**  Below are defined constants over the game,
  tweak them carefully otherwise it might introduce bugs
 */
GC.itr={};
GC.itr.hit_stall= 3; //default stall when hit somebody

GC.recover={};
GC.recover.fall= -1; //fall recover constant
GC.recover.bdefend= -0.5; //bdefend recover constant

GC.effect={};
GC.effect.num_to_id= 300; //convert effect num to id
GC.effect.duration= 3; //default effect lasting duration

GC.character={};
GC.character.bounceup={};
GC.character.bounceup.limit={};
GC.character.bounceup.limit.xy= 14.2; //defined speed threshold to bounce up again
GC.character.bounceup.limit.y= 11; //y threshold; will bounce if any one of xy,y is overed
GC.character.bounceup.factor={};
GC.character.bounceup.factor.x= 0.6; //defined bounce up factors
GC.character.bounceup.factor.y= -0.4;
GC.character.bounceup.factor.z= 0.6;

GC.defend={};
GC.defend.injury={};
GC.defend.injury.factor= 0.1; //defined defend injury factor
GC.defend.break= 40; //defined defend break

GC.fall={};
GC.fall.KO= 60; //defined KO

GC.friction={};
GC.friction.factor={}; //defined factor of friction when on the ground
// friction is computed as: v -= |v|*degree1 + v*v*degree2
GC.friction.factor.degree1= 0.26;
GC.friction.factor.degree2= 0.02;
GC.friction.fell={};
GC.friction.fell.factor= 0.76; //previously 0.34; defined friction at the moment of falling onto ground

GC.min_speed= 1; //defined minimum speed

GC.gravity= 1.7; //defined gravity

GC.weapon={};
GC.weapon.bounceup={}; //when a weapon falls onto ground
GC.weapon.bounceup.limit= 12.25; //defined limit to bounce up again
GC.weapon.bounceup.speed={};
GC.weapon.bounceup.speed.x= 3; //defined bounce up speed
GC.weapon.bounceup.speed.y= -3.7;
GC.weapon.bounceup.speed.z= 2;
GC.weapon.soft_bounceup={}; //when heavy weapon being hit by character punch
GC.weapon.soft_bounceup.speed={};
GC.weapon.soft_bounceup.speed.y= -2;

GC.weapon.hit={}; //when a weapon hit others
GC.weapon.hit.vx= -3; //absolute speed
GC.weapon.hit.vy= 0;

GC.weapon.gain={}; //when a weapon is being hit at rest
GC.weapon.gain.factor={}; //gain factor
GC.weapon.gain.factor.x= 1.1;
GC.weapon.gain.factor.y= 1.4;

GC.weapon.reverse={}; //when a weapon is being hit while travelling in air
GC.weapon.reverse.factor={};
GC.weapon.reverse.factor.vx= -0.4;
GC.weapon.reverse.factor.vy= -2;
GC.weapon.reverse.factor.vz= -0.4;

GC.unspecified= -842150451; //0xCDCDCDCD, one kind of HEX label

return G;
});
