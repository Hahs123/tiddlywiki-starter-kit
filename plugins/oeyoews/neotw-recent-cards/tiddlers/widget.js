/*\
title: $:/plugins/oeyoews/neotw-recent-cards/widget.js
type: application/javascript
module-type: widget

neotw-recent-cards widget

\*/
(function () {
  /*jslint node: true, browser: true */
  /*global $tw: false */
  'use strict';

  const Widget = require('$:/core/modules/widgets/widget.js').widget;

  class cardsWidget extends Widget {
    constructor(parseTreeNode, options) {
      super(parseTreeNode, options);
    }

    render(parent, nextSibling) {
      if (!$tw.browser) return;

      this.parentDomNode = parent;
      this.computeAttributes();
      this.execute();

      const wiki = $tw.wiki;

      const recentTiddlers = $tw.wiki.filterTiddlers(
        '[!is[system]!has[draft.of]!sort[created]limit[9]]',
      );

      const data = recentTiddlers.map((tiddler) => {
        const { fields } = wiki.getTiddler(tiddler);
        const cover =
          fields['page-cover'] ||
          `https://source.unsplash.com/random?fm=blurhash&w=50&${fields.title}`;
        return {
          title: fields.title,
          cover,
        };
      });

      const container = document.createElement('div');
      container.classList.add('grid', 'grid-cols-3', 'gap-3');
      container.innerHTML = data
        .map((item) => {
          return `
    <div class="flex flex-col items-center group p-0">
      <a class="text-black truncate group-hover:underline mb-2" href="#${item.title}">${item.title}</a>
       <img class="w-48 h-48 rounded-sm group-hover:scale-105 transition" src="${item.cover}" />
    </div>
  `;
        })
        .join('');

      parent.insertBefore(container, nextSibling);
      this.domNodes.push(container);
    }
  }

  exports.cards = cardsWidget;
})();
