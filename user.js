// #include "meta.jsp"

function YAYS(unsafeWindow) {

/*
 * Meta.
 */

var Meta = {
	title:       APOSTROPHIZE(SCRIPT_NAME),
	version:     APOSTROPHIZE(SCRIPT_VERSION),
	releasedate: APOSTROPHIZE(SCRIPT_RELEASE_DATE),
	site:        APOSTROPHIZE(SCRIPT_SITE),
	ns:          APOSTROPHIZE(SCRIPT_NS)
};

/*
 * Script context.
 */

unsafeWindow[Meta.ns] = {};

// #include "util.jsp"
// #include "i18n.jsp"
// #include "dom.jsp"
// #include "config.jsp"
// #include "jsonrequest.jsp"
// #include "update.jsp"
// #include "player.jsp"
// #include "button.jsp"
// #include "playeroption.jsp"
// #include "ui.jsp"

/*
 * Player state change callback.
 */

unsafeWindow[Meta.ns].onPlayerStateChange = timeoutProxy(function(state) {
	debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering'][state + 1]);

	AutoPlay.apply();
	VideoQuality.apply();
});

/*
 * Player ready callback.
 */

var onPlayerReady = timeoutProxy(function() {
	var element = DH.id('movie_player') || DH.id('movie_player-flash') || DH.id('movie_player-html5');

	if (element) {
		try {
			Player.initialize(DH.unwrap(element)).onReady(function(player) {
				debug('Player ready');

				each([AutoPlay, VideoQuality, PlayerSize], function(i, option) {
					option.init(player);
				});

				AutoPlay.apply();
				VideoQuality.apply();

				player.addEventListener('onStateChange', Meta.ns + '.onPlayerStateChange');
			});
		}
		catch (e) {
			debug(e);
		}
	}
});

each(['onYouTubePlayerReady', 'ytPlayerOnYouTubePlayerReady'], function(i, callback) {
	unsafeWindow[callback] = extendFn(unsafeWindow[callback], onPlayerReady);
});

onPlayerReady();

var page = DH.id('page'), v7 = DH.hasClass(unsafeWindow.document.body, 'site-left-aligned');
if (page) {
	if (DH.hasClass(page, 'watch')) {
		if (v7)
			new Watch7UI();
		else
			new WatchUI();
	}
	else if (DH.hasClass(page, 'channel')) {
		if (v7)
			new Channel7UI();
		else
			new ChannelUI();
	}
}

} // YAYS

if (window.top === window.self) {
	if (this['unsafeWindow']) { // Greasemonkey.
		YAYS(unsafeWindow);
	}
	else {
		var node = document.createElement('script');
		node.setAttribute('type', 'text/javascript');
		node.text = '('.concat(YAYS.toString(), ')(window);');

		document.body.appendChild(node);
		document.body.removeChild(node);
	}
}
