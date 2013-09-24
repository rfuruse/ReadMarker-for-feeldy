(function(){
	
	if (!localStorage.hasOwnProperty('filters'))
		localStorage['filters'] = '[{"id":{"p":"^feed/","f":""},"title":[{"p":"^(AD|PR|ＡＤ|ＰＲ)[:：]","f":"i"}]},{"id":{"p":"^user\/[0-9a-f\-]+\/category\/.+","f":""},"title":[{"p":"^(AD|PR|ＡＤ|ＰＲ)[:：]","f":"i"}]}]';

	
	
	
	
	
	var subscriptions = JSON.parser(localStorage['subscriptions']);

	if (subscriptions && subscriptions.length) {
		
	}
})();

/*

filter config format

[
    {
        "id": {
            "p": "^feed/",
            "f": ""
        },
        "title": [
            {
                "p": "^(AD|PR|ＡＤ|ＰＲ)[:：]",
                "f": "i"
            },
            {
                "p": "^.*((apple|i(pod|pad|phone)|mac).*整備済|整備済.*(apple|i(pod|pad|phone)|mac)).*$",
                "f": "i"
            }
        ]
    }
]





*/