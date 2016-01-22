module.exports = function(io){
	require('fs').readdirSync(__dirname + '/').forEach(function(file) {
	  if (file.match(/\.js(on)?$/) !== null && file !== 'index.js' && file !== '.DS_Store') {
	    var name = file.replace('.js', '');
	    require('./' + file)(io);
	  }
	});
};