/*\
title: $:/plugins/oeyoews/neotw-unsplash/widget.js
type: application/javascript
module-type: widget

neotw-unsplash widget

\*/
(function () {
  'use strict';

  if (!$tw.browser) return;

  const Widget = require('$:/core/modules/widgets/widget.js').widget;

  class UnsplashWidget extends Widget {
    constructor(parseTreeNode, options) {
      super(parseTreeNode, options);
    }

    render(parent, nextSibling) {
      this.parentDomNode = parent;
      this.computeAttributes();
      this.execute();

      // TODO: use searchcontainer
      // 创建搜索栏和搜索按钮
      function createSearchBar() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'search-input';
        searchInput.placeholder = 'Search photos...';
        searchInput.classList.add(
          'w-4/5',
          'px-3',
          'py-2',
          'bg-white',
          'border',
          'border-gray-300',
          'rounded',
          'shadow-sm',
          'focus:outline-none',
          'focus:border-blue-300',
        );

        const searchBtn = document.createElement('button');
        searchBtn.id = 'search-btn';
        searchBtn.textContent = 'Search';
        searchBtn.classList.add(
          'bg-blue-500',
          'hover:bg-blue-600',
          'text-white',
          'font-semibold',
          'py-2',
          'px-4',
          'mx-2',
          'rounded',
          'shadow',
          'transition',
          'duration-200',
        );

        return { searchInput, searchBtn };
      }

      // 在 Unsplash 上搜索照片
      async function searchPhotos(query) {
        const apiKey = window.localStorage.getItem('unsplashApiKey') || '';
        if (!apiKey) {
          const input = window.prompt(
            'Please enter your Unsplash API Key:',
            '',
          );
          if (input) {
            window.localStorage.setItem('unsplashApiKey', input.trim());
          }
        }
        const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}&lang=en&per_page=21`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;
      }

      // 创建一个照片元素
      function createPhotoElement(photo) {
        const elementWrapper = document.createElement('div');
        elementWrapper.classList.add('w-full', 'md:w-1/2', 'lg:w-1/3', 'p-4');

        const element = document.createElement('div');
        element.classList.add(
          'bg-white',
          'rounded-lg',
          'shadow-lg',
          'overflow-hidden',
          'w-44',
          'h-44',
        );
        element.style.backgroundImage = `url(${photo.urls.small})`;
        element.style.backgroundSize = 'cover';
        element.style.backgroundPosition = 'center';

        // 在照片元素内部创建一个复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.classList.add(
          'bg-blue-400',
          'hover:bg-blue-500',
          'text-white',
          'py-2',
          'px-4',
          'rounded',
          'focus:outline-none',
          'focus:shadow-outline',
          'transform',
          'scale-0',
          'duration-400',
          'transition',
        );
        copyBtn.dataset.photoUrl = photo.urls.regular;
        copyBtn.textContent = 'Copy';

        // 在鼠标悬停时显示复制按钮
        element.addEventListener('mouseenter', () => {
          copyBtn.classList.remove('scale-0');
          copyBtn.classList.add('scale-100');
        });
        element.addEventListener('mouseleave', () => {
          copyBtn.classList.remove('scale-100');
          copyBtn.classList.add('scale-0');
        });

        // 监听复制图片 URL 的按钮点击事件
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText(copyBtn.dataset.photoUrl);
          pushNotify('info', 'Unplash', 'copyed');
        });

        // 在照片元素内部创建一个文本元素，显示图片描述信息
        const textElement = document.createElement('div');
        textElement.classList.add(
          'text-white',
          'py-2',
          'px-4',
          'text-sm',
          'truncate',
        );
        textElement.textContent = photo.alt_description || '';

        element.appendChild(copyBtn);
        element.appendChild(textElement);
        elementWrapper.appendChild(element);

        return elementWrapper;
      }

      const unsplashNode = this.document.createElement('div');
      unsplashNode.id = 'unsplashApp';

      // 创建搜索栏和搜索按钮
      const { searchInput, searchBtn } = createSearchBar();
      unsplashNode.appendChild(searchInput);
      unsplashNode.appendChild(searchBtn);

      // 添加搜索结果容器到页面中
      const resultsContainer = document.createElement('div');
      resultsContainer.id = 'results-container';
      resultsContainer.classList.add(
        'flex',
        'flex-wrap',
        'justify-between',
        'mt-8',
      );
      unsplashNode.appendChild(resultsContainer);

      parent.insertBefore(unsplashNode, nextSibling);

      // 从 localStorage 中读取上一次的搜索关键字，并执行搜索
      const savedQuery = window.localStorage.getItem('unsplashSearchQuery');
      if (savedQuery) {
        searchInput.value = savedQuery;
        performSearch();
      }

      // 在 Unsplash 上搜索照片
      async function performSearch() {
        resultsContainer.innerHTML = '';
        const query = searchInput.value.trim();

        if (!query) {
          return;
        }

        // 将搜索关键字存储到 localStorage 中
        window.localStorage.setItem('unsplashSearchQuery', query);

        try {
          const photos = await searchPhotos(query);

          photos.forEach(photo => {
            const element = createPhotoElement(photo);
            resultsContainer.appendChild(element);
          });
        } catch (error) {
          console.log(error);
        }
      }

      // 创建 debounce 函数
      function debounce(fn, delay) {
        let timerId;
        return function (...args) {
          const context = this;
          clearTimeout(timerId);
          timerId = setTimeout(() => fn.apply(context, args), delay);
        };
      }

      // 监听搜索栏输入框的键盘事件
      searchInput.addEventListener('keyup', debounce(performSearch, 1000));

      // 监听点击搜索按钮的事件
      searchBtn.addEventListener('click', debounce(performSearch, 1000));
    }
  }

  exports['unsplash'] = UnsplashWidget;
})();
