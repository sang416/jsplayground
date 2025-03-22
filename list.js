function handleCredentialResponse(response) {
  const id_token = response.credential;
  console.log("ID Token: ", id_token);
  // 여기서 백엔드로 ID 토큰을 보내서 인증 처리
}
// 상수 선언으로 재사용성 높임
const DISPLAY_METHODS = {
  APPEND: 'append',
  HTML: 'html'
};

// 상품 관련 유틸리티 함수들
const productUtils = {
  sortByPrice: products => [...products].sort((a, b) => a.price - b.price),
  sortByName: products => [...products].sort((a, b) => b.title.localeCompare(a.title)),
  filterByPrice: (products, maxPrice = 60000) => products.filter(product => product.price <= maxPrice),
  formatPrice: price => price.toLocaleString() + '원'
};

// 상품 표시 함수 최적화
function showItem(products, buttonText='장바구니 담기',method = DISPLAY_METHODS.APPEND) {
  const productHTML = products.map(product => `
      <div class="col-sm-4">
          <img src="https://dummyimage.com/400x400/000/fff" class="w-100" alt="${product.title}">
          <h5>${product.title}</h5>
          <p>가격: ${productUtils.formatPrice(product.price)}</p>
          <button class="btn btn-danger buy-btn">${buttonText}</button>
      </div>
  `).join('');

  $('.container1')[method](`<div class="row">${productHTML}</div>`);
}

$(() => {
  let products = [
      { id: 0, price: 70000, title: 'Blossom Dress' },
      { id: 1, price: 50000, title: 'Springfield Shirt' },
      { id: 2, price: 60000, title: 'Black Monastery' }
  ];

  // 초기 상품 표시
  showItem(products, '장바구니 담기',DISPLAY_METHODS.HTML);

  // 이벤트 핸들러 통합
  const handlers = {
      'more-btn': async () => {
          try {
              const data = await $.get('http://localhost:3000/products');
              products = [...products, ...data];
              showItem(data, '장바구니 담기',DISPLAY_METHODS.APPEND);
          } catch (error) {
              console.error('데이터 로드 실패:', error);
          }
      },
      'sort-btn': () => showItem(productUtils.sortByPrice(products), '장바구니 담기',DISPLAY_METHODS.HTML),
      'sort-byName-btn': () => showItem(productUtils.sortByName(products), '장바구니 담기',DISPLAY_METHODS.HTML),
      'filter-btn': () => showItem(productUtils.filterByPrice(products), '장바구니 담기',DISPLAY_METHODS.HTML),
      'buy-btn': (e) => {
        // const newTitle = $(e.target).closest('div').find('h5').text();
        const newTitle = $(e.target).siblings('h5').text();
        const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
        if (cart.includes(newTitle)) {
          console.log("이미 장바구니에 있는 상품입니다");
          return;
        }
        cart.unshift(newTitle);  // 새 상품을 배열 앞쪽에 추가
        sessionStorage.setItem('cart', JSON.stringify(cart));
      },
      /*
      'buy-btn': (e) => {
        let title = [$(e.target).closest('div').find('h5').text()];
        if(sessionStorage.getItem('cart')!=null) {
          let getTitle = JSON.parse(sessionStorage.getItem('cart'))
          if(getTitle.includes(title[0])) {
            console.log("이미 구매했어요");
            return;
          }
          title = title.concat(getTitle);
        }
        title = JSON.stringify(title);
        sessionStorage.setItem('cart', title);
      },
      */
      'post-btn': () => {
        // sessionStorage에 이미 cart 데이터가 있으므로
        // products 데이터만 추가로 저장
        sessionStorage.setItem('allProducts', JSON.stringify(products));
        window.open('cart.html');
      }
  };

  // 이벤트 리스너 등록
  Object.entries(handlers).forEach(([className, handler]) => {
      // buy-btn은 동적으로 생성되므로 이벤트 위임 방식 사용
      if (className === 'buy-btn') {
          $(document).on('click', `.${className}`, handler);
      } else {
          $(`.${className}`).on('click',handler);
      }
  });

  // 현재 페이지가 cart.html인 경우에만 실행
  if (window.location.pathname.includes('cart.html')) {
      const products = JSON.parse(sessionStorage.getItem('allProducts') || '[]');
      const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      let cartProducts = [];
      
      products.forEach((item) => {
          if (cart.includes(item.title)) {
              cartProducts.push(item);
          }
      });
      
      showItem(cartProducts, '구매하기', DISPLAY_METHODS.HTML);
  }
});