G_ENV = "0"; //test
G_USERTYPE = "1"; //   1.client端  2.server端   3.小宝
G_COMKEY = "torh";
G_APPNAME = "昵窝";
G_CHECKVERONSTART = false; //0打开应用即检测，1登录后检测
G_BINDPUSH = false; /*是否在登录成功绑定webSocket */
G_OSTYPE = 0; /*安装平台类型：1安卓，2iOS*/
G_LOGINTYPE = 1; /* 登录类型  1手动登录，2自动登录 */
G_LOCALDB = "1.21"; /*数据库版本，修改数据库后需要修改版本号*/
G_APPDOWNURL = "https://itunes.apple.com/us/app/id1232989165?mt=8"; /*输入当前APP 在 appstore的下载地址的URL*/
G_SERVERS = {
	"1": {
		web: "http://owner.api.60living.com/",
		push: "ws://owner.api.60living.com/socket",
		img: "http://img.60living.com",
		name: ""
	},
	"0": {
		web: "http://116.62.208.39:8080",
		push: "ws://192.168.89.45:2080/socket",
		img: "http://img.60community.com",
		name: "-0号"
	}
};

G_ROOTDIR = (window.location + "").substring(0, (window.location + "").lastIndexOf("/") + 1);
G_ISBROWSE = (G_ROOTDIR.indexOf("file://") == -1);
G_ISPC = !($.os.android || $.os.ios || $.os.touchpad || $.os.blackberry);
G_ROOTURL = (G_ISBROWSE ? G_ROOTDIR : G_SERVERS[G_ENV].web);
G_ROOTURLONE = (G_ISBROWSE ? G_ROOTDIR : (G_SERVERS[G_ENV].webone) ? G_SERVERS[G_ENV].webone : G_SERVERS[G_ENV].web);
G_MOCKUPSVR = G_ROOTDIR + "mockupsvr/";
G_PUSHSVR = G_SERVERS[G_ENV].push;
G_IMGPREFIX = G_SERVERS[G_ENV].img;
G_SPLITCHAR = " • ";
G_SERVERTIME = 0;
G_PLUSUIREADY = 0;
RETRYOUTTIME = 1000; //ajax请求超时时间
RETRYTIMES = 2; //ajax请求失败重试次数,加上本来一次，共3次
G_POPUPSHOW = false; //当为true时，不执行af.touchLayer.js 586行的e.preventDefault(); popup在show时将POPUPSHOW改为true，当执行popup的hide方法时将POPUPSHOW重置为false. ymkadun-2016/1/6
LastAjaxOpts = {};
G_LOG_TYPE = 0;
webContent = {
	mockupsvr: G_MOCKUPSVR,
	rootUrlOne: G_ROOTURLONE,
	rootUrl: G_ROOTURL,
	rootDir: G_ROOTDIR,
	appname: G_APPNAME + G_SERVERS[G_ENV].name,
	appVersion: "0.0.0.0",
	doSearch: function() {},
	searchHistory: []
};
G_CONTENTTYPE = "application/json; charset=UTF-8";
G_UPLOAD = false; //避免为修改图像时，也上传图片到服务器