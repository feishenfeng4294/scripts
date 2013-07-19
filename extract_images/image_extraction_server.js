var port, server, service,
    system = require('system');

if (system.args.length !== 2) {
    console.log('Usage: simpleserver.js <portnumber>');
    phantom.exit(1);
} else {
    port = system.args[1];
    server = require('webserver').create();

    service = server.listen(port, function (request, response) {

        console.log('Request at ' + new Date());
        console.log(JSON.stringify(request, null, 4));
        response.statusCode = 200;
        response.headers = {
            'Cache': 'no-cache',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Max-Age': '1000',
            'Access-Control-Allow-Headers': '*'
        };
        
        
        
        var url = request.url.split("?url=")[1];
        url = decodeURIComponent(url);

		//setTimeout( function(){

		var page = require('webpage').create();
		var finished = 0;


		//Take up to X seconds
        setTimeout(function(){
        	console.log("Timeout check.");
        	if(finished)
        	{
        		console.log("Already responded");
        		return;
        	}
        	if(response)
        	{
	        	response.statusCode=500;
	        	response.write("Timeout.");
	        	response.close();
	        	page.close();
        	}
        }
        ,15000);//15 seconds
        
		page.onConsoleMessage = function(msg) {
		    if(msg.indexOf("URL:") == 0)
		    {
		    	response.write(msg.split("URL:")[1]);
		    	response.close();
		    	page.close()
		    	finished=1;
		    }
		    else
		    {
		    	console.log("NOISE----:"+msg);
		    }
		};
		page.open(url, function(status) {
		    if ( status === "success" ) {
		        page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", function() {
		            page.evaluate(function() {		            			            	

		            	var getImgSize = function(imgSrc, isog) {
		            		console.log("Getting image size for:"+imgSrc)
						    var newImg = new Image();
						    newImg.src = imgSrc;
						    var height = newImg.height;
						    var width = newImg.width;
						    if(isog)
						    {
						    	width=640;
						    	height=480;
						    }
						    return {"width":width,"height": height, "image_src":imgSrc};
						}

		                //console.log("URL:"+$($("img")[0]).attr("src"));
		                
		                var all=[];
		                
		                var og = $('meta[property="og:image"]');
		                console.log(og);
		                if(og != null)
		                {
		                	console.log("NOT NULL!!!");
		                	var ogurl = $('meta[property="og:image"]').attr('content');
		                	console.log(ogurl);
		                	
		                	all.push(getImgSize(ogurl,1));
		                	//console.log("Found OG!!!"+all[0]);
		                }
		                
		                var images = $("img");	
		                
		                for(var i=0;i<images.length;i++)
		                {
		                	//console.log($(images[i]).attr("src"));
		                	all.push( getImgSize( images[i].src) );
		                	
		                }
		                
		                //decending by points
		                
		                var score_result = function(res,all)
		                {
		                	var points = 0;
		                	points += res.width*res.height;
		                	points += (all.length - all.indexOf(res))*.05;//more points if first
		                	return points;
		                }
		                
		                all.sort(function(a,b) { return parseFloat(score_result(b,all)) - parseFloat(score_result(a,all)) } );
		                
		                var res = {"extract_images_response":{"images":all}} ;
		                
		                /*! JSON v3.2.5 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
							;(function(){var o=!0,w=null;
							(function(A){function u(a){if("bug-string-char-index"==a)return"a"!="a"[0];var f,c="json"==a;if(c||"json-stringify"==a||"json-parse"==a){if("json-stringify"==a||c){var e=k.stringify,b="function"==typeof e&&l;if(b){(f=function(){return 1}).toJSON=f;try{b="0"===e(0)&&"0"===e(new Number)&&'""'==e(new String)&&e(m)===r&&e(r)===r&&e()===r&&"1"===e(f)&&"[1]"==e([f])&&"[null]"==e([r])&&"null"==e(w)&&"[null,null,null]"==e([r,m,w])&&'{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}'==e({a:[f,o,!1,w,"\x00\u0008\n\u000c\r\t"]})&&
							"1"===e(w,f)&&"[\n 1,\n 2\n]"==e([1,2],w,1)&&'"-271821-04-20T00:00:00.000Z"'==e(new Date(-864E13))&&'"+275760-09-13T00:00:00.000Z"'==e(new Date(864E13))&&'"-000001-01-01T00:00:00.000Z"'==e(new Date(-621987552E5))&&'"1969-12-31T23:59:59.999Z"'==e(new Date(-1))}catch(n){b=!1}}if(!c)return b}if("json-parse"==a||c){a=k.parse;if("function"==typeof a)try{if(0===a("0")&&!a(!1)){f=a('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');var d=5==f.a.length&&1===f.a[0];if(d){try{d=!a('"\t"')}catch(g){}if(d)try{d=
							1!==a("01")}catch(i){}}}}catch(N){d=!1}if(!c)return d}return b&&d}}var m={}.toString,p,B,r,C=typeof define==="function"&&define.amd,k="object"==typeof exports&&exports;k||C?"object"==typeof JSON&&JSON?k?(k.stringify=JSON.stringify,k.parse=JSON.parse):k=JSON:C&&(k=A.JSON={}):k=A.JSON||(A.JSON={});var l=new Date(-3509827334573292);try{l=-109252==l.getUTCFullYear()&&0===l.getUTCMonth()&&1===l.getUTCDate()&&10==l.getUTCHours()&&37==l.getUTCMinutes()&&6==l.getUTCSeconds()&&708==l.getUTCMilliseconds()}catch(O){}if(!u("json")){var D=
							u("bug-string-char-index");if(!l)var s=Math.floor,J=[0,31,59,90,120,151,181,212,243,273,304,334],z=function(a,f){return J[f]+365*(a-1970)+s((a-1969+(f=+(f>1)))/4)-s((a-1901+f)/100)+s((a-1601+f)/400)};if(!(p={}.hasOwnProperty))p=function(a){var f={},c;if((f.__proto__=w,f.__proto__={toString:1},f).toString!=m)p=function(a){var f=this.__proto__,a=a in(this.__proto__=w,this);this.__proto__=f;return a};else{c=f.constructor;p=function(a){var f=(this.constructor||c).prototype;return a in this&&!(a in f&&
							this[a]===f[a])}}f=w;return p.call(this,a)};B=function(a,f){var c=0,b,h,n;(b=function(){this.valueOf=0}).prototype.valueOf=0;h=new b;for(n in h)p.call(h,n)&&c++;b=h=w;if(c)c=c==2?function(a,f){var c={},b=m.call(a)=="[object Function]",e;for(e in a)!(b&&e=="prototype")&&!p.call(c,e)&&(c[e]=1)&&p.call(a,e)&&f(e)}:function(a,f){var c=m.call(a)=="[object Function]",b,e;for(b in a)!(c&&b=="prototype")&&p.call(a,b)&&!(e=b==="constructor")&&f(b);(e||p.call(a,b="constructor"))&&f(b)};else{h=["valueOf","toString",
							"toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];c=function(a,f){var c=m.call(a)=="[object Function]",b;for(b in a)!(c&&b=="prototype")&&p.call(a,b)&&f(b);for(c=h.length;b=h[--c];p.call(a,b)&&f(b));}}c(a,f)};if(!u("json-stringify")){var K={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},t=function(a,f){return("000000"+(f||0)).slice(-a)},G=function(a){var f='"',b=0,e=a.length,h=e>10&&D,n;for(h&&(n=a.split(""));b<e;b++){var d=a.charCodeAt(b);switch(d){case 8:case 9:case 10:case 12:case 13:case 34:case 92:f=
							f+K[d];break;default:if(d<32){f=f+("\\u00"+t(2,d.toString(16)));break}f=f+(h?n[b]:D?a.charAt(b):a[b])}}return f+'"'},E=function(a,b,c,e,h,n,d){var g=b[a],i,j,k,l,q,u,v,x,y;try{g=b[a]}catch(A){}if(typeof g=="object"&&g){i=m.call(g);if(i=="[object Date]"&&!p.call(g,"toJSON"))if(g>-1/0&&g<1/0){if(z){k=s(g/864E5);for(i=s(k/365.2425)+1970-1;z(i+1,0)<=k;i++);for(j=s((k-z(i,0))/30.42);z(i,j+1)<=k;j++);k=1+k-z(i,j);l=(g%864E5+864E5)%864E5;q=s(l/36E5)%24;u=s(l/6E4)%60;v=s(l/1E3)%60;l=l%1E3}else{i=g.getUTCFullYear();
							j=g.getUTCMonth();k=g.getUTCDate();q=g.getUTCHours();u=g.getUTCMinutes();v=g.getUTCSeconds();l=g.getUTCMilliseconds()}g=(i<=0||i>=1E4?(i<0?"-":"+")+t(6,i<0?-i:i):t(4,i))+"-"+t(2,j+1)+"-"+t(2,k)+"T"+t(2,q)+":"+t(2,u)+":"+t(2,v)+"."+t(3,l)+"Z"}else g=w;else if(typeof g.toJSON=="function"&&(i!="[object Number]"&&i!="[object String]"&&i!="[object Array]"||p.call(g,"toJSON")))g=g.toJSON(a)}c&&(g=c.call(b,a,g));if(g===w)return"null";i=m.call(g);if(i=="[object Boolean]")return""+g;if(i=="[object Number]")return g>
							-1/0&&g<1/0?""+g:"null";if(i=="[object String]")return G(g);if(typeof g=="object"){for(a=d.length;a--;)if(d[a]===g)throw TypeError();d.push(g);x=[];b=n;n=n+h;if(i=="[object Array]"){j=0;for(a=g.length;j<a;y||(y=o),j++){i=E(j,g,c,e,h,n,d);x.push(i===r?"null":i)}a=y?h?"[\n"+n+x.join(",\n"+n)+"\n"+b+"]":"["+x.join(",")+"]":"[]"}else{B(e||g,function(a){var b=E(a,g,c,e,h,n,d);b!==r&&x.push(G(a)+":"+(h?" ":"")+b);y||(y=o)});a=y?h?"{\n"+n+x.join(",\n"+n)+"\n"+b+"}":"{"+x.join(",")+"}":"{}"}d.pop();return a}};
							k.stringify=function(a,b,c){var e,h,j;if(typeof b=="function"||typeof b=="object"&&b)if(m.call(b)=="[object Function]")h=b;else if(m.call(b)=="[object Array]"){j={};for(var d=0,g=b.length,i;d<g;i=b[d++],(m.call(i)=="[object String]"||m.call(i)=="[object Number]")&&(j[i]=1));}if(c)if(m.call(c)=="[object Number]"){if((c=c-c%1)>0){e="";for(c>10&&(c=10);e.length<c;e=e+" ");}}else m.call(c)=="[object String]"&&(e=c.length<=10?c:c.slice(0,10));return E("",(i={},i[""]=a,i),h,j,e,"",[])}}if(!u("json-parse")){var L=
							String.fromCharCode,M={92:"\\",34:'"',47:"/",98:"\u0008",116:"\t",110:"\n",102:"\u000c",114:"\r"},b,v,j=function(){b=v=w;throw SyntaxError();},q=function(){for(var a=v,f=a.length,c,e,h,k,d;b<f;){d=a.charCodeAt(b);switch(d){case 9:case 10:case 13:case 32:b++;break;case 123:case 125:case 91:case 93:case 58:case 44:c=D?a.charAt(b):a[b];b++;return c;case 34:c="@";for(b++;b<f;){d=a.charCodeAt(b);if(d<32)j();else if(d==92){d=a.charCodeAt(++b);switch(d){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:c=
							c+M[d];b++;break;case 117:e=++b;for(h=b+4;b<h;b++){d=a.charCodeAt(b);d>=48&&d<=57||d>=97&&d<=102||d>=65&&d<=70||j()}c=c+L("0x"+a.slice(e,b));break;default:j()}}else{if(d==34)break;d=a.charCodeAt(b);for(e=b;d>=32&&d!=92&&d!=34;)d=a.charCodeAt(++b);c=c+a.slice(e,b)}}if(a.charCodeAt(b)==34){b++;return c}j();default:e=b;if(d==45){k=o;d=a.charCodeAt(++b)}if(d>=48&&d<=57){for(d==48&&(d=a.charCodeAt(b+1),d>=48&&d<=57)&&j();b<f&&(d=a.charCodeAt(b),d>=48&&d<=57);b++);if(a.charCodeAt(b)==46){for(h=++b;h<f&&
							(d=a.charCodeAt(h),d>=48&&d<=57);h++);h==b&&j();b=h}d=a.charCodeAt(b);if(d==101||d==69){d=a.charCodeAt(++b);(d==43||d==45)&&b++;for(h=b;h<f&&(d=a.charCodeAt(h),d>=48&&d<=57);h++);h==b&&j();b=h}return+a.slice(e,b)}k&&j();if(a.slice(b,b+4)=="true"){b=b+4;return o}if(a.slice(b,b+5)=="false"){b=b+5;return false}if(a.slice(b,b+4)=="null"){b=b+4;return w}j()}}return"$"},F=function(a){var b,c;a=="$"&&j();if(typeof a=="string"){if(a[0]=="@")return a.slice(1);if(a=="["){for(b=[];;c||(c=o)){a=q();if(a=="]")break;
							if(c)if(a==","){a=q();a=="]"&&j()}else j();a==","&&j();b.push(F(a))}return b}if(a=="{"){for(b={};;c||(c=o)){a=q();if(a=="}")break;if(c)if(a==","){a=q();a=="}"&&j()}else j();(a==","||typeof a!="string"||a[0]!="@"||q()!=":")&&j();b[a.slice(1)]=F(q())}return b}j()}return a},I=function(a,b,c){c=H(a,b,c);c===r?delete a[b]:a[b]=c},H=function(a,b,c){var e=a[b],h;if(typeof e=="object"&&e)if(m.call(e)=="[object Array]")for(h=e.length;h--;)I(e,h,c);else B(e,function(a){I(e,a,c)});return c.call(a,b,e)};k.parse=
							function(a,f){var c,e;b=0;v=""+a;c=F(q());q()!="$"&&j();b=v=w;return f&&m.call(f)=="[object Function]"?H((e={},e[""]=c,e),"",f):c}}}C&&define(function(){return k})})(this);
							}());
		                
		                console.log("URL:"+JSON.stringify(res));
		            });
		        });
		    }
		    else
		    {
		    	response.statusCode=500;
	        	response.write("Page failed to load.  Nothing extracted.");
	        	response.close();
	        	page.close();
	        	finished = 1;
		    }
		});
    });

    if (service) {
        console.log('Web server running on port ' + port);
    } else {
        console.log('Error: Could not create web server listening on port ' + port);
        phantom.exit();
    }
}