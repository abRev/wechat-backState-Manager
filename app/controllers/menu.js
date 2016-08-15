var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	Article = mongoose.model('Article'),
	Button  = mongoose.model('Button'),
	SubButton = mongoose.model('SubButton');
var JSSDK = require('../../libs/jssdk.js');
var request = require('request');
var jssdk = new JSSDK('wx0d3fe90f46946b2b','8d8cd2ec36fa750cfdf7566e850ba03c');

const menuItems = {
	"button":[
		{
			"type":"click",
			"name":"哈哈test",
			"key":"conversation-history"
		},
		{
			"type":"view",
			"name":"随机问答",
			"url":"http://demo.open.weixin.qq.com/jssdk"
		},
		{
			"name":"扫码子菜单",
			"sub_button":[
				{
					"type":"scancode_push",
					"name":"扫码推事件",
					"key":"scanPush"
				},
				{
					"type":"scancode_waitmsg",
					"name":"扫码带提示",
					"key":"scanMsg"
				}
			]
		}
	]
};

module.exports = function (app) {
  app.use('/wechat-back', router);
};

router.get('/menu/index',function(req,res,next){
	res.render('menu/index',{
			title:"主页"
	});
});

router.get('/menu/insert/:num',function(req,res,next){
	if(req.params.num==1){
		res.render('menu/insertFirst',{
			title:'增加一级菜单'
		});
	}else{
		res.render('menu/insertSecond',{
			title:'增加二级菜单'
		});
	}
});

router.post('/menu/insert/1',function(req,res,next){
	console.log(req.body.name);
	res.send('OK');
})

router.get('/menu/:number', function (req, res, next) {
	var number = req.params.number;
	var menu;
	if(number == 1){
		menu = menuItems;
		createMenu(req,res,menu);
	}else if(number == 2){
		Button.find({appId:jssdk.appId}).exec(function(err,buttons){
			if(err){
				return next(err);
			}else{
				SubButton.find({appId:jssdk.appId}).exec(function(errSub,subButtons){
					if(errSub){
						return next(err);
					}else{	
						menu={
							"button":[
							]
						}
						for(index in buttons){
							let button={
								"name":buttons[index].name,
								"type":buttons[index].type,
								"key":buttons[index].key,
								"url":buttons[index].url,
								"media_id":buttons[index].media_id,
								"sub_button":[]
							};
							if(buttons[index].sub_button == 1){
								for(indexSub in subButtons){
									if(subButtons[indexSub].parentName == buttons[index].name){
										var sub={
											"type":subButtons[indexSub].type,
											"name":subButtons[indexSub].name,
											"key":subButtons[indexSub].key,
											"url":subButtons[indexSub].url,
											"media_id":subButtons[indexSub].media_id
										}
										button.sub_button.push(sub);
									}
								}
								
							}
							menu.button.push(button);
						}
						createMenu(req,res,menu);
					}
				});
			}
		});
	}
});

function createMenu(req,res,menu){
	console.log('menu=====>'+JSON.stringify(menu));
	jssdk.getAccessToken(function(err,token){
		if(err){
			console.log(err);
		}
		request.get('https://api.weixin.qq.com/cgi-bin/menu/delete?access_token='+token,function(errGet,resGet,body){
			if(errGet){
				console.log(errGet);
				return next(errGet);
			}
			
			request.post({
				url:"https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+token,
				json:menu
			},function(errPost,resPost,bodyPost){
				if(errPost){
					console.log(errPost);
					return next(errPost);
				}else{
					res.end('OK');
				}
			});
		});
	});
}
