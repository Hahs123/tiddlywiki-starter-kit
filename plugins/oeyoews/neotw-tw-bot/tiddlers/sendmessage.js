/*\
title: $:/plugins/oeyoews/neotw-tw-bot/sendmessage.js
type: application/javascript
module-type: library

// 配置UI
// line color

\*/
module.exports = function twBot() {
  const tagsDict = $tw.wiki.getTiddlerData(
    "$:/plugins/oeyoews/neotw-tw-bot/tags.json"
  );
  const tags = Object.entries(tagsDict)
    .filter(([creator]) => creator !== "creator")
    .map(([tag, color]) => ({
      tag,
      color,
    }));
  const selectedTag = localStorage.getItem("selectedTag");
  const defaultTag = selectedTag || tags[0].tag; // 如果localStorage中没有存储标签，则使用第一个标签作为默认标签
  const selectTag = document.createElement("select");
  selectTag.classList.add(
    "appearance-none",
    "border-none",
    "p-2",
    "rounded-sm",
    "cursor-pointer",
    `bg-${tagsDict[defaultTag]}-300`
  );
  selectTag.addEventListener("change", function () {
    // 移除以"bg-"开头的类名
    localStorage.setItem("selectedTag", selectTag.value);
    selectTag.classList.forEach((className) => {
      if (className.startsWith("bg-")) {
        selectTag.classList.remove(className);
      }
    });
    // add new color
    selectTag.classList.add(`bg-${tagsDict[selectTag.value]}-300`);
  });
  tags.forEach(({ tag, color }) => {
    const option = document.createElement("option");
    option.value = tag;
    option.text = tag;
    option.classList.add(`bg-${color}-300`);
    if (tag === defaultTag) {
      option.selected = true; // 设置默认选中标签
      // need listener
      // selectTag.classList.add(`bg-${color}-400`);
    }
    selectTag.appendChild(option);
  });

  // 直接使用fakeDocument会报错
  const form = document.createElement("form");
  form.classList.add(
    "p-2",
    "flex",
    "justify-between",
    "max-w-xl",
    "mx-auto",
    "border",
    "border-2",
    "rounded"
  );

  const button = document.createElement("button");

  const sendIcon = $tw.wiki.getTiddlerText(
    "$:/plugins/oeyoews/neotw-tw-bot/send.svg"
  );
  button.innerHTML = sendIcon;
  button.classList.add(
    "p-2",
    "mx-2",
    "bg-transparent",
    "hover:fill-green-700",
    "scale-125",
    "cursor-not-allowed"
  );
  button.title = "send";
  button.disabled = true; // 不需要使用readonly
  const inputMessage = document.createElement("input");
  // bug
  // inputMessage.setAttribute("autofocus", true);
  inputMessage.classList.add(
    "w-full",
    "mx-2",
    "border-none",
    "placeholder-gray-300",
    "bg-transparent",
    "caret-indigo-500"
  );
  inputMessage.placeholder = `任何${tags.map(({ tag }) => tag).join(",")}`;
  inputMessage.addEventListener("input", function () {
    // 检查输入框的值是否为空，然后设置按钮的禁用状态
    // inputMessage.classList.add(`bg-${tagsDict[selectTag.value]}-300`);
    button.disabled = !inputMessage.value;
    if (button.disabled) {
      button.classList.add("cursor-not-allowed");
    } else {
      button.classList.remove("cursor-not-allowed");
    }
  });
  form.appendChild(selectTag);
  form.appendChild(inputMessage);
  form.appendChild(button);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    sentMessage(selectTag.value);
  });

  const timestamp = new Date().toISOString().replace(/\D/g, "");

  const options = {
    created: timestamp,
    modified: timestamp,
    creator: tagsDict.creator,
  };

  function sentMessage(tag) {
    const tags = tag;
    // create new tiddler
    $tw.wiki.addTiddler({
      // title: `${options.creator}-${tag}-${timestamp}`,
      title: inputMessage.value.slice(0, 5),
      text: inputMessage.value,
      tags,
      ...options,
    });
    // 需要await
    // inputMessage.value = "";
    // 统计当天记录的想法数量
    const count = $tw.wiki.filterTiddlers(
      `[creator[${options.creator}]days[-1]]`
    ).length;

    function createAndDisplayNotification(count) {
      const tempTiddler = "$:/temp/tw-bot/notify";
      $tw.wiki.addTiddler({
        title: tempTiddler,
        text: `这是你今天的第 ${count} 条记录`,
      });
      $tw.notifier.display(tempTiddler);
    }

    typeof Swal !== "undefined"
      ? Swal.fire({
          icon: "success",
          title: `这是你今天的第 ${count} 条记录`,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          position: "top-end",
        })
      : createAndDisplayNotification(count);
  }
  return form;
};
