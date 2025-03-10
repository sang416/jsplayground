// DOM 요소 캐싱 및 이벤트 핸들러 관리
$(function() {
  // 자주 사용하는 DOM 요소 캐싱
  const $body = $('body');
  const $navbar = $('.navbar');
  const $blackBg = $('.black-bg');
  const $badge = $('.badge');
  const $listGroup = $('.list-group');

  let audioUnlocked = false;
  let myHowlerSound;

  gsap.from("#title", { duration: 2, opacity: 0, y: -50, ease: "bounce", repeat: -1, yoyo: true });

  // Play 버튼에 이미 있는 클릭 이벤트에 GSAP 효과 추가
  $('#playButton').on('click', function() {
    // 이 버튼에만 GSAP 효과 적용
    const $this = $(this);
    gsap.timeline()
      .to($this, { scale: 0.9, duration: 0.1 })
      .to($this, { scale: 1.1, duration: 0.2, backgroundColor: '#28a745' })
      .to($this, { scale: 1.0, duration: 0.1 });
      
    // 기존 오디오 관련 코드는 그대로 유지
    if (!audioUnlocked) {
      // You can 'unlock' the audio by just playing a silent track.
      // You can also remove this line, but you will need to play the audio on the next interaction.
      myHowlerSound = new Howl({
          src: ['/nawhij_Cloud Nine.mp3'], // audio url
          // loop: true,
      });
      myHowlerSound.play();
      myHowlerSound.pause();

      audioUnlocked = true;
    }
    // Now play the sound if it is already loaded.
    if(myHowlerSound && !myHowlerSound.playing()){
      myHowlerSound.play();
    }
  });

  // Stop 버튼에 이미 있는 클릭 이벤트에 GSAP 효과 추가
  $('#stopButton').on('click', function() {
    // 이 버튼에만 GSAP 효과 적용
    const $this = $(this);
    gsap.timeline()
      .to($this, { scale: 0.9, duration: 0.1 })
      .to($this, { x: -5, duration: 0.1, backgroundColor: '#dc3545' })
      .to($this, { x: 5, duration: 0.1 })
      .to($this, { x: 0, scale: 1.0, duration: 0.1 });
      
    // 기존 오디오 정지 코드는 그대로 유지
    if(myHowlerSound){
      myHowlerSound.stop();
    }
  });

  // 테마 관련 함수
  const themeManager = {
    isDarkMode: false,
    
    toggleTheme: function() {
      this.isDarkMode = !this.isDarkMode;
      
      if (this.isDarkMode) {
        // 다크 모드로 변경
        $body.removeClass('light-mode').addClass('dark-mode');
        $navbar.removeClass('bg-light').addClass('bg-dark');
        $badge.text('Light Mode 🔄')
              .css('color', 'black')
              .removeClass('bg-dark')
              .addClass('bg-light');
        
        // Prism 테마 변경
        document.getElementById('prism-light').disabled = true;
        document.getElementById('prism-dark').disabled = false;
      } else {
        // 라이트 모드로 변경
        $body.removeClass('dark-mode').addClass('light-mode');
        $navbar.removeClass('bg-dark').addClass('bg-light');
        $badge.text('Dark Mode 🔄')
              .css('color', 'white')
              .removeClass('bg-light')
              .addClass('bg-dark');
        
        // Prism 테마 변경
        document.getElementById('prism-light').disabled = false;
        document.getElementById('prism-dark').disabled = true;
      }
    },
    
    applyThemeToModal: function() {
      const bgColor = this.isDarkMode ? '#333' : 'white';
      $('.white-bg').css('background-color', bgColor);
    }
  };
  
  // 토스트 메시지 설정 객체
  const toastConfig = {
    positionClass: 'toast-top-center',
    closeButton: true,
    progressBar: true,
    timeOut: 5000,
    preventDuplicates: true,     // 중복 메시지 방지
    newestOnTop: false,          
    maxOpened: 1,                // 최대 1개의 토스트만 표시
    autoDismiss: true   
  };
  
  // 이벤트 핸들러 등록
  $('.navbar-toggler').on('click', function(e) {
    e.stopPropagation(); // 이벤트 버블링 방지
    $listGroup.slideToggle(300);
  });

  $('.lorem').on('scroll', function() {
    const scrollTop = $(this).scrollTop();
    const height = $(this).height();
    const scrollHeight = $(this).prop("scrollHeight");
    
    // 스크롤 위치가 전체 높이의 95% 이상일 때 이벤트 발생
    if (scrollTop + height > scrollHeight * 0.95) {
      toastr.error('스크롤이 맨 아래에 도달했습니다.','스크롤 끝남!',
        {
          ...toastConfig,
          extendedTimeOut: 1000
        });
    }
  });
  
  // 리스트 외부 클릭 시 리스트 닫기
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.list-group, .navbar-toggler').length && $listGroup.is(':visible')) {
      $listGroup.slideUp(300);
    }
  });
  
  $('.login-btn').on('click', () => {
    $blackBg.toggleClass('show-modal');
    themeManager.applyThemeToModal();
  });

  $('.home-btn').on('click', () => {
    window.location.href = '#';
  });
  
  $('#close').on('click', () => $blackBg.toggleClass('show-modal'));
  
  $blackBg.on('click', function(e) {
    if (e.target === this) {
      $blackBg.toggleClass('show-modal');
    }
  });
  
  $('#theme-toggle').on('click', () => themeManager.toggleTheme());
  
  $('form').on('submit', (e) => {
    const email = $('#exampleInputEmail1').val();
    const password = $('#exampleInputPassword1').val();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{8,}$/;

    if (!regex.test(email)) {
      e.preventDefault();
      toastr.error('이메일 주소를 바르게 입력해주세요', '이메일 주소 에러', {
        ...toastConfig,
        extendedTimeOut: 1000
      });
    }
    if (passwordRegex.test(password)) {
      e.preventDefault();
      toastr.error('비밀번호를 바르게 입력해주세요', '비밀번호 에러', {
        ...toastConfig,
        extendedTimeOut: 1000
      });
    }
  });
  
  $('#button').on('click', () => {
    const $clickCount = $('#clickCount');
    $clickCount.text(Number($clickCount.text()) + 1);
  });
  
  // 초기화: 라이트 모드 적용
  $body.addClass('light-mode');
  $navbar.addClass('bg-light');
  
  // 페이지 로드 시 이벤트
  $(document).ready(() => {
    
    // 이벤트 알림
    // toastr.info('5초안에 이벤트에 응모하셔야 합니다.', '빅 이벤트!!!', toastConfig);
    // const regex = /\)(?:[^\)]*\))\s*(\w+)/;
    const regex = /^.*?\)/;
    const userAgent = globalThis.navigator.userAgent.match(regex);
    $('#userInfo').text(userAgent[0]);
    // $('#userInfo').text(globalThis.navigator.userAgent);
    $('#userPlatform').text(globalThis.navigator.platform);
    getUserIp();
    console.log(userAgent);
    let nowtime = 5;
    // 알림 숨기기
    let timer = setInterval(() =>{
      nowtime--;
      $('#offtime').text(nowtime);
      if(nowtime == 0){
        $('.alert').hide();
        clearInterval(timer);
      }
    }, 1000);
    // 웹 워커 처리
    initWebWorker();
  });
});

// 비동기 처리를 위한 웹 워커 초기화
function initWebWorker() {
  const workerScript = `
    function waitSync(milliseconds) {
      const start = Date.now();
      while (Date.now() - start < milliseconds) {}
    }

    self.onmessage = function(e) {
      waitSync(50);
      self.postMessage('Process complete!');
    }
  `;

  const blob = new Blob([workerScript], { type: 'text/javascript' });
  const worker = new Worker(window.URL.createObjectURL(blob));
  const items = new Array(100).fill(null);
  
  (async () => {
    for (const i of items) {
      worker.postMessage(i);
      
      await new Promise(resolve => {
        worker.onmessage = function(e) {
          const $loopCount = $('#loopCount');
          $loopCount.text(Number($loopCount.text()) + 1);
          resolve();
        };
      });
    }
  })();
}

// 동기 대기 함수 (사용 권장하지 않음 - 성능 문제)
// 참고용으로만 유지, 실제 사용 시 setTimeout 또는 Promise 사용 권장
function waitSync(milliseconds) {
  const start = Date.now();
  while (Date.now() - start < milliseconds) {}
}

function getUserIp() {
  fetch('https://api64.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                console.log('IP 조회 성공');
                console.log(data.ip);
                $('#userIP').text(data.ip);
                return data.ip;
            })
            .catch(error => {
                console.error('IP 조회 실패:', error);
            });
}

const $slidecontainer = $('.slide-container');
let curpic = 1;
const slidenum = [1,2,3,4];
slidenum.forEach((num) => {
  $('.slide-' + num).on('click',() => {
    $slidecontainer.css('transform', `translateX(${(num - 1) * -100}vw)`);
    curpic = num;
  }
  );
});

$('.slide-5').on('click', function() {
  if (curpic > 1) {
    curpic--;
    $slidecontainer.css('transform', `translateX(-${(curpic - 1) * 100}vw)`);
  }
});
$('.slide-6').on('click', function() {
  if (curpic < 4) {
    curpic++;
    $slidecontainer.css('transform', `translateX(-${(curpic - 1) * 100}vw)`);
  }   
});

// Hammer.js를 이용한 swipe 이벤트 처리
const slideContainer = document.querySelector('.slide-container');
const hammer = new Hammer(slideContainer);

hammer.on('swipeleft', function() {
  if (curpic < 4) {
    curpic++;
    $('.slide-container').css('transform', `translateX(-${(curpic - 1) * 100}vw)`);
  }
});

hammer.on('swiperight', function() {
  if (curpic > 1) {
    curpic--;
    $('.slide-container').css('transform', `translateX(-${(curpic - 1) * 100}vw)`);
  }
});


$(window).scroll(function() {
  window.scrollY > 100 ? $('.navbar-brand').css('font-size', '20px') : $('.navbar-brand').css('font-size', '25px');
});





