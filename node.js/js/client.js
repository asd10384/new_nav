
const publicKey = 'BNNHIhlClmTFFeGtkkgvDLAah8Q8lC0269ZAWVa9kBnGCW3NP3GrkkG0lXy5ZOKxfVf9bsPXcJ64i55sxuwxHjc';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  }).catch(() => {
    alert(`알림을 보낼수 없는 기기입니다.\n알림을 받으시려면\n다른 브라우저를 이용해주세요.`)
  });
}

async function getdb() {
  const register = await navigator.serviceWorker.ready;

  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  }).catch(() => {
    alert(`알림을 보낼수 없는 기기입니다.\n알림을 받으시려면\n다른 브라우저를 이용해주세요.`)
    return false;
  });

  if (subscription) return await fetch('/subscribe/setdb', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
