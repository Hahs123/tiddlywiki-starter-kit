/*\
title: docs/code.js
type: application/javascript
description: tw-typed is a tw api declaration for typescript, it also works for javascript;下面是插件开发中经常使用到的一些方法
\*/

// wiki api
const wiki = $tw.wiki;

// some methods
$tw.utils.copyToClipboard();

// get/add/set/delete/search
wiki.getTiddler().fields;
wiki.getTiddlerData();
wiki.getTiddlerText();
wiki.addTiddler();
wiki.setText(title, key, null, value);
wiki.deleteTiddler();
wiki.filterTiddlers('[!is[system]]');
wiki.getTiddlersWithTag(tag);
$tw.wiki.getTiddlersAsJson(title);

wiki.setTiddlerData(title, data, fields, options);

// dom
$tw.utils.domMaker; // createElement

wiki.addTiddler(
  new $tw.Tiddler({
    title: 'title content',
    text: 'text content',
  }),
);
wiki.addTiddler({
  title: 'title content',
  text: 'text content',
});
// https://github.com/Jermolene/TiddlyWiki5/blob/4b56cb42983d4134715eb7fe7b083fdcc04980f0/core/modules/startup/rootwidget.js#L58
$tw.notifier.display(tiddler); // send notification
$tw.modal.display(title); // show a dialog

// widget
this.getVariable('currentTiddler'); // 获取当前条目名称;
this.getVariable('storyTiddler'); // 判断是否是处于story river

/** class
 *
 */

// 如果目标元素没有class可以使用，仅支持单个class
// $tw.utils.addClass(commode, 'font-bold')
// tiddler的field的class支持设置样式就是来源于此，除了这一点，在写第三方插件的过程中感觉这种这种写法并没有比className有什么优势， 更推荐使用classList方法
exports.addClass = function (el, className) {
  var c = (el.getAttribute('class') || '').split(' ');
  if (c.indexOf(className) === -1) {
    c.push(className);
    el.setAttribute('class', c.join(' '));
  }
};

// 移除class
exports.removeClass = function (el, className) {
  var c = (el.getAttribute('class') || '').split(' '),
    p = c.indexOf(className);
  if (p !== -1) {
    c.splice(p, 1);
    el.setAttribute('class', c.join(' '));
  }
};

// 切换class
exports.toggleClass = function (el, className, status) {
  if (status === undefined) {
    status = !exports.hasClass(el, className);
  }
  if (status) {
    exports.addClass(el, className);
  } else {
    exports.removeClass(el, className);
  }
};

// tw会将你写的widget使用两个function 进行包裹起来, 可以看到这里最外层有tw require console exports module等等, 这也就是为什么可以使用require tw的原因
(function (
  module,
  exports,
  console,
  setInterval,
  clearInterval,
  setTimeout,
  clearTimeout,
  Buffer,
  $tw,
  require,
) {
  (function () {
    /*\
title: nprogress/startup.js
type: application/javascript
module-type: startup

nprogress module

\*/
    (function () {
      /*jslint node: true, browser: true */
      /*global $tw: false */
      'use strict';

      exports.name = 'nprogress-startup-hook';
      exports.platforms = ['browser'];
      exports.after = ['load-modules'];
      exports.synchronous = true;
      exports.startup = xxx;
    })();
  })();

  return exports;
});

//# sourceURL=nprogress/startup.js
