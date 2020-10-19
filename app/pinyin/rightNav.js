
var _listRightNav = {
	data: null,
	dataName: null,
	dataScope: null,
	navY: null,
	letterList: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
	init: function(attrObj){
		this.data = attrObj.data;
		this.dataName = attrObj.dataName;
		this.dataScope = attrObj.dataScope;
		this.sort();
		this.gropName();
		this.createRightNav();
		this.showLetter();
	},
	sort: function(){ // 数据排序赋值给angularjs属性
		this.data.sort(function(a, b){
			return a.AAC003.localeCompare(b.AAC003, 'zh-CN');
		});
	
		this.dataScope[this.dataName] = this.data;
	},
	gropName: function(){ // 给分组的数据每一组头部加上标识
		var nameArr = this.data.map(function(item){ return item.AAC003 }); // 拿出所有的姓名

		var sortName = this.pySegSort(nameArr); // 拿到根据姓名排序的数组
	
		setTimeout(function(){
			// 找出所有列表项
			var list = document.getElementsByClassName('list-right-nav');
		
			var nowElem = 0; // 在第几个元素上加
		
			// 在每一组的前面加上标识
			sortName.forEach(function(item){
				var p = document.createElement('p');
				p.innerText = item.letter;
				p.setAttribute('style', 'background-color: #eee; padding-left: 10px;');
				p.id = '#' + item.letter;
				document.getElementById('list_content').insertBefore(p, list[nowElem]);
				nowElem += item.data.length
			});
	
		}, 0);
	},
	pySegSort: function(arr){ // 数据分组方法
		var segs = [];

        arr.map(function(item){
          var cur = { letter: item, data: [] };
          var pinyin = pinyinUtil.getPinyin(item, '', false);
          if(segs.length == 0){
            cur.letter = pinyin.slice(0, 1);
            cur.data.push(item);
            segs.push(cur);
          } else {
            segs.map(function(val, i){
              if(val.letter == pinyin.slice(0, 1)){ // 已经存在同一组数据
                segs[i].data.push(item);
                return;
              }
              if(segs.length == i + 1){ // 不存在同一组数据
                cur.letter = pinyin.slice(0, 1);
                cur.data.push(item);
                segs.push(cur);
              }
            });
          }
          
        });
        
        return segs;
	},
	createRightNav: function(){ // 右侧导航元素写入页面

		var frag = document.createDocumentFragment();
		this.letterList.forEach(function(item){
			var p = document.createElement('p');
			p.innerText = item;
			p.setAttribute('style', 'text-align: center; line-height: 10px; font-size: 10px; margin: 0;padding: 3px 0;');
			p.id = item;
			frag.appendChild(p);
		});

		var rightNav = document.createElement('div');
		rightNav.setAttribute('style', 'width: 25px; position: fixed; top: 50%; right: 0; transform: translateY(-50%);');
		rightNav.id = 'rightNav';
		rightNav.appendChild(frag);
		document.body.appendChild(rightNav);
		
		this.rightEvent(this); // 注册导航事件
	},
	rightEvent: function(that){
		
		var elemTop = rightNav.offsetTop; // 导航距离页面顶部距离
		var elemHright = rightNav.offsetHeight; // 导航高度
		var realTop = elemTop - elemHright / 2;

        rightNav.addEventListener('touchmove', function(e){
          	e.preventDefault();

			var showLetter = document.getElementById("showNowLetter");
			showLetter.style.display = 'block'; // 显示当前滑动到字母的元素

			var nowY = e.touches[0].clientY - realTop; // 当前在导航元素的坐标

			var index = Math.ceil(nowY / 16) - 1;
			var id;
			if(index < 0){
				id = '#a';
				showLetter.innerText = "A";
			} else if (index > 25){
				id = '#z';
				showLetter.innerText = "Z";
			} else {
				id = '#' + that.letterList[index].toLocaleLowerCase();
				showLetter.innerText = that.letterList[index];
			}
      
			var elem = document.getElementById(id); // 在页面上找到元素
			if(elem != null){
				var top = elem.offsetTop; // 得到偏移量
				window.scrollTo(0, top); // 设置滚动到指定位置
			}

			rightNav.addEventListener("touchend", function(){ // 手指离开屏幕 字母显示框消失
				showLetter.style.display = 'none';
			});

        }, { passive: false }); // 禁止页面滚动
	},
	showLetter: function(){  // 添加当前滑动到的字母的元素
		var showNowLetter = document.createElement('div');
		showNowLetter.style.cssText = 'width: 3rem; height: 3rem; position: fixed; top: 2rem; right: 2rem; background-color: #ddd; text-align: center; line-height: 3rem; display: none; font-size: 1.5rem; border-radius: 5px';
		showNowLetter.id = 'showNowLetter';
		document.body.appendChild(showNowLetter);
	}
}