function hitokoto_footer() {
  fetch('https://v1.hitokoto.cn')
    .then(response => response.json())
    .then(data => {
      const hitokoto = document.querySelector('#h-text');
      let data_ = data.hitokoto;
      // if(data_.length > 22){
      // data_ = data_.substring(0,22);
      // data_ = data_ + "…";
      // }
      hitokoto.innerText = data_;
      const hitokoto_from = document.querySelector('#h-author');
      // hitokoto_from.href = "https://hitokoto.cn/?uuid=" + data.uuid;
      hitokoto_from.innerText = '@' + data.from;
    })
    .catch(console.error);
}

hitokoto_footer();
setInterval(hitokoto_footer, 30000);
