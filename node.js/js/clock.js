
addEventListener('load', function () {
  // 시간을 딜레이 없이 나타내기 위한 선 실행
  // 이후 1초에 한번씩 시간을 갱신
  realTimer();
  setInterval(realTimer, 1000);
});
function realTimer() {
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
