(function(){
	getSubscriptions();

	// メッセージ受信
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			getList(request.filter);
		}
	);

	/**
	 * Cookieから取得
	 */
	function cookieLoad()
	{
		var key = 'session@cloud=';
		var cookie = document.cookie.split(';');
		for (var i = 0; i < cookie.length; i++) {
			var val = cookie[i];
			while (val.charAt(0) == ' ') {
				val = val.substring(1, val.length);
			}
			if (val.indexOf(key) == 0) {
				return JSON.parse(val.substring(key.length, val.length));
			}
		}
		return null;
	}

	/**
	 * 表示中の一覧から削除対象を抽出
	 */
	function getList(filter)
	{
		// 既読対象のidを退避
		var entrys = [];
		// 表示中のリストを取得
		var list = document.getElementById('section0_column0').children;

		// リストを全部を対象に既読対象か確認
		for (var i = 0; i < list.length; i++ ) {
			var marked = false;
			
			for(var j = 0; j < filter['title'].length; j++) {
				if ((new RegExp(filter['title'][j]['p'], filter['title'][j]['f'])).test(list[i].getAttribute('data-title'))) {
					entrys.push(list[i].getAttribute('id'));
					marked = true;
					break;
				}
			}
			
			for(var j = 0; marked == false, j < filter['summary'].length; j++) {
				var tmp = list[i].children;
				tmp = tmp[tmp.length - 1].children;
				var summary = tmp[tmp.length - 1].innerText;
				
				if ((new RegExp(filter['summary'][j]['p'], filter['summary'][j]['f'])).test(summary)) {
					entrys.push(list[i].getAttribute('id'));
					break;
				}
			}
		}
		
		if (entrys.length)
			setMark(entrys);
	}

	/**
	 * 既読をPOST
	 */
	function setMark(entrys) {
		var cookies = cookieLoad();
		var xhr = new XMLHttpRequest();
		var url = 'https://cloud.feedly.com/v3/markers?' +
			'ck=' + (new Date()).getTime() + '&' +
			'ct=feedly.desktop&cv=17.2.636';

		xhr.open('POST', url, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				for (var i = 0; i < entrys.length; i++) {
					var taget = document.getElementById(entrys[i]);
					var parent = taget.parentNode;
					
					parent.removeChild(taget);
					
					console.debug('[readmaker for feedly] complete the \'' + entrys[i] + '\'');
				}
			}
		};

		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('$Authorization.feedly', '$FeedlyAuth');
		xhr.setRequestHeader('Authorization', 'OAuth ' + cookies['feedlyToken']);
		
		var ids = JSON.stringify(entrys);

		xhr.send( '{"action":"markAsRead","type":"entries","entryIds":'+ids.replace(/_main/g,'')+'}' );
	}
	
	/**
	 * 購読リストを取得
	 */
	function getSubscriptions() {
		var cookies = cookieLoad();
		var xhr = new XMLHttpRequest();
		var url = 'http://cloud.feedly.com/v3/subscriptions?' +
			'ck=' + (new Date()).getTime() + '&' +
			'ct=feedly.desktop&cv=17.2.636';

		xhr.open('GET', url, true);

		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
//				console.debug(JSON.parse(xhr.response));
				chrome.runtime.sendMessage(null, {'subscriptions': xhr.response});
			}
		};

		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('X-Feedly-Access-Token', cookies['feedlyToken']);
		xhr.send();
	}
})();
