/**
 * DOM 요소 캐싱 및 초기화 
 *
 * @type {{ elements: {}; init: () => void; }}
 */
const DOMManager = {
  elements: {},
  
  init: () => {
    // 자주 사용하는 DOM 요소 캐싱
    DOMManager.elements = {
      body: $('body'),
      navbar: $('.navbar'),
      blackBg: $('.black-bg'),
      badge: $('.badge'),
      listGroup: $('.list-group'),
      slideContainer: $('.slide-container')
    };
    
    // 초기화: 라이트 모드 적용
    DOMManager.elements.body.addClass('light-mode');
    DOMManager.elements.navbar.addClass('bg-light');
  }
};

/**
 * 오디오 관리자
 *
 * @type {{ unlocked: boolean; sound: any; init: () => void; playAudio: () => void; stopAudio: () => void; applyButtonAnimation: ($button: any, ...steps: {}) => void; }}
 */
const AudioManager = {
  unlocked: false,
  sound: null,
  
  init: () => {
    $('#playButton').on('click', () => AudioManager.playAudio());
    $('#stopButton').on('click', () => AudioManager.stopAudio());
  },
  
  playAudio: () => {
    const $button = $('#playButton');
    AudioManager.applyButtonAnimation($button, {
      scale: 0.9, 
      duration: 0.1
    }, {
      scale: 1.1, 
      duration: 0.2, 
      backgroundColor: '#28a745'
    }, {
      scale: 1.0, 
      duration: 0.1
    });
    
    if (!AudioManager.unlocked) {
      AudioManager.sound = new Howl({
        src: ['/nawhij_Cloud Nine.mp3']
      });
      AudioManager.sound.play();
      AudioManager.sound.pause();
      AudioManager.unlocked = true;
    }
    
    if(AudioManager.sound && !AudioManager.sound.playing()){
      AudioManager.sound.play();
    }
  },
  
  stopAudio: () => {
    const $button = $('#stopButton');
    AudioManager.applyButtonAnimation($button, {
      scale: 0.9, 
      duration: 0.1
    }, {
      x: -5, 
      duration: 0.1, 
      backgroundColor: '#dc3545'
    }, {
      x: 5, 
      duration: 0.1
    }, {
      x: 0, 
      scale: 1.0, 
      duration: 0.1
    });
    
    if(AudioManager.sound){
      AudioManager.sound.stop();
    }
  },
  
  applyButtonAnimation: ($button, ...steps) => {
    const timeline = gsap.timeline();
    steps.forEach(step => {
      timeline.to($button, step);
    });
  }
};

/**
 * 테마 관련 함수
 *
 * @type {{ isDarkMode: boolean; init: () => void; toggleTheme: () => void; applyThemeToModal: () => void; }}
 */
const ThemeManager = {
  isDarkMode: false,
  
  init: () => {
    $('#theme-toggle').on('click', () => ThemeManager.toggleTheme());
  },
  
  toggleTheme: () => {
    ThemeManager.isDarkMode = !ThemeManager.isDarkMode;
    const elements = DOMManager.elements;
    
    if (ThemeManager.isDarkMode) {
      // 다크 모드로 변경
      elements.body.removeClass('light-mode').addClass('dark-mode');
      elements.navbar.removeClass('bg-light').addClass('bg-dark');
      elements.badge.text('Light Mode 🔄')
            .css('color', 'black')
            .removeClass('bg-dark')
            .addClass('bg-light');
      
      // Prism 테마 변경
      $('#prism-light').prop('disabled', true);
      $('#prism-dark').prop('disabled', false);
      // 하이라이팅 다시 적용
      Prism.highlightAll();
    } else {
      // 라이트 모드로 변경
      elements.body.removeClass('dark-mode').addClass('light-mode');
      elements.navbar.removeClass('bg-dark').addClass('bg-light');
      elements.badge.text('Dark Mode 🔄')
            .css('color', 'white')
            .removeClass('bg-light')
            .addClass('bg-dark');
      
      // Prism 테마 변경
      $('#prism-light').prop('disabled', false);
      $('#prism-dark').prop('disabled', true);
      // 하이라이팅 다시 적용
      Prism.highlightAll();
    }
  },
  
  applyThemeToModal: () => {
    const bgColor = ThemeManager.isDarkMode ? '#333' : 'white';
    $('.white-bg').css('background-color', bgColor);
  }
};

/**
 * 토스트 메시지 관리자
 *
 * @type {{ config: { positionClass: string; closeButton: boolean; progressBar: boolean; timeOut: number; preventDuplicates: boolean; newestOnTop: boolean; maxOpened: number; autoDismiss: boolean; }; showError: (message: any, title: any, options?: {}) => void; showInfo: (message: any, title: any, options?: {}) => void; }}
 */
const ToastManager = {
  config: {
    positionClass: 'toast-top-center',
    closeButton: true,
    progressBar: true,
    timeOut: 5000,
    preventDuplicates: true,
    newestOnTop: false,
    autoDismiss: true
    // maxOpened: 1
  },
  
  showError: (message, title, options = {}) => {
    toastr.error(message, title, {
      ...ToastManager.config,
      ...options
    });
  },
  
  showInfo: (message, title, options = {}) => {
    toastr.info(message, title, {
      ...ToastManager.config,
      ...options
    });
  }
};

/**
 * 슬라이드 관리자
 *
 * @type {{ currentSlide: number; totalSlides: number; init: () => void; goToSlide: (slideNum: any) => void; prevSlide: () => void; nextSlide: () => void; initSwipeEvents: () => void; }}
 */
const SlideManager = {
  currentSlide: 1,
  totalSlides: 4,
  
  init: () => {
    // 슬라이드 버튼 이벤트 설정
    for (let i = 1; i <= SlideManager.totalSlides; i++) {
      $(`.slide-${i}`).on('click', () => SlideManager.goToSlide(i));
    }
    
    // 이전/다음 버튼 이벤트
    $('.slide-5').on('click', () => SlideManager.prevSlide());
    $('.slide-6').on('click', () => SlideManager.nextSlide());
    
    // Hammer.js 스와이프 이벤트 설정
    SlideManager.initSwipeEvents();
  },
  
  goToSlide: (slideNum) => {
    DOMManager.elements.slideContainer.css('transform', `translateX(${(slideNum - 1) * -100}vw)`);
    SlideManager.currentSlide = slideNum;
  },
  
  prevSlide: () => {
    if (SlideManager.currentSlide > 1) {
      SlideManager.currentSlide--;
      SlideManager.goToSlide(SlideManager.currentSlide);
    }
  },
  
  nextSlide: () => {
    if (SlideManager.currentSlide < SlideManager.totalSlides) {
      SlideManager.currentSlide++;
      SlideManager.goToSlide(SlideManager.currentSlide);
    }
  },
  
  initSwipeEvents: () => {
    const slideContainer = document.querySelector('.slide-container');
    const hammer = new Hammer(slideContainer);
    
    hammer.on('swipeleft', () => SlideManager.nextSlide());
    hammer.on('swiperight', () => SlideManager.prevSlide());
  }
};

/**
 * 이벤트 핸들러 관리자
 *
 * @type {{ init: () => void; setupNavbarEvents: () => void; setupScrollEvents: () => void; setupFormEvents: () => void; setupModalEvents: () => void; setupCounterEvents: () => void; }}
 */
const EventManager = {
  init: () => {
    EventManager.setupNavbarEvents();
    EventManager.setupScrollEvents();
    EventManager.setupFormEvents();
    EventManager.setupModalEvents();
    EventManager.setupCounterEvents();
    EventManager.loadCode();
    EventManager.loadCssCode();
    EventManager.setupProgressEvents();
    EventManager.clickTab();

    // GSAP 애니메이션 설정
    // gsap.from("#title", { 
    //   duration: 2, 
    //   opacity: 0, 
    //   y: -50, 
    //   ease: "bounce", 
    //   repeat: -1, 
    //   yoyo: true 
    // });
  },
  
  setupNavbarEvents: () => {
    const elements = DOMManager.elements;
    
    $('.navbar-toggler').on('click', (e) => {
      e.stopPropagation();
      elements.listGroup.slideToggle(300);
    });
    
    $(document).on('click', (e) => {
      if (!$(e.target).closest('.list-group, .navbar-toggler').length && 
          elements.listGroup.is(':visible')) {
        elements.listGroup.slideUp(300);
      }
    });
    
    // 네비게이션 바 크기 조절
    $(window).scroll(() => {
      window.scrollY > 100 
        ? $('.navbar-brand').css('font-size', '20px') 
        : $('.navbar-brand').css('font-size', '25px');
    });
  },
  
  setupScrollEvents: () => {
    $('.lorem').on('scroll', () => {
      const scrollTop = $(this).scrollTop();
      const height = $(this).height();
      const scrollHeight = $(this).prop("scrollHeight");
      let isBottom = false;

      if ((scrollTop + height > scrollHeight * 0.95) && !isBottom) {
        isBottom = true;
        ToastManager.showError('스크롤이 맨 아래에 도달했습니다.', '스크롤 끝남!', {
          extendedTimeOut: 1000
        });
      } else {
        isBottom = false;
      }
    });
  },

  setupProgressEvents: () => {
    $(window).on('scroll', () => {
      const scrollTop = $(window).scrollTop();
      const windowHeight = $(window).height();
      const documentHeight = $(document).height();
      // console.log(scrollTop, windowHeight, documentHeight);
      const progress = ((scrollTop + windowHeight) / documentHeight) * 100;
      $('.progress').val(progress);
    });
  },
  
  setupFormEvents: () => {
    $('form').on('submit', (e) => {
      const email = $('#exampleInputEmail1').val();
      const password = $('#exampleInputPassword1').val();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const passwordRegex = /^.{8,}$/;

      if (!emailRegex.test(email)) {
        e.preventDefault();
        ToastManager.showError('이메일 주소를 바르게 입력해주세요', '이메일 주소 에러', {
          extendedTimeOut: 1000
        });
      }
      
      if (passwordRegex.test(password)) {
        e.preventDefault();
        ToastManager.showError('비밀번호를 바르게 입력해주세요', '비밀번호 에러', {
          extendedTimeOut: 1000
        });
      }
    });
  },
  
  setupModalEvents: () => {
    const elements = DOMManager.elements;
    
    $('.login-btn').on('click', () => {
      elements.blackBg.toggleClass('show-modal');
      ThemeManager.applyThemeToModal();
    });

    $('.home-btn').on('click', () => {
      window.location.href = '#';
    });
    
    $('#close').on('click', () => elements.blackBg.toggleClass('show-modal'));
    
    // elements.blackBg = $('.black-bg')
    elements.blackBg.on('click', (e) => {
      console.log("%c e.target", "background-color: red; color: black", e.target);
      console.log("%c e.currentTarget", "background-color: yellow; color: black", e.currentTarget);
      console.log("%c this", "background-color: green; color: black", globalThis);
      console.log("%c elements.blackBg", "background-color: orange; color: black", elements.blackBg);
      console.log("--------------------------------");
      if (e.target === e.currentTarget) {
        elements.blackBg.toggleClass('show-modal');
      }
    });
  },
  
  setupCounterEvents: () => {
    $('#button').on('click', () => {
      const $clickCount = $('#clickCount');
      $clickCount.text(Number($clickCount.text()) + 1);
    });
  },

  loadCode : async () => {
    const response = await fetch('./myjava.js'); // 외부 코드 파일
    const code = await response.text();
    document.getElementById('code-block').textContent = code;
    Prism.highlightAll(); // Prism.js 하이라이팅 적용
  },

  loadCssCode : async () => {
    const response = await fetch('./main.css'); // 외부 코드 파일
    const code = await response.text();
    document.getElementById('css-block').textContent = code;
    Prism.highlightAll(); // Prism.js 하이라이팅 적용
  },

  clickTab: () => {
    const $tabButton = $('.tab-button');
    const $tabContent = $('.tab-content');
    
    // 이벤트 위임(Event Delegation)을 사용하여 개별 이벤트 리스너 대신 부모 요소에 하나의 이벤트 리스너 등록
    $('.list').on('click', '.tab-button', function() {
      const index = $(this).index();
      
      $tabButton.removeClass('orange');
      $tabContent.removeClass('show');
      
      $(this).addClass('orange');
      $tabContent.eq(index).addClass('show');
    });
  }
};

/**
 * 유틸리티 함수
 *
 * @type {{ getUserInfo: () => void; getUserIp: () => void; startCountdown: (seconds: any, onComplete: any) => any; }}
 */
const Utils = {
  getUserInfo: () => {
    const regex = /^.*?\)/;
    const userAgent = globalThis.navigator.userAgent.match(regex);
    $('#userInfo').text(userAgent[0]);
    $('#userPlatform').text(globalThis.navigator.platform);
    Utils.getUserIp();
  },
  
  getUserIp: () => {
    fetch('https://api64.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        console.log('IP 조회 성공');
        $('#userIP').text(data.ip);
        return data.ip;
      })
      .catch(error => {
        console.error('IP 조회 실패:', error);
      });
  },
  
  startCountdown: (seconds, onComplete) => {
    let timeLeft = seconds;
    const $offtime = $('#offtime');
    
    const timer = setInterval(() => {
      timeLeft--;
      $offtime.text(timeLeft);
      
      if (timeLeft === 0) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 1000);
    
    return timer;
  }
};

/**
 * 웹 워커 관리자
 *
 * @type {{ init: () => void; }}
 */
const WebWorkerManager = {
  init: () => {
    const workerScript = `
      function waitSync(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds) {}
      }

      self.onmessage = (e) => {
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
          worker.onmessage = (e) => {
            const $loopCount = $('#loopCount');
            $loopCount.text(Number($loopCount.text()) + 1);
            resolve();
          };
        });
      }
    })();
  }
};

// 애플리케이션 초기화
$(() => {
  // 각 모듈 초기화
  DOMManager.init();
  AudioManager.init();
  ThemeManager.init();
  SlideManager.init();
  EventManager.init();
  const $content = $('.content');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold : 0.5
  });
  $content.each(function() {
    observer.observe(this);
  });
  // 페이지 로드 시 실행
  $(document).ready(() => {
    Utils.getUserInfo();
    
    // 알림 타이머 시작
    Utils.startCountdown(5, () => {
      $('.alert').hide();
    });
    
    // 웹 워커 초기화
    WebWorkerManager.init();

    // const animateTitle = () =>{
    //   $('#title').animate({'fontSize': '100px','color': 'blue'}, 1000,'easeOutBounce',()=> $('h1').animate({'fontSize': '25px','color': 'black'}));
    // }
    // animateTitle();
    // setInterval(animateTitle, 2000);
  });
  var myFullpage = new fullpage('#fullpage', {
    anchors: ['home', 'content', 'footer'],

    // Get your license at https://alvarotrigo.com/fullPage/pricing
    licenseKey: 'xxxxxxxxxxxxxxxxxxxxxxxxx',

    // Optional
    navigation: true,
    scrollingSpeed: 700
  });
});