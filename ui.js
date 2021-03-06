/**
 * @class UI
 * Abstract UI class.
 */
function UI(buttons) {
	this.buttons = buttons;
	this.button = DH.build(this._def.button(bind(this.toggle, this)));
	this.panel = DH.build(this._def.panel(buttons));
}

merge(UI, {
	instance: null,

	initialize: function(type, buttons) {
		if (this.instance) {
			this.instance.destroy();
		}

		return this.instance = new type(buttons);
	}
});

UI.prototype = {
	_def: {
		icon: {
			tag: 'img',
			attributes: {
				'src': 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAA4ElEQVQoz32RMU4CQRhG38xqQ0e7\
CbHCnnxHEM/AEUiIthZegFAYErIhegTuwAWIGYiWWGKypY0bkgUZCxZ2JIuvmnkz8//fzECA2ppq\
qnbozJ8NOZfA2tVKZwE0lFcGbADwoExeo6KCujxTzb1LLBBxDgsRpK/xmtuK5Uf3BEZvNKgXakEH\
mNAq5t+sjHxw5tp9gJosT27xHxe8By0m2rc4kPFpAPTAoDJkHyJQj2Fl9Zv4K51Z4OdsgB1YcC8k\
QO4MOQSjsUvKb9pn2crLa1ua4zOnAMRzrlhxly4PBn4BWEpBljV5iJUAAAAASUVORK5CYII='}
		},

		button: function(click) {
			return {
				listeners: {
					'click': click
				}
			};
		},

		panel: function(buttons) {
			return [{
				style: {
					'margin-bottom': '10px'
				},
				children: [{
					tag: 'strong',
					children: _('Player settings')
				}, {
					tag: 'a',
					attributes: {
						'href': Meta.site,
						'target': '_blank'
					},
					style: {
						'margin-left': '4px',
						'vertical-align': 'super',
						'font-size': '10px'
					},
					children: _('Help')
				}]
			}, {
				style: {
					'text-align': 'center',
				},
				children: map(function(button) { return button.render(); }, buttons)
#if ! RELEASE
			}, {
				style: {
					'margin-top': '10px',
					'padding': '5px',
					'max-height': '200px',
					'overflow-y': 'auto',
					'color': '#777777',
					'font-size': '10px',
					'border': '1px solid #e2e2e2'
				},
				children: Console.display
#endif
			}];
		}
	},

	buttons: null,
	button: null,
	panel: null,

	destroy: function() {
		DH.remove(this.button);
		DH.remove(this.panel);
	},

	toggle: function() {
		each(this.buttons, function(i, button) { button.refresh(); });
	}
};

#include "watchui.js"

#include "channelui.js"

#include "featherui.js"
