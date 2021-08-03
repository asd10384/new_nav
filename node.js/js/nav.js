
addEventListener('load', function () {
  // 시계
  navtime();
  setInterval(navtime, 1000);

  // nav
  let menuToggle = document.querySelector('.toggle');
  let nav = document.querySelector('.nav');
  menuToggle.onclick = function() {
    console.log(nav.style.display);
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  }
  
  // add active class in selected list item
  let list = document.querySelectorAll('.list');
  for (let i=0; i<list.length; i++) {
    list[i].onclick = function() {
      let j = 0;
      while (j < list.length) {
        list[j++].className = 'list';
      }
      list[i].className = 'list active';
    }
  }
});


function navtime() {
  const nowDate = new Date();
  var element = document.getElementById('realtime')
  element.setAttribute('style', 'margin-bottom: 0;');
  element.innerHTML =
    `${nowDate.getFullYear()
    }년 ${az(nowDate.getMonth() + 1)
    }월 ${az(nowDate.getDate())
    }일<br/>${az(nowDate.getHours())
    }시 ${az(nowDate.getMinutes())
    }분 ${az(nowDate.getSeconds())
    }초`;
}

function az(num) {
  return num < 10 ? '0' + num : num;
}
