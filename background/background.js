/**
 * webRequest.onCompleted
 *  - Fired when a request is completed.
 */
chrome.webRequest.onCompleted.addListener(
	function(details) {
		console.log( '* onComplete[' + details.requestId +']' );
		
		// feed idを取得
		var streamId = decodeURIComponent(details.url.match(/streamId=([^&]+)/)[1]);
		// feed idの一致するフィルタを抽出
		var computedFilter = (function(id){
			var title = [], summary = [];
			var filters = JSON.parse(localStorage['filters'] || '[{"id":{"p":"^feed/","f":""},"title":[{"p":"^(AD|PR|ＡＤ|ＰＲ)[:：]","f":"i"}]},{"id":{"p":"^user\/[0-9a-f\-]+\/category\/.+","f":""},"title":[{"p":"^(AD|PR|ＡＤ|ＰＲ)[:：]","f":"i"}]}]');
			
			// フィルターを全チェック
			for (var i = 0; i < filters.length; i++) {
				// streamIdの一致を確認
				if ((new RegExp(filters[i]['id']['p'], filters[i]['id']['f'])).test(id)) {
					// タイトルフィルタの有無
					if (filters[i].hasOwnProperty('title') && filters[i]['title'].length)
						title = title.concat(filters[i]['title']);
					// サマリフィルタの有無
					if (filters[i].hasOwnProperty('summary') && filters[i]['summary'].length)
						summary = summary.concat(filters[i]['summary']);
				}
			}
			
			// フィルタ対象の有無を確認
			if (title.length == 0 && summary.length == 0)
				return null;
			else
				return {'title': title, 'summary': summary};
		})(streamId);
		
		// フィルタ対象がない場合
		if (computedFilter != null)
			// タブへメッセージ送信
			chrome.tabs.sendMessage(details.tabId, {'streamId': streamId, 'filter': computedFilter});
	},
	{ types: [ 'xmlhttprequest' ], urls : [ '*://*.feedly.com/*/streams/contents*' ] },
	[]
);

/**
 * runtime.onMessage
 *  - Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse)
	{
		// subscriptions list save
		if (message.hasOwnProperty('subscriptions')) {
			console.log( '* onMessage: subscriptions list save' );
			localStorage['subscriptions'] = message['subscriptions'];
		}
	}
);