/**	loader-built is the version for use after optimization.
	during optimization, a gamedata dump is injected directly to the
	script file inside a module.
	all I have to do is to load that module.
 */

define(function() {
	var loaded=false;
	var gamedata;

	return {
		load: function (name, require, load, config) {		
			if( config.isBuild)
				console.log('why am I here?');
				
			if( !loaded)
			{
				loaded=true;
				require(['loader_gamedata'], function(data){
					gamedata=data;
					load(gamedata);
				});
			}
			else
				load(gamedata);
		},
		pluginBuilder: './loader-build'
	}
});
